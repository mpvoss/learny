
module "ecr" {
  source = "../../modules/ecr"
  project_name = var.project_name
}

module "route53" {
  source = "../../modules/route53"
  project_name = var.project_name
  root_domain_name = var.root_domain_name
}