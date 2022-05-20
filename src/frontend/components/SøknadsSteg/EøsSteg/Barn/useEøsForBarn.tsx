import React, { Dispatch, SetStateAction, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import useInputFelt from '../../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../../hooks/usePerioder';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../typer/barn';
import { AlternativtSvarForInput, BarnetsId } from '../../../../typer/common';
import { Slektsforhold } from '../../../../typer/kontrakt/barn';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
} from '../../../../typer/perioder';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { valideringAdresse } from '../../../../utils/adresse';
import { skalSkjuleAndreForelderFelt, skalViseBorMedOmsorgsperson } from '../../../../utils/barn';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import { formaterVerdiForCheckbox } from '../../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../../utils/spørsmål';
import { arbeidsperiodeFeilmelding } from '../../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { pensjonsperiodeFeilmelding } from '../../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { idNummerKeyPrefix } from '../idnummerUtils';
import { EøsBarnSpørsmålId } from './spørsmål';

export const useEøsForBarn = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    oppdaterSøknad: () => void;
    leggTilPensjonsperiodeNorgeAndreForelder: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiodeNorgeAndreForelder: (periode: IPensjonsperiode) => void;
    leggTilAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    fjernAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    leggTilArbeidsperiodeNorgeAndreForelder: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiodeNorgeAndreForelder: (periode: IArbeidsperiode) => void;
    leggTilBarnetrygdsperiodeAndreForelder: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiodeAndreForelder: (periode: IEøsBarnetrygdsperiode) => void;
    leggTilArbeidsperiodeUtlandOmsorgsperson: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiodeUtlandOmsorgsperson: (periode: IArbeidsperiode) => void;
    leggTilArbeidsperiodeNorgeOmsorgsperson: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiodeNorgeOmsorgsperson: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiodeUtlandOmsorgsperson: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiodeUtlandOmsorgsperson: (periode: IPensjonsperiode) => void;
    leggTilPensjonsperiodeNorgeOmsorgsperson: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiodeNorgeOmsorgsperson: (periode: IPensjonsperiode) => void;
    settIdNummerFelterForBarn: Dispatch<SetStateAction<Felt<string>[]>>;
    idNummerFelterForBarn: Felt<string>[];
    idNummerFelterForAndreForelder: Felt<string>[];
    settIdNummerFelterForAndreForelder: Dispatch<SetStateAction<Felt<string>[]>>;
} => {
    const { søknad, settSøknad } = useApp();

    const [gjeldendeBarn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid)
    );

    const [idNummerFelterForBarn, settIdNummerFelterForBarn] = useState<Felt<string>[]>([]);
    const [idNummerFelterForAndreForelder, settIdNummerFelterForAndreForelder] = useState<
        Felt<string>[]
    >([]);

    if (!gjeldendeBarn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }
    const andreForelder = gjeldendeBarn.andreForelder;
    const omsorgsperson = gjeldendeBarn.omsorgsperson;

    /*--- SLEKTSFORHOLD ---*/
    const søkersSlektsforhold = useFelt<Slektsforhold | ''>({
        feltId: gjeldendeBarn[barnDataKeySpørsmål.søkersSlektsforhold].id,
        verdi: gjeldendeBarn[barnDataKeySpørsmål.søkersSlektsforhold].svar,
        valideringsfunksjon: (felt: FeltState<Slektsforhold | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.velgslektsforhold.feilmelding'} />);
        },
        skalFeltetVises: () => gjeldendeBarn.erFosterbarn.svar === ESvar.NEI,
    });
    const søkersSlektsforholdSpesifisering = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.søkersSlektsforholdSpesifisering],
        feilmeldingSpråkId: 'eøs-om-barn.dinrelasjon.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalVises: søkersSlektsforhold.verdi === Slektsforhold.ANNEN_RELASJON,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[0-9A-Za-z\s\-\\,\\.]{4,60}$/)
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={'felles.relasjon.format.feilmelding'}
                          values={{
                              barn: gjeldendeBarn.navn,
                          }}
                      />
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    /*--- BOSITUASJON ---*/
    const borMedAndreForelder = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borMedAndreForelder],
        feilmeldingSpråkId: 'eøs-om-barn.borbarnmedandreforelder.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        nullstillVedAvhengighetEndring: true,
        skalSkjules:
            gjeldendeBarn.erFosterbarn.svar === ESvar.JA ||
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA ||
            gjeldendeBarn.oppholderSegIInstitusjon.svar === ESvar.JA,
    });

    /*--- OMSORGSPERSON ---*/
    const borMedOmsorgsperson = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borMedOmsorgsperson],
        feilmeldingSpråkId: 'eøs-om-barn.bormedannenomsorgsperson.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        nullstillVedAvhengighetEndring: true,
        skalSkjules: !skalViseBorMedOmsorgsperson(
            borMedAndreForelder.verdi,
            gjeldendeBarn.borFastMedSøker.svar,
            gjeldendeBarn.oppholderSegIInstitusjon.svar,
            gjeldendeBarn.andreForelderErDød.svar,
            gjeldendeBarn.erFosterbarn.svar
        ),
    });

    const omsorgspersonNavn = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.navn,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonnavn.feilmelding',
        skalVises: borMedOmsorgsperson.verdi === ESvar.JA,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[A-Za-zæøåÆØÅ\s\-\\,\\.]{1,60}$/)
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={'felles.relasjon.format.feilmelding'}
                          values={{
                              barn: gjeldendeBarn.navn,
                          }}
                      />
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgspersonSlektsforhold = useFelt<Slektsforhold | ''>({
        feltId: omsorgsperson?.slektsforhold.id,
        verdi: omsorgsperson?.slektsforhold.svar ?? '',
        valideringsfunksjon: (felt: FeltState<Slektsforhold | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.velgslektsforhold.feilmelding'} />);
        },
        skalFeltetVises: avhengigheter =>
            gjeldendeBarn.erFosterbarn.svar === ESvar.NEI &&
            avhengigheter.borMedOmsorgsperson.verdi === ESvar.JA,
        avhengigheter: { borMedOmsorgsperson },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgpersonSlektsforholdSpesifisering = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.slektsforholdSpesifisering,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonrelasjon.feilmelding',
        feilmeldingSpråkVerdier: {
            barn: gjeldendeBarn.navn,
        },
        skalVises: omsorgspersonSlektsforhold.verdi === Slektsforhold.ANNEN_RELASJON,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[0-9A-Za-zæøåÆØÅ\s\-\\,\\.]{4,60}$/)
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={'felles.relasjon.format.feilmelding'}
                          values={{
                              barn: gjeldendeBarn.navn,
                          }}
                      />
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgspersonIdNummerVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(omsorgsperson?.idNummer.svar),
        feltId: EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke,
        skalFeltetVises: avhengigheter => avhengigheter.borMedOmsorgsperson.verdi === ESvar.JA,
        avhengigheter: { borMedOmsorgsperson },
    });

    const omsorgspersonIdNummer = useInputFeltMedUkjent({
        søknadsfelt: omsorgsperson && omsorgsperson.idNummer,
        avhengighet: omsorgspersonIdNummerVetIkke,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonidnummer.feilmelding',
        skalVises: borMedOmsorgsperson.verdi === ESvar.JA,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[0-9A-Za-zæøåÆØÅ\s\-.\\/]{4,20}$/)
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={'felles.idnummer-feilformat.feilmelding'}
                          values={{
                              barn: gjeldendeBarn.navn,
                          }}
                      />
                  );
        },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgspersonAdresse = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.adresse,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonoppholdssted.feilmelding',
        skalVises: borMedOmsorgsperson.verdi === ESvar.JA,
        customValidering: valideringAdresse,
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgspersonArbeidUtland = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.arbeidUtland,
        feilmeldingSpråkId: 'eøs-om-barn.omsorgsperson-arbeid-utland.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernArbeidsperiodeUtlandOmsorgsperson,
        leggTilPeriode: leggTilArbeidsperiodeUtlandOmsorgsperson,
        registrertePerioder: omsorgspersonArbeidsperioderUtland,
    } = usePerioder<IArbeidsperiode>(
        omsorgsperson?.arbeidsperioderUtland ?? [],
        { omsorgspersonArbeidUtland },
        avhengigheter => avhengigheter.omsorgspersonArbeidUtland.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonArbeidUtland.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonArbeidUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(true)} />);
        }
    );

    const omsorgspersonArbeidNorge = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.arbeidNorge,
        feilmeldingSpråkId: 'eøs-om-barn.omsorgspersonarbeidsperiodenorge.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernArbeidsperiodeNorgeOmsorgsperson,
        leggTilPeriode: leggTilArbeidsperiodeNorgeOmsorgsperson,
        registrertePerioder: omsorgspersonArbeidsperioderNorge,
    } = usePerioder<IArbeidsperiode>(
        omsorgsperson?.arbeidsperioderNorge ?? [],
        { omsorgspersonArbeidNorge },
        avhengigheter => avhengigheter.omsorgspersonArbeidNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonArbeidNorge.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonArbeidNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(false)} />);
        }
    );

    const omsorgspersonPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.pensjonUtland,
        feilmeldingSpråkId: 'eøs-om-barn.omsorgsperson-pensjon-utland.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernPensjonsperiodeUtlandOmsorgsperson,
        leggTilPeriode: leggTilPensjonsperiodeUtlandOmsorgsperson,
        registrertePerioder: omsorgspersonPensjonsperioderUtland,
    } = usePerioder<IPensjonsperiode>(
        omsorgsperson?.pensjonsperioderUtland ?? [],
        { omsorgspersonPensjonUtland },
        avhengigheter => avhengigheter.omsorgspersonPensjonUtland.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonPensjonUtland.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonPensjonUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(false)} />);
        }
    );

    const omsorgspersonPensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: omsorgsperson?.pensjonNorge,
        feilmeldingSpråkId: 'eøs-om-barn.omsorgsperson-pensjon-norge.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules: borMedOmsorgsperson.verdi !== ESvar.JA,
    });

    const {
        fjernPeriode: fjernPensjonsperiodeNorgeOmsorgsperson,
        leggTilPeriode: leggTilPensjonsperiodeNorgeOmsorgsperson,
        registrertePerioder: omsorgspersonPensjonsperioderNorge,
    } = usePerioder<IPensjonsperiode>(
        omsorgsperson?.pensjonsperioderNorge ?? [],
        { omsorgspersonPensjonNorge },
        avhengigheter => avhengigheter.omsorgspersonPensjonNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.omsorgspersonPensjonNorge.verdi === ESvar.NEI ||
                (avhengigheter?.omsorgspersonPensjonNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(false)} />);
        }
    );

    /*--- BARNETS ADRESSE ---*/
    const barnetsAdresseVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(gjeldendeBarn[barnDataKeySpørsmål.adresse].svar),
        feltId: EøsBarnSpørsmålId.barnetsAdresseVetIkke,
        skalFeltetVises: () =>
            (borMedAndreForelder.verdi === ESvar.JA &&
                skalSkjuleAndreForelderFelt(gjeldendeBarn)) ||
            gjeldendeBarn.erFosterbarn.svar === ESvar.JA,
        avhengigheter: { borMedAndreForelder },
    });

    const barnetsAdresse = useInputFeltMedUkjent({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.adresse],
        avhengighet: barnetsAdresseVetIkke,
        feilmeldingSpråkId: 'eøs.hvorborbarn.feilmelding',
        språkVerdier: {
            barn: gjeldendeBarn.navn,
        },
        skalVises:
            (borMedAndreForelder.verdi === ESvar.JA &&
                skalSkjuleAndreForelderFelt(gjeldendeBarn)) ||
            gjeldendeBarn.erFosterbarn.svar === ESvar.JA,
        customValidering: valideringAdresse,
    });

    /*--- ANDRE FORELDER ---*/
    const andreForelderAdresseVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(andreForelder?.adresse.svar),
        feltId: EøsBarnSpørsmålId.andreForelderAdresseVetIkke,
        skalFeltetVises: () =>
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar !== ESvar.JA &&
            !skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const andreForelderAdresse = useInputFeltMedUkjent({
        søknadsfelt: andreForelder && andreForelder[andreForelderDataKeySpørsmål.adresse],
        avhengighet: andreForelderAdresseVetIkke,
        feilmeldingSpråkId: 'eøs-om-barn.andreforelderoppholdssted.feilmelding',
        språkVerdier: { barn: gjeldendeBarn.navn },
        skalVises:
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar !== ESvar.JA &&
            !skalSkjuleAndreForelderFelt(gjeldendeBarn),
        customValidering: valideringAdresse,
    });

    const andreForelderArbeidNorge = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidNorge],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.annenforelderarbeidnorge.feilmelding'
                : 'eøs-om-barn.annenforelderarbeidsperiodenorge.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernArbeidsperiodeNorgeAndreForelder,
        leggTilPeriode: leggTilArbeidsperiodeNorgeAndreForelder,
        registrertePerioder: andreForelderArbeidsperioderNorge,
    } = usePerioder<IArbeidsperiode>(
        andreForelder?.arbeidsperioderNorge ?? [],
        { andreForelderArbeidNorge },
        avhengigheter => avhengigheter.andreForelderArbeidNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderArbeidNorge.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderArbeidNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(false)} />);
        }
    );

    const andreForelderPensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonNorge],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelderpensjon.feilmelding'
                : 'eøs-om-barn.andreforelderpensjon.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernPensjonsperiodeNorgeAndreForelder,
        leggTilPeriode: leggTilPensjonsperiodeNorgeAndreForelder,
        registrertePerioder: andreForelderPensjonsperioderNorge,
    } = usePerioder<IPensjonsperiode>(
        andreForelder?.pensjonsperioderNorge ?? [],
        { andreForelderPensjonNorge },
        avhengigheter => avhengigheter.andreForelderPensjonNorge.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderPensjonNorge.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderPensjonNorge.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(false)} />);
        }
    );

    const andreForelderAndreUtbetalinger = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.andreUtbetalinger],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.annenforelderytelser.feilmelding'
                : 'eøs-om-barn.andreforelderutbetalinger.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernAndreUtbetalingsperiode,
        leggTilPeriode: leggTilAndreUtbetalingsperiode,
        registrertePerioder: andreForelderAndreUtbetalingsperioder,
    } = usePerioder<IUtbetalingsperiode>(
        andreForelder?.andreUtbetalingsperioder ?? [],
        { andreForelderAndreUtbetalinger },
        avhengigheter => avhengigheter.andreForelderAndreUtbetalinger.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderAndreUtbetalinger.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderAndreUtbetalinger.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.flereytelser.feilmelding'} />);
        }
    );

    const andreForelderBarnetrygdFraEøs = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.barnetrygdFraEøs],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'eøs-om-barn.andre-forelder-barnetrygd-gjenlevende.feilmelding'
                : 'eøs-om-barn.andre-forelder-barnetrygd.feilmelding',
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernBarnetrygdsperiodeAndreForelder,
        leggTilPeriode: leggTilBarnetrygdsperiodeAndreForelder,
        registrertePerioder: andreForelderEøsBarnetrygdperioder,
    } = usePerioder<IEøsBarnetrygdsperiode>(
        andreForelder?.eøsBarnetrygdperioder ?? [],
        { andreForelderBarnetrygdFraEøs },
        avhengigheter => avhengigheter.andreForelderBarnetrygdFraEøs.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderBarnetrygdFraEøs.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderBarnetrygdFraEøs.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.trygdandreperioder.feilmelding'} />);
        }
    );

    const genererAndreForelder = (andreForelder: IAndreForelder) => ({
        andreForelder: {
            ...andreForelder,
            pensjonNorge: {
                ...andreForelder[andreForelderDataKeySpørsmål.pensjonNorge],
                svar: andreForelderPensjonNorge.verdi,
            },
            pensjonsperioderNorge:
                andreForelderPensjonNorge.verdi === ESvar.JA
                    ? andreForelderPensjonsperioderNorge.verdi
                    : [],
            andreUtbetalinger: {
                ...andreForelder[andreForelderDataKeySpørsmål.andreUtbetalinger],
                svar: andreForelderAndreUtbetalinger.verdi,
            },
            andreUtbetalingsperioder:
                andreForelderAndreUtbetalinger.verdi === ESvar.JA
                    ? andreForelderAndreUtbetalingsperioder.verdi
                    : [],
            arbeidNorge: {
                ...andreForelder[andreForelderDataKeySpørsmål.arbeidNorge],
                svar: andreForelderArbeidNorge.verdi,
            },
            arbeidsperioderNorge:
                andreForelderArbeidNorge.verdi === ESvar.JA
                    ? andreForelderArbeidsperioderNorge.verdi
                    : [],
            barnetrygdFraEøs: {
                ...andreForelder[andreForelderDataKeySpørsmål.barnetrygdFraEøs],
                svar: andreForelderBarnetrygdFraEøs.verdi,
            },
            eøsBarnetrygdsperioder:
                andreForelderBarnetrygdFraEøs.verdi === ESvar.JA
                    ? andreForelderEøsBarnetrygdperioder.verdi
                    : [],
            idNummer: idNummerFelterForAndreForelder.map(felt => ({
                land: felt.id.split(idNummerKeyPrefix)[1] as Alpha3Code,
                idnummer:
                    trimWhiteSpace(felt.verdi) === '' ? AlternativtSvarForInput.UKJENT : felt.verdi,
            })),
            adresse: {
                ...andreForelder[andreForelderDataKeySpørsmål.adresse],
                svar: trimWhiteSpace(
                    svarForSpørsmålMedUkjent(andreForelderAdresseVetIkke, andreForelderAdresse)
                ),
            },
        },
    });

    const genererOmsorgsperson = () => ({
        navn: {
            id: EøsBarnSpørsmålId.omsorgspersonNavn,
            svar: trimWhiteSpace(omsorgspersonNavn.verdi),
        },
        slektsforhold: {
            id: EøsBarnSpørsmålId.omsorgspersonSlektsforhold,
            svar: omsorgspersonSlektsforhold.verdi,
        },
        slektsforholdSpesifisering: {
            id: EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering,
            svar: trimWhiteSpace(omsorgpersonSlektsforholdSpesifisering.verdi),
        },
        idNummer: {
            id: EøsBarnSpørsmålId.omsorgspersonIdNummer,
            svar: trimWhiteSpace(
                svarForSpørsmålMedUkjent(omsorgspersonIdNummerVetIkke, omsorgspersonIdNummer)
            ),
        },
        adresse: {
            id: EøsBarnSpørsmålId.omsorgspersonAdresse,
            svar: trimWhiteSpace(omsorgspersonAdresse.verdi),
        },
        arbeidUtland: {
            id: EøsBarnSpørsmålId.omsorgspersonArbeidUtland,
            svar: omsorgspersonArbeidUtland.verdi,
        },
        arbeidsperioderUtland:
            omsorgspersonArbeidUtland.verdi === ESvar.JA
                ? omsorgspersonArbeidsperioderUtland.verdi
                : [],
        arbeidNorge: {
            id: EøsBarnSpørsmålId.omsorgspersonArbeidNorge,
            svar: omsorgspersonArbeidNorge.verdi,
        },
        arbeidsperioderNorge:
            omsorgspersonArbeidNorge.verdi === ESvar.JA
                ? omsorgspersonArbeidsperioderNorge.verdi
                : [],
        pensjonUtland: {
            id: EøsBarnSpørsmålId.omsorgspersonPensjonUtland,
            svar: omsorgspersonPensjonUtland.verdi,
        },
        pensjonsperioderUtland:
            omsorgspersonPensjonUtland.verdi === ESvar.JA
                ? omsorgspersonPensjonsperioderUtland.verdi
                : [],
        pensjonNorge: {
            id: EøsBarnSpørsmålId.omsorgspersonPensjonNorge,
            svar: omsorgspersonPensjonNorge.verdi,
        },
        pensjonsperioderNorge:
            omsorgspersonPensjonNorge.verdi === ESvar.JA
                ? omsorgspersonPensjonsperioderNorge.verdi
                : [],
    });

    const genererOppdatertBarn = (barn: IBarnMedISøknad): IBarnMedISøknad => {
        const barnMedSammeForelder = søknad.barnInkludertISøknaden.find(
            barn => barn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
        );

        return {
            ...barn,
            idNummer: idNummerFelterForBarn.map(felt => ({
                land: felt.id.split(idNummerKeyPrefix)[1] as Alpha3Code,
                idnummer:
                    trimWhiteSpace(felt.verdi) === '' ? AlternativtSvarForInput.UKJENT : felt.verdi,
            })),
            søkersSlektsforhold: {
                ...barn.søkersSlektsforhold,
                svar: søkersSlektsforhold.verdi,
            },
            søkersSlektsforholdSpesifisering: {
                ...barn.søkersSlektsforholdSpesifisering,
                svar: søkersSlektsforholdSpesifisering.erSynlig
                    ? søkersSlektsforholdSpesifisering.verdi
                    : '',
            },
            borMedAndreForelder: {
                ...barn.borMedAndreForelder,
                svar: borMedAndreForelder.verdi,
            },
            borMedOmsorgsperson: {
                ...barn.borMedOmsorgsperson,
                svar: borMedOmsorgsperson.erSynlig ? borMedOmsorgsperson.verdi : null,
            },
            adresse: {
                ...barn.adresse,
                svar: trimWhiteSpace(
                    svarForSpørsmålMedUkjent(barnetsAdresseVetIkke, barnetsAdresse)
                ),
            },
            omsorgsperson: borMedOmsorgsperson.verdi === ESvar.JA ? genererOmsorgsperson() : null,
            ...(!!barn.andreForelder &&
                !barnMedSammeForelder &&
                genererAndreForelder(barn.andreForelder)),
        };
    };

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] =
            søknad.barnInkludertISøknaden.map(barn => {
                if (barn === gjeldendeBarn) {
                    return genererOppdatertBarn(gjeldendeBarn);
                } else {
                    const barnSkalOppdatereEnAnnensForelder =
                        barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar ===
                        gjeldendeBarn.id;
                    return !!barn.andreForelder && barnSkalOppdatereEnAnnensForelder
                        ? { ...barn, ...genererAndreForelder(barn.andreForelder) }
                        : barn;
                }
            });

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IEøsForBarnFeltTyper,
        string
    >({
        felter: {
            ...idNummerFelterForBarn.reduce(
                (objekt, felt) => ({
                    ...objekt,
                    [felt.id]: felt,
                }),
                {}
            ),
            ...idNummerFelterForAndreForelder.reduce(
                (objekt, felt) => ({
                    ...objekt,
                    [felt.id]: felt,
                }),
                {}
            ),
            andreForelderPensjonNorge,
            andreForelderPensjonsperioderNorge,
            andreForelderAndreUtbetalinger,
            andreForelderAndreUtbetalingsperioder,
            andreForelderArbeidNorge,
            andreForelderArbeidsperioderNorge,
            andreForelderBarnetrygdFraEøs,
            andreForelderEøsBarnetrygdperioder,
            andreForelderAdresse,
            andreForelderAdresseVetIkke,
            søkersSlektsforhold,
            søkersSlektsforholdSpesifisering,
            borMedAndreForelder,
            omsorgspersonNavn,
            omsorgspersonSlektsforhold,
            omsorgpersonSlektsforholdSpesifisering,
            omsorgspersonIdNummer,
            omsorgspersonIdNummerVetIkke,
            omsorgspersonAdresse,
            omsorgspersonArbeidUtland,
            omsorgspersonArbeidsperioderUtland,
            omsorgspersonArbeidNorge,
            omsorgspersonArbeidsperioderNorge,
            omsorgspersonPensjonUtland,
            omsorgspersonPensjonsperioderUtland,
            omsorgspersonPensjonNorge,
            omsorgspersonPensjonsperioderNorge,
            barnetsAdresse,
            barnetsAdresseVetIkke,
            borMedOmsorgsperson,
        },
        skjemanavn: 'eøsForBarn',
    });

    return {
        skjema,
        barn: gjeldendeBarn,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        validerAlleSynligeFelter,
        oppdaterSøknad,
        leggTilPensjonsperiodeNorgeAndreForelder,
        fjernPensjonsperiodeNorgeAndreForelder,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        leggTilArbeidsperiodeNorgeAndreForelder,
        fjernArbeidsperiodeNorgeAndreForelder,
        leggTilBarnetrygdsperiodeAndreForelder,
        fjernBarnetrygdsperiodeAndreForelder,
        settIdNummerFelterForBarn,
        idNummerFelterForBarn,
        idNummerFelterForAndreForelder,
        settIdNummerFelterForAndreForelder,
        leggTilArbeidsperiodeUtlandOmsorgsperson,
        fjernArbeidsperiodeUtlandOmsorgsperson,
        leggTilArbeidsperiodeNorgeOmsorgsperson,
        fjernArbeidsperiodeNorgeOmsorgsperson,
        leggTilPensjonsperiodeUtlandOmsorgsperson,
        fjernPensjonsperiodeUtlandOmsorgsperson,
        leggTilPensjonsperiodeNorgeOmsorgsperson,
        fjernPensjonsperiodeNorgeOmsorgsperson,
    };
};
