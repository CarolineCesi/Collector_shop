# Processus de Test - POC Collector.shop

Ce document décrit la stratégie de test appliquée au Proof of Concept (POC) Collector.shop.

## 1. Types de Tests et Outils

| Type de Test | Objectif | Outil | Métrique / Seuil |
| :--- | :--- | :--- | :--- |
| **Tests Unitaires** | Vérifier la logique métier isolée (fonctions, routes) | **Jest / Supertest** | Couverture > 80% |
| **Tests de Performance** | Mesurer la réactivité du système sous charge | **k6** | Temps de réponse (ms) |
| **Tests d'Intégration** | Vérifier la communication entre services et base de données | Jest / Docker-compose | Succès des requêtes |
| **Conformité Réglementaire** | Vérifier la détection de fraude et la sécurité (RGPD/Keycloak) | Jest / Scripts custom | Validation des règles métier |

## 2. Outils de tests associés
- **Jest** : Framework de test JavaScript pour les tests unitaires et d'intégration.
- **Supertest** : Bibliothèque pour tester les APIs HTTP.
- **k6** : Outil moderne pour les tests de charge et de performance.
- **SonarQube** (Optionnel) : Pour le suivi de la qualité du code et de la couverture.

## 3. Parties Prenantes
- **Équipe de Développement** : Écriture et maintenance des tests unitaires et d'intégration.
- **DevOps / QA** : Configuration des tests de performance et de l'intégration continue (CI/CD).
- **Direction Métier** : Validation des critères d'acceptation (ex: détection de fraude sur les prix).

## 4. Application au POC
Pour ce POC, nous nous concentrons sur :
1. **Tests Unitaires (Jest)** sur les microservices `service_catalogue` et `service_utilisateur` avec un objectif de couverture de code de 80%.
2. **Tests de Performance (k6)** sur les endpoints critiques du catalogue pour s'assurer de la fluidité de l'expérience utilisateur.
