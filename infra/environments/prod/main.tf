module "lambda" {
  source = "../../modules/lambda"
  project_name = "${var.project_name}"
  env = "prod"
  ecr_repository_url = var.ecr_repository_url
  image_tag = "stable"
}

module "cloudfront" {
  source = "../../modules/cloudfront"
  project_name = "${var.project_name}"
  root_domain_name = "${var.root_domain_name}"
  lambda_function_url = module.lambda.function_url
  acm_certificate_arn = var.acm_certificate_arn
  route53_zone_id = var.route53_zone_id
}