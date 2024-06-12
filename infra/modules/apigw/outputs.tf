output "apigw_id"{
    value = aws_apigatewayv2_api.apigw.id
}

output "apigw_arn"{
    value = aws_apigatewayv2_api.apigw.arn
}

output "apigw_execution_arn"{
    value = aws_apigatewayv2_api.apigw.execution_arn
}

output "apigw_endpoint"{
    value = aws_apigatewayv2_api.apigw.api_endpoint
}