variable "project_name" {
  type        = string
  default     = "learny"
}

variable "root_domain_name" {
  type        = string
}

variable "prod_db_config" {
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

variable "openai_api_key" {
  type = string
}

variable "supabase_jwt_secret_key" {
  type = string
}