#!/bin/bash

echo "🚀 Starting Backend Services (MongoDB + API)..."
docker-compose up -d --build

echo "⏳ Waiting for API to be ready on http://localhost:3000..."
# Loop until the API responds with a 200 OK status
until [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api-docs/)" = "200" ]; do
  sleep 2
done

echo "✅ API is up and running!"
echo "🌱 Seeding the database..."
docker-compose exec -T api node src/seeders/seed.js

echo "🎉 Backend is fully ready for testing!"