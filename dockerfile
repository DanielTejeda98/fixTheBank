FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install -g next

EXPOSE 3721

CMD npm run build && next start -p 3721