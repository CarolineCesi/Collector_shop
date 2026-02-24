# Projet Bloc 3 - Collector_shop - POC Architecture Microservices

@author : Caroline Grenet 
@groupe : MAALSI 24.2
@version : 1.0.0


# Qu'est ce que Collector.shop ? 

Ce repository contient le POC de l'architecture pour la plateforme C2C **Collector.shop**.

## Contexte 

L'entreprise Collector est une startup spécialisée dans la vente d'objets de collection vintage. Ce POC vise à démontrer la faisabilité et la résilience de l'architecture et à garantir la sécurité des transactions financières.

## Architecture
L'architecture repose sur des microservices isolés :
* **Service Catalogue** : Gestion des objets (Node.js / Express)
* **Service Paiement** : Sécurisation des transactions (Node.js)