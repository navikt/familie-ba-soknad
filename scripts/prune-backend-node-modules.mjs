// Bygger en minimal node_modules-mappe som kun inneholder filene backend-serveren faktisk
// trenger for å kjøre, ved å spore det reelle require/import-grafen fra det kompilerte
// inngangspunktet (dist/backend/server.js). Dette holder Docker-imaget lite ved at vi slipper
// å kopiere med frontend-only avhengigheter (react, styled-components, @navikt/ds-react osv.)
// som allerede er bundlet inn i frontend-JS-en av Vite og aldri trengs av Node i runtime.
import { existsSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeFileTrace } from '@vercel/nft';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const entryFile = join(rootDir, 'dist/backend/server.js');
const outputNodeModulesDir = join(rootDir, 'dist/node_modules');

if (!existsSync(entryFile)) {
    console.error(`Fant ikke ${relative(rootDir, entryFile)}. Kjør "tsc -p src/backend/tsconfig.json" først.`);
    process.exit(1);
}

const { fileList } = await nodeFileTrace([entryFile], { base: rootDir });

const nodeModuleFiles = [...fileList].filter(file => file.includes('node_modules/'));

await rm(outputNodeModulesDir, { recursive: true, force: true });

for (const file of nodeModuleFiles) {
    const src = join(rootDir, file);
    // Behold stien relativt til node_modules/, slik at pakkestrukturen (inkl. scopes som @navikt/*) bevares
    const dest = join(outputNodeModulesDir, file.slice(file.indexOf('node_modules/') + 'node_modules/'.length));
    await mkdir(dirname(dest), { recursive: true });
    await cp(src, dest);
}

console.log(
    `Sporet og kopierte ${nodeModuleFiles.length} filer fra node_modules til ${relative(rootDir, outputNodeModulesDir)}`
);
