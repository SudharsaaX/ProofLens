#!/usr/bin/env bash
# Start the Vite dev server with API proxy to backend.
set -e

cd "$(dirname "$0")/../frontend"

if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  npm install
fi

echo "Starting ProofLens frontend on http://localhost:5173"
npm run dev
