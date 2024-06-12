resource "aws_apigatewayv2_api" "apigw" {
  name          = "${var.project_name}-apigw"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://mpvoss.com"]
    allow_methods = ["POST", "GET", "OPTIONS", "PUT", "DELETE"]
    allow_headers = ["content-type"]
    max_age = 300
  }
}