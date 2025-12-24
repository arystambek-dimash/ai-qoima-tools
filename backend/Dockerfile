# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built files only (esbuild bundles everything)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/package.json ./

# Install only production dependencies for native modules
RUN npm install --omit=dev && npm cache clean --force

EXPOSE 8000

CMD ["node", "dist/index.js"]
