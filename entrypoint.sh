#!/bin/bash

# check if Redis is running using brew services
if ! brew services list | grep -q 'redis.*started'; then
  echo "Redis is not running. Starting Redis..."
  sudo brew services start redis
else
  echo "Redis is already running."
fi

echo "Starting backend..."
cd backend
bun run dev &
BACKEND_PID=$!

echo "Starting worker..."
bun run consumer/worker.ts &
WORKER_PID=$!

echo "Starting frontend..."
cd ../ui
bun run dev &

# wait for the backend process to finish
wait $BACKEND_PID