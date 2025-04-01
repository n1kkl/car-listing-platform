resource "keycloak_role" "user" {
  realm_id    = keycloak_realm.clp_master.id
  name        = "user"
  description = "The default user role. This role is assigned to all users."
}

resource "keycloak_default_roles" "default_roles" {
  default_roles = [keycloak_role.user.name]
  realm_id = keycloak_realm.clp_master.id
}