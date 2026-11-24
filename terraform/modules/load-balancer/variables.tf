variable "vpc_id" {
  description = "VPC that contains the application targets"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnets in two availability zones"
  type        = list(string)
}

variable "load_balancer_sg_id" {
  description = "Security group attached to the public load balancer"
  type        = string
}

variable "application_instance_id" {
  description = "Private application EC2 instance registered as the target"
  type        = string
}

variable "app_port" {
  description = "Application port on the private target"
  type        = number
}
