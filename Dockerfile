# Use official Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm install --include=dev

# Copy source code
COPY . .

# ===== Build-time environment variables =====
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_BASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_BASE_URL=$NEXT_PUBLIC_WS_BASE_URL

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
