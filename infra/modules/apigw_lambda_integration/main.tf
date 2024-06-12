
resource "aws_apigatewayv2_integration" "apigw_integration" {
  api_id           = var.apigw_id
  integration_type = "AWS_PROXY"

  connection_type        = "INTERNET"
  description            = "Integration for lambda function"
  integration_method     = "ANY"
  integration_uri        = var.lambda_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_stage" "apigw_stage" {
  api_id      = var.apigw_id
  name        = var.env
  description = "${var.env} stage"
  auto_deploy = true

  default_route_settings {
    data_trace_enabled     = false
    throttling_burst_limit = 5000
    throttling_rate_limit  = 5000
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.apigw_log_group.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}


resource "aws_cloudwatch_log_group" "apigw_log_group" {
  name = "/aws/api-gw/api-gw-logs"

  retention_in_days = 30
}

resource "aws_apigatewayv2_route" "apigw_route" {
  api_id    = var.apigw_id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.apigw_integration.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.apigw_execution_arn}/*/*"
}

# resource "aws_apigatewayv2_route" "cors_route" {
#   api_id    = var.apigw_id
#   route_key = "OPTIONS /{proxy+}"
#   target    = "integrations/${aws_apigatewayv2_integration.apigw_integration.id}"
# }

# resource "aws_apigatewayv2_route_response" "cors_route_response" {
#   api_id      = var.apigw_id
#   route_id    = aws_apigatewayv2_route.cors_route.id
#   route_response_key = "$default"

#   response_models = {
#     "application/json" = "Empty"
#   }

#   response_parameters = {
#     "gatewayresponse.header.Access-Control-Allow-Origin"      = "'your-domain.com'"
#     "gatewayresponse.header.Access-Control-Allow-Headers"     = "'*'"
#     "gatewayresponse.header.Access-Control-Allow-Credentials" = "'true'"
#     "gatewayresponse.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST'"
#   }
# }