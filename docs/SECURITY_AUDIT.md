# Security Analysis & Remediation Plan

## 1. Audit Findings (SCA/SAST & Load Testing)

### Software Composition Analysis (SCA) - Trivy Scan
- **Findings**: Some older versions of `node:20-alpine` might have minor OS-level vulnerabilities. `fastify` and other dependencies were scanned.
- **Criticality**: Low to Medium.

### Static Application Security Testing (SAST)
- **Findings**: Potential for SQL Injection if raw queries are used in `service_catalogue`. Hardcoded secrets in `.env` (addressed by K8s Secrets).
- **Criticality**: Medium.

### Load Testing Results (JMeter)
- **Findings**: At 50 concurrent users, latency increases on the `POST /api/catalogue/items` endpoint due to synchronous database writes without connection pooling optimization.
- **Criticality**: Low/Performance related.

## 2. Remediation Plan

### Immediate Actions
| Weakness | Remediation Action | Status |
| :--- | :--- | :--- |
| Secrets in Version Control | Use **Kubernetes Secrets** for DB credentials and Keycloak secrets. | [x] Implemented |
| Unsecured Ingress | Enable **HTTPS/TLS** with a self-signed certificate for the Ingress controller. | [/] In Progress |
| Missing Role Validation | Implement **Keycloak RBAC** check at the API Gateway. | [ ] Proposed |

### Strategic Improvements (Direction's Requirements)
1. **Encryption at Rest**:
   - **Action**: Enable `POSTGRES_PASSWORD` encryption and explore `pgcrypto` for sensitive user data in PostgreSQL.
   - **Benefit**: Ensures data remains secure even if the storage volumes are compromised.

2. **Fraud Detection on Prices**:
   - **Action**: Implement a validation layer in `service_catalogue` that checks the `price` against historical averages for the category.
   - **Logic**: If `price < (avg * 0.5)` or `price > (avg * 2)`, flag the item for manual review before it goes live.

3. **Data Protection at Rest**:
   - **Action**: Configure Persistent Volumes with encryption (highly dependent on the cloud provider, simulated here via encrypted PVC annotations).
