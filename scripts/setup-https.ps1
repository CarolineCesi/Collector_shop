# Generate a private key and self-signed certificate for collector-shop.local
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "$env:TEMP/tls.key" -out "$env:TEMP/tls.crt" -subj "/CN=collector-shop.local"

# Create the Kubernetes secret
kubectl create secret tls shop-tls-secret --key "$env:TEMP/tls.key" --cert "$env:TEMP/tls.crt"

# Success message
Write-Host "TLS secret 'shop-tls-secret' created successfully for collector-shop.local" -ForegroundColor Green
