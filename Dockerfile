# Stage 1: Build the app using Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies and build the app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build  # This creates the 'dist/' directory

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Copy the build files from the previous stage to Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for serving the app
EXPOSE 80

# Start Nginx to serve the production build
CMD ["nginx", "-g", "daemon off;"]
