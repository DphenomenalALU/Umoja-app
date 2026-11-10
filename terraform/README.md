### Umoja Infrastructure with Terraform

## Overview

This directory contains the Infrastructure as Code (IaC) configuration used to provision the AWS resources required to host Umoja.

Umoja is a community engagement platform that supports community meetings, volunteer events, RSVPs, attendance tracking and volunteer service-hour reporting. Rather than manually creating cloud infrastructure through the AWS Console, Terraform is used to define infrastructure in code so that deployments can be reproduced consistently by any user.

The configuration provisions:

- A dedicated VPC
- A public subnet
- Network security rules
- An Ubuntu 24.04 EC2 instance
- Reusable outputs for deployment and troubleshooting

The implementation follows a modular structure to improve readability, reuse and maintenance.

# Architecture

The infrastructure is divided into three modules:

## Networking Module

Creates:

- VPC
- Public subnet

Responsibilities:

- Defines network boundaries.
- Allocates address ranges.
- Provides networking outputs to dependent modules.

---

## Security Module

Creates:

- Security Group

Responsibilities:

- Allows HTTP access to Umoja.
- Allows SSH access for administrators.
- Uses a configurable CIDR block for SSH access.
- Prevents insecure hardcoded access policies.

## Compute Module

Creates:

- Ubuntu 24.04 EC2 Instance

Responsibilities:

- Hosts Umoja.
- Uses a configurable instance type.
- Receives networking and security configuration from other modules.
- Outputs deployment information such as the public IP address.

---

# Directory Structure

terraform/

│

├── versions.tf

├── variables.tf

├── outputs.tf

├── main.tf

├── README.md

│

└── modules/

    ├── networking/

    │   ├── main.tf

    │   ├── variables.tf

    │   └── outputs.tf

    │

    ├── security/

    │   ├── main.tf

    │   ├── variables.tf

    │   └── outputs.tf

    │

    └── compute/

        ├── main.tf

        ├── variables.tf

        └── outputs.tf

---

# Configuration Variables

## Required Variables

| Variable | Purpose |
| --- | --- |
| aws\region | AWS deployment region |
| environment | Deployment environment name |
| instance_type | EC2 instance size |
| vpc_cidr | VPC address space |
| public_subnet_cidr | Public subnet range |
| ssh_cidr | Allowed SSH source range |
| key_name | AWS EC2 Key Pair name |

---

## Example Configuration

Create a local Terraform variables file:

aws_region         = "af-south-1"

environment        = "dev"

instance_type      = "t3.micro"

vpc_cidr           = "10.0.0.0/16"

public_subnet_cidr = "10.0.1.0/24"

ssh_cidr           = "0.0.0.0/0"

key_name           = "umoja-key"

This file should not contain secrets and should not be committed with specific values needed in production.

---

# Security Considerations

Several security measures were intentionally applied during design.

## No Hardcoded Secrets

AWS credentials are never stored in:

- Terraform code
- Source control
- Output files

Terraform retrieves credentials from the local AWS CLI configuration.

---

## SSH Access Control

SSH access is configurable through:

ssh_cidr

This allows deployments to restrict administrative access to approved networks.

Example:

ssh_cidr = "197.xx.xx.xx/32"

---

## Least Privilege Principle

Terraform should be executed using a dedicated IAM user or role with only the permissions required to provision Umoja infrastructure.

Administrative credentials should not be used during normal operation.

---

## Private Database Access

PostgreSQL is intentionally not exposed to the public internet.

Database access should only occur through trusted application components or private networking configurations.

---

# Terraform Workflow

## 1. Initialize Terraform

Run:

terraform init

Purpose:

- Downloads required providers, initializes modules and prepares the working directory.

Expected result:

Terraform has been successfully initialized!

## 2. Format Configuration

Run:

terraform fmt -recursive

Purpose:

- Applies standard Terraform formatting and keeps the codebase consistent.

## 3. Validate Configuration

Run:

terraform validate

Purpose:

- Detects syntax errors, verifies module structure and checks variable references.

Expected result:

Success! The configuration is valid.

## 4. Review Planned Changes

Run:

terraform plan

Purpose:

- Displays resources that Terraform intends to create.
- Allows infrastructure review before deployment.
- Verifies no unexpected resources will be created.

Typical resources:

- VPC
- Subnet
- Security Group
- EC2 Instance

## 5. Apply Infrastructure

Only perform this step after:

- AWS account access has been confirmed and team approval has been received.

Deployment command:

terraform apply

Terraform will present a final execution plan before creating resources.

## 6. View Outputs

After deployment:

terraform output

Example:

instance_id = "i-xxxxxxxx"

public_ip = "13.xxx.xxx.xxx"

security_group_id = "sg-xxxxxxxx"

subnet_id = "subnet-xxxxxxxx"

vpc_id = "vpc-xxxxxxxx"

---

## Public IP for Deployment

The most important deployment output is:

public_ip

This value is provided to deployment and automation contributors so that configuration management and application deployment tools can connect to the server.

Example retrieval:

terraform output public_ip

---

# Cleanup

To remove all provisioned resources:

terraform destroy

Terraform will display all resources scheduled for removal before execution.

Use this command when:

- Testing is complete and resources are no longer required.

---

# Known Limitations

Current scope is intentionally limited to support MVP deployment.

Current implementation:

- Single EC2 instance.
- No load balancer.
- No auto-scaling.
- No managed PostgreSQL service.
- No disaster recovery strategy.
- No multi-region deployment.

---

