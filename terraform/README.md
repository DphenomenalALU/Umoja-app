# Umoja AWS infrastructure

This configuration provisions the AWS environment for the Summative deployment.

## What it creates

- A VPC with two public subnets, a private application subnet, and two private database subnets
- An internet gateway and NAT gateway for outbound package and image downloads
- A bastion host with SSH limited to the configured administrator address
- A private application EC2 instance and a managed PostgreSQL database
- Nginx on the public bastion, forwarding HTTP requests to the private application instance
- A private ECR repository with scan-on-push and immutable commit-SHA tags, plus a read-only instance profile for image pulls
- A GitHub OIDC provider and deploy role that publishes images, reads an existing image on retries, and briefly opens the bastion for deployment

The app VM and database do not receive public addresses. The bastion's public IP
serves as the demo web entry point: Nginx listens on port 80 and forwards requests
to the app VM on port 3000. SSH access to the bastion remains limited to the
configured administrator and temporary deployment runner. This coursework demo
uses plain HTTP and must not carry real community data.

## Requirements

- Terraform 1.5 or later
- AWS CLI credentials allowed to create the resources in the selected region
- An EC2 key pair that exists in the selected region
- An administrator IPv4 address for SSH in /32 notation

Terraform reads AWS credentials from the active AWS CLI profile or environment.
Do not put AWS keys, private SSH keys, or real database passwords in this
directory.

## Configure

From the repository root, copy the example variables file:

    cp terraform/terraform.tfvars.example terraform/terraform.tfvars

Set ssh_cidr to the administrator's current public IP and key_name to the
existing EC2 key pair. Replace db_password with a unique value of at least 16
characters. Do not apply with the example placeholder. Terraform state contains
the database password, so keep terraform.tfstate private and never commit it.

The example uses us-east-1. Change aws_region and the CIDR ranges if your AWS
environment requires different values. Make sure the subnets do not overlap.

## Plan and apply

Run these commands from the repository root:

    terraform -chdir=terraform init
    terraform -chdir=terraform fmt -check -recursive
    terraform -chdir=terraform validate
    terraform -chdir=terraform plan

Review the plan before applying. It creates billable AWS resources, including a
NAT gateway, managed database, ECR repository, and EC2 instances.

    terraform -chdir=terraform apply

Terraform asks for confirmation before creating or changing resources.

## Outputs used by deployment

After apply, get the public application URL:

    terraform -chdir=terraform output -raw application_url

The deployment workflow also needs these outputs:

    terraform -chdir=terraform output -raw github_deploy_role_arn
    terraform -chdir=terraform output -raw ecr_repository_url
    terraform -chdir=terraform output -raw bastion_public_ip
    terraform -chdir=terraform output -raw bastion_security_group_id
    terraform -chdir=terraform output -raw application_private_ip
    terraform -chdir=terraform output -raw db_host

Add them to the GitHub Actions repository variables documented in the root
README. Keep SSH private keys and Ansible Vault contents in GitHub secrets.

## Clean up

When the environment is no longer needed, inspect the plan and then remove the
resources:

    terraform -chdir=terraform destroy

The database has final snapshot creation disabled for this coursework demo.
Save anything needed before destroying the environment.
