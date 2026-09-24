# Apply only the parts matching the label for the configmap and the textStore
kubectl apply -f mynoteapp-v1.yaml -l data=config
kubectl apply -f mynoteapp-v1.yaml -l app=mynote-database

# Extract the clusterIP of database
export databaseip=$( kubectl get services/mynote-database-service --template='{{.spec.clusterIP}}' )

# Retrieve the ConfigMap, replace "NOTSET" with the clusterIP, and re-apply.
kubectl get configmap/mynote-app-config -o yaml | sed -r "s/NOTSET/$databaseip/" | kubectl apply -f -

# Start the services
kubectl apply -f mynoteapp-v1.yaml -l app=mynote-user
kubectl apply -f mynoteapp-v1.yaml -l app=mynote-note
# Start the app
kubectl apply -f mynoteapp-v1.yaml -l app=mynote-app
