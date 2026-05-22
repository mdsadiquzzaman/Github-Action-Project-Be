#!/bin/bash

echo "🧪 Starting E2E Tests..."

# Verify the backend is actually running before trying to test
if [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api-docs/)" != "200" ]; then
  echo "❌ Error: Backend is not running on http://localhost:3000"
  echo "👉 Please run 'npm run docker:backend' first."
  exit 1
fi

# Run the Playwright tests
npx playwright test

echo "✅ E2E Tests completed!"