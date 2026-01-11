FROM node:alpine3.22

RUN apk update && apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    libpng-dev \
    build-base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3721

ENV TZ "America/New_York"

CMD npm run migrate:up && npm run build && npm run start