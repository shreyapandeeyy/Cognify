# Use Node.js LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the Next.js application
RUN npx next build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npx", "next", "start"]
