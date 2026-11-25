variable "instance_type" {
  type = string
}

variable "app_port" {
  description = "Port the private application VM serves"
  type        = number
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "key_name" {
  description = "AWS EC2 key pair name"
  type        = string
}

variable "public_subnet_id" {
  type = string
}

variable "private_app_subnet_id" {
  type = string
}

variable "bastion_security_group_id" {
  type = string
}

variable "application_security_group_id" {
  type = string
}

variable "application_instance_profile_name" {
  description = "Instance profile that grants the app VM read-only access to ECR"
  type        = string
}
