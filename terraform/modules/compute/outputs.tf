output "bastion_instance_id" {
  value = aws_instance.bastion.id
}

output "application_instance_id" {
  value = aws_instance.application.id
}

output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "application_private_ip" {
  value = aws_instance.application.private_ip
}
