# -------------------------
# Stage 1: Build
# -------------------------
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10.18.2

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


# -------------------------
# Stage 2: Production
# -------------------------
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]