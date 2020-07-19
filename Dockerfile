FROM node:12.18.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Exports
EXPOSE 3000
CMD [ "npm", "run", "start.dev" ]