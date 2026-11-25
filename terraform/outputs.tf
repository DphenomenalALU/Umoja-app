output "vpc_id" {
  value = module.networking.vpc_id
}
output "public_subnet_id" {
  value = module.networking.public_subnet_id
}
output "public_subnet_ids" {
  value = module.networking.public_subnet_ids
}
output "private_app_subnet_id" {
  value = module.networking.private_app_subnet_id
}
output "private_db_subnet_a_id" {
  value = module.networking.private_db_subnet_a_id
}
output "private_db_subnet_b_id" {
  value = module.networking.private_db_subnet_b_id
}
output "bastion_security_group_id" {
  value = module.security.bastion_security_group_id
}
output "application_security_group_id" {
  value = module.security.application_security_group_id
}
output "database_security_group_id" {
  value = module.security.database_security_group_id
}
output "bastion_instance_id" {
  value = module.compute.bastion_instance_id
}
output "application_instance_id" {
  value = module.compute.application_instance_id
}
output "bastion_public_ip" {
  value = module.compute.bastion_public_ip
}
output "application_private_ip" {
  value = module.compute.application_private_ip
}
output "application_url" {
  description = "Public HTTP URL served by the bastion reverse proxy"
  value       = format("http://%s", module.compute.bastion_public_ip)
}

output "github_deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC deployments"
  value       = module.github_deploy.role_arn
}

output "ecr_repository_url" {
  description = "Private ECR repository URI for application images"
  value       = module.ecr.repository_url
}

output "application_instance_profile_name" {
  description = "Instance profile that lets the private app VM pull from ECR"
  value       = module.ecr.application_instance_profile_name
}

output "db_host" {
  description = "Managed PostgreSQL hostname without the port"
  value       = module.database.db_host
}

output "db_endpoint" {
  description = "Managed PostgreSQL endpoint including the port"
  value       = module.database.db_endpoint
}
