import React, { useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    DatoMedUkjent,
    IBarnMedISøknad,
} from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId } from './spørsmål';
import useDatovelgerFelt from './useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from './useDatovelgerFeltMedUkjent';
import useInputFeltMedUkjent from './useInputFeltMedUkjent';
import useLanddropdownFelt from './useLanddropdownFelt';

export interface IOmBarnetUtvidetFeltTyper {
    institusjonsnavn: string;
    institusjonsadresse: string;
    institusjonspostnummer: string;
    institusjonOppholdStartdato: ISODateString;
    institusjonOppholdSluttdato: DatoMedUkjent;
    institusjonOppholdSluttVetIkke: ESvar;
    oppholdsland: Alpha3Code | '';
    oppholdslandStartdato: ISODateString;
    oppholdslandSluttdato: DatoMedUkjent;
    oppholdslandSluttDatoVetIkke: ESvar;
    nårKomBarnTilNorgeDato: ISODateString;
    planleggerÅBoINorge12Mnd: ESvar | undefined;
    barnetrygdFraEøslandHvilketLand: Alpha3Code | '';
    andreForelderNavn: string;
    andreForelderNavnUkjent: ESvar;
    andreForelderFnr: string;
    andreForelderFnrUkjent: ESvar;
    andreForelderFødselsdatoUkjent: ESvar;
    andreForelderFødselsdato: DatoMedUkjent;
    andreForelderArbeidUtlandet: ESvar | undefined;
    andreForelderArbeidUtlandetHvilketLand: Alpha3Code | '';
    andreForelderPensjonUtland: ESvar | undefined;
    andreForelderPensjonHvilketLand: Alpha3Code | '';
}

export const useOmBarnet = (
    barnetsIdent: string
): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    barn: IBarnMedISøknad;
} => {
    const { søknad, settSøknad } = useApp();

    const [barn] = useState(
        søknad.barnInkludertISøknaden.find(barn => barn.ident === barnetsIdent)
    );

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const skalFeltetVises = (søknadsdataFelt: barnDataKeySpørsmål) => {
        return barn[søknadsdataFelt].svar === ESvar.JA;
    };

    /*---INSTITUSJON---*/

    const institusjonsnavn = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonsnavn].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonsnavn].id,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.navn.feilmelding'} />),
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonsadresse = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonsadresse].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonsadresse].id,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.adresse.feilmelding'} />),
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonspostnummer].id,
        valideringsfunksjon: felt =>
            felt.verdi?.length === 4 && Number.parseInt(felt.verdi)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.postnummer.feilmelding'} />),
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonOppholdStartdato = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
        institusjonOppholdSluttVetIkke,
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    /*---UTENLANDSOPPHOLD---*/

    const oppholdsland = useLanddropdownFelt(
        barn[barnDataKeySpørsmål.oppholdsland],
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIUtland)
    );

    const oppholdslandStartdato = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.oppholdslandStartdato],
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIUtland)
    );

    const oppholdslandSluttDatoVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.oppholdslandSluttdato].svar === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.oppholdslandSluttDatoVetIkke,
    });

    const oppholdslandSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.oppholdslandSluttdato],
        oppholdslandSluttDatoVetIkke,
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIUtland)
    );

    /*---BODD SAMMENHENGENDE I NORGE---*/

    const nårKomBarnTilNorgeDato = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato],
        skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge)
    );

    const planleggerÅBoINorge12Mnd = useFelt<ESvar | undefined>({
        feltId: barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].id,
        verdi: barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.mangler-svar.feilmelding'} />);
        },
        skalFeltetVises: () => {
            return skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge);
        },
        nullstillVedAvhengighetEndring: false,
    });

    /*--- MOTTAR BARNETRYFD FRA ANNET EØSLAND ---*/

    const barnetrygdFraEøslandHvilketLand = useLanddropdownFelt(
        barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand],
        skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland)
    );

    /*--- ANDRE FORELDER ---*/
    const andreForelderNavnUkjent = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.andreForelderNavn].svar === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.andreForelderNavnUkjent,
    });
    const andreForelderNavn = useInputFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderNavn],
        andreForelderNavnUkjent,
        'ombarnet.andre-forelder.navn.feilmelding'
    );

    const andreForelderFnrUkjent = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.andreForelderFnr].svar === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.andreForelderFnrUkjent,
    });
    const andreForelderFnr = useInputFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderFnr],
        andreForelderFnrUkjent,
        'ombarnet.andre-forelder.fnr.feilmelding',
        true
    );

    const andreForelderFødselsdatoUkjent = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.andreForelderFnrUkjent &&
                avhengigheter.andreForelderFnrUkjent.verdi === ESvar.JA
            );
        },
        avhengigheter: { andreForelderFnrUkjent },
        nullstillVedAvhengighetEndring: false,
    });
    const andreForelderFødselsdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderFødselsdato],
        andreForelderFødselsdatoUkjent,
        andreForelderFnrUkjent.verdi === ESvar.JA
    );

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.andreForelderArbeidUtlandet]
    );

    const andreForelderArbeidUtlandetHvilketLand = useLanddropdownFelt(
        barn[barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand],
        skalFeltetVises(barnDataKeySpørsmål.andreForelderArbeidUtlandet)
    );

    const andreForelderPensjonUtland = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.andreForelderPensjonUtland]
    );

    const andreForelderPensjonHvilketLand = useLanddropdownFelt(
        barn[barnDataKeySpørsmål.andreForelderPensjonHvilketLand],
        skalFeltetVises(barnDataKeySpørsmål.andreForelderPensjonUtland)
    );

    const { kanSendeSkjema, skjema, valideringErOk } = useSkjema<IOmBarnetUtvidetFeltTyper, string>(
        {
            felter: {
                institusjonsnavn,
                institusjonsadresse,
                institusjonspostnummer,
                institusjonOppholdStartdato,
                institusjonOppholdSluttdato,
                institusjonOppholdSluttVetIkke,
                oppholdsland,
                oppholdslandStartdato,
                oppholdslandSluttdato,
                oppholdslandSluttDatoVetIkke,
                nårKomBarnTilNorgeDato,
                planleggerÅBoINorge12Mnd,
                barnetrygdFraEøslandHvilketLand,
                andreForelderNavn,
                andreForelderNavnUkjent,
                andreForelderFnr,
                andreForelderFnrUkjent,
                andreForelderFødselsdato,
                andreForelderFødselsdatoUkjent,
                andreForelderArbeidUtlandet,
                andreForelderArbeidUtlandetHvilketLand,
                andreForelderPensjonUtland,
                andreForelderPensjonHvilketLand,
            },
            skjemanavn: 'om-barnet',
        }
    );

    const svarForSpørsmålMedVetIkke = (
        vetIkkeFelt: Felt<ESvar>,
        spørsmålFelt: Felt<string>
    ): string => {
        return vetIkkeFelt.verdi === ESvar.JA ? AlternativtSvarForInput.UKJENT : spørsmålFelt.verdi;
    };

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] = søknad.barnInkludertISøknaden.map(
            barn =>
                barn.ident === barnetsIdent
                    ? {
                          ...barn,
                          institusjonsnavn: {
                              ...barn.institusjonsnavn,
                              svar: institusjonsnavn.verdi,
                          },
                          institusjonsadresse: {
                              ...barn.institusjonsadresse,
                              svar: institusjonsadresse.verdi,
                          },
                          institusjonspostnummer: {
                              ...barn.institusjonspostnummer,
                              svar: institusjonspostnummer.verdi,
                          },
                          institusjonOppholdStartdato: {
                              ...barn.institusjonOppholdStartdato,
                              svar: institusjonOppholdStartdato.verdi,
                          },
                          institusjonOppholdSluttdato: {
                              ...barn.institusjonOppholdSluttdato,
                              svar: svarForSpørsmålMedVetIkke(
                                  institusjonOppholdSluttVetIkke,
                                  institusjonOppholdSluttdato
                              ),
                          },
                          oppholdsland: {
                              ...barn.oppholdsland,
                              svar: oppholdsland.verdi,
                          },
                          oppholdslandStartdato: {
                              ...barn.oppholdslandStartdato,
                              svar: oppholdslandStartdato.verdi,
                          },
                          oppholdslandSluttdato: {
                              ...barn.oppholdslandSluttdato,
                              svar: svarForSpørsmålMedVetIkke(
                                  oppholdslandSluttDatoVetIkke,
                                  oppholdslandSluttdato
                              ),
                          },
                          nårKomBarnTilNorgeDato: {
                              ...barn.nårKomBarnTilNorgeDato,
                              svar: nårKomBarnTilNorgeDato.verdi,
                          },
                          planleggerÅBoINorge12Mnd: {
                              ...barn.planleggerÅBoINorge12Mnd,
                              svar: planleggerÅBoINorge12Mnd.verdi,
                          },
                          barnetrygdFraEøslandHvilketLand: {
                              ...barn.barnetrygdFraEøslandHvilketLand,
                              svar: barnetrygdFraEøslandHvilketLand.verdi,
                          },
                          andreForelderNavn: {
                              ...barn.andreForelderNavn,
                              svar: svarForSpørsmålMedVetIkke(
                                  andreForelderNavnUkjent,
                                  andreForelderNavn
                              ),
                          },
                          andreForelderFnr: {
                              ...barn.andreForelderFnr,
                              svar: svarForSpørsmålMedVetIkke(
                                  andreForelderFnrUkjent,
                                  andreForelderFnr
                              ),
                          },
                          andreForelderFødselsdato: {
                              ...barn.andreForelderFødselsdato,
                              svar: svarForSpørsmålMedVetIkke(
                                  andreForelderFødselsdatoUkjent,
                                  andreForelderFødselsdato
                              ),
                          },
                          andreForelderArbeidUtlandet: {
                              ...barn.andreForelderArbeidUtlandet,
                              svar: andreForelderArbeidUtlandet.verdi,
                          },
                          andreForelderArbeidUtlandetHvilketLand: {
                              ...barn.andreForelderArbeidUtlandetHvilketLand,
                              svar: andreForelderArbeidUtlandetHvilketLand.verdi,
                          },
                          andreForelderPensjonUtland: {
                              ...barn.andreForelderPensjonUtland,
                              svar: andreForelderPensjonUtland.verdi,
                          },
                          andreForelderPensjonHvilketLand: {
                              ...barn.andreForelderPensjonHvilketLand,
                              svar: andreForelderPensjonHvilketLand.verdi,
                          },
                      }
                    : barn
        );

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
        });
    };

    return {
        oppdaterSøknad,
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        barn,
    };
};
