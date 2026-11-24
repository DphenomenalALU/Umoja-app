output "bastion_security_group_id" {
  value = aws_security_group.bastion.id
}

output "load_balancer_security_group_id" {
  value = aws_security_group.load_balancer.id
}

output "application_security_group_id" {
  value = aws_security_group.application.id
}

output "database_security_group_id" {
  value = aws_security_group.database.id
}
