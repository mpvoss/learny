locals {
  s3_origin_id  = "s3-${var.project_name}.com"
  apigw_origin_id = "${var.env}-apigw"
}

resource "aws_s3_bucket" "sitebucket" {
  bucket = "${var.project_name}-s3-sitebucket-${var.env}"
}

resource "aws_s3_bucket_website_configuration" "s3_website_config" {
  bucket = aws_s3_bucket.sitebucket.id

  index_document {
    suffix = "index.html"
  }

  # In react using multiple pages all handled by index...bit hacky but eh
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_acl" "protected_bucket_acl" {
  bucket = aws_s3_bucket.sitebucket.id
  acl    = "private"
}

# Resource to avoid error "AccessControlListNotSupported: The bucket does not allow ACLs"
resource "aws_s3_bucket_ownership_controls" "s3_bucket_acl_ownership" {
  bucket = aws_s3_bucket.sitebucket.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "${var.project_name}"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.sitebucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }

  }

  aliases = ["${var.root_domain_name}", "*.${var.root_domain_name}"]

  origin {
    //remove https:// from the domain name
    domain_name = replace(var.apigw_endpoint, "https://", "")
    origin_id   = local.apigw_origin_id
    origin_path = "/${var.env}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only" 
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]

    }
    
  }

  custom_error_response {
    error_caching_min_ttl = 86400
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "cloudfront-dist"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 60 #TODO increase this 3600
    max_ttl                = 60 #TODO incrase this 86400
  }


  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "POST", "DELETE", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.apigw_origin_id

    forwarded_values {
      query_string = true

      # had to do this to get cloudfront to talk to apigw, unsure if this is going to break auth once I try that, todo revisit
      headers = ["Authorization"] 

      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "MX"] #"GB", "DE", "IN", "IR"]
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }
  # Configure logging here if required 	
  logging_config {
   include_cookies = false
   bucket          = aws_s3_bucket.cloudfront_logs.bucket_domain_name
  #  prefix          = "myprefix"
  }

  # If you have domain configured use it here 
  #aliases = ["mywebsite.example.com", "s3-static-web-dev.example.com"]
}

resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "${var.project_name}-cloudfront-access-logs-${var.env}"
}

resource "aws_s3_bucket_lifecycle_configuration" "cloudfront_logs_lifecycle" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    id     = "30-day-exp"
    status = "Enabled"
    expiration {
      days = 30
    }
  }
}

resource "aws_s3_bucket_acl" "protected_cf_bucket_acl" {
  bucket     = aws_s3_bucket.cloudfront_logs.id
  acl        = "private"
  depends_on = [aws_s3_bucket_ownership_controls.s3_cf_bucket_acl_ownership]
}

# Resource to avoid error "AccessControlListNotSupported: The bucket does not allow ACLs"
resource "aws_s3_bucket_ownership_controls" "s3_cf_bucket_acl_ownership" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.sitebucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "sitebucket" {
  bucket = aws_s3_bucket.sitebucket.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_s3_bucket_public_access_block" "sitebucket" {
  bucket = aws_s3_bucket.sitebucket.id

  block_public_acls   = true
  block_public_policy = true
  # //ignore_public_acls      = true
  # //restrict_public_buckets = true
}






# Note...might need to add wildcard record for subdomains later?
resource "aws_route53_record" "root_domain" {
  zone_id = var.route53_zone_id
  name    = var.root_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# resource "aws_route53_record" "subdomain_wildcard" {
#   zone_id = aws_route53_zone.zone.zone_id
#   name    = "*.${var.root_domain_name}"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.s3_distribution.domain_name
#     zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "test_subdomain" {
#   zone_id = aws_route53_zone.zone.zone_id
#   name    = "*.test.${var.root_domain_name}"
#   type    = "A"
#   ttl     = 60
#   // to change this to test distribution once it exists
#   records = ["185.199.110.153"]
# }

