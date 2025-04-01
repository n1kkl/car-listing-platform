data "keycloak_openid_client_scope" "profile" {
  realm_id = keycloak_realm.clp_master.id
  name     = "profile"
}