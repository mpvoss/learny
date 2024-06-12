module "lambda" {
  source = "../../modules/lambda"
  project_name = "${var.project_name}"
  env = "prod"
  ecr_repository_url = var.ecr_repository_url
  image_tag = "stable"
  db_config = var.db_config
  supabase_jwt_secret_key = var.supabase_jwt_secret_key
  openai_api_key = var.openai_api_key
}

module "cloudfront" {
  source = "../../modules/cloudfront"
  project_name = "${var.project_name}"
  root_domain_name = "${var.root_domain_name}"
  lambda_function_url = module.lambda.function_url
  acm_certificate_arn = var.acm_certificate_arn
  route53_zone_id = var.route53_zone_id
  env = "prod"
  apigw_endpoint = var.apigw_endpoint
}

module "apigw_lambda_integration" {
  source = "../../modules/apigw_lambda_integration"
  project_name = "${var.project_name}"
  lambda_arn = module.lambda.lambda_arn 
  env = "prod"
  apigw_id = var.apigw_id
  apigw_arn = var.apigw_arn
  function_name = module.lambda.function_name
  apigw_execution_arn = var.apigw_execution_arn
}