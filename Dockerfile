# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN pnpm build

# Expose port (default Next.js port)
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
