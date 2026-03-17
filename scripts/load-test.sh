#!/bin/bash

# Script de test de charge simple utilisant 'siege'
# Nécessite l'installation de siege (sudo apt install siege)

URL="http://collector.local/api/catalogue/products" # Adapter selon votre Ingress

echo "Lancement du test de charge sur $URL"
echo "Simulation de 20 utilisateurs concurrents pendant 30 secondes..."

siege -c20 -t30S $URL

echo "Test terminé. Consultez les métriques ci-dessus pour le taux de succès et le temps de réponse."
