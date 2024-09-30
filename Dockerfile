# Use the official lightweight Node.js 14 image.
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy local code to the container image
COPY . ./

# Build the Next.js app
RUN npm run build

# Run the web service on container startup
CMD [ "npm", "start" ]