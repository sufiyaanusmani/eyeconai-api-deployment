# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Use build argument for environment (default to development)
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install dependencies based on the environment
RUN npm install && \
    if [ "$NODE_ENV" = "production" ]; then npm prune --production; fi

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Default command for the container
CMD ["node", "server.js"]
