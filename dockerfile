FROM node:alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3721

ENV TZ "America/New_York"

CMD npm run migrate:up && npm run build && npm run start