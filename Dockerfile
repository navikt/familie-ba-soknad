FROM navikt/node-express:16 as prod-builder
USER root
RUN apk --no-cache add curl binutils make gcc g++ vips-dev
USER apprunner

COPY --chown=apprunner:apprunner ./yarn.lock ./package.json /var/server/

RUN yarn

# Trenger å vite BASE_PATH før vi kjører webpack, siden webpack bruker DefinePlugin for å videresende basepath til frontend
ARG base_path
ENV BASE_PATH=$base_path
ARG sentry_auth_token
ENV SENTRY_AUTH_TOKEN=$sentry_auth_token
ARG sentry_release
ENV SENTRY_RELEASE=$sentry_release

COPY --chown=apprunner:apprunner ./ /var/server/

RUN yarn build

# Fjern alle pakker som vi kun trengte for webpack
RUN rm -rf node_modules
RUN yarn install --prod
RUN rm -rf .cache


FROM navikt/node-express:16 as prod-runner
COPY --from=prod-builder /var/server/ /var/server
USER root
RUN apk add vips-dev
USER apprunner

EXPOSE 9000
CMD ["yarn", "start"]
