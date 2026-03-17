# Script to build and load images into Minikube

Write-Host "Building Front-End image..." -ForegroundColor Cyan
docker build -t frontend:latest ./frontend

Write-Host "Building Service Catalogue image..." -ForegroundColor Cyan
docker build -t service-catalogue:latest ./service_catalogue

Write-Host "Building Service Utilisateur image..." -ForegroundColor Cyan
docker build -t service-utilisateur:latest ./service_utilisateur

Write-Host "Building API Gateway image..." -ForegroundColor Cyan
docker build -t api-gateway:latest ./api_gateway

# Load images into Minikube
Write-Host "Loading images into Minikube (this may take a minute)..." -ForegroundColor Yellow
minikube image load frontend:latest
minikube image load service-catalogue:latest
minikube image load service-utilisateur:latest
minikube image load api-gateway:latest

Write-Host "Images loaded successfully! Restarting pods..." -ForegroundColor Green
kubectl rollout restart deployment frontend
kubectl rollout restart deployment service-catalogue
kubectl rollout restart deployment service-utilisateur
kubectl rollout restart deployment api-gateway

kubectl get pods
