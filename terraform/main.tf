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

  vpc_id             = module.networking.vpc_id
  ssh_cidr           = var.ssh_cidr
  ssh_port           = var.ssh_port
  app_port           = var.app_port
  app_cidr_blocks    = var.app_cidr_blocks
  web_egress_ports   = var.web_egress_ports
  egress_cidr_blocks = var.egress_cidr_blocks
}

module "compute" {

  source = "./modules/compute"

  subnet_id                   = module.networking.subnet_id
  security_group_id           = module.security.security_group_id
  instance_type               = var.instance_type
  environment                 = var.environment
  key_name                    = var.key_name
  associate_public_ip_address = var.associate_public_ip_address
}
