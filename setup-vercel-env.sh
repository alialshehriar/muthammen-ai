#!/bin/bash

# Vercel Project Details
PROJECT_ID="prj_NcZxPTA4QFQ6roS2Mpls7KVtYZr9"
TEAM_ID="team_ZXj80fgBf0cQjTYjlH3hhbYS"
TOKEN="TH3S2wKSTmvIvcdYdnNF5GPu"

# Neon Database Connection
DATABASE_URL="postgresql://neondb_owner:npg_IqCNIRZOHxvv@ep-hidden-grass-a8fhgc9h-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"

# Add DATABASE_URL environment variable
curl -X POST "https://api.vercel.com/v10/projects/${PROJECT_ID}/env" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "DATABASE_URL",
    "value": "'"${DATABASE_URL}"'",
    "type": "encrypted",
    "target": ["production", "preview", "development"]
  }'

echo ""
echo "✅ DATABASE_URL added"

# Add ADMIN_PASS environment variable
curl -X POST "https://api.vercel.com/v10/projects/${PROJECT_ID}/env" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "ADMIN_PASS",
    "value": "muthammen2025",
    "type": "encrypted",
    "target": ["production", "preview", "development"]
  }'

echo ""
echo "✅ ADMIN_PASS added"
