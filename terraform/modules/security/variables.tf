variable "vpc_id" {
  type = string
}

variable "private_app_subnet_cidr" {
  type = string
}

variable "private_db_subnet_cidrs" {
  type = list(string)
}

variable "ssh_cidr" {
  type = string
}

variable "app_port" {
  type = number
}

variable "db_port" {
  type = number
}

variable "web_egress_ports" {
  type = map(number)
}

variable "egress_cidr_blocks" {
  type = list(string)
}
