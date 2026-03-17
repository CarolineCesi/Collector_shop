# Keycloak POC: Authorization Server Configuration

This document describes the official experimentation with Keycloak for the Collector_shop project, focusing on securing the API Gateway and managing "Acheteur/Vendeur" roles.

## 1. Authorisation Server Configuration

### Realm Creation
- **Realm Name**: `collector-shop`
- **Display Name**: Collector Shop Authentication

### Client Configuration
- **Client ID**: `collector-gateway`
- **Access Type**: `confidential` (requires client secret)
- **Valid Redirect URIs**: `http://collector-shop.local/*`
- **Web Origins**: `*`

### Roles Implementation
Two major roles are defined within the realm:
1. `ACHETEUR`: Permission to browse the catalogue and make purchases.
2. `VENDEUR`: Permission to add, edit, or delete items in the catalogue.

### Users & Role Mapping
- `user-buyer`: Assigned `ACHETEUR` role.
- `user-seller`: Assigned `VENDEUR` role.

## 2. API Gateway Security

The API Gateway acts as an Enforcement Point. It intercepts incoming requests and validates the JWT issued by Keycloak.

### Security logic (Simulated in `api_gateway/src/index.js`):
1. Extract `Authorization: Bearer <TOKEN>` header.
2. Verify token signature with Keycloak Public Key (retrieved from `auth/realms/collector-shop/protocol/openid-connect/certs`).
3. Extract `realm_access.roles` from the payload.
4. Check if the user has the required role for the requested route:
   - `POST /api/catalogue/items` -> Requires `VENDEUR`
   - `GET /api/catalogue/items` -> Requires `ACHETEUR` or `VENDEUR`

## 3. Difficulties & Remediation

- **Challenge**: Secure communication between services inside K8s while maintaining the user identity.
- **Solution**: The Gateway performs the initial validation and then propagates the user's roles via custom headers (e.g., `X-User-Roles`) to downstream microservices, which then perform fine-grained access control if necessary.

## 4. Keycloak Deployment in Minikube
Deployed via `k8s/keycloak.yaml` using the official `quay.io/keycloak/keycloak:24.0` image, with auto-import of the realm configuration.
