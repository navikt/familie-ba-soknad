import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { BarnetsIdent } from './HvilkeBarnCheckboxGruppe';

const useBarnCheckboxFelt = (
    datafeltNavn: barnDataKeySpørsmål,
    avhengighet: Felt<ESvar | undefined>,
    avhengigJaNeiSpmSvarCondition = ESvar.JA
) => {
    const { søknad } = useApp();
    const barn = søknad.barnInkludertISøknaden;

    return useFelt<BarnetsIdent[]>({
        feltId: barn[0][datafeltNavn].id,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn[datafeltNavn].svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarna.barn-ikke-valgt.feilmelding'} />);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter && avhengigheter.jaNeiSpm
                ? (avhengigheter.jaNeiSpm as Felt<ESvar | undefined>).verdi ===
                      avhengigJaNeiSpmSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
        nullstillVedAvhengighetEndring: false,
    });
};

export default useBarnCheckboxFelt;
