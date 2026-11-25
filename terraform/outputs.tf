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
