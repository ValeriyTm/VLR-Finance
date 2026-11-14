# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@9.15.0
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@9.15.0
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist

EXPOSE 3007

CMD ["node", "dist/main.js"]
