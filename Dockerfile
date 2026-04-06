FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:e6db36bee695d302632bfda068b3ea5dea5cb167b335876274f7ecec7d234d31

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
