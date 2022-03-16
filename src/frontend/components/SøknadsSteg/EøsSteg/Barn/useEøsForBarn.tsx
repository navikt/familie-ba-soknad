import React, { useState } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

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
    IOmsorgsperson,
} from '../../../../typer/barn';
import { BarnetsId } from '../../../../typer/common';
import { Slektsforhold } from '../../../../typer/kontrakt/barn';
import { IArbeidsperiode, IPensjonsperiode, IUtbetalingsperiode } from '../../../../typer/perioder';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { barnetsNavnValue, skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { trimWhiteSpace } from '../../../../utils/hjelpefunksjoner';
import { formaterVerdiForCheckbox } from '../../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../../utils/spørsmål';
import { arbeidsperiodeFeilmelding } from '../../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { pensjonsperiodeFeilmelding } from '../../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
} => {
    const { søknad, settSøknad } = useApp();
    const intl = useIntl();

    const [gjeldendeBarn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid)
    );

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
        skalSkjules: !(
            gjeldendeBarn.borFastMedSøker.svar === ESvar.NEI &&
            gjeldendeBarn.andreForelderErDød.svar === ESvar.NEI &&
            gjeldendeBarn.oppholderSegIInstitusjon.svar === ESvar.NEI
        ),
    });

    const omsorgspersonNavn = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.omsorgspersonNavn,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonnavn.feilmelding',
        skalVises: borMedAndreForelder.verdi === ESvar.NEI,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[A-Za-z\s\-\\,\\.]{1,60}$/)
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
        nullstillVedAvhengighetEndring: true,
    });

    const omsorgspersonSlektsforhold = useFelt<Slektsforhold | ''>({
        feltId: omsorgsperson?.omsorgspersonSlektsforhold.id,
        verdi: omsorgsperson?.omsorgspersonSlektsforhold.svar ?? '',
        valideringsfunksjon: (felt: FeltState<Slektsforhold | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.velgslektsforhold.feilmelding'} />);
        },
        skalFeltetVises: avhengigheter => avhengigheter.borMedAndreForelder.verdi === ESvar.NEI,
        avhengigheter: { borMedAndreForelder },
    });

    const omsorgpersonSlektsforholdSpesifisering = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.omsorgpersonSlektsforholdSpesifisering,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonrelasjon.feilmelding',
        feilmeldingSpråkVerdier: {
            barn: barnetsNavnValue(gjeldendeBarn, intl),
        },
        skalVises: omsorgspersonSlektsforhold.verdi === Slektsforhold.ANNEN_RELASJON,
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

    const omsorgspersonIdNummerVetIkke = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(omsorgsperson?.omsorgspersonIdNummer.svar),
        feltId: EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke,
        skalFeltetVises: avhengigheter => avhengigheter.borMedAndreForelder.verdi === ESvar.NEI,
        avhengigheter: { borMedAndreForelder },
    });

    const omsorgspersonIdNummer = useInputFeltMedUkjent({
        søknadsfelt: omsorgsperson && omsorgsperson.omsorgspersonIdNummer,
        avhengighet: omsorgspersonIdNummerVetIkke,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonidnummer.feilmelding',
        skalVises: borMedAndreForelder.verdi === ESvar.NEI,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[0-9A-Za-z\s\-.\\/]{4,20}$/)
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
    });

    const omsorgspersonAdresse = useInputFelt({
        søknadsfelt: omsorgsperson && omsorgsperson.omsorgspersonAdresse,
        feilmeldingSpråkId: 'eøs-om-barn.annenomsorgspersonoppholdssted.feilmelding',
        skalVises: borMedAndreForelder.verdi === ESvar.NEI,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            return verdi.match(/^[A-Za-z\s\-\\,\\.]{1,60}$/)
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
        nullstillVedAvhengighetEndring: true,
    });

    /*--- ANDRE FORELDER ---*/

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
        },
    });

    const genererOmsorgsperson = (omsorgsperson: IOmsorgsperson) => ({
        omsorgsperson: {
            ...omsorgsperson,
            omsorgspersonNavn: {
                ...omsorgsperson.omsorgspersonNavn,
                svar: omsorgspersonNavn.verdi,
            },
            omsorgspersonSlektsforhold: {
                ...omsorgsperson.omsorgspersonSlektsforhold,
                svar: omsorgspersonSlektsforhold.verdi,
            },
            omsorgpersonSlektsforholdSpesifisering: {
                ...omsorgsperson.omsorgpersonSlektsforholdSpesifisering,
                svar: omsorgpersonSlektsforholdSpesifisering.verdi,
            },
            omsorgspersonIdNummer: {
                ...omsorgsperson.omsorgspersonIdNummer,
                svar: svarForSpørsmålMedUkjent(omsorgspersonIdNummerVetIkke, omsorgspersonIdNummer),
            },
            omsorgspersonAdresse: {
                ...omsorgsperson.omsorgspersonAdresse,
                svar: omsorgspersonAdresse.verdi,
            },
        },
    });

    const genererOppdatertBarn = (barn: IBarnMedISøknad): IBarnMedISøknad => {
        const barnMedSammeForelder = søknad.barnInkludertISøknaden.find(
            barn => barn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
        );

        return {
            ...barn,
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
            ...(!!barn.andreForelder &&
                !barnMedSammeForelder &&
                genererAndreForelder(barn.andreForelder)),
            ...(!!barn.omsorgsperson && genererOmsorgsperson(barn.omsorgsperson)),
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
            andreForelderPensjonNorge,
            andreForelderPensjonsperioderNorge,
            andreForelderAndreUtbetalinger,
            andreForelderAndreUtbetalingsperioder,
            andreForelderArbeidNorge,
            andreForelderArbeidsperioderNorge,
            søkersSlektsforhold,
            søkersSlektsforholdSpesifisering,
            borMedAndreForelder,
            omsorgspersonNavn,
            omsorgspersonSlektsforhold,
            omsorgpersonSlektsforholdSpesifisering,
            omsorgspersonIdNummer,
            omsorgspersonIdNummerVetIkke,
            omsorgspersonAdresse,
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
    };
};
