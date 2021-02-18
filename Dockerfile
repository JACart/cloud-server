FROM node:12.18.2-alpine3.9 as client
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npm run tsc
CMD [ "node", "./dist/server.js" ]
EXPOSE 8020