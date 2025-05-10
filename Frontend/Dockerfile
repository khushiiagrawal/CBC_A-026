# Base stage for dependencies and build
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Add source code and build
COPY . .

# Ensure next.config.js has standalone output mode
RUN if ! grep -q "output: 'standalone'" next.config.js; then \
    sed -i "/const nextConfig/a\  output: 'standalone'," next.config.js; \
    fi

# Build the application
RUN npm run build

# Production image, copy built files and run
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy only necessary files
COPY --from=base --chown=nextjs:nodejs /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]