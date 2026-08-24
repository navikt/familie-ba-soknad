import type { NextFunction, Request, Response } from 'express';
import type { ViteDevServer } from 'vite';

const naisMetaTags = (): string => {
    const app = process.env.NAIS_APP_NAME ?? '';
    const team = process.env.NAIS_NAMESPACE ?? process.env.NAIS_TEAM ?? '';
    const cluster = process.env.NAIS_CLUSTER_NAME ?? '';
    const telemetryUrl = process.env.NAIS_TELEMETRY_URL ?? '';

    if (!app && !team) return '';

    return [
        app ? `<meta name="nais-app" content="${app}">` : '',
        team ? `<meta name="nais-team" content="${team}">` : '',
        cluster ? `<meta name="nais-cluster" content="${cluster}">` : '',
        telemetryUrl ? `<meta name="nais-telemetry-url" content="${telemetryUrl}">` : '',
    ]
        .filter(Boolean)
        .join('\n    ');
};

/**
 * Callback som håndterer ytterligere rendering dersom vi kjører med ViteDevServer (injiserer HMR-klient, løser
 * %BASE_URL% og modul-importer).
 */
export const renderHtml = (
    htmlFileName: string,
    viteDevServer: ViteDevServer | undefined,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const språk: string | undefined = req.cookies['decorator-language'];
    req.app.render(
        htmlFileName,
        { LOCALE_CODE: språk ?? 'nb', NAIS_META_TAGS: naisMetaTags() },
        async (feil: Error, html: string) => {
            if (feil) {
                return next(feil);
            }
            // Når vi kjører applikasjon lokalt med ViteDevServer, må vi transformere html-filen for å injisere HMR-klient, løse %BASE_URL% og modul-importer.
            if (viteDevServer) {
                try {
                    html = await viteDevServer.transformIndexHtml(req.originalUrl, html);
                } catch (transformFeil) {
                    viteDevServer.ssrFixStacktrace(transformFeil as Error);
                    return next(transformFeil);
                }
            }
            res.send(html);
        }
    );
};
