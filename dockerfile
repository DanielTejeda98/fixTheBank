FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN yarn global add next

EXPOSE 3721

CMD npm run build && next start -p 3721