# Ansible deployment

This playbook configures the private Ubuntu application VM and deploys the
Umoja image from ECR. The application uses the managed PostgreSQL database in
RDS over TLS; no PostgreSQL container is started.

The public demo URL is the bastion's IP. Nginx on the bastion forwards HTTP
requests to the private app VM on port 3000. The demo has no TLS; do not use it
with real community data.

## Requirements

Run Ansible from Linux, macOS, or WSL.

- Python 3
- Ansible Core
- The read-only ECR instance profile attached to the app VM by Terraform
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
umoja-server ansible_host=APP_PRIVATE_IP ansible_user=ubuntu

[umoja:vars]
ansible_ssh_private_key_file=/home/YOUR_USER/.ssh/umoja-key.pem
ansible_ssh_common_args=-o ProxyJump=bastion
```

Add this entry to ~/.ssh/config so SSH uses the same key for the bastion:

```ssh
Host bastion
  HostName BASTION_PUBLIC_IP
  User ubuntu
  IdentityFile /home/YOUR_USER/.ssh/umoja-key.pem
  IdentitiesOnly yes
```

Place the SSH key at the path in the inventory and restrict its permissions:

```bash
mkdir -p ~/.ssh
cp /path/to/umoja-key.pem ~/.ssh/umoja-key.pem
chmod 600 ~/.ssh/umoja-key.pem
```

Set aws_region to the same region used by Terraform. Set database_host to the
hostname from terraform output -raw db_host. Pass app_image as the ECR URI
with the full 40-character commit SHA. The playbook checks these values before
it changes the host.

Replace the placeholder values in the local Vault file, then encrypt it before
use. Ansible asks you to set a Vault password; keep it for local deployments
and store it as `ANSIBLE_VAULT_PASSWORD` in the GitHub `production` environment.

```bash
${EDITOR:-vi} ansible/group_vars/vault.yml
ansible-vault encrypt ansible/group_vars/vault.yml
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
  -e "app_image=ECR_REPOSITORY_URL:FULL_COMMIT_SHA" \
  -e "aws_region=AWS_REGION" \
  -e "database_host=RDS_HOST" \
  --ask-vault-pass
```

The playbook logs in to ECR on the VM, pulls `app_image`, applies the database
schema when required, starts the application, and waits for `/api/health`.
Run the same command a second time; an idempotent run should finish with
`failed=0` and few or no changes.

## Verify the server

```bash
ssh -i ~/.ssh/umoja-key.pem \
  -J ubuntu@BASTION_PUBLIC_IP \
  ubuntu@APP_PRIVATE_IP
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
