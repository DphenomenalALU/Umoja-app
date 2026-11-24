provider "aws" {
  region = var.aws_region
}

module "networking" {
  source = "./modules/networking"

  vpc_cidr                 = var.vpc_cidr
  public_subnet_cidr       = var.public_subnet_cidr
  private_app_subnet_cidr  = var.private_app_subnet_cidr
  private_db_subnet_cidr   = var.private_db_subnet_cidr
  private_db_subnet_cidr_b = var.private_db_subnet_cidr_b
}

module "security" {
  source = "./modules/security"

  vpc_id             = module.networking.vpc_id
  ssh_cidr           = var.ssh_cidr
  app_port           = var.app_port
  app_cidr_blocks    = var.app_cidr_blocks
  web_egress_ports   = var.web_egress_ports
  egress_cidr_blocks = var.egress_cidr_blocks
}

module "compute" {
  source = "./modules/compute"

  instance_type = var.instance_type
  environment   = var.environment
  key_name      = var.key_name

  public_subnet_id      = module.networking.public_subnet_id
  private_app_subnet_id = module.networking.private_app_subnet_id

  bastion_security_group_id     = module.security.bastion_security_group_id
  application_security_group_id = module.security.application_security_group_id
  database_security_group_id    = module.security.database_security_group_id
}

module "database" {
  source = "./modules/database"

  private_db_subnet_a_id     = module.networking.private_db_subnet_a_id
  private_db_subnet_b_id     = module.networking.private_db_subnet_b_id
  database_security_group_id = module.security.database_security_group_id

  db_username = var.db_username
  db_password = var.db_password
}

module "ecr" {
  source = "./modules/ecr"
}
