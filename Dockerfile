# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the server.js file from the "Backend/back" directory to the working directory in the container
COPY Backend/back/server.js .


# Expose the port your app runs on
EXPOSE 3001

# Command to run your application
CMD ["npm", "start"]
