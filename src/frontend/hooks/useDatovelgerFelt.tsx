import React from 'react';

import dayjs from 'dayjs';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/søknad';

export const erDatoFormatGodkjent = (verdi: string) => {
    /*FamilieDatoVelger har allerede sin egen validering.
      Dersom valideringen går igjennom der, blir datoen formatert til YYYY-MM-DD.
      Derfor sjekker vi her om FamilieDatoVelger har klart å formatere den,
      i tillegg til om det er en gyldig dato med dayjs.*/
    return dayjs(verdi, 'YYYY-MM-DD').format('YYYY-MM-DD') === verdi;
};

const useDatovelgerFelt = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    språkTekstIdForFeil: string,
    avhengigSvarCondition: ESvar,
    avhengighet?: Felt<ESvar | undefined>
) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return erDatoFormatGodkjent(felt.verdi)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={språkTekstIdForFeil} />);
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter && avhengigheter.jaNeiSpm
                ? (avhengigheter.jaNeiSpm as Felt<ESvar | undefined>).verdi ===
                      avhengigSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });
};

export default useDatovelgerFelt;
