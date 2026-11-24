# Ansible deployment

This playbook configures the private Ubuntu application VM and deploys the
Umoja image from ECR. The application uses the managed PostgreSQL database in
RDS; no PostgreSQL container is started.

## Requirements

Run Ansible from WSL or another Linux system.

- Python 3
- Ansible Core
- AWS CLI credentials with permission to authenticate to ECR
- OpenSSH client
- The bastion and private VM SSH details
- The RDS endpoint and database credentials
- The Ansible Vault password

Install the dependencies from the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install 'ansible-core>=2.16,<3.0' -r ansible/requirements.txt
ansible-galaxy collection install -r ansible/requirements.yml
```

## Configure local files

```bash
cp ansible/inventory/hosts.ini.example ansible/inventory/hosts.ini
cp ansible/group_vars/vault.yml.example ansible/group_vars/vault.yml
```

Edit `ansible/inventory/hosts.ini`:

```ini
[umoja]
umoja-server ansible_host=10.0.2.93 ansible_user=ubuntu

[umoja:vars]
ansible_ssh_private_key_file=/home/YOUR_USER/.ssh/umoja-key.pem
ansible_ssh_common_args=-o ProxyJump=ubuntu@13.246.194.249 -i /home/YOUR_USER/.ssh/umoja-key.pem
```

Copy the SSH key into WSL and protect it:

```bash
mkdir -p ~/.ssh
cp /mnt/c/Users/YOUR_WINDOWS_USER/Downloads/umoja-key.pem ~/.ssh/umoja-key.pem
chmod 600 ~/.ssh/umoja-key.pem
```

The application settings in `ansible/group_vars/all.yml` use the AWS region,
ECR repository, RDS endpoint, and private VPC CIDR supplied by the
infrastructure deployment. The image is passed at deployment time as a full
40-character commit-SHA URI.

Create and encrypt the Vault file:

```bash
ansible-vault edit ansible/group_vars/vault.yml
```

It must contain:

```yaml
vault_postgres_password: "YOUR_DATABASE_PASSWORD"
vault_organizer_access_code: "YOUR_PRIVATE_CODE_AT_LEAST_12_CHARACTERS"
vault_session_secret: "YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS"
```

Keep the Vault file, local inventory, and private key out of Git. The
repository ignores `ansible/group_vars/vault.yml`,
`ansible/inventory/hosts.ini`, and `*.pem`.

## Check access

```bash
ansible-inventory -i ansible/inventory/hosts.ini --graph
ansible all -i ansible/inventory/hosts.ini -m ansible.builtin.ping
```

The connection test should return:

```text
"ping": "pong"
```

## Validate and deploy

```bash
ansible-playbook \
  -i ansible/inventory/hosts.ini \
  ansible/site.yml \
  --syntax-check \
  --ask-vault-pass
```

Deploy the image produced by the CI workflow:

```bash
ansible-playbook \
  -i ansible/inventory/hosts.ini \
  ansible/site.yml \
  -e "app_image=386963842124.dkr.ecr.af-south-1.amazonaws.com/umoja:<40-character-commit-sha>" \
  -e "aws_region=af-south-1" \
  --ask-vault-pass
```

The playbook logs in to ECR on the VM, pulls `app_image`, applies the database
schema when required, starts the application, and waits for `/api/health`.
Run the same command a second time; an idempotent run should finish with
`failed=0` and few or no changes.

## Verify the server

```bash
ssh -i ~/.ssh/umoja-key.pem \
  -J ubuntu@13.246.194.249 \
  ubuntu@10.0.2.93
```

On the VM:

```bash
cd /opt/umoja
docker compose ps
docker compose logs umoja --tail=100
curl http://127.0.0.1:3000/api/health
sudo ufw status verbose
```

Expected response:

```json
{"status":"healthy","database":"ready"}
```

Port 5432 is not exposed by the application VM. RDS access must be allowed
from the VM security group, and application traffic must be allowed by the
AWS security groups and private-network path.
