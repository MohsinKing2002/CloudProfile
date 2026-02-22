FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Working dir
WORKDIR /app

# Copy package.json and pnpm-lock.yaml file
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 5001

# Start the application in dev mode
CMD ["pnpm", "run", "dev"]