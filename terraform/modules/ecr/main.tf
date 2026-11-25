resource "aws_ecr_repository" "umoja" {
  name = "umoja"

  image_scanning_configuration {
    scan_on_push = true
  }

  image_tag_mutability = "IMMUTABLE"
}

data "aws_iam_policy_document" "application_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "application_image_pull" {
  name               = "umoja-application-ecr-pull"
  assume_role_policy = data.aws_iam_policy_document.application_assume_role.json
}

data "aws_iam_policy_document" "application_image_pull" {
  statement {
    sid       = "EcrLogin"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid = "PullUmojaImage"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [aws_ecr_repository.umoja.arn]
  }
}

resource "aws_iam_role_policy" "application_image_pull" {
  name   = "umoja-application-ecr-pull"
  role   = aws_iam_role.application_image_pull.id
  policy = data.aws_iam_policy_document.application_image_pull.json
}

resource "aws_iam_instance_profile" "application" {
  name = "umoja-application"
  role = aws_iam_role.application_image_pull.name
}
