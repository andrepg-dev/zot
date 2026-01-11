
# 1. Preparacion
FROM node:25-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install -g @nestjs/cli

RUN npm install

COPY . . 

CMD ["npm","run","dev"]
