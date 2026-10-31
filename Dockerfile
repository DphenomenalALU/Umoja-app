# Use a specific node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies 
RUN npm ci

# Copy the rest of the source code to the working directory
COPY . .

# Build the production version 
RUN npm run build

# Create a noon-root user
RUN addgroup -S umoja && adduser -S umoja -G umoja

#Switch to the non-root user
USER umoja

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]