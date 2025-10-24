FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app

COPY dist ./dist

ENV NODE_OPTIONS="--disable-warning=DEP0169"

CMD ["dist/server.cjs"]
