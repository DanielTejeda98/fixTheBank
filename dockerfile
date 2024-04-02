FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN yarn global add next

EXPOSE 3721

ENV TZ "America/New_York"

CMD npm run build && next start -p 3721