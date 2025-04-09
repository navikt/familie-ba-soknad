import { Dispatch, SetStateAction, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type Felt, type ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../../context/AppContext';
import useInputFelt from '../../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../../hooks/usePerioder';
import { AlternativtSvarForInput } from '../../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode, IUtbetalingsperiode } from '../../../../typer/perioder';
import { ISøker } from '../../../../typer/person';
import { PersonType } from '../../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../../typer/sanity/modaler/arbeidsperiode';
import { IPensjonsperiodeTekstinnhold } from '../../../../typer/sanity/modaler/pensjonsperiode';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { IEøsForSøkerFeltTyper } from '../../../../typer/skjema';
import { valideringAdresse } from '../../../../utils/adresse';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import { ArbeidsperiodeSpørsmålsId } from '../../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../../../Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtbetalingerSpørsmålId } from '../../../Felleskomponenter/UtbetalingerModal/spørsmål';
import { idNummerKeyPrefix } from '../idnummerUtils';

import { IEøsForSøkerTekstinnhold } from './innholdTyper';
import { EøsSøkerSpørsmålId } from './spørsmål';

export const useEøsForSøker = (): {
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    validerAlleSynligeFelter: () => void;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    fjernAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    idNummerFelter: Felt<string>[];
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useAppContext();
    const teksterForSteg: IEøsForSøkerTekstinnhold = tekster()[ESanitySteg.EØS_FOR_SØKER];
    const teksterForArbeidsperiode: IArbeidsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.arbeidsperiode.søker;
    const teksterForPensjonsperiode: IPensjonsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.pensjonsperiode.søker;
    const teksterForAndreUtbetalinger =
        tekster()[ESanitySteg.FELLES].modaler.andreUtbetalinger.søker;

    const [idNummerFelter, settIdNummerFelter] = useState<Felt<string>[]>([]);

    const søker = søknad.søker;

    const adresseISøkeperiode = useInputFelt({
        søknadsfelt: {
            id: EøsSøkerSpørsmålId.adresseISøkeperiode,
            svar: søker.adresseISøkeperiode.svar,
        },
        feilmelding: teksterForSteg.hvorBor.feilmelding,
        feilmeldingSpråkId: 'eøs-om-deg.dittoppholdssted.feilmelding',
        skalVises: søker.triggetEøs,
        customValidering: valideringAdresse,
    });

    const arbeidINorge = useJaNeiSpmFelt({
        søknadsfelt: søker.arbeidINorge,
        feilmelding: teksterForSteg.arbeidNorge.feilmelding,
        feilmeldingSpråkId: 'eøs-om-deg.arbeidsperioderinorge.feilmelding',
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: registrerteArbeidsperioder,
    } = usePerioder<IArbeidsperiode>({
        feltId: `${ArbeidsperiodeSpørsmålsId.arbeidsperioderNorge}-${PersonType.Søker}`,
        verdi: søker.arbeidsperioderNorge,
        avhengigheter: { arbeidINorge },
        skalFeltetVises: avhengigheter => avhengigheter.arbeidINorge.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.arbeidINorge.verdi === ESvar.NEI ||
                (avhengigheter?.arbeidINorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(teksterForArbeidsperiode.leggTilFeilmelding, {
                          gjelderUtland: false,
                      })
                  );
        },
    });

    const pensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: søker.pensjonNorge,
        feilmelding: teksterForSteg.pensjonNorge.feilmelding,
        feilmeldingSpråkId: 'eøs-om-deg.pensjoninorge.feilmelding',
    });
    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: registrertePensjonsperioder,
    } = usePerioder<IPensjonsperiode>({
        feltId: `${PensjonsperiodeSpørsmålId.pensjonsperioderNorge}-${PersonType.Søker}`,
        verdi: søker.pensjonsperioderNorge,
        avhengigheter: { pensjonNorge },
        skalFeltetVises: avhengigheter => avhengigheter.pensjonNorge.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.pensjonNorge.verdi === ESvar.NEI ||
                (avhengigheter?.pensjonNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(teksterForPensjonsperiode.leggTilFeilmelding, {
                          gjelderUtland: false,
                      })
                  );
        },
    });

    const andreUtbetalinger = useJaNeiSpmFelt({
        søknadsfelt: søker.andreUtbetalinger,
        feilmelding: teksterForSteg.utbetalinger.feilmelding,
        feilmeldingSpråkId: 'eøs-om-deg.utbetalinger.feilmelding',
    });
    const {
        fjernPeriode: fjernAndreUtbetalingsperiode,
        leggTilPeriode: leggTilAndreUtbetalingsperiode,
        registrertePerioder: registrerteAndreUtbetalinger,
    } = usePerioder<IUtbetalingsperiode>({
        feltId: `${UtbetalingerSpørsmålId.utbetalingsperioder}-${PersonType.Søker}`,
        verdi: søker.andreUtbetalingsperioder,
        avhengigheter: { andreUtbetalinger },
        skalFeltetVises: avhengigheter => avhengigheter.andreUtbetalinger.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.andreUtbetalinger.verdi === ESvar.NEI ||
                (avhengigheter?.andreUtbetalinger.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, plainTekst(teksterForAndreUtbetalinger.leggTilFeilmelding));
        },
    });

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        settSøknad({
            ...søknad,
            søker: oppdatertSøker,
        });
    };
    const genererOppdatertSøker = (): ISøker => ({
        ...søknad.søker,
        idNummer: idNummerFelter.map(felt => ({
            land: felt.id.split(idNummerKeyPrefix)[1] as Alpha3Code,
            idnummer:
                trimWhiteSpace(felt.verdi) === '' ? AlternativtSvarForInput.UKJENT : felt.verdi,
        })),
        adresseISøkeperiode: {
            ...søknad.søker.adresseISøkeperiode,
            svar: trimWhiteSpace(skjema.felter.adresseISøkeperiode.verdi),
        },
        arbeidINorge: {
            ...søknad.søker.arbeidINorge,
            svar: skjema.felter.arbeidINorge.verdi,
        },

        arbeidsperioderNorge:
            skjema.felter.arbeidINorge.verdi === ESvar.JA
                ? skjema.felter.registrerteArbeidsperioder.verdi
                : [],

        pensjonNorge: {
            ...søknad.søker.pensjonNorge,
            svar: skjema.felter.pensjonNorge.verdi,
        },
        pensjonsperioderNorge:
            skjema.felter.pensjonNorge.verdi === ESvar.JA
                ? skjema.felter.registrertePensjonsperioder.verdi
                : [],
        andreUtbetalinger: {
            ...søknad.søker.andreUtbetalinger,
            svar: skjema.felter.andreUtbetalinger.verdi,
        },
        andreUtbetalingsperioder:
            skjema.felter.andreUtbetalinger.verdi === ESvar.JA
                ? skjema.felter.registrerteAndreUtbetalinger.verdi
                : [],
    });

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IEøsForSøkerFeltTyper,
        string
    >({
        felter: {
            ...idNummerFelter.reduce(
                (objekt, felt) => ({
                    ...objekt,
                    [felt.id]: felt,
                }),
                {}
            ),
            adresseISøkeperiode,
            arbeidINorge,
            registrerteArbeidsperioder,
            pensjonNorge,
            registrertePensjonsperioder,
            andreUtbetalinger,
            registrerteAndreUtbetalinger,
        },
        skjemanavn: 'eøsForSøker',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        validerAlleSynligeFelter,
        oppdaterSøknad,
        fjernArbeidsperiode,
        leggTilArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        settIdNummerFelter,
        idNummerFelter,
    };
};
