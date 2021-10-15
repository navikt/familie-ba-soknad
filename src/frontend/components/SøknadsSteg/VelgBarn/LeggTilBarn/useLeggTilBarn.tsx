import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import {
    feil,
    FeltState,
    ISkjema,
    ok,
    useFelt,
    useSkjema,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import useInputFeltMedUkjent from '../../../../hooks/useInputFeltMedUkjent';
import { barnDataKeySpørsmål, IBarn } from '../../../../typer/person';
import { erBarnRegistrertFraFør, hentUid } from '../../../../utils/barn';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { ESvarMedUbesvart } from '../../OmDeg/useOmdeg';
import { VelgBarnSpørsmålId } from '../spørsmål';

// Jeg har ikke funnet dokumentasjon på at man kan passe en enum til Omit, men det funker
export interface ILeggTilBarnTyper
    extends Omit<
        IBarn,
        'borMedSøker' | 'alder' | 'navn' | 'adressebeskyttelse' | 'id' | barnDataKeySpørsmål
    > {
    erFødt: ESvarMedUbesvart;
    fornavn: string;
    etternavn: string;
    navnetErUbestemt: ESvar;
    ident: string;
    ikkeFåttIdentChecked: ESvar;
}

export const useLeggTilBarn = (): {
    skjema: ISkjema<ILeggTilBarnTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
    leggTilBarn: () => void;
} => {
    const { søknad, settSøknad, mellomlagre } = useApp();
    const intl = useIntl();

    const erFødt = useFelt<ESvarMedUbesvart>({
        verdi: null,
        feltId: VelgBarnSpørsmålId.leggTilBarnErFødt,
        valideringsfunksjon: felt => {
            switch (felt.verdi) {
                case ESvar.JA:
                    return ok(felt);
                case ESvar.NEI:
                    return feil(
                        felt,
                        <SpråkTekst id={'hvilkebarn.leggtilbarn.barn-ikke-født.feilmelding'} />
                    );
                default:
                    return feil(
                        felt,
                        <SpråkTekst id={'hvilkebarn.leggtilbarn.barnfødt.feilmelding'} />
                    );
            }
        },
    });

    const navnetErUbestemt = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: VelgBarnSpørsmålId.leggTilBarnNavnIkkeBestemt,
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { erFødt },
    });

    const fornavn = useInputFeltMedUkjent(
        { id: VelgBarnSpørsmålId.leggTilBarnFornavn, svar: '' },
        navnetErUbestemt,
        'hvilkebarn.leggtilbarn.fornavn.feilmelding',
        false,
        erFødt.valideringsstatus === Valideringsstatus.OK
    );

    const etternavn = useInputFeltMedUkjent(
        { id: VelgBarnSpørsmålId.leggTilBarnEtternavn, svar: '' },
        navnetErUbestemt,
        'hvilkebarn.leggtilbarn.etternavn.feilmelding',
        false,
        erFødt.valideringsstatus === Valideringsstatus.OK
    );

    const ikkeFåttIdentChecked = useFelt<ESvar>({
        verdi: ESvar.NEI,
        valideringsfunksjon: felt =>
            felt.verdi === ESvar.NEI
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst id={'hvilkebarn.leggtilbarn.ikke-fått-fnr.feilmelding'} />
                  ),
        skalFeltetVises: ({ erFødt }) => erFødt.verdi === ESvar.JA,
        avhengigheter: { erFødt },
    });

    const ident = useInputFeltMedUkjent(
        {
            id: VelgBarnSpørsmålId.leggTilBarnFnr,
            svar: '',
        },
        ikkeFåttIdentChecked,
        'hvilkebarn.leggtilbarn.fnr.feilmelding',
        true,
        erFødt.valideringsstatus === Valideringsstatus.OK,
        (felt: FeltState<string>) => {
            return erBarnRegistrertFraFør(søknad, felt.verdi)
                ? feil(
                      felt,
                      <SpråkTekst id={'hvilkebarn.leggtilbarn.fnr.duplikat-barn.feilmelding'} />
                  )
                : ok(felt);
        }
    );

    const { skjema, kanSendeSkjema, valideringErOk, nullstillSkjema } = useSkjema<
        ILeggTilBarnTyper,
        string
    >({
        felter: {
            erFødt,
            fornavn,
            etternavn,
            navnetErUbestemt,
            ident,
            ikkeFåttIdentChecked,
        },
        skjemanavn: 'velgbarn',
    });

    const fulltNavn = () => {
        return fornavn.verdi && etternavn.verdi
            ? trimWhiteSpace(`${fornavn.verdi} ${etternavn.verdi}`)
            : '';
    };

    const leggTilBarn = () => {
        settSøknad({
            ...søknad,
            barnRegistrertManuelt: søknad.barnRegistrertManuelt.concat([
                {
                    id: hentUid(),
                    navn:
                        fulltNavn() ||
                        intl.formatMessage({ id: 'hvilkebarn.barn.ingen-navn.placeholder' }),
                    ident: ident.verdi,
                    borMedSøker: undefined,
                    alder: undefined,
                    adressebeskyttelse: false,
                },
            ]),
        });
        nullstillSkjema();
        mellomlagre();
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
        leggTilBarn,
    };
};
