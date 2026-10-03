# -------------------------
# Stage 1: Builder
# -------------------------
FROM node:20-slim AS builder

RUN npm install -g pnpm@10.18.2

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# -------------------------
# Stage 2: Production
# -------------------------
FROM node:20-slim AS production

RUN npm install -g pnpm@10.18.2

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

EXPOSE 5001

CMD ["node", "dist/server.js"]