FROM navikt/node-express:14-alpine
USER root
RUN apk --no-cache add curl
USER appuser

ADD ./ /var/server/

RUN yarn
RUN yarn build

EXPOSE 9000
CMD ["yarn", "start"]
