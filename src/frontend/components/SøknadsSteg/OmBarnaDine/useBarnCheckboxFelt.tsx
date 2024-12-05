import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/common';
import { FlettefeltVerdier, LocaleRecordBlock } from '../../../typer/sanity/sanity';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface IUseBarnCheckboxFeltProps {
    datafeltNavn: barnDataKeySpørsmål;
    feilmelding?: LocaleRecordBlock;
    flettefelter?: FlettefeltVerdier;
    feilmeldingSpråkId: string;
    avhengighet: Felt<ESvar | null>;
    avhengigJaNeiSpmSvarCondition?: ESvar;
}

const useBarnCheckboxFelt = ({
    datafeltNavn,
    feilmelding,
    flettefelter,
    feilmeldingSpråkId,
    avhengighet,
    avhengigJaNeiSpmSvarCondition = ESvar.JA,
}: IUseBarnCheckboxFeltProps) => {
    const { søknad, plainTekst } = useApp();
    const barn = søknad.barnInkludertISøknaden;

    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigJaNeiSpmSvarCondition;

    const checkbox = useFelt<BarnetsId[]>({
        feltId: barn[0][datafeltNavn].id,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn[datafeltNavn].svar === ESvar.JA)
            .map(barn => barn.id),
        valideringsfunksjon: (felt: FeltState<BarnetsId[]>) => {
            return felt.verdi.length > 0
                ? ok(felt)
                : feil(
                      felt,
                      feilmelding ? (
                          plainTekst(feilmelding, { ...flettefelter })
                      ) : (
                          <SpråkTekst id={feilmeldingSpråkId} />
                      )
                  );
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter && avhengigheter.jaNeiSpm
                ? (avhengigheter.jaNeiSpm as Felt<ESvar | null>).verdi ===
                      avhengigJaNeiSpmSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });

    useEffect(() => {
        const skalVises = skalFeltetVises(avhengighet.verdi);

        skalVises && checkbox.verdi.length > 0 && checkbox.validerOgSettFelt(checkbox.verdi);

        return () => {
            !skalFeltetVises(avhengighet.verdi) && checkbox.validerOgSettFelt([]);
        };
    }, [avhengighet]);

    return checkbox;
};

export default useBarnCheckboxFelt;
