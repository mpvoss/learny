output "function_url" {
    value = aws_lambda_function.docker_lambda_function.invoke_arn
}
