# Dependency install stage (multi-stage build)
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Runtime stage
FROM node:20-slim AS runner
WORKDIR /app

RUN chown node:node /app

USER node

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node src/ ./src/

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/health', (r) => {if (r.statusCode !== 200) process.exit(1);})" || exit 1

CMD ["npm", "start"]
