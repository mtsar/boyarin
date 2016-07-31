FROM node:latest

RUN mkdir -p /boyarin /var/log/boyarin
WORKDIR /boyarin

ADD . /boyarin
RUN make build

EXPOSE 8841

ENV NODE_ENV=production
RUN node app.js 2>>/var/log/boyarin/stderr.log >>/var/log/boyarin/stdout.log
