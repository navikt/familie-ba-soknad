import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { useApp } from '../../../../context/AppContext';
import { IBarnNy } from '../../../../typer/person';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { ESvarMedUbesvart } from '../../1-OmDeg/useOmdeg';

export interface ILeggTilBarnTyper extends Omit<IBarnNy, 'borMedSøker' | 'alder'> {
    borMedSøker: ESvarMedUbesvart;
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
            navnetErUbestemt,
            harBarnetFåttIdNummer,
        },
        skjemanavn: 'velgbarn',
    });

    const submit = () => {
        if (!kanSendeSkjema()) {
            return false;
        }
        // TODO: Fjern hvis vi legger til dato-input
        const dato = ident.verdi.substr(0, 6);
        const [, dag, måned, år] = dato.match(/.{2}/g) || [];
        const fulltÅr =
            Number.parseInt(år) > 60 ? 1900 + Number.parseInt(år) : 2000 + Number.parseInt(år);
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                barn: søknad.søker.barn.concat([
                    {
                        ident: ident.verdi,
                        borMedSøker: borMedSøker.verdi === ESvar.JA,
                        fødselsdato: [fulltÅr, måned, dag].join('-'),
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
