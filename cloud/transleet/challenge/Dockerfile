FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD PORT=8080 node /app/build/index.js
