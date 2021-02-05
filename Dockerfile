FROM navikt/node-express:14-alpine
USER root
RUN apk --no-cache add curl
USER apprunner

COPY --chown=apprunner:apprunner ./ /var/server/

RUN yarn
RUN yarn build

EXPOSE 9000
CMD ["yarn", "start"]
