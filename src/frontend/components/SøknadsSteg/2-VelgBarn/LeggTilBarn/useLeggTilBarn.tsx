import React from 'react';

import { FormattedMessage } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { IBarnNy } from '../../../../typer/person';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { ESvarMedUbesvart } from '../../1-OmDeg/useOmdeg';

export interface ILeggTilBarnTyper extends Omit<IBarnNy, 'borMedSøker' | 'alder'> {
    borMedSøker: ESvarMedUbesvart;
    erFødt: ESvarMedUbesvart;
    navnUbestemt: ESvar;
    ingenIdent: ESvar;
}

export const useLeggTilBarn = (): {
    skjema: ISkjema<ILeggTilBarnTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
} => {
    const erFødt = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        valideringsfunksjon: felt => {
            return felt.verdi === ESvar.JA
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'Du kan ikke søke for ufødte barn'} />);
        },
    });

    const navnUbestemt = useFelt<ESvar>({
        verdi: ESvar.NEI,
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { erFødt },
    });

    const navn = useFelt<string>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        valideringsfunksjon: (felt, avhengigheter) => {
            const skip = avhengigheter?.navnUbestemt.verdi === ESvar.JA;
            if (skip) {
                return ok(felt);
            }
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'leggtilbarn.feil.tomt-navn'} />);
        },
        avhengigheter: { erFødt, navnUbestemt },
    });

    const ident = useFelt<string>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        valideringsfunksjon: felt => {
            return idnr(felt.verdi).status === 'valid'
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'leggtilbarn.feil.ugyldig-idnr'} />);
        },
        avhengigheter: { erFødt },
    });

    const ingenIdent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        valideringsfunksjon: felt =>
            felt.verdi === ESvar.NEI
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'leggtilbarn.feil.må-ha-idnr'} />),
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { erFødt },
    });

    const borMedSøker = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
    });

    const fødselsdato = useFelt<string>({
        verdi: '',
        avhengigheter: { ident },
    });

    // Nødvendig for å sette valideringsstatus til ok for element
    // som bruker ikke kommer til å interacte med.
    ingenIdent.validerOgSettFelt(ESvar.NEI);
    navnUbestemt.validerOgSettFelt(ESvar.NEI);

    const { skjema, kanSendeSkjema, valideringErOk, nullstillSkjema } = useSkjema<
        ILeggTilBarnTyper,
        string
    >({
        felter: {
            erFødt,
            ident,
            navn,
            borMedSøker,
            fødselsdato,
            navnUbestemt,
            ingenIdent,
        },
        skjemanavn: 'velgbarn',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
    };
};
