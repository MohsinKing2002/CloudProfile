FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm@10.18.2

# Working dir
WORKDIR /app

# Copy package.json and pnpm-lock.yaml file
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create build/compile
RUN pnpm run build

# -------------------------
# Stage 2: Production
# -------------------------
FROM node:20-alpine AS production

RUN npm install -g pnpm@10.18.2

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

EXPOSE 5001

CMD [ "node", "dist/server.js" ]