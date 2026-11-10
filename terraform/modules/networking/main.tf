resource "aws_vpc" "umoja" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "umoja-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.umoja.id
  cidr_block = var.public_subnet_cidr

  map_public_ip_on_launch = true

  tags = {
    Name = "umoja-public-subnet"
  }
}