resource "aws_security_group" "bastion" {
  name        = "umoja-bastion-sg"
  description = "Public web entry point and SSH jump host"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH from the administrator or the temporary deployment runner address"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  ingress {
    description = "Public HTTP traffic forwarded to the private app VM"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  #trivy:ignore:AWS-0104:exp:2026-12-10
  egress {
    description = "HTTP for operating system updates"
    from_port   = var.web_egress_ports["http"]
    to_port     = var.web_egress_ports["http"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
  }

  #trivy:ignore:AWS-0104:exp:2026-12-10
  egress {
    description = "HTTPS for package downloads"
    from_port   = var.web_egress_ports["https"]
    to_port     = var.web_egress_ports["https"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
  }

  egress {
    description = "SSH from bastion to the private application host"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.private_app_subnet_cidr]
  }

  egress {
    description = "Forward web traffic to the private application host"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = [var.private_app_subnet_cidr]
  }

  tags = {
    Name = "umoja-bastion-sg"
  }
}

resource "aws_security_group" "application" {
  name        = "umoja-application-sg"
  description = "Private application VM security group"
  vpc_id      = var.vpc_id

  ingress {
    description     = "SSH from the bastion only"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Application traffic from the bastion reverse proxy"
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  #trivy:ignore:AWS-0104:exp:2026-12-10
  egress {
    description = "HTTP for operating system updates"
    from_port   = var.web_egress_ports["http"]
    to_port     = var.web_egress_ports["http"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
  }

  #trivy:ignore:AWS-0104:exp:2026-12-10
  egress {
    description = "HTTPS for package and ECR image downloads"
    from_port   = var.web_egress_ports["https"]
    to_port     = var.web_egress_ports["https"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
  }

  egress {
    description = "PostgreSQL traffic to the private database subnets"
    from_port   = var.db_port
    to_port     = var.db_port
    protocol    = "tcp"
    cidr_blocks = var.private_db_subnet_cidrs
  }

  tags = {
    Name = "umoja-application-sg"
  }
}

resource "aws_security_group" "database" {
  name        = "umoja-database-sg"
  description = "Private PostgreSQL traffic"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from the application VM only"
    from_port       = var.db_port
    to_port         = var.db_port
    protocol        = "tcp"
    security_groups = [aws_security_group.application.id]
  }

  egress = []

  tags = {
    Name = "umoja-database-sg"
  }
}
