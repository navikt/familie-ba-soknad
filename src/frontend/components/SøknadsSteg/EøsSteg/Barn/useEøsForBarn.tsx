import React, { Dispatch, SetStateAction, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

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
import { IArbeidsperiode, IPensjonsperiode, IUtbetalingsperiode } from '../../../../typer/perioder';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { valideringAdresse } from '../../../../utils/adresse';
import {
    barnetsNavnValue,
    skalSkjuleAndreForelderFelt,
    skalViseBorMedOmsorgsperson,
} from '../../../../utils/barn';
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
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    fjernAndreUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    settIdNummerFelterForBarn: Dispatch<SetStateAction<Felt<string>[]>>;
    idNummerFelterForBarn: Felt<string>[];
    idNummerFelterForAndreForelder: Felt<string>[];
    settIdNummerFelterForAndreForelder: Dispatch<SetStateAction<Felt<string>[]>>;
} => {
    const { søknad, settSøknad } = useApp();
    const intl = useIntl();

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
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
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
                              barn: barnetsNavnValue(gjeldendeBarn, intl),
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
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
        nullstillVedAvhengighetEndring: true,
        skalSkjules:
            gjeldendeBarn.erFosterbarn.svar === ESvar.JA ||
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA ||
            gjeldendeBarn.oppholderSegIInstitusjon.svar === ESvar.JA,
    });

    const borMedOmsorgsperson = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borMedOmsorgsperson],
        feilmeldingSpråkId: 'eøs-om-barn.bormedannenomsorgsperson.feilmelding',
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
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
                              barn: barnetsNavnValue(gjeldendeBarn, intl),
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
        skalFeltetVises: avhengigheter => avhengigheter.borMedOmsorgsperson.verdi === ESvar.JA,
        avhengigheter: { borMedOmsorgsperson },
        nullstillVedAvhengighetEndring: false,
    });

    const omsorgpersonSlektsforholdSpesifisering = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.slektsforholdSpesifisering,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonrelasjon.feilmelding',
        feilmeldingSpråkVerdier: {
            barn: barnetsNavnValue(gjeldendeBarn, intl),
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
                              barn: barnetsNavnValue(gjeldendeBarn, intl),
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
                              barn: barnetsNavnValue(gjeldendeBarn, intl),
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
            barn: barnetsNavnValue(gjeldendeBarn, intl),
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
        språkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
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
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
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
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
        skalSkjules: skalSkjuleAndreForelderFelt(gjeldendeBarn),
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
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
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
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

    const genererAndreForelder = (andreForelder: IAndreForelder) => ({
        andreForelder: {
            ...andreForelder,
            pensjonNorge: {
                ...andreForelder[andreForelderDataKeySpørsmål.pensjonNorge],
                svar: andreForelderPensjonNorge.verdi,
            },
            pensjonsperioderNorge:
                andreForelderPensjonNorge.verdi === ESvar.JA
                    ? skjema.felter.andreForelderPensjonsperioderNorge.verdi
                    : [],
            andreUtbetalinger: {
                ...andreForelder[andreForelderDataKeySpørsmål.andreUtbetalinger],
                svar: andreForelderAndreUtbetalinger.verdi,
            },
            andreUtbetalingsperioder:
                andreForelderAndreUtbetalinger.verdi === ESvar.JA
                    ? skjema.felter.andreForelderAndreUtbetalingsperioder.verdi
                    : [],
            arbeidNorge: {
                ...andreForelder[andreForelderDataKeySpørsmål.arbeidNorge],
                svar: andreForelderArbeidNorge.verdi,
            },
            arbeidsperioderNorge:
                andreForelderArbeidNorge.verdi === ESvar.JA
                    ? skjema.felter.andreForelderArbeidsperioderNorge.verdi
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
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        settIdNummerFelterForBarn,
        idNummerFelterForBarn,
        idNummerFelterForAndreForelder,
        settIdNummerFelterForAndreForelder,
    };
};
