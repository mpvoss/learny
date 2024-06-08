variable "project_name" {
  type        = string
}

variable "root_domain_name" {
  type        = string
}

variable "ecr_repository_url" {
  type = string
}

variable "acm_certificate_arn" {
  type = string
}

variable "route53_zone_id" {
  type = string
}