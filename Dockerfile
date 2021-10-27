FROM navikt/node-express:16 as builder-base
USER root
RUN apk --no-cache add curl binutils make gcc g++ vips-dev
USER apprunner

COPY --chown=apprunner:apprunner ./yarn.lock ./package.json /var/server/


FROM builder-base as webpack-express-builder
# Trenger å vite BASE_PATH før vi kjører webpack, siden webpack bruker DefinePlugin for å videresende basepath til frontend
ARG base_path
ENV BASE_PATH=$base_path
ARG sentry_auth_token
ENV SENTRY_AUTH_TOKEN=$sentry_auth_token
ARG sentry_release
ENV SENTRY_RELEASE=$sentry_release

COPY --chown=apprunner:apprunner ./ /var/server/

RUN yarn
RUN yarn build


FROM builder-base as runtime-deps-builder
RUN yarn install --prod
RUN rm -rf .cache


FROM navikt/node-express:16 as prod-runner
USER root
RUN apk add vips-dev
USER apprunner

COPY --from=runtime-deps-builder /var/server/ /var/server
COPY --from=webpack-express-builder /var/server/build /var/server/build
COPY --from=webpack-express-builder /var/server/dist /var/server/dist

EXPOSE 9000
CMD ["yarn", "start"]
