const erLokalt = (hostname: string) => hostname === 'localhost' || hostname === '127.0.0.1';

/**
 * Tillatelsesliste i stedet for «ikke prod», slik at panelet aldri vises på en host vi ikke kjenner.
 *
 * - I preprod (*.dev.nav.no) vises panelet alltid.
 * - Lokalt vises det bare med `?preutfylling` i adressen, slik at forsiden ellers er lik den i produksjon når vi
 *   utvikler og kjører ende-til-ende-tester.
 */
export const skalVisePreutfylling = ({ hostname, search }: Pick<Location, 'hostname' | 'search'>): boolean => {
    if (hostname.endsWith('.dev.nav.no')) {
        return true;
    }
    return erLokalt(hostname) && new URLSearchParams(search).has('preutfylling');
};
