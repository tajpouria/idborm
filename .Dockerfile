FROM node:alpine

WORKDIR /usr/idborm

COPY ./package.json .

RUN npm i

COPY . .
