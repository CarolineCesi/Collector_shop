# Create a private key and self-signed certificate for the local domain
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /tmp/tls.key -out /tmp/tls.crt -subj "/CN=collector-shop.local"

# Create the Kubernetes secret with the generated certificate
kubectl create secret tls shop-tls-secret --key /tmp/tls.key --cert /tmp/tls.crt

# Clean up temporary files
rm /tmp/tls.key /tmp/tls.crt

echo "TLS secret 'shop-tls-secret' created successfully for collector-shop.local"
