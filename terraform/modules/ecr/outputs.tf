output "repository_url" {
  value = aws_ecr_repository.umoja.repository_url
}

output "application_instance_profile_name" {
  description = "Instance profile that lets the private app VM pull its ECR image"
  value       = aws_iam_instance_profile.application.name
}
