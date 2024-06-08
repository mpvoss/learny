variable "root_domain_name" {
  type = string
}

variable "project_name" {
  type        = string
}

variable "lambda_function_url" {
  type        = string
}

variable "acm_certificate_arn" {
  type        = string
}

variable "route53_zone_id" {
  type        = string
}

variable "env" {
  type = string
}