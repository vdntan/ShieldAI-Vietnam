# Multi-stage Docker build for ShieldAI Vietnam (Node.js + React + Express)
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build Vite frontend and bundled Express server (dist/server.cjs)
RUN npm run build

# Production runner stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json for production scripts & external modules
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled build output from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/community_reports.json ./community_reports.json
COPY --from=builder /app/user_feedback.json ./user_feedback.json

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.cjs"]

