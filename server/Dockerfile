FROM node:18-slim

# Set working directory
WORKDIR /app

# Change ownership of the working directory to the existing 'node' user
RUN chown node:node /app

# Switch to the non-root user
USER node

# Copy package.json and package-lock.json first to leverage Docker cache
COPY --chown=node:node package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY --chown=node:node src/ ./src/

# Expose the API port
EXPOSE 5001

# Add an HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/health', (r) => {if (r.statusCode !== 200) process.exit(1);})" || exit 1

# Start the Node.js app
CMD ["npm", "start"]
