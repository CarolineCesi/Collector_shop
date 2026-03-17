# Installation Guide: Minikube & Prerequisites (Windows)

To run the Collector_shop project, you need three main tools: **Docker Desktop**, **Kubectl**, and **Minikube**.

## 1. Quick Installation (Recommended)
Open **PowerShell** as **Administrator** and run these commands using the Windows Package Manager (`winget`):

### Install Docker Desktop
```powershell
winget install -e --id Docker.DockerDesktop
```
*Note: You will need to restart your computer after Docker installation to enable WSL2/Hyper-V.*

### Install Kubectl (Kubernetes CLI)
```powershell
winget install -e --id Kubernetes.kubectl
```

### Install Minikube
```powershell
winget install -e --id Kubernetes.minikube
```

---

## 2. Manual Installation (Alternative)

### Docker Desktop
1. Download from: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Run the installer and follow the instructions.
3. Ensure "Use the WSL 2 based engine" is checked.

### Minikube
1. Download the installer from: [https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/)
2. Run `minikube-installer.exe`.

---

## 3. Verify Installation
Once installed, open a NEW PowerShell window and run:

```powershell
docker --version
kubectl version --client
minikube version
```

## 4. First Start
After your computer has restarted and Docker is running:
```powershell
minikube start --driver=docker
minikube addons enable ingress
```

You are now ready to follow the steps in the [walkthrough.md](file:///C:/Users/Caroline/.gemini/antigravity/brain/4eb3c21e-4c2f-4faf-abf6-3bff7985d70b/walkthrough.md)!
