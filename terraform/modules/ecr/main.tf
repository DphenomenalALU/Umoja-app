resource "aws_ecr_repository" "umoja" {
  name = "umoja"

  image_scanning_configuration {
    scan_on_push = true
  }

  image_tag_mutability = "MUTABLE"
}