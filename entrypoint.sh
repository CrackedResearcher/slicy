#!/bin/bash

echo "Starting backend..."
cd backend
bun run dev &
BACKEND_PID=$!

echo "Starting frontend..."
cd ../ui
bun run dev &

wait $BACKEND_PID