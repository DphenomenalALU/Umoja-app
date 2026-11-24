data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name = "name"

    values = [
      "ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"
    ]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

#
# Public Bastion Host
#
resource "aws_instance" "bastion" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  key_name = var.key_name

  subnet_id = var.public_subnet_id

  associate_public_ip_address = true

  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  vpc_security_group_ids = [
    var.bastion_security_group_id
  ]

  tags = {
    Name        = "umoja-bastion"
    Environment = var.environment
  }
}

#
# Private Application VM
#
resource "aws_instance" "application" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  key_name = var.key_name

  subnet_id = var.private_app_subnet_id

  associate_public_ip_address = false
  iam_instance_profile        = var.application_instance_profile_name

  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  vpc_security_group_ids = [
    var.application_security_group_id
  ]

  tags = {
    Name        = "umoja-application"
    Environment = var.environment
  }
}
