FROM node:latest

# Make a directory for our application
WORKDIR /server

# Install dependencies
COPY package.json .

RUN npm install

# Copy our source code
COPY . .

# Run the application
CMD ["npm", "start"]
