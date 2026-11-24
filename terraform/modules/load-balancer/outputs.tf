output "dns_name" {
  description = "Public DNS name for the Umoja application"
  value       = aws_lb.umoja.dns_name
}

output "arn" {
  value = aws_lb.umoja.arn
}

output "target_group_arn" {
  value = aws_lb_target_group.application.arn
}
