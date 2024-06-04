resource "azurerm_storage_account" "func_storage_account" {
  name                     = "sa${var.project_name}functionapp"
  resource_group_name      = var.rg_name
  location                 = var.rg_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}


# data "archive_file" "python_function_package" {  
#   type = "zip"  
#   source_dir = "../../../build"  
#   output_path = "build.zip"
# }

resource "azurerm_service_plan" "service_plan" {
  name                = "functionapp-service-plan"
  resource_group_name = var.rg_name
  location            = var.rg_location
  os_type             = "Linux"
  sku_name            = "Y1"
}


resource "azurerm_linux_function_app" "functionapp" {
  name                       = "${var.project_name}-functionapp"
  resource_group_name        = var.rg_name
  location                   = var.rg_location
  storage_account_name       = azurerm_storage_account.func_storage_account.name
  storage_account_access_key = azurerm_storage_account.func_storage_account.primary_access_key
  service_plan_id            = azurerm_service_plan.service_plan.id

  zip_deploy_file = "../build/build.zip"
  app_settings = {
    # WEBSITE_RUN_FROM_PACKAGE = "1"
    "SCM_DO_BUILD_DURING_DEPLOYMENT"="true"
    # "ENABLE_ORYX_BUILD"="true"
  }
  site_config {
    application_stack {
      python_version = "3.11"
    }
  }
}
