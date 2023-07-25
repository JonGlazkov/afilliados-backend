# Node.js image
FROM node:18.17.0

# work directory
WORKDIR /app

# Install dependencies
COPY package.json .
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./nest-cli.json .

RUN npm install && yarn cache clean

# Copy source code
COPY src/ .

# Listen on port 3333
EXPOSE 3333