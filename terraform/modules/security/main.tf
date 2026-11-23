resource "aws_security_group" "bastion" {
  name        = "umoja-bastion-sg"
  description = "SSH access to bastion host"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH from approved administrator IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.egress_cidr_blocks
  }

  tags = {
    Name = "umoja-bastion-sg"
  }
}

resource "aws_security_group" "application" {
  name        = "umoja-application-sg"
  description = "Application VM security group"
  vpc_id      = var.vpc_id

  ingress {
    description     = "SSH from bastion only"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description = "Application traffic"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = var.app_cidr_blocks
  }

  egress {
    description = "Web access for updates and Docker pulls"
    from_port   = var.web_egress_ports["http"]
    to_port     = var.web_egress_ports["http"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
  }

  egress {
    description = "Secure web access"
    from_port   = var.web_egress_ports["https"]
    to_port     = var.web_egress_ports["https"]
    protocol    = "tcp"
    cidr_blocks = var.egress_cidr_blocks
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
    description     = "PostgreSQL from application VM only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.application.id]
  }

  tags = {
    Name = "umoja-database-sg"
  }
}
