variable "vpc_cidr" {
  description = "CIDR block for Umoja VPC"
  type        = string
}

variable "public_subnet_cidr" {
  description = "CIDR block for the first public subnet"
  type        = string
}

variable "public_subnet_cidr_b" {
  description = "CIDR block for the second public subnet"
  type        = string
}

variable "private_app_subnet_cidr" {
  description = "CIDR block for the private application subnet"
  type        = string
}

variable "private_db_subnet_cidr" {
  description = "CIDR block for the first private database subnet"
  type        = string
}

variable "private_db_subnet_cidr_b" {
  description = "CIDR block for the second private database subnet"
  type        = string
}
