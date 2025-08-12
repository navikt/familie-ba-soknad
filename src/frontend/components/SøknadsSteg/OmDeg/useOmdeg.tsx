import { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type FeltState, type ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { AlternativtSvarForInput } from '../../../typer/common';
import { ISvalbardOppholdPeriode, IUtenlandsperiode } from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmDegFeltTyper } from '../../../typer/skjema';
import { nullstilteEøsFelterForBarn } from '../../../utils/barn';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import { SvalbardOppholdSpørsmålId } from '../../Felleskomponenter/SvalbardOppholdModal.tsx/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLandMedPeriodeType, PeriodeType } from '../EøsSteg/idnummerUtils';

import { IOmDegTekstinnhold } from './innholdTyper';

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilSvalbardOppholdPeriode: (periode: ISvalbardOppholdPeriode) => void;
    fjernSvalbardOppholdPeriode: (periodeSomSkalFjernes: ISvalbardOppholdPeriode) => void;
    svalbardOppholdPerioder: ISvalbardOppholdPeriode[];
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useAppContext();
    const { erEøsLand } = useEøsContext();
    const søker = søknad.søker;
    const [svalbardOppholdPerioder, settSvalbardOppholdPerioder] = useState<
        ISvalbardOppholdPeriode[]
    >(søker.svalbardOppholdPerioder);
    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        søker.utenlandsperioder
    );
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs } = useEøsContext();
    const teksterForSteg: IOmDegTekstinnhold = tekster()[ESanitySteg.OM_DEG];
    const teksterForSvalbardOpphold: ISvalbardOppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.svalbardOpphold.søker;
    const teksterForUtenlandsopphold: IUtenlandsoppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold.søker;

    const borPåRegistrertAdresse = useJaNeiSpmFelt({
        søknadsfelt: søker.borPåRegistrertAdresse,
        feilmelding: teksterForSteg.borPaaRegistrertAdresse.feilmelding,
        feilmeldingSpråkId: 'omdeg.borpådenneadressen.feilmelding',
        skalSkjules: !søker.adresse || søker.adressebeskyttelse,
    });

    const borPåSvalbard = useFelt<ESvar | null>({
        feltId: søker.borPåSvalbard.id,
        verdi: borPåRegistrertAdresse.verdi === ESvar.JA ? null : søker.borPåSvalbard.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(felt, plainTekst(teksterForSteg.borPaaSvalbard.feilmelding));
        },
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.borPåRegistrertAdresse &&
                avhengigheter.borPåRegistrertAdresse.verdi === ESvar.NEI
            );
        },
        avhengigheter: { borPåRegistrertAdresse },
    });

    const registrerteSvalbardOppholdPerioder = useFelt<ISvalbardOppholdPeriode[]>({
        feltId: SvalbardOppholdSpørsmålId.svalbardOpphold,
        verdi: svalbardOppholdPerioder,
        avhengigheter: {
            borPåSvalbard,
        },
        valideringsfunksjon: felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, plainTekst(teksterForSvalbardOpphold.leggTilFeilmelding));
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter.borPåSvalbard.verdi === ESvar.JA;
        },
    });

    useEffect(() => {
        registrerteSvalbardOppholdPerioder.validerOgSettFelt(svalbardOppholdPerioder);
        genererOppdatertSøker();
    }, [borPåSvalbard, svalbardOppholdPerioder]);

    const leggTilSvalbardOppholdPeriode = (periode: ISvalbardOppholdPeriode) => {
        settSvalbardOppholdPerioder(prevState => prevState.concat(periode));
    };

    const fjernSvalbardOppholdPeriode = (periodeSomSkalFjernes: ISvalbardOppholdPeriode) => {
        settSvalbardOppholdPerioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    const værtINorgeITolvMåneder = useJaNeiSpmFelt({
        søknadsfelt: søker.værtINorgeITolvMåneder,
        feilmelding: teksterForSteg.vaertINorgeITolvMaaneder.feilmelding,
        feilmeldingSpråkId: 'omdeg.oppholdtsammenhengende.feilmelding',
    });

    const registrerteUtenlandsperioder = useFelt<IUtenlandsperiode[]>({
        feltId: UtenlandsoppholdSpørsmålId.utenlandsopphold,
        verdi: utenlandsperioder,
        avhengigheter: {
            værtINorgeITolvMåneder,
        },
        valideringsfunksjon: felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, plainTekst(teksterForUtenlandsopphold.leggTilFeilmelding));
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter.værtINorgeITolvMåneder.verdi === ESvar.NEI;
        },
    });

    const planleggerÅBoINorgeTolvMnd = useJaNeiSpmFelt({
        søknadsfelt: søker.planleggerÅBoINorgeTolvMnd,
        feilmelding: teksterForSteg.planleggerAaBoINorgeTolvMnd.feilmelding,
        feilmeldingSpråkId: 'omdeg.planlagt-opphold-sammenhengende.feilmelding',
        avhengigheter: {
            værtINorgeITolvMåneder: { hovedSpørsmål: værtINorgeITolvMåneder },
        },
        skalSkjules:
            flyttetPermanentFraNorge(utenlandsperioder) ||
            værtINorgeITolvMåneder.verdi === ESvar.JA ||
            (værtINorgeITolvMåneder.verdi === ESvar.NEI && !utenlandsperioder.length),
    });

    useEffect(() => {
        registrerteUtenlandsperioder.validerOgSettFelt(utenlandsperioder);

        const oppdatertSøker = genererOppdatertSøker();
        if (skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs) {
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

    const gyldigVerdiPåIdNummer = (idNummerObj: IIdNummer) =>
        idNummerObj.idnummer !== AlternativtSvarForInput.UKJENT ||
        relevanteLandMedPeriodeType().find(
            landMedPeriode => idNummerObj.land === landMedPeriode.land
        )?.periodeType === PeriodeType.utenlandsperiode;

    const relevanteLandMedPeriodeType = () =>
        idNummerLandMedPeriodeType(
            {
                arbeidsperioderUtland: søker.arbeidsperioderUtland,
                pensjonsperioderUtland: søker.pensjonsperioderUtland,
                utenlandsperioder:
                    værtINorgeITolvMåneder.verdi === ESvar.NEI
                        ? registrerteUtenlandsperioder.verdi
                        : [],
            },
            erEøsLand
        );

    const filtrerteRelevanteIdNummer = (): IIdNummer[] =>
        søknad.søker.idNummer.filter(
            idNummerObj =>
                relevanteLandMedPeriodeType()
                    .map(landMedPeriode => landMedPeriode.land)
                    .includes(idNummerObj.land) && gyldigVerdiPåIdNummer(idNummerObj)
        );

    const genererOppdatertSøker = () => ({
        ...søker,
        svalbardOppholdPerioder: borPåSvalbard.verdi === ESvar.JA ? svalbardOppholdPerioder : [],
        utenlandsperioder: værtINorgeITolvMåneder.verdi === ESvar.NEI ? utenlandsperioder : [],
        idNummer: filtrerteRelevanteIdNummer(),
        borPåRegistrertAdresse: {
            ...søker.borPåRegistrertAdresse,
            svar: skjema.felter.borPåRegistrertAdresse.verdi,
        },
        borPåSvalbard: {
            ...søker.borPåSvalbard,
            svar: skjema.felter.borPåSvalbard.verdi,
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
        const søkerTriggetEøs = skalTriggeEøsForSøker(oppdatertSøker);
        const harEøsSteg =
            søkerTriggetEøs || !!søknad.barnInkludertISøknaden.find(barn => barn.triggetEøs);

        settSøknad({
            ...søknad,
            søker: {
                ...oppdatertSøker,
                triggetEøs: søkerTriggetEøs,
                ...(!harEøsSteg && nullstilteEøsFelterForSøker(søknad.søker)),
            },
            ...(!harEøsSteg && {
                barnInkludertISøknaden: søknad.barnInkludertISøknaden.map(barn => ({
                    ...barn,
                    ...nullstilteEøsFelterForBarn(barn),
                })),
            }),
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmDegFeltTyper,
        string
    >({
        felter: {
            borPåRegistrertAdresse,
            borPåSvalbard,
            registrerteSvalbardOppholdPerioder,
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
        leggTilSvalbardOppholdPeriode,
        fjernSvalbardOppholdPeriode,
        svalbardOppholdPerioder,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    };
};
