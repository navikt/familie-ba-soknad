import dayjs from 'dayjs';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../typer/søknad';
import { validerDato } from '../utils/dato';

export const erDatoFormatGodkjent = (verdi: string) => {
    /*FamilieDatoVelger har allerede sin egen validering.
      Dersom valideringen går igjennom der, blir datoen formatert til YYYY-MM-DD.
      Derfor sjekker vi her om FamilieDatoVelger har klart å formatere den,
      i tillegg til om det er en gyldig dato med dayjs.*/
    return dayjs(verdi, 'YYYY-MM-DD').format('YYYY-MM-DD') === verdi;
};

export const erDatoFremITid = (verdi: ISODateString) => {
    return dayjs(verdi).isAfter(dayjs());
};

const useDatovelgerFelt = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    avhengigSvarCondition?: ESvar,
    avhengighet?: Felt<ESvar | undefined>,
    avgrensDatoFremITid = false
) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return validerDato(felt, avgrensDatoFremITid);
        },
        skalFeltetVises: avhengigheter => {
            return avhengigSvarCondition && avhengigheter && avhengigheter.jaNeiSpm
                ? (avhengigheter.jaNeiSpm as Felt<ESvar | undefined>).verdi ===
                      avhengigSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });
};

export default useDatovelgerFelt;
