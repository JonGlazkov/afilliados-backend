# Node.js image
FROM node:20.4

# work directory
WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy source code
COPY src/ .

# Listen on port 3333
EXPOSE 3333