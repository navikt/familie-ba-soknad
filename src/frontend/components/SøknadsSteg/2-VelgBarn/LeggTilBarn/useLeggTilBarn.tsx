import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { IBarnNy } from '../../../../typer/person';
import { SpråkTekst } from '../../../../utils/visning';
import { ESvarMedUbesvart } from '../../1-OmDeg/useOmdeg';

interface ISkjemaTyper extends Omit<IBarnNy, 'borMedSøker' | 'alder'> {
    borMedSøker: ESvarMedUbesvart;
    erFødt: ESvarMedUbesvart;
}

export const useLeggTilBarn = (): {
    skjema: ISkjema<ISkjemaTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
} => {
    const erFødt = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        valideringsfunksjon: felt => {
            return felt.verdi === ESvar.JA
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'Du kan ikke søke for ufødte barn'} />);
        },
    });

    const navn = useFelt<string>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { erFødt },
    });

    const ident = useFelt<string>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        valideringsfunksjon: felt => {
            return idnr(felt.verdi).status === 'valid'
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'leggtilbarn.ugyldig-fødselsnummer'} />);
        },
        avhengigheter: { erFødt },
    });

    const borMedSøker = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
    });

    const fødselsdato = useFelt<string>({
        verdi: (Date.now() as unknown) as string,
        avhengigheter: { ident },
    });

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<ISkjemaTyper, string>({
        felter: {
            erFødt,
            ident,
            navn,
            borMedSøker,
            fødselsdato,
        },
        skjemanavn: 'velgbarn',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
    };
};
