FROM node:12.18.2-alpine3.9 as client
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --silent
COPY . .
EXPOSE 8020
CMD [ "npm", "start" ]