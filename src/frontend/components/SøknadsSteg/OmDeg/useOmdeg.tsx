import React, { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { IUtenlandsperiode } from '../../../typer/person';
import { IOmDegFeltTyper } from '../../../typer/skjema';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
} => {
    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;
    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        søker.utenlandsperioder
    );

    const søkerFlyttetPermanentFraNorge = () =>
        !!utenlandsperioder.find(
            periode =>
                periode.utenlandsoppholdÅrsak.svar ===
                EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE
        );

    const borPåRegistrertAdresse = useFelt<ESvar | null>({
        feltId: søker.borPåRegistrertAdresse.id,
        verdi: søker.borPåRegistrertAdresse.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            /**
             * Hvis man svarer nei setter vi felt til Feil-state slik at man ikke kan gå videre,
             * og setter feilmelding til en tom string, siden personopplysningskomponenten har egen
             * feilmelding for det tilfellet.
             * Hvis man ikke svarer vises vanlig feilmelding.
             */

            if (felt.verdi === ESvar.JA) {
                return ok(felt);
            }

            let feilmeldingId: string;

            if (felt.verdi === ESvar.NEI) feilmeldingId = 'omdeg.du-kan-ikke-søke.feilmelding';
            else if (!søker.adressebeskyttelse && !søker.adresse)
                feilmeldingId = 'omdeg.personopplysninger.ikke-registrert.feilmelding';
            else feilmeldingId = 'omdeg.borpådenneadressen.feilmelding';

            return feil(felt, <SpråkTekst id={feilmeldingId} />);
        },
        skalFeltetVises: () => søker.adressebeskyttelse === false,
    });

    const værtINorgeITolvMåneder = useJaNeiSpmFelt(
        søker.værtINorgeITolvMåneder,
        'omdeg.opphold-sammenhengende.feilmelding',
        {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const planleggerÅBoINorgeTolvMnd = useJaNeiSpmFelt(
        søker.planleggerÅBoINorgeTolvMnd,
        'omdeg.planlagt-opphold-sammenhengende.feilmelding',
        {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
            værtINorgeITolvMåneder: { hovedSpørsmål: værtINorgeITolvMåneder },
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI,
        søkerFlyttetPermanentFraNorge() ||
            (værtINorgeITolvMåneder.verdi === ESvar.NEI && !utenlandsperioder.length)
    );

    const registrerteUtenlandsperioder = useFelt<IUtenlandsperiode[]>({
        feltId: UtenlandsoppholdSpørsmålId.utenlandsopphold,
        verdi: utenlandsperioder,
        avhengigheter: {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
            værtINorgeITolvMåneder,
        },
        valideringsfunksjon: felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />);
        },
        nullstillVedAvhengighetEndring: borPåRegistrertAdresse.verdi === ESvar.NEI,
        skalFeltetVises: avhengigheter => {
            return avhengigheter.værtINorgeITolvMåneder.verdi === ESvar.NEI;
        },
    });

    useEffect(() => {
        registrerteUtenlandsperioder.validerOgSettFelt(utenlandsperioder);
    }, [utenlandsperioder]);

    const leggTilUtenlandsperiode = (periode: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState => prevState.concat(periode));
    };

    const fjernUtenlandsperiode = (periodeSomSkalFjernes: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                utenlandsperioder:
                    værtINorgeITolvMåneder.verdi === ESvar.NEI ? utenlandsperioder : [],
                borPåRegistrertAdresse: {
                    ...søker.borPåRegistrertAdresse,
                    svar: skjema.felter.borPåRegistrertAdresse.verdi,
                },
                værtINorgeITolvMåneder: {
                    ...søker.værtINorgeITolvMåneder,
                    svar: skjema.felter.værtINorgeITolvMåneder.verdi,
                },
                planleggerÅBoINorgeTolvMnd: {
                    ...søker.planleggerÅBoINorgeTolvMnd,
                    svar: !søkerFlyttetPermanentFraNorge()
                        ? skjema.felter.planleggerÅBoINorgeTolvMnd.verdi
                        : null,
                },
            },
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmDegFeltTyper,
        string
    >({
        felter: {
            borPåRegistrertAdresse,
            værtINorgeITolvMåneder,
            planleggerÅBoINorgeTolvMnd,
            registrerteUtenlandsperioder,
        },
        skjemanavn: 'omdeg',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    };
};
