variable "aws_region" {
  description = "AWS region for Umoja"
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
  description = "IPv4 CIDR block for the first public subnet"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.public_subnet_cidr))
    error_message = "public_subnet_cidr must be a valid IPv4 CIDR block."
  }
}

variable "public_subnet_cidr_b" {
  description = "IPv4 CIDR block for the second public subnet"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.public_subnet_cidr_b))
    error_message = "public_subnet_cidr_b must be a valid IPv4 CIDR block."
  }
}

variable "private_app_subnet_cidr" {
  description = "IPv4 CIDR block for the private application subnet"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.private_app_subnet_cidr))
    error_message = "private_app_subnet_cidr must be a valid IPv4 CIDR block."
  }
}

variable "private_db_subnet_cidr" {
  description = "IPv4 CIDR block for the first private database subnet"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.private_db_subnet_cidr))
    error_message = "private_db_subnet_cidr must be a valid IPv4 CIDR block."
  }
}

variable "private_db_subnet_cidr_b" {
  description = "IPv4 CIDR block for the second private database subnet"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.private_db_subnet_cidr_b))
    error_message = "private_db_subnet_cidr_b must be a valid IPv4 CIDR block."
  }
}

variable "ssh_cidr" {
  description = "Single administrator IPv4 address allowed to SSH to the bastion"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.ssh_cidr)) && endswith(var.ssh_cidr, "/32")
    error_message = "ssh_cidr must be one IPv4 address in /32 notation."
  }
}

variable "key_name" {
  description = "EC2 SSH key pair in aws_region"
  type        = string

  validation {
    condition     = length(trimspace(var.key_name)) > 0
    error_message = "Set key_name to an EC2 key pair in aws_region."
  }
}

variable "app_port" {
  description = "Port served by the application on the private VM"
  type        = number
  default     = 3000

  validation {
    condition     = var.app_port >= 1 && var.app_port <= 65535
    error_message = "app_port must be between 1 and 65535."
  }
}

variable "db_port" {
  description = "PostgreSQL port used by the application"
  type        = number
  default     = 5432

  validation {
    condition     = var.db_port >= 1 && var.db_port <= 65535
    error_message = "db_port must be between 1 and 65535."
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

variable "egress_cidr_blocks" {
  description = "IPv4 destinations allowed for package and image downloads"
  type        = list(string)
  default     = ["0.0.0.0/0"]

  validation {
    condition     = length(var.egress_cidr_blocks) > 0 && alltrue([for cidr in var.egress_cidr_blocks : can(cidrnetmask(cidr))])
    error_message = "egress_cidr_blocks must contain one or more valid IPv4 CIDR blocks."
  }
}

variable "db_username" {
  description = "Master username for the managed PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Master password for the managed PostgreSQL database"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.db_password) >= 16 && !strcontains(var.db_password, "REPLACE")
    error_message = "Set db_password to a unique password of at least 16 characters; do not use the example placeholder."
  }
}

variable "github_repository" {
  description = "GitHub repository (owner/name) allowed to deploy through OIDC"
  type        = string
  default     = "DphenomenalALU/Umoja-app"
}
