FROM node:0.10

RUN mkdir -p /boyarin /var/log/boyarin
WORKDIR /boyarin

ADD package.json /boyarin/package.json
RUN npm install

ADD . /boyarin

EXPOSE 8841

CMD ["/boyarin/boyarin-cmd.sh"]
