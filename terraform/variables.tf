variable "aws_region" {
  description = "AWS region"
  type        = string

  validation {
    condition     = length(trimspace(var.aws_region)) > 0
    error_message = "Set aws_region to the AWS region for this environment."
  }
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
  description = "IPv4 CIDR block for the VPC"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "vpc_cidr must be a valid IPv4 CIDR block."
  }
}

variable "public_subnet_cidr" {
  description = "IPv4 CIDR block for the public subnet"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.public_subnet_cidr))
    error_message = "public_subnet_cidr must be a valid IPv4 CIDR block."
  }
}

variable "ssh_cidr" {
  description = "Allowed SSH source range"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.ssh_cidr)) && endswith(var.ssh_cidr, "/32")
    error_message = "ssh_cidr must be one IPv4 address in /32 notation."
  }
}

variable "key_name" {
  description = "EC2 SSH key pair"
  type        = string

  validation {
    condition     = length(trimspace(var.key_name)) > 0
    error_message = "Set key_name to an EC2 key pair in aws_region."
  }
}

variable "app_port" {
  description = "Public host port for Umoja; keep it aligned with Ansible"
  type        = number
  default     = 3000

  validation {
    condition     = var.app_port >= 1 && var.app_port <= 65535
    error_message = "app_port must be between 1 and 65535."
  }
}

variable "ssh_port" {
  description = "SSH port on the EC2 host"
  type        = number
  default     = 22

  validation {
    condition     = var.ssh_port >= 1 && var.ssh_port <= 65535
    error_message = "ssh_port must be between 1 and 65535."
  }
}

variable "web_egress_ports" {
  description = "Outbound TCP ports used for package and image downloads"
  type        = map(number)
  default = {
    http  = 80
    https = 443
  }

  validation {
    condition = contains(keys(var.web_egress_ports), "http") && contains(keys(var.web_egress_ports), "https") && alltrue([
      for port in values(var.web_egress_ports) : port >= 1 && port <= 65535
    ])
    error_message = "web_egress_ports must contain TCP ports between 1 and 65535."
  }
}

variable "app_cidr_blocks" {
  description = "IPv4 sources allowed to reach the demo app"
  type        = list(string)
  default     = ["0.0.0.0/0"]

  validation {
    condition     = length(var.app_cidr_blocks) > 0 && alltrue([for cidr in var.app_cidr_blocks : can(cidrnetmask(cidr))])
    error_message = "app_cidr_blocks must contain one or more valid IPv4 CIDR blocks."
  }
}

variable "egress_cidr_blocks" {
  description = "IPv4 destinations allowed for package and image downloads"
  type        = list(string)
  default     = ["0.0.0.0/0"]

  validation {
    condition     = length(var.egress_cidr_blocks) > 0 && alltrue([for cidr in var.egress_cidr_blocks : can(cidrnetmask(cidr))])
    error_message = "egress_cidr_blocks must contain one or more valid IPv4 CIDR blocks."
  }
}

variable "associate_public_ip_address" {
  description = "Give the demo EC2 host a public IPv4 address"
  type        = bool
  default     = true
}
