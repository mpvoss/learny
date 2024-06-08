

resource "aws_lambda_function" "docker_lambda_function" {
  function_name = "${var.project_name}-docker-lambda-${var.env}"
  timeout       = 5 # seconds
  image_uri     = "${var.ecr_repository_url}:${var.image_tag}"
  package_type  = "Image"

  role = aws_iam_role.lambda_function_role.arn

  environment {
    variables = {
      ENVIRONMENT = var.env
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