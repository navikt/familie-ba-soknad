FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:aee62c33de044f9dc74e5ce764c56d7a6767676d711cd4c3aa7603174fe7c5ba

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
