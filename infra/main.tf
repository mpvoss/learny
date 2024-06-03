resource "azurerm_resource_group" "rg" {
  location = var.resource_group_location
  name     = "rg-${var.project_name}"
}

module "storage_account_site" {
  source = "./storage_account_site"
  project_name = var.project_name
  rg_name = azurerm_resource_group.rg.name
  rg_location = azurerm_resource_group.rg.location
}

module "functionapp" {
  source = "./modules/functionapp"
  project_name = var.project_name
  rg_name = azurerm_resource_group.rg.name
  rg_location = azurerm_resource_group.rg.location
}