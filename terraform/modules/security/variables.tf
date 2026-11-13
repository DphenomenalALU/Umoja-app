variable "vpc_id" {
  type = string
}

variable "ssh_cidr" {
  type = string
}

variable "ssh_port" {
  type = number
}

variable "app_port" {
  type = number
}

variable "app_cidr_blocks" {
  type = list(string)
}

variable "web_egress_ports" {
  type = map(number)
}

variable "egress_cidr_blocks" {
  type = list(string)
}
