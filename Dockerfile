# Use the Node.js LTS image as the base
FROM node:20 AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the app's port
EXPOSE 3000

# Define the development stage
FROM base AS development
ENV ENVIRONMENT=development

# Define the production stage
FROM base AS production
ENV ENVIRONMENT=production

# Reinstall dependencies in production mode to remove dev dependencies
RUN npm ci --only=production