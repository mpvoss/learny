output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "acm_certificate_arn" {
  value = module.route53.acm_certificate_arn
}

output "route53_zone_id" {
  value = module.route53.zone_id
}

output "apigw_id"{
    value = module.apigw.apigw_id
}

output "apigw_arn"{
    value = module.apigw.apigw_arn
}

output "apigw_execution_arn"{
    value = module.apigw.apigw_execution_arn
}

output "apigw_endpoint"{
    value = module.apigw.apigw_endpoint
}