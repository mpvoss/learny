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

variable "apigw_id" {
  type = string
}

variable "apigw_arn" {
  type = string
}

variable "apigw_execution_arn"{
    type = string
}

variable "apigw_endpoint"{
    type = string
}

variable "db_config" {
  description = "Configuration settings for the database"
  type = map(string)
}

variable "supabase_jwt_secret_key" {
  type = string
}

variable "openai_api_key" {
  type = string
}

variable "qdrant_api_key" {
  type = string
}

variable "qdrant_url" {
  type = string
}