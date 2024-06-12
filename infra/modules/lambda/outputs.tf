output "function_url" {
    value = aws_lambda_function_url.function_url.function_url
}

output "lambda_arn"{
    value = aws_lambda_function.docker_lambda_function.arn
}

output "function_name" {
    value = aws_lambda_function.docker_lambda_function.function_name
}