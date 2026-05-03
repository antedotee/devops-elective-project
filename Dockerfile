FROM node:20-slim AS client-builder
WORKDIR /usr/src/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
ENV VITE_API_BASE_URL=/api
RUN npm run build

FROM node:20-slim AS server-deps
WORKDIR /usr/src/server
COPY server/package*.json ./
RUN npm ci --omit=dev

FROM node:20-slim AS runner
WORKDIR /usr/src/app

ENV PORT=3000
ENV NODE_ENV=production

RUN groupadd --system appgroup && useradd --system --gid appgroup appuser

COPY --from=server-deps /usr/src/server/node_modules ./node_modules
COPY server/ .
COPY --from=client-builder /usr/src/client/dist ./public

RUN chown -R appuser:appgroup /usr/src/app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

USER appuser

CMD ["npm", "start"]
