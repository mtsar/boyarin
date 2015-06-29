FROM node:0.10

RUN mkdir -p /boyarin
WORKDIR /boyarin

ADD package.json /boyarin/package.json
RUN npm install

ADD . /boyarin

EXPOSE 8841

CMD ["node", "app.js"]
