#!/bin/bash

echo -e "-------------------------------------------"
echo -e "INFO: Starting frontend and backend servers"
echo -e "-------------------------------------------"

# frontend
cd ui_crud && pnpm run dev &

# backend
cd api_crud && pnpm run dev &

echo -e "-------------------------------------------"
echo -e "INFO: Both servers are running"
echo -e "-------------------------------------------"

wait