# Terraform infrastructure

This configuration provisions the AWS network and EC2 host used to run Umoja.
It keeps the VPC, subnet, security group, and instance in separate modules.

## Resources

- A VPC and public subnet with an internet gateway and route
- A security group that allows the app on `app_port` and restricts SSH to `ssh_cidr`
- An Ubuntu 24.04 EC2 instance
- Outputs for the instance ID, public IP, VPC, subnet, and security group

PostgreSQL runs in the application’s Docker Compose network. The security group
does not expose port 5432.

The subnet does not assign public IPs by default, but the demo EC2 instance
explicitly receives one so it can fetch packages and serve the app directly.
The app port is public by default; SSH is limited to `ssh_cidr`. This setup has
no TLS termination or reverse proxy. The security group limits outbound TCP to
the configured HTTP and HTTPS ports. AWS security groups do not filter DNS
traffic to or from the VPC DNS resolver ([AWS documentation](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)).

## Requirements

- Terraform 1.5 or later
- AWS CLI credentials with permission to manage the listed resources
- An EC2 key pair that exists in the selected AWS region

Terraform reads AWS credentials from the AWS CLI profile or environment. Do not
put credentials or a private key in Terraform files.

## Configure

From the repository root, copy the example variables file:

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
```

Edit `terraform/terraform.tfvars` and set `ssh_cidr` to the administrator’s
current public IP in `/32` notation and `key_name` to an EC2 key pair in the
selected region. The example IP is reserved for documentation and will not
allow a real SSH connection. The local `terraform.tfvars` file is ignored by
Git.

`app_port`, `ssh_port`, and `web_egress_ports` have defaults for the coursework
demo and can be set in the same file. Keep the SSH CIDR and port aligned with
`ansible/group_vars/all.yml`. The Ansible deploy command reads `app_port` and
`ssh_port` from Terraform outputs.

## Plan and apply

Run these commands from the repository root:

```bash
terraform -chdir=terraform init
terraform -chdir=terraform fmt -check -recursive
terraform -chdir=terraform validate
terraform -chdir=terraform plan
```

Review the plan before applying it. `apply` creates billable AWS resources, so
confirm the account, region, and resource list first:

```bash
terraform -chdir=terraform apply
```

The command asks for confirmation before making changes.

## Connect the deployment

After applying, get the public IP for the Ansible inventory:

```bash
terraform -chdir=terraform output -raw public_ip
```

Other outputs are available with:

```bash
terraform -chdir=terraform output
```

## Clean up

When the host is no longer needed, review the resources Terraform will remove:

```bash
terraform -chdir=terraform destroy
```

The deployment uses one EC2 instance. It has no load balancer, autoscaling, or
managed PostgreSQL service.
