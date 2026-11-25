variable "github_repository" {
  description = "GitHub repository allowed to use the deploy role, as owner/name"
  type        = string
}

variable "github_owner_id" {
  description = "Numeric ID of the repository owner, as it appears in GitHub's OIDC sub claim"
  type        = string
}

variable "github_repository_id" {
  description = "Numeric ID of the repository, as it appears in GitHub's OIDC sub claim"
  type        = string
}
variable "deploy_branch" {
  description = "Branch whose workflow runs may use the deploy role"
  type        = string
  default     = "main"
}

variable "deploy_environment" {
  description = "GitHub environment whose jobs may use the deploy role"
  type        = string
  default     = "production"
}

variable "ecr_repository_name" {
  description = "ECR repository the role may push to"
  type        = string
}

variable "bastion_security_group_id" {
  description = "Bastion security group the deploy job opens for SSH during a deploy"
  type        = string
}