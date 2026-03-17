# Synthèse du Protocole d'Expérimentation

## 1. Expérimentation : Orchestration et Déploiement Kubernetes
### Objectif
Valider la capacité de déploiement et de résilience d'une architecture microservices sur Kubernetes (Minikube).

### Environnement de test
- Minikube local (Driver: Docker)
- Kustomize pour la gestion des configurations par environnement (Dev/Prod).

### Étapes clés
1.  **Conteneurisation** : Création de Dockerfiles optimisés pour chaque service.
2.  **Manifests** : Écriture des YAML (Deployments, Services, Ingress, Secrets).
3.  **Déploiement** : Utilisation de `kubectl apply -k` pour déployer la base et les overlays.
4.  **Résilience** : Simulation de crash de pod et vérification de l'auto-healing par K8s.

### Difficultés et Limites
- **Image Pull** : Difficulté initiale pour charger les images locales dans Minikube sans registre externe (Résolu via `minikube image load`).
- **Ressources** : Minikube consomme beaucoup de RAM lors du lancement de 5+ microservices plus l'observabilité.

---

## 2. Expérimentation : Pipeline CI/CD et Métriques de Qualité
### Objectif
Automatiser la validation du code et la sécurité avant le déploiement.

### Environnement de test
- GitHub Actions.
- Outils : Jest (Unit tests), Trivy (Security scan).

### Étapes clés
1.  **Config Workflow** : Définition des jobs `build`, `test`, et `security`.
2.  **Multi-métriques** : 
    - Métrique 1 : Taux de succès des tests unitaires (> 90%).
    - Métrique 2 : Nombre de vulnérabilités critiques (doit être 0 pour passer).
3.  **Build Docker** : Automatisation du push d'image après succès des tests.

### Résultats
L'adoption du pipeline permet de détecter les régressions instantanément. L'utilisation de Trivy a permis d'identifier des vulnérabilités dans l'image de base Node.js, menant au choix de l'image `node:20-slim`.
