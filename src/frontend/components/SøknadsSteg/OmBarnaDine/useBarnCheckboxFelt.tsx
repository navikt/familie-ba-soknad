import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { BarnetsIdent } from './HvilkeBarnCheckboxGruppe';

interface ICheckboxAvhengighet {
    jaNeiSpm: Felt<ESvar | undefined>;
}

const useBarnCheckboxFelt = (
    datafeltNavn: barnDataKeySpørsmål,
    språkTekstIdForFeil: string,
    avhengighet?: Felt<ESvar | undefined>
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
                : feil(felt, <SpråkTekst id={språkTekstIdForFeil} />);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            const typetAvhengigheter = avhengigheter as ICheckboxAvhengighet;
            return typetAvhengigheter ? typetAvhengigheter.jaNeiSpm.verdi === ESvar.JA : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet } as ICheckboxAvhengighet,
    });
};

export default useBarnCheckboxFelt;
