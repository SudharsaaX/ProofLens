#!/usr/bin/env bash
# Start the FastAPI backend in development mode (hot reload enabled).
set -e

cd "$(dirname "$0")/../backend"

if [ ! -d ".venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -q -r requirements.txt

echo "Starting ProofLens backend on http://localhost:8000"
echo "API docs: http://localhost:8000/docs"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
