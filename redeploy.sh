#!/bin/bash

TOKEN="TH3S2wKSTmvIvcdYdnNF5GPu"
DEPLOYMENT_ID="DpuxSfRcX"

# Redeploy using Vercel API
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "muthammen-ai",
    "gitSource": {
      "type": "github",
      "repo": "alialshehriar/muthammen-ai",
      "ref": "main"
    },
    "target": "production"
  }'
