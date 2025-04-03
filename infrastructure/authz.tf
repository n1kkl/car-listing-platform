// resources, scopes, and policies

resource "keycloak_openid_client_authorization_scope" "profile" {
  name               = "profile"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
}

resource "keycloak_openid_client_authorization_scope" "write" {
  name               = "write"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
}

resource "keycloak_openid_client_authorization_scope" "read" {
  name               = "read"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
}

resource "keycloak_openid_client_authorization_scope" "delete" {
  name               = "delete"
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

resource "keycloak_openid_client_authorization_resource" "profile" {
  name               = "profile"
  display_name       = "profile"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
  scopes = [
    keycloak_openid_client_authorization_scope.read.name,
    keycloak_openid_client_authorization_scope.write.name,
    keycloak_openid_client_authorization_scope.delete.name,
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
  scopes = [
    keycloak_openid_client_authorization_scope.profile.name
  ]
  policies = [
    keycloak_openid_client_role_policy.role-policy-user.name
  ]
}

resource "keycloak_openid_client_authorization_permission" "permission-profile-user" {
  name               = "permission_profile_user"
  realm_id           = keycloak_realm.clp_master.id
  resource_server_id = keycloak_openid_client.backend-api.resource_server_id
  resources = [
    keycloak_openid_client_authorization_resource.profile.name
  ]
  type = "scope"
  scopes = [
    keycloak_openid_client_authorization_scope.write.name,
    keycloak_openid_client_authorization_scope.read.name
  ]
  policies = [
    keycloak_openid_client_role_policy.role-policy-user.name
  ]
}