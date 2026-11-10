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

resource "aws_internet_gateway" "umoja" {
  vpc_id = aws_vpc.umoja.id

  tags = {
    Name = "umoja-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.umoja.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.umoja.id
  }

  tags = {
    Name = "umoja-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}