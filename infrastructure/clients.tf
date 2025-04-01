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

resource "keycloak_openid_user_realm_role_protocol_mapper" "frontend-app_profile" {
  client_scope_id = data.keycloak_openid_client_scope.profile.id
  realm_id        = keycloak_realm.clp_master.id
  name            = "roles"
  claim_name      = "roles"
  multivalued     = true
}