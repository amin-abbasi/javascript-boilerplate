FROM node:12-alpine3.12 AS builder

WORKDIR /usr/src

RUN ["npm", "install", "-g", "nodemon"]

COPY package.json ./package.json
RUN npm install

COPY . .

CMD ["nodemon"]