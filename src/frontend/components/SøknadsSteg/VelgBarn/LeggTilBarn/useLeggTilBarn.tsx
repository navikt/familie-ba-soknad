import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { useApp } from '../../../../context/AppContext';
import { barnDataKeySpørsmål, IBarn } from '../../../../typer/person';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { ESvarMedUbesvart } from '../../OmDeg/useOmdeg';

// Jeg har ikke funnet dokumentasjon på at man kan passe en enum til Omit, men det funker
export interface ILeggTilBarnTyper
    extends Omit<IBarn, 'borMedSøker' | 'alder' | barnDataKeySpørsmål> {
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
            switch (felt.verdi) {
                case ESvar.JA:
                    return ok(felt);
                case ESvar.NEI:
                    return feil(felt, '');
                default:
                    return feil(felt, <SpråkTekst id={'felles.mangler-svar.feilmelding'} />);
            }
        },
    });

    const navnetErUbestemt = useFelt<ESvar>({
        verdi: ESvar.NEI,
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { erFødt },
    });

    const navn = useFelt<string | undefined>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        valideringsfunksjon: (felt, avhengigheter) => {
            const navnErUbestemt = avhengigheter?.navnetErUbestemt.verdi === ESvar.JA;
            if (navnErUbestemt) {
                return ok(felt);
            }
            return felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      <FormattedMessage id={'hvilkebarn.leggtilbarn.fornavn.feilmelding'} />
                  );
        },
        avhengigheter: { erFødt, navnetErUbestemt },
    });

    const ident = useFelt<string>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        valideringsfunksjon: felt => {
            return idnr(felt.verdi).status === 'valid'
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'hvilkebarn.leggtilbarn.fnr.feilmelding'} />);
        },
        avhengigheter: { erFødt },
    });

    const harBarnetFåttIdNummer = useFelt<ESvar>({
        verdi: ESvar.JA,
        valideringsfunksjon: felt => (felt.verdi === ESvar.JA ? ok(felt) : feil(felt, '')),
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
            barnRegistrertManuelt: søknad.barnRegistrertManuelt.concat([
                {
                    navn:
                        navn.verdi ||
                        intl.formatMessage({ id: 'hvilkebarn.barn.ingen-navn.placeholder' }),
                    ident: ident.verdi,
                    borMedSøker: undefined,
                    alder: undefined,
                },
            ]),
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
