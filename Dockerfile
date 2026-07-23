FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:dd63e3809dd877a0019715dc32b0474bbb47c56c725248dd94aea497e1520eb4

WORKDIR /app

# Etter overgang til tsc for bygg av backend blir ikke avhengigheter lenger bundlet. Må derfor copiere over node_modules for å kunne resolve avhengigheter.
# package.json med "type": "modules" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import /export.
COPY node_modules ./node_modules
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
