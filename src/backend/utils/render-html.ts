import { renderNaisMetaTags } from '@nais/apm';
import type { NextFunction, Request, Response } from 'express';
import type { ViteDevServer } from 'vite';

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
        { LOCALE_CODE: språk ?? 'nb', NAIS_META_TAGS: renderNaisMetaTags() },
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
    req.app.render(htmlFileName, { LOCALE_CODE: språk ?? 'nb' }, async (feil: Error, html: string) => {
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
    });
};
