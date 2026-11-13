output "vpc_id" {
  value = module.networking.vpc_id
}

output "subnet_id" {
  value = module.networking.subnet_id
}

output "security_group_id" {
  value = module.security.security_group_id
}

output "instance_id" {
  value = module.compute.instance_id
}

output "public_ip" {
  value = module.compute.public_ip
}

output "app_port" {
  value = var.app_port
}

output "ssh_port" {
  value = var.ssh_port
}
