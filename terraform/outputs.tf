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

output "load_balancer_security_group_id" {
  value = module.security.load_balancer_security_group_id
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
  description = "Public HTTP URL routed through the load balancer to the private application VM"
  value       = format("http://%s", module.load_balancer.dns_name)
}

output "load_balancer_dns_name" {
  value = module.load_balancer.dns_name
}

output "app_port" {
  value = var.app_port
}

output "db_endpoint" {
  value = module.database.db_endpoint
}

output "db_name" {
  value = module.database.db_name
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "github_deploy_role_arn" {
  value       = module.github_deploy.role_arn
  description = "Set as the AWS_DEPLOY_ROLE_ARN GitHub Actions repository variable"
}
