provider "aws" {
  region = var.aws_region
}

module "networking" {
  source = "./modules/networking"

  vpc_cidr           = var.vpc_cidr
  public_subnet_cidr = var.public_subnet_cidr
}

module "security" {

  source = "./modules/security"

  vpc_id   = module.networking.vpc_id
  ssh_cidr = var.ssh_cidr
}

module "compute" {

  source = "./modules/compute"

  subnet_id         = module.networking.subnet_id
  security_group_id = module.security.security_group_id
  instance_type     = var.instance_type
  environment       = var.environment
  key_name          = var.key_name
}