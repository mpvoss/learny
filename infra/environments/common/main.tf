
# terraform {
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~> 4.16"
#     }
   
#   }
# }

# provider "aws" {
#   alias  = "virginia"
#   region = "us-east-1"
#   profile = "edtech-tf"
#   shared_credentials_files = ["./aws_creds"]
# }

module "ecr" {
  source = "../../modules/ecr"
  project_name = var.project_name
}

module "route53" {
  source = "../../modules/route53"
  project_name = var.project_name
  root_domain_name = var.root_domain_name

  # providers = {
  #   aws = aws
  #   aws.virginia = aws.virginia
  # }
}