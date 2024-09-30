FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g next

EXPOSE 3721

ENV TZ "America/New_York"

CMD npm run migrate:up && npm run build && npm run start