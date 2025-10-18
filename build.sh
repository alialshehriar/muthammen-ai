#!/bin/bash
set -e

echo "Building project..."
npm run build

echo "Checking dist directory..."
if [ -d "dist" ]; then
  echo "✓ dist directory exists"
  ls -la dist/
else
  echo "✗ dist directory not found!"
  exit 1
fi

echo "Build completed successfully!"

