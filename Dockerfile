# ---- deps stage ----
# npm, not pnpm: package-lock.json is the project's real lockfile
# (pnpm-lock.yaml is stale — still lists supabase-js, missing pg)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --legacy-peer-deps is required: react-day-picker@8 wants date-fns ^2||^3
# but the project pins date-fns@4 (v0 template quirk; matches local installs)
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --legacy-peer-deps

# ---- builder stage ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV CI=true
RUN npx next build

# ---- runner stage (final, lean image) ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
