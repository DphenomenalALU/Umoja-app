output "db_endpoint" {
  value = aws_db_instance.umoja.endpoint
}

output "db_name" {
  value = aws_db_instance.umoja.db_name
}