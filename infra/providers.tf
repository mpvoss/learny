terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}


provider "aws" {
  region  = "us-east-2"
  shared_credentials_files = ["./aws_creds"]
  profile = "edtech-tf"
}

# Needed because acm certs required to be in us-east-1 for cloudfront
provider "aws" {
  alias = "virginia"
  region = "us-east-1"
  profile = "edtech-tf"
  shared_credentials_files = ["./aws_creds"]
}