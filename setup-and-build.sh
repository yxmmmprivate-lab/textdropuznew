#!/bin/bash

# Exit on error
set -e

echo "🧹 Starting clean install..."

# Clean install
echo "Removing node_modules and lock files..."
rm -rf node_modules yarn.lock

echo "Installing dependencies..."
yarn install

# Clear cache
echo "Clearing Next.js cache..."
rm -rf .next

# Generate Prisma
echo "Generating Prisma client..."
yarn db:generate

# Build
echo "Building the project..."
yarn run build

echo "✅ Build complete!"
