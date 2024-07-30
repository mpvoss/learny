variable "project_name" {
  type = string
}

variable "env" {
  type = string
}

variable "ecr_repository_url" {
  type = string
}

variable "image_tag" {
  type = string
}

variable "db_config" {
  description = "Configuration settings for the database"
  type = map(string)
  default = {
    host     = "localhost"
    username = "user"
    password = "pass"
    name     = "dbname"
    port     = "5432"
  }
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
  