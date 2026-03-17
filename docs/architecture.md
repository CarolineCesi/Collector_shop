# Architecture Technique - Collector.shop

## Schéma d'Architecture (Mermaid)

```mermaid
graph TD
    User((Utilisateur))
    Frontend[Frontend - React/Vite]
    Gateway[API Gateway - Node/Express]
    Auth[Keycloak - Auth Server]
    
    subgraph "Kubernetes (Minikube)"
        subgraph "Ingress Control"
            Ingress[Nginx Ingress]
        end
        
        subgraph "Microservices"
            SC[Service Catalogue - Node.js]
            SU[Service Utilisateur - Node.js]
            SP[Service Paiement - Node.js]
        end
        
        subgraph "Databases"
            DBC[(PostgreSQL - Catalogue)]
            DBU[(PostgreSQL - Utilisateur)]
        end
        
        subgraph "Observability"
            Prom(Prometheus)
            Graf(Grafana)
        end
    end

    User --> Ingress
    Ingress --> Frontend
    Ingress --> Gateway
    Gateway --> Auth
    Gateway --> SC
    Gateway --> SU
    SC --> DBC
    SU --> DBU
    Prom --> SC
    Prom --> SU
    Prom --> Gateway
    Graf --> Prom
```

## Choix Techniques
- **Frameworks** : Node.js (Backend), React/Vite (Frontend).
- **Protocoles** : REST (HTTP/JSON).
- **Microservices** : Architecture découplée pour la scalabilité et la résilience.
- **Sécurité** : Gateway avec `helmet` et `rate-limit`, Authentification via JWT/Keycloak.
- **Base de données** : PostgreSQL (une instance par service pour l'isolation).
- **Orchestration** : Kubernetes (Minikube) pour la portabilité cloud-native.
- **Pipelines** : GitHub Actions (CI/CD) avec Trivy (Sécurité) et Jest (Tests).
- **Observability** : Prometheus/Grafana pour le monitoring des métriques.
