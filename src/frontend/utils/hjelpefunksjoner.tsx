import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { basePath } from '../../shared-utils/Miljø';
import { SkjemaFeltTyper } from '../typer/skjema';

export const randomIntFraIntervall = (min, max) => {
    // min and max inkludert
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const trimWhiteSpace = (str: string) => {
    return str.split(/\s+/).join(' ').trim();
};

export const visFeiloppsummering = (skjema: ISkjema<SkjemaFeltTyper, string>): boolean => {
    const feil = Object.values(skjema.felter).find(
        felt => felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL
    );
    return skjema.visFeilmeldinger && !!feil;
};

/**
 * Vi må fortsatt hente scripts og ressurser fra /ordinaer med mindre vi ønsker å gjøre endringer på
 * express-appen, og vi kan forwarde requests til APIet via /ordinaer, det eneste som må endres for
 * å støtte utvidet søknad er basepath for react-routeren og login-redirect, derfor gjør vi dette her.
 */
export const routerBasePath = () =>
    window.location.pathname.includes('utvidet')
        ? basePath.replace('ordinaer', 'utvidet')
        : basePath;
