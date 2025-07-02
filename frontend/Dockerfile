# Use official Node.js image as the base
FROM node:20-alpine3.19

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose Angular default port
EXPOSE 4200

# Start the Angular development server
CMD ["npm", "start"]