output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "acm_certificate_arn" {
  value = module.route53.acm_certificate_arn
}

output "route53_zone_id" {
  value = module.route53.zone_id
}