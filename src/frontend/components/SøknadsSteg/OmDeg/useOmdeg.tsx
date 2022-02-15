import React, { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { IOmDegFeltTyper } from '../../../typer/skjema';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLandMedPeriodeType, PeriodeType } from '../EøsSteg/idnummerUtils';

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
    const { erEøsLand } = useEøs();
    const søker = søknad.søker;
    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        søker.utenlandsperioder
    );
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs } = useEøs();

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

    const værtINorgeITolvMåneder = useJaNeiSpmFelt({
        søknadsfelt: søker.værtINorgeITolvMåneder,
        feilmeldingSpråkId: 'omdeg.oppholdtsammenhengende.feilmelding',
        avhengigheter: {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
        },
        nullstillVedAvhengighetEndring: borPåRegistrertAdresse.verdi === ESvar.NEI,
    });

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

    const planleggerÅBoINorgeTolvMnd = useJaNeiSpmFelt({
        søknadsfelt: søker.planleggerÅBoINorgeTolvMnd,
        feilmeldingSpråkId: 'omdeg.planlagt-opphold-sammenhengende.feilmelding',
        avhengigheter: {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
            værtINorgeITolvMåneder: { hovedSpørsmål: værtINorgeITolvMåneder },
        },
        nullstillVedAvhengighetEndring: borPåRegistrertAdresse.verdi === ESvar.NEI,
        skalSkjules:
            flyttetPermanentFraNorge(utenlandsperioder) ||
            værtINorgeITolvMåneder.verdi === ESvar.JA ||
            (værtINorgeITolvMåneder.verdi === ESvar.NEI && !utenlandsperioder.length),
    });

    useEffect(() => {
        if (borPåRegistrertAdresse.verdi !== ESvar.NEI) {
            registrerteUtenlandsperioder.validerOgSettFelt(utenlandsperioder);

            const oppdatertSøker = genererOppdatertSøker();
            skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs &&
                settSøkerTriggerEøs(prevState => !prevState);
        }
    }, [værtINorgeITolvMåneder, utenlandsperioder]);

    const leggTilUtenlandsperiode = (periode: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState => prevState.concat(periode));
    };

    const fjernUtenlandsperiode = (periodeSomSkalFjernes: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    const gyldigUkjentVerdiPåIdNummer = (idNummerMedLand: IIdNummer) =>
        relevanteLandMedPeriodeType.find(
            landMedPeriode => idNummerMedLand.land === landMedPeriode.land
        )?.periodeType === PeriodeType.utenlandsperiode;

    const relevanteLandMedPeriodeType = idNummerLandMedPeriodeType(
        søker.arbeidsperioderUtland,
        søker.pensjonsperioderUtland,
        registrerteUtenlandsperioder.verdi,
        erEøsLand
    );

    const filtrerteRelevanteIdNummer = søknad.søker.idNummer.svar.filter(idNummer => {
        return relevanteLandMedPeriodeType
            .map(landMedPeriode => landMedPeriode.land)
            .includes(idNummer.land);
    });

    const oppdaterteIdNummer = filtrerteRelevanteIdNummer.filter(
        idNummerObjekt =>
            idNummerObjekt.idnummer !== AlternativtSvarForInput.UKJENT ||
            gyldigUkjentVerdiPåIdNummer(idNummerObjekt)
    );

    console.log(oppdaterteIdNummer);

    const genererOppdatertSøker = () => ({
        ...søker,
        utenlandsperioder: værtINorgeITolvMåneder.verdi === ESvar.NEI ? utenlandsperioder : [],
        idNummer: {
            ...søker.idNummer,
            svar: oppdaterteIdNummer,
        },
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
            svar:
                !flyttetPermanentFraNorge(utenlandsperioder) &&
                værtINorgeITolvMåneder.verdi === ESvar.NEI
                    ? skjema.felter.planleggerÅBoINorgeTolvMnd.verdi
                    : null,
        },
    });

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();

        settSøknad({
            ...søknad,
            søker: { ...oppdatertSøker, triggetEøs: skalTriggeEøsForSøker(oppdatertSøker) },
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
