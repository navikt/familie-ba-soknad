import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { useApp } from '../../../../context/AppContext';
import { IBarn } from '../../../../typer/person';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { ESvarMedUbesvart } from '../../OmDeg/useOmdeg';

export interface ILeggTilBarnTyper extends Omit<IBarn, 'borMedSøker' | 'alder' | 'fødselsdato'> {
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
        const dato = ident.verdi.substr(0, 6);
        const [, dag, måned, år] = (dato.match(/.{2}/g) || []).map(tall => Number.parseInt(tall));

        const fulltÅr = år > 60 ? 1900 + år : 2000 + år;

        const dagKompansertForDNummer =
            dag < 40 // D-nummer starter med fødselsdato pluss 4 på første tall
                ? dag // ... med mindre det ikke var noen tilgjengelige for den datoen,
                : dag - 40; // da brukes dato man søkte om d-nummer i steden for fødselsdato.
        // TODO: Bedre dato-løsning
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                barn: søknad.søker.barn.concat([
                    {
                        ident: ident.verdi,
                        borMedSøker: undefined,
                        fødselsdato: [fulltÅr, måned, dagKompansertForDNummer].join('-'),
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
