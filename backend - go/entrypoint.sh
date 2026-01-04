#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z postgres 5432; do
  echo "Database is unavailable - sleeping"
  sleep 1
done
echo "Database is up - executing command"

# Run database migration
echo "Running database migration..."
./migrate

# Start the main application
echo "Starting the application..."
exec ./main