
resource "azurerm_storage_account" "sa" {
  name                            = "${var.project_name}site"
  resource_group_name             = "${var.rg_name}"
  location                        = "${var.rg_location}"
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = true
}

resource "azurerm_storage_container" "sc" {
  name                  = "sc-website"
  storage_account_name  = azurerm_storage_account.sa.name
  container_access_type = "blob"
}

resource "azurerm_cdn_profile" "cdn" {
  name                = "${var.project_name}-cdn"
  location            = "${var.rg_location}"
  resource_group_name = "${var.rg_name}"
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "endpoint" {
  name                = "${var.project_name}-cdn-endpoint"
  profile_name        = azurerm_cdn_profile.cdn.name
  location            = "${var.rg_location}"
  resource_group_name = "${var.rg_name}"
  origin_host_header  = azurerm_storage_account.sa.primary_blob_host
  
  origin_path = "/${azurerm_storage_container.sc.name}"
  origin {
    name      = "StorageAccountOrigin"
    host_name = azurerm_storage_account.sa.primary_blob_host
  }

  global_delivery_rule {
    cache_expiration_action {
      behavior = "Override"
      duration = "00:05:00"
    }
  }
  delivery_rule {
    name               = "ReactRewriteRule"
    order              = 1
    url_file_extension_condition {
      operator       = "LessThan"
      match_values = ["1"]
    }
    url_rewrite_action {
      source_pattern          = "/"
      destination             = "/index.html"
      preserve_unmatched_path = false
    }
  }
}

