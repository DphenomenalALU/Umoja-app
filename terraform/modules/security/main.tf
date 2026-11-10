resource "aws_security_group" "umoja" {
  name        = "umoja-security-group"
  description = "Security group for Umoja application"
  vpc_id      = var.vpc_id

  # HTTP access to Umoja
  ingress {
    description = "Umoja application"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH access (configurable)
  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  # The instance needs outbound web access for package updates and downloads.
  # The rule is limited to web ports; revisit it if an egress proxy is added.
  #trivy:ignore:AWS-0104
  egress {
    description = "Web access for updates and downloads"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Secure web access for updates and downloads"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "umoja-security-group"
  }
}
