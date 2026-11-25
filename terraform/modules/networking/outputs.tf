output "vpc_id" {
  value = aws_vpc.umoja.id
}

output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "public_subnet_ids" {
  value = [aws_subnet.public.id, aws_subnet.public_b.id]
}

output "private_app_subnet_id" {
  value = aws_subnet.private_app.id
}

output "private_db_subnet_a_id" {
  value = aws_subnet.private_db_a.id
}

output "private_db_subnet_b_id" {
  value = aws_subnet.private_db_b.id
}
