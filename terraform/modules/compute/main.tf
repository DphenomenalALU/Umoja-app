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

resource "aws_instance" "umoja" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  key_name = var.key_name

  subnet_id = var.subnet_id

  associate_public_ip_address = var.associate_public_ip_address

  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    encrypted = true
  }

  vpc_security_group_ids = [
    var.security_group_id
  ]

  tags = {
    Name        = "umoja-instance"
    Environment = var.environment
  }
}
