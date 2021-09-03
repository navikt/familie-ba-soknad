import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { RessursStatus } from '@navikt/familie-typer';
import { idnr } from '@navikt/fnrvalidator';

import { useApp } from '../../../../context/AppContext';
import useInputFeltMedUkjent from '../../../../hooks/useInputFeltMedUkjent';
import Miljø from '../../../../Miljø';
import { barnDataKeySpørsmål, IBarn } from '../../../../typer/person';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import { erBarnRegistrertFraFør } from '../../../../utils/person';
import { hentUid } from '../../../../utils/uuid';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { ESvarMedUbesvart } from '../../OmDeg/useOmdeg';

// Jeg har ikke funnet dokumentasjon på at man kan passe en enum til Omit, men det funker
export interface ILeggTilBarnTyper
    extends Omit<
        IBarn,
        'borMedSøker' | 'alder' | 'navn' | 'adressebeskyttelse' | 'id' | barnDataKeySpørsmål
    > {
    ident: string;
    erFødt: ESvarMedUbesvart;
    navnetErUbestemt: ESvar;
    harBarnetFåttIdNummer: ESvar;
    fornavn: string;
    etternavn: string;
}

export const useLeggTilBarn = (): {
    skjema: ISkjema<ILeggTilBarnTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
    submit: () => Promise<boolean>;
    forsøkerBarnMedAdressebeskyttelse: boolean;
} => {
    const { søknad, settSøknad, axiosRequest } = useApp();
    const { barnRegistrertManuelt } = søknad;
    const intl = useIntl();
    const [forsøkerBarnMedAdressebeskyttelse, settForsøkerBarnMedAdressebeskyttelse] = useState(
        false
    );

    const erFødt = useFelt<ESvarMedUbesvart>({
        verdi: null,
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

    const fornavn = useInputFeltMedUkjent(
        null,
        navnetErUbestemt,
        'hvilkebarn.leggtilbarn.fornavn.feilmelding'
    );

    const etternavn = useInputFeltMedUkjent(
        null,
        navnetErUbestemt,
        'hvilkebarn.leggtilbarn.etternavn.feilmelding'
    );

    const ident = useFelt<string>({
        verdi: '',
        skalFeltetVises: ({ erFødt }) => erFødt.valideringsstatus === Valideringsstatus.OK,
        valideringsfunksjon: felt => {
            if (erBarnRegistrertFraFør(søknad, felt.verdi)) {
                return feil(
                    felt,
                    <SpråkTekst id={'hvilkebarn.leggtilbarn.fnr.duplikat-barn.feilmelding'} />
                );
            } else if (felt.verdi === '') {
                return feil(felt, <SpråkTekst id={'hvilkebarn.leggtilbarn.fnr.feilmelding'} />);
            } else {
                return idnr(felt.verdi).status === 'valid'
                    ? ok(felt)
                    : feil(
                          felt,
                          <SpråkTekst id={'hvilkebarn.leggtilbarn.fnr.feil-format.feilmelding'} />
                      );
            }
        },
        avhengigheter: { erFødt, barnRegistrertManuelt },
    });

    useEffect(() => {
        settForsøkerBarnMedAdressebeskyttelse(false);
    }, [ident.verdi]);

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
            fornavn,
            etternavn,
            navnetErUbestemt,
            harBarnetFåttIdNummer,
        },
        skjemanavn: 'velgbarn',
    });

    const fulltNavn = () => {
        return fornavn.verdi && etternavn.verdi
            ? trimWhiteSpace(`${fornavn.verdi} ${etternavn.verdi}`)
            : '';
    };

    const submit = async () => {
        if (!kanSendeSkjema()) {
            return false;
        }

        const result = await axiosRequest<boolean, unknown>({
            url: `${Miljø().soknadApi}/adressebeskyttelse`,
            method: 'POST',
            data: `ident=${ident.verdi}`,
            withCredentials: true,
        });

        // Hvis requestet feilet for noen grunn, behandle det som om barnet har beskyttelse
        const harAdressebeskyttelseRespons =
            result.status === RessursStatus.SUKSESS ? result.data : true;

        if (!harAdressebeskyttelseRespons) {
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
            return true;
        }

        settForsøkerBarnMedAdressebeskyttelse(true);
        return false;
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
        submit,
        forsøkerBarnMedAdressebeskyttelse,
    };
};
