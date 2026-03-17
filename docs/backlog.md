# Backlog - Prototype Collector.shop

## 1. User Story: Détection de fraude sur les prix
**En tant que** responsable de la plateforme,
**Je veux** que le système détecte et bloque automatiquement les articles dont le prix est suspect (aberrant),
**Afin d'** éviter les erreurs de saisie et les tentatives de fraude par "money laundering" ou "price manipulation".

### Critères d'acceptation (CA)
- **CA#1 (Fonctionnel)** : Lorsqu'un utilisateur tente d'ajouter un article avec un prix inférieur à 1€, l'API `service-catalogue` doit rejeter la requête avec une erreur 400.
- **CA#2 (Sécurité)** : Lorsqu'un utilisateur saisit un prix supérieur à 10 000€ (seuil défini pour le POC), une alerte de fraude doit être générée dans les logs et le système peut bloquer ou marquer l'article pour révision.
- **CA#3 (Communication)** : Le Microservice Gateway doit router correctement la requête vers le Microservice Catalogue et retourner l'erreur appropriée au Frontend.
- **CA#4 (Observabilité)** : Les tentatives de fraude doivent être visibles via les logs centralisés (ou le monitoring de l'API).

## 2. Infrastructure et Pipeline
- **Pipeline CI/CD** : Doit inclure un scan de vulnérabilités (Trivy) et des tests unitaires (Jest).
- **Déploiement** : Orchestration via Kubernetes (Minikube) avec gestion via Kustomize.
- **Sécurité** : Intégration de Keycloak pour l'authentification (POC).
