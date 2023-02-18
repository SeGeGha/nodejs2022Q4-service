FROM node:18.14-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install cache clean --force 

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "run", "start:dev" ]