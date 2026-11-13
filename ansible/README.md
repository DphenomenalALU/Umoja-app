# Umoja Ansible deployment

This playbook prepares an Ubuntu server and deploys the Umoja Docker Compose
application. It installs Docker, configures the firewall, copies the app, and
starts PostgreSQL and Umoja.

## Requirements

Run Ansible from WSL or another Linux system.

- Ansible Core
- OpenSSH client
- Docker collections:

```bash
ansible-galaxy collection install community.general community.docker
```

You also need:

- The EC2 public IP
- The SSH private key for the EC2 instance
- The Ubuntu SSH user
- The current public IP allowed for SSH
- The Ansible Vault password

## Local files

Copy the example files:

```bash
cp ansible/inventory/hosts.ini.example ansible/inventory/hosts.ini
cp ansible/group_vars/vault.yml.example ansible/group_vars/vault.yml
```

Get the instance address from Terraform:

```bash
terraform -chdir=terraform output -raw public_ip
```

Edit `ansible/inventory/hosts.ini` and replace the host placeholder with that
address. Replace the key path with the path to your private key:

```text
REPLACE_ME_EC2_PUBLIC_IP
REPLACE_ME_SSH_KEY_PATH
```

Edit `ansible/group_vars/all.yml` and replace the SSH source placeholder with
your current public IP in CIDR notation:

```yaml
ssh_allowed_cidr: "YOUR_CURRENT_PUBLIC_IP/32"
```

Create or update the encrypted password file:

```bash
ansible-vault encrypt ansible/group_vars/vault.yml
ansible-vault edit ansible/group_vars/vault.yml
```

The encrypted file should contain:

```yaml
vault_postgres_password: "YOUR_DATABASE_PASSWORD"
vault_organizer_access_code: "YOUR_PRIVATE_CODE_AT_LEAST_12_CHARACTERS"
vault_session_secret: "YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS"
```

Set a private organizer code and a separate random session secret before
deploying. The app uses them to sign in organizers and protect attendance and
volunteer details. Use at least 12 characters for the code and generate the
session secret with `openssl rand -hex 32`. Keep both values in the encrypted
Vault file.

Do not commit these files:

```text
ansible/inventory/hosts.ini
ansible/group_vars/vault.yml
*.pem
```

## Check the connection

```bash
ansible-inventory -i ansible/inventory/hosts.ini --graph
ansible all -i ansible/inventory/hosts.ini -m ansible.builtin.ping
```

The connection test should return:

```text
"ping": "pong"
```

## Validate and deploy

Run the syntax check:

```bash
ansible-playbook \
  -i ansible/inventory/hosts.ini \
  ansible/site.yml \
  --syntax-check \
  --ask-vault-pass
```

Deploy Umoja:

```bash
ansible-playbook \
  -i ansible/inventory/hosts.ini \
  ansible/site.yml \
  --ask-vault-pass
```

Run the same command a second time to check idempotence. The second run
should make few or no changes and must finish with `failed=0`.

## Verify the server

Connect to the server:

```bash
ssh -i SSH_KEY_PATH ubuntu@EC2_PUBLIC_IP
```

Check the containers:

```bash
cd /opt/umoja
docker compose ps
docker compose logs umoja --tail=100
```

Check the health endpoint:

```bash
curl http://127.0.0.1:3000/api/health
```

Expected response:

```json
{"status":"healthy","database":"ready"}
```

Check the firewall:

```bash
sudo ufw status verbose
```

PostgreSQL is kept private because the Compose file does not publish port
5432. The application is available on port 3000 when the AWS security group
and UFW allow it.
