# -----------------------
# Base Image
# -----------------------
FROM node:20-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# -----------------------
# Builder
# -----------------------
FROM base AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

# Better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy rest
COPY . .

# Build-time env
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_BASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_BASE_URL=$NEXT_PUBLIC_WS_BASE_URL

# Build
RUN pnpm exec next build

# -----------------------
# Runner (Production)
# -----------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001
RUN apk add --no-cache curl libc6-compat

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "server.js"]