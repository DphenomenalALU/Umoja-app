variable "vpc_cidr" {
  description = "CIDR block for Umoja VPC"
  type        = string
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
}

variable "private_app_subnet_cidr" {
  type = string
}

variable "private_db_subnet_cidr" {
  type = string
}

variable "private_db_subnet_cidr_b" {
  type = string
}