const erLokalt = (hostname: string) => hostname === 'localhost' || hostname === '127.0.0.1';

// Tillatelsesliste i stedet for «ikke prod», slik at panelet aldri vises på en host vi ikke kjenner.
export const skalVisePreutfylling = ({ hostname, search }: Pick<Location, 'hostname' | 'search'>): boolean => {
    if (hostname.endsWith('.dev.nav.no')) {
        return true;
    }
    return erLokalt(hostname) && new URLSearchParams(search).has('preutfylling');
};
