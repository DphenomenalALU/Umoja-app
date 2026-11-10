variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance size"
  type        = string
}

variable "vpc_cidr" {
  type = string
}

variable "public_subnet_cidr" {
  type = string
}

variable "ssh_cidr" {
  description = "Allowed SSH source range"
  type        = string
}

variable "key_name" {
  description = "EC2 SSH key pair"
  type        = string
}