variable "keycloak_url" {
  description = "The URL of the Keycloak server"
  type        = string
}

variable "keycloak_client_id" {
  type        = string
  description = "The client ID for the admin client"
}

variable "keycloak_client_secret" {
  type        = string
  description = "The client secret for the admin client"
  sensitive   = true
}