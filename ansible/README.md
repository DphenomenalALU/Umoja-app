# Ansible deployment

Ansible configures the Ubuntu EC2 instance created by Terraform. It installs
Docker, applies the host firewall and SSH settings, starts Umoja with Docker
Compose, and checks that the app and PostgreSQL are healthy.

The playbook uses AWS EC2 dynamic inventory by default. It selects running
instances tagged `Name=umoja-instance` and `Environment=dev`, matching the
Terraform configuration. A static inventory is also available for a one-off
host or a local syntax check.

## Requirements

- Python 3
- AWS CLI credentials with `ec2:DescribeInstances` permission
- The EC2 SSH key used by Terraform
- An encrypted Ansible Vault file with the application secrets

Install the Python and Ansible collection dependencies from the repository
root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install 'ansible-core>=2.16,<3.0' -r ansible/requirements.txt
ansible-galaxy collection install -r ansible/requirements.yml
```

AWS credentials come from the AWS CLI profile or environment. Set `AWS_PROFILE`
if the credentials are not in the default profile. `AWS_REGION` selects the
inventory region; the default is `us-east-1`.

From the repository root, set the Ansible config and SSH key before running the
commands below:

```bash
export ANSIBLE_CONFIG=ansible/ansible.cfg
export ANSIBLE_PRIVATE_KEY_FILE="$HOME/.ssh/your-terraform-key.pem"
```

## Configure secrets and SSH access

Create the local Vault file and encrypt it:

```bash
cp ansible/group_vars/vault.yml.example ansible/group_vars/vault.yml
ansible-vault encrypt ansible/group_vars/vault.yml
ansible-vault edit ansible/group_vars/vault.yml
```

Set these values in the encrypted file:

```yaml
vault_postgres_password: "YOUR_DATABASE_PASSWORD"
vault_organizer_access_code: "YOUR_PRIVATE_CODE_AT_LEAST_12_CHARACTERS"
vault_session_secret: "YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS"
```

Generate the session secret with `openssl rand -hex 32`. Set
`ssh_allowed_cidr` in `ansible/group_vars/all.yml` to the administrator's
current public IPv4 address in `/32` notation. The playbook checks these values
before changing the server.

Keep the Vault file, local inventory, and private key out of Git. The
repository ignores `ansible/group_vars/vault.yml`,
`ansible/inventory/hosts.ini`, and `*.pem` files.

## Check dynamic inventory

Terraform tags the instance so the inventory plugin can find it. After the
instance is running, list the hosts Ansible discovers:

```bash
ansible-inventory -i ansible/inventory/aws_ec2.yml --graph
```

The output should include the EC2 instance under `umoja`. The AWS credentials
need permission to describe EC2 instances; they do not need to be saved in the
repository.

## Validate and deploy

Set Ansible's project configuration, then check the playbook syntax. This
check uses the static example and does not contact AWS:

```bash
ansible-playbook \
  -i ansible/inventory/hosts.ini.example \
  ansible/site.yml \
  --syntax-check \
  --ask-vault-pass
```

Deploy to the EC2 instance selected by dynamic inventory:

```bash
ansible-playbook \
  -i ansible/inventory/aws_ec2.yml \
  ansible/site.yml \
  --ask-vault-pass
```

The playbook installs Docker and configures SSH and UFW before deploying the
app. SSH root login and password authentication are disabled; SSH key access
is limited to the `ubuntu` account and the configured source IP. The playbook
waits for `/api/health` to report both the app and database ready, and fails
with a log-check hint if they do not become healthy.

Run the deploy command a second time. An idempotent run should finish with
`changed=0` and `failed=0`.

## Use a static inventory

For a one-off host, copy the example and add its Terraform public IP and SSH key
path:

```bash
cp ansible/inventory/hosts.ini.example ansible/inventory/hosts.ini
```

Then replace the host and key placeholders in `ansible/inventory/hosts.ini` and
pass it to the same commands with `-i ansible/inventory/hosts.ini`.

## Verify the server

The playbook checks the health endpoint after deployment. To inspect the
server manually:

```bash
ssh -i SSH_KEY_PATH ubuntu@EC2_PUBLIC_IP <<'REMOTE'
cd /opt/umoja
docker compose ps
docker compose logs umoja --tail=100
curl http://127.0.0.1:3000/api/health
sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication|kbdinteractiveauthentication|allowusers'
sudo ufw status verbose
REMOTE
```

The health response should be:

```json
{"status":"healthy","database":"ready"}
```

PostgreSQL stays inside the Compose network; the security group and UFW do not
open port 5432 to the internet.
