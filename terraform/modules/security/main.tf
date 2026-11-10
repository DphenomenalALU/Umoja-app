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

  # Outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "umoja-security-group"
  }
}
