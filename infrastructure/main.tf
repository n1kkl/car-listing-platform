terraform {
  required_providers {
    keycloak = {
      source  = "mrparkers/keycloak"
      version = "5.1.1"
    }
  }
}

provider "keycloak" {
  client_id     = "admin-cli"
  client_secret = "DfNKkVLoFD5pJWi2xNuhfQw4pyj229kY"
  url           = "http://localhost:7080"
}

resource "keycloak_realm" "clp_master" {
  realm   = "clp_master"
  enabled = true
}

// realm roles

resource "keycloak_role" "user" {
  realm_id    = keycloak_realm.clp_master.id
  name        = "user"
  description = "The default user role. This role is assigned to all users."
}

resource "keycloak_default_roles" "default_roles" {
  default_roles = [keycloak_role.user.name]
  realm_id = keycloak_realm.clp_master.id
}

// backend-api

resource "keycloak_openid_client" "backend-api" {
  client_id = "backend-api"
  realm_id  = keycloak_realm.clp_master.id

  name                     = "backend-api"
  enabled                  = true
  service_accounts_enabled = true

  authorization {
    policy_enforcement_mode = "ENFORCING"
  }

  access_type = "CONFIDENTIAL"
  root_url    = "http://localhost:3000"
}

resource "keycloak_openid_client_service_account_realm_role" "backend-api_user" {
  realm_id                = keycloak_realm.clp_master.id
  service_account_user_id = keycloak_openid_client.backend-api.service_account_user_id
  role                    = keycloak_role.user.name
}

// frontend-app

resource "keycloak_openid_client" "frontend-app" {
  client_id = "frontend-app"
  realm_id  = keycloak_realm.clp_master.id

  name                  = "frontend-app"
  enabled               = true
  implicit_flow_enabled = false
  standard_flow_enabled = true

  access_type = "PUBLIC"
  root_url    = "http://localhost:3001"
  valid_redirect_uris = [
    "http://localhost:3001/*"
  ]
  web_origins = [
    "+"
  ]
}

// scope mappings

data "keycloak_openid_client_scope" "profile" {
  realm_id = keycloak_realm.clp_master.id
  name     = "profile"
}

resource "keycloak_openid_user_realm_role_protocol_mapper" "frontend-app_profile" {
  client_scope_id = data.keycloak_openid_client_scope.profile.id
  realm_id        = keycloak_realm.clp_master.id
  name            = "roles"
  claim_name      = "roles"
  multivalued     = true
}

// resources, scopes, and policies

resource "keycloak_openid_client_authorization_scope" "profile" {
  name               = "profile"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
}

resource "keycloak_openid_client_authorization_resource" "auth" {
  name               = "auth"
  display_name       = "auth"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
  scopes = [
    keycloak_openid_client_authorization_scope.profile.name
  ]
}

resource "keycloak_openid_client_role_policy" "role-policy-user" {
  name               = "role_policy_user"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
  type               = "role"
  decision_strategy  = "UNANIMOUS"
  logic              = "POSITIVE"

  role {
    id       = keycloak_role.user.id
    required = true
  }
}

resource "keycloak_openid_client_authorization_permission" "permission-auth-profile" {
  name               = "permission_auth_profile"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
  resources = [
    keycloak_openid_client_authorization_resource.auth.name
  ]
  policies = [
    keycloak_openid_client_role_policy.role-policy-user.name
  ]
}