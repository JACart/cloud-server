FROM node:12.18.3-alpine
WORKDIR /usr/app
EXPOSE 8020
COPY package.json .
RUN apk update && \
    apk upgrade && \
    apk add git
RUN git clone https://github.com/JACart/cloud-server/
RUN mv cloud-server/* .
RUN npm i --quiet
RUN npm start
COPY . .
