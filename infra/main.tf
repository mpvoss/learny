module "common"{  
  source = "./environments/common"  
  project_name = var.project_name  
  root_domain_name = var.root_domain_name
}

module "prod_env"{  
  source = "./environments/prod"  
  project_name = var.project_name  
  ecr_repository_url = module.common.ecr_repository_url
  root_domain_name = var.root_domain_name
  route53_zone_id = module.common.route53_zone_id 
  acm_certificate_arn = module.common.acm_certificate_arn
  apigw_id = module.common.apigw_id
  apigw_arn = module.common.apigw_arn
  apigw_execution_arn = module.common.apigw_execution_arn
  apigw_endpoint = module.common.apigw_endpoint
  db_config = var.prod_db_config
  supabase_jwt_secret_key = var.supabase_jwt_secret_key
  openai_api_key = var.openai_api_key
  qdrant_api_key = var.qdrant_api_key
  qdrant_url = var.qdrant_url
}
