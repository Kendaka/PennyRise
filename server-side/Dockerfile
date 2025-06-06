# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and instll dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the backend ort
EXPOSE 5000

# Start the serve
CMD ["npm", "start"]
