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
    Name = "umoja-internet-gateway"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.umoja.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.umoja.id
  }

  tags = {
    Name = "umoja-public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}


resource "aws_subnet" "private_app" {
  vpc_id     = aws_vpc.umoja.id
  cidr_block = var.private_app_subnet_cidr

  tags = {
    Name = "umoja-private-app"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "private_db_a" {
  vpc_id            = aws_vpc.umoja.id
  cidr_block        = var.private_db_subnet_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "umoja-private-db-a"
  }
}

resource "aws_subnet" "private_db_b" {
  vpc_id            = aws_vpc.umoja.id
  cidr_block        = var.private_db_subnet_cidr_b
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "umoja-private-db-b"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "umoja" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.umoja.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.umoja.id
  }
}

resource "aws_route_table_association" "private_app" {
  subnet_id      = aws_subnet.private_app.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_db_a" {
  subnet_id      = aws_subnet.private_db_a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_db_b" {
  subnet_id      = aws_subnet.private_db_b.id
  route_table_id = aws_route_table.private.id
}