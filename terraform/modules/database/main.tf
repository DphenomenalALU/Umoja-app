resource "aws_db_subnet_group" "umoja" {
  name = "umoja-db-subnet-group"

  subnet_ids = [
    var.private_db_subnet_a_id,
    var.private_db_subnet_b_id
  ]

  tags = {
    Name = "umoja-db-subnet-group"
  }
}

resource "aws_db_instance" "umoja" {
  identifier = "umoja-postgres"

  engine         = "postgres"
  engine_version = "15"

  instance_class = "db.t3.micro"

  allocated_storage = 20

  db_name = "umoja"

  username = var.db_username
  password = var.db_password

  db_subnet_group_name = aws_db_subnet_group.umoja.name

  vpc_security_group_ids = [
    var.database_security_group_id
  ]

  publicly_accessible        = false
  storage_encrypted          = true
  backup_retention_period    = 1
  auto_minor_version_upgrade = true
  skip_final_snapshot        = true
}
