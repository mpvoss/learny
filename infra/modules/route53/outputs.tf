output "acm_certificate_arn" {
    value = aws_acm_certificate.certificate.arn
}

output "zone_id" {
    value = aws_route53_zone.zone.zone_id
}