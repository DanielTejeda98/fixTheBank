FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn global add next

EXPOSE 3721

ENV TZ "America/New_York"

CMD yarn migrate:up && yarn build && next start -p 3721