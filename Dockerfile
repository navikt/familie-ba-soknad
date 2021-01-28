FROM navikt/node-express:14-alpine
RUN apk --no-cache add curl

ADD ./ /var/server/

RUN yarn
RUN yarn build

EXPOSE 9000
CMD ["yarn", "serve"]
