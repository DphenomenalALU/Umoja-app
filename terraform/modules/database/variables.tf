variable "private_db_subnet_a_id" {
  type = string
}

variable "private_db_subnet_b_id" {
  type = string
}

variable "database_security_group_id" {
  type = string
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}