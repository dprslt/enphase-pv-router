
FROM node:24-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn ci

COPY . .
RUN yarn build

CMD ["node", "/app/build/index.js"]