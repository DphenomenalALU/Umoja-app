output "role_arn" {
  description = "Set this as the AWS_DEPLOY_ROLE_ARN repository variable"
  value       = aws_iam_role.github_deploy.arn
}
