FROM gcr.io/distroless/nodejs24-debian12:nonroot

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
