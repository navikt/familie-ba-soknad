import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { useApp } from '../../../../context/AppContext';
import { barnDataKeySpørsmål, IBarn } from '../../../../typer/person';
import { fødselsdatoSomISOStringFraIdNummer } from '../../../../utils/person';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { ESvarMedUbesvart } from '../../OmDeg/useOmdeg';

// Jeg har ikke funnet dokumentasjon på at man kan passe en enum til Omit, men det funker
export interface ILeggTilBarnTyper
    extends Omit<IBarn, 'borMedSøker' | 'alder' | 'fødselsdato' | barnDataKeySpørsmål> {
    erFødt: ESvarMedUbesvart;
    navnetErUbestemt: ESvar;
    harBarnetFåttIdNummer: ESvar;
}

export const useLeggTilBarn = (): {
    skjema: ISkjema<ILeggTilBarnTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
    submit: () => boolean;
} => {
    const { søknad, settSøknad } = useApp();
    const intl = useIntl();

    const erFødt = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        valideringsfunksjon: felt => {
            return felt.verdi === ESvar.JA
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'leggtilbarn.må-være-født'} />);
        },
    });

    const navnetErUbestemt = useFelt<ESvar>({
        verdi: ESvar.NEI,
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { erFødt },
    });

    const navn = useFelt<string>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        valideringsfunksjon: (felt, avhengigheter) => {
            const navnErUbestemt = avhengigheter?.navnetErUbestemt.verdi === ESvar.JA;
            if (navnErUbestemt) {
                return ok(felt);
            }
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'leggtilbarn.feil.tomt-navn'} />);
        },
        avhengigheter: { erFødt, navnetErUbestemt },
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

    const harBarnetFåttIdNummer = useFelt<ESvar>({
        verdi: ESvar.JA,
        valideringsfunksjon: felt =>
            felt.verdi === ESvar.JA
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'leggtilbarn.feil.må-ha-idnr'} />),
        skalFeltetVises: ({ erFødt }) => erFødt.verdi === ESvar.JA,
        avhengigheter: { erFødt },
    });

    const { skjema, kanSendeSkjema, valideringErOk, nullstillSkjema } = useSkjema<
        ILeggTilBarnTyper,
        string
    >({
        felter: {
            erFødt,
            ident,
            navn,
            navnetErUbestemt,
            harBarnetFåttIdNummer,
        },
        skjemanavn: 'velgbarn',
    });

    const submit = () => {
        if (!kanSendeSkjema()) {
            return false;
        }
        // TODO: Bedre dato-løsning
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                barn: søknad.søker.barn.concat([
                    {
                        ident: ident.verdi,
                        borMedSøker: undefined,
                        fødselsdato: fødselsdatoSomISOStringFraIdNummer(ident.verdi),
                        navn:
                            navn.verdi ||
                            intl.formatMessage({ id: 'leggtilbarn.navn-ubestemt.plassholder' }),
                    },
                ]),
            },
        });
        nullstillSkjema();
        return true;
    };
    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
        submit,
    };
};
