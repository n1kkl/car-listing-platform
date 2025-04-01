terraform {
  required_providers {
    keycloak = {
      source  = "mrparkers/keycloak"
      version = "5.1.1"
    }
  }
}

provider "keycloak" {
  client_id     = var.keycloak_client_id
  client_secret = var.keycloak_client_secret
  url           = var.keycloak_url
}

resource "keycloak_realm" "clp_master" {
  realm   = "clp_master"
  enabled = true
}