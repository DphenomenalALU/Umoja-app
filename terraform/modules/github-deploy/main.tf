data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  account_id         = data.aws_caller_identity.current.account_id
  region             = data.aws_region.current.name
  ecr_repository_arn = "arn:aws:ecr:${local.region}:${local.account_id}:repository/${var.ecr_repository_name}"
  bastion_sg_arn     = "arn:aws:ec2:${local.region}:${local.account_id}:security-group/${var.bastion_security_group_id}"
}

# Lets AWS trust short-lived login tokens issued by GitHub Actions.
resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

# Who may use the role: only this repository, and only from main or the production environment.
data "aws_iam_policy_document" "trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_repository}:ref:refs/heads/${var.deploy_branch}",
        "repo:${var.github_repository}:environment:${var.deploy_environment}",
      ]
    }
  }
}

resource "aws_iam_role" "github_deploy" {
  name                 = "umoja-github-deploy"
  description          = "Assumed by GitHub Actions to push the Umoja image and open the bastion during deploys"
  assume_role_policy   = data.aws_iam_policy_document.trust.json
  max_session_duration = 3600
}

# What the role may do once GitHub has logged in.
data "aws_iam_policy_document" "deploy" {
  statement {
    sid       = "EcrLogin"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid = "PushUmojaImage"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage",
    ]
    resources = [local.ecr_repository_arn]
  }

  # The deploy job adds the runner's IP to the bastion for SSH, then removes it.
  statement {
    sid = "OpenBastionForDeploy"
    actions = [
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:RevokeSecurityGroupIngress",
    ]
    resources = [local.bastion_sg_arn]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "umoja-github-deploy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}