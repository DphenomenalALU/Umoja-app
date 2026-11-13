resource "aws_security_group" "umoja" {
  name        = "umoja-security-group"
  description = "Security group for Umoja application"
  vpc_id      = var.vpc_id

  ingress {
    description = "Umoja application"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = var.app_cidr_blocks
  }

  ingress {
    description = "SSH access"
    from_port   = var.ssh_port
    to_port     = var.ssh_port
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  egress {
    description = "Web access for updates and downloads"
    from_port   = var.web_egress_ports["http"]
    to_port     = var.web_egress_ports["http"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
  }

  egress {
    description = "Secure web access for updates and downloads"
    from_port   = var.web_egress_ports["https"]
    to_port     = var.web_egress_ports["https"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
  }

  tags = {
    Name = "umoja-security-group"
  }
}
