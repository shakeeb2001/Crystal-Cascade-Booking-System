# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for backend
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy package.json and package-lock.json for frontend
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
RUN cd frontend && npm install

# Bundle the app source
COPY . .

# Expose the ports
EXPOSE 3000
EXPOSE 3001

# Define the command to run your app
CMD ["npm", "run", "start:fullstack"]
