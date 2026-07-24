FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:dd63e3809dd877a0019715dc32b0474bbb47c56c725248dd94aea497e1520eb4

WORKDIR /app

# Etter overgang til tsc for bygg av backend blir ikke avhengigheter lenger bundlet, så Node må
# kunne resolve dem fra en node_modules-mappe i runtime. "yarn build:backend" bruker @vercel/nft
# til å spore hvilke node_modules-filer serveren faktisk trenger, og skriver kun disse til
# dist/node_modules (se scripts/prune-backend-node-modules.mjs). Siden Node resolver node_modules
# ved å gå oppover fra filen som importerer, blir denne automatisk funnet uten en egen COPY-linje,
# og vi slipper å kopiere med hele det (mye større) node_modules som også inneholder frontend-only
# avhengigheter (react, styled-components, @navikt/ds-react, osv.) som allerede er bundlet inn i
# frontend-JS-en av Vite.
# package.json med "type": "module" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import /export.
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
