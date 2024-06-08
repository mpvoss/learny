# resource "azurerm_resource_group" "rg" {
#   location = var.resource_group_location
#   name     = "rg-${var.project_name}"
# }


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
}

# module "storage_account_site" {
#   source = "./storage_account_site"
#   project_name = var.project_name
#   rg_name = azurerm_resource_group.rg.name
#   rg_location = azurerm_resource_group.rg.location
# }

# module "functionapp" {
#   source = "./modules/functionapp"
#   project_name = var.project_name
#   rg_name = azurerm_resource_group.rg.name
#   rg_location = azurerm_resource_group.rg.location
# }