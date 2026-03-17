# Observability Setup for Collector_shop

To monitor the Collector_shop microservices, we use Prometheus for scraping metrics and Grafana for visualization, deployed via Helm on Minikube.

## Prerequisites
1. Ensure Minikube is running: `minikube start`
2. Ensure Helm is installed: `helm version`

## 1. Install Prometheus and Grafana

We will use the `kube-prometheus-stack` Helm chart which installs Prometheus, Grafana, and Alertmanager.

```bash
# Add the Prometheus community Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create a namespace for monitoring
kubectl create namespace monitoring

# Install the kube-prometheus-stack
helm install monitoring-stack prometheus-community/kube-prometheus-stack --namespace monitoring
```

## 2. Accessing the Dashboards

### Prometheus
```bash
# Port-forward to access Prometheus on http://localhost:9090
kubectl port-forward svc/monitoring-stack-kube-prom-prometheus 9090:9090 -n monitoring
```

### Grafana
```bash
# Get the Grafana admin password
kubectl get secret --namespace monitoring monitoring-stack-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo

# Port-forward to access Grafana on http://localhost:3000
kubectl port-forward svc/monitoring-stack-grafana 3000:80 -n monitoring
```
Login with username `admin` and the password retrieved above.

## 3. Monitoring Application Metrics
Once deployed, Prometheus will automatically scrape standard Kubernetes metrics (CPU, Memory, Pod status).
To monitor the specific microservices (Catalogue, Utilisateur, Gateway), they should expose a `/metrics` endpoint (e.g., using `prom-client` in Node.js). 
Promuetheus `ServiceMonitor` resources can then be defined to tell Prometheus to scrape those endpoints.
