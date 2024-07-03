

resource "aws_lambda_function" "docker_lambda_function" {
  function_name = "${var.project_name}-docker-lambda-${var.env}"
  timeout       = 30 # seconds
  image_uri     = "${var.ecr_repository_url}:${var.image_tag}"
  package_type  = "Image"

  role = aws_iam_role.lambda_function_role.arn

  environment {
    variables = {
      DB_HOST = var.db_config.host
      DB_PORT = var.db_config.port
      DB_NAME = var.db_config.name
      DB_PASS = sensitive(var.db_config.pass)
      DB_USER = var.db_config.user

      SUPABASE_JWT_SECRET_KEY = sensitive(var.supabase_jwt_secret_key)
      OPENAI_API_KEY = sensitive(var.openai_api_key)
    }
  }
}

resource "aws_iam_role" "lambda_function_role" {
  name = "lambda-function-role-${var.env}"

  assume_role_policy = jsonencode({
    Statement = [
      {
        
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}



resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_function_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function_url" "function_url" {
  function_name      = aws_lambda_function.docker_lambda_function.function_name
  authorization_type = "NONE"

  # cors {
  #   allow_credentials = true
  #   allow_origins     = ["*"]
  #   allow_methods     = ["*"]
  #   allow_headers     = ["date", "keep-alive"]
  #   expose_headers    = ["keep-alive", "date"]
  #   max_age           = 86400
  # }
}