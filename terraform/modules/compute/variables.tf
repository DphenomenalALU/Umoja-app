variable "instance_type" {
  type = string
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

variable "database_security_group_id" {
  type = string
}