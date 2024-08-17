FROM node:20.16

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npm run migrate:dev && npm run start:dev"]