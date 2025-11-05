const env = import.meta.env.MODE;

export const erLokal = (): boolean => env === 'lokal';
export const erPreprod = (): boolean => env === 'preprod';
export const erProd = (): boolean => env === 'prod';

export const soknadApiProxyUrl = import.meta.env.VITE_SOKNAD_API_PROXY_URL;
export const dokumentProxyUrl = import.meta.env.VITE_DOKUMENT_PROXY_URL;
export const wonderwallUrl = import.meta.env.VITE_WONDERWALL_URL;
