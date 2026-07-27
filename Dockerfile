FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:dd63e3809dd877a0019715dc32b0474bbb47c56c725248dd94aea497e1520eb4

WORKDIR /app

# package.json med "type": "module" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import /export.
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
