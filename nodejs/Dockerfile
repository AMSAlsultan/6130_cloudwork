FROM alpine
RUN apk add --update nodejs npm
WORKDIR /usr/src/app
EXPOSE 3000
COPY src/ .
RUN ls -la /usr/src/app/*
RUN npm install express mongoose amqplib axios
Run npm install dayjs
RUN npm install pm2 -g
CMD [ "pm2-runtime", "mongo.js", "--watch" ]

