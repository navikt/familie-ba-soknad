import React, { useEffect, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useLocation } from 'react-router-dom';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import {
    feil,
    Felt,
    FeltState,
    ISkjema,
    ok,
    useFelt,
    useSkjema,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useRoutes } from '../../../context/RoutesContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { Dokumentasjonsbehov, IDokumentasjon } from '../../../typer/dokumentasjon';
import { ILokasjon } from '../../../typer/lokasjon';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    DatoMedUkjent,
    IBarnMedISøknad,
} from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import useLanddropdownFeltMedJaNeiAvhengighet from '../OmDeg/useLanddropdownFeltMedJaNeiAvhengighet';
import { ANNEN_FORELDER } from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId } from './spørsmål';
import useDatovelgerFelt from './useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from './useDatovelgerFeltMedUkjent';
import useInputFeltMedUkjent from './useInputFeltMedUkjent';
import useLanddropdownFelt from './useLanddropdownFelt';
import { formaterInitVerdiForInputMedUkjent, formaterVerdiForCheckbox } from './utils';

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
    planleggerÅBoINorge12Mnd: ESvar | null;
    barnetrygdFraEøslandHvilketLand: Alpha3Code | '';
    andreForelderNavn: string;
    andreForelderNavnUkjent: ESvar;
    andreForelderFnr: string;
    andreForelderFnrUkjent: ESvar;
    andreForelderFødselsdatoUkjent: ESvar;
    andreForelderFødselsdato: DatoMedUkjent;
    andreForelderArbeidUtlandet: ESvar | null;
    andreForelderArbeidUtlandetHvilketLand: Alpha3Code | '';
    andreForelderPensjonUtland: ESvar | null;
    andreForelderPensjonHvilketLand: Alpha3Code | '';
    borFastMedSøker: ESvar | null;
    skriftligAvtaleOmDeltBosted: ESvar | null;
    søkerForTidsromCheckbox: ESvar;
    søkerForTidsromStartdato: ISODateString;
    søkerForTidsromSluttdato: ISODateString;
    sammeForelderSomAnnetBarn: string | null;
}

export const useOmBarnet = (
    barnetsIdent: string
): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    barn: IBarnMedISøknad | undefined;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    settSammeForelder: (radioVerdi: string) => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad, erStegUtfyltFrafør } = useApp();
    const { hentRouteIndex } = useRoutes();
    const location = useLocation<ILokasjon>();

    const [barn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.ident === barnetsIdent)
    );

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const skalFeltetVises = (søknadsdataFelt: barnDataKeySpørsmål) => {
        return barn[søknadsdataFelt].svar === ESvar.JA;
    };

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad => barnISøknad.barnErFyltUt && barnISøknad.id !== barn.id
    );

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
        barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].id,
        barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar !==
            AlternativtSvarForInput.UKJENT
            ? barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar
            : '',
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
        barn[barnDataKeySpørsmål.oppholdslandSluttdato].id,
        barn[barnDataKeySpørsmål.oppholdslandSluttdato].svar !== AlternativtSvarForInput.UKJENT
            ? barn[barnDataKeySpørsmål.oppholdslandSluttdato].svar
            : '',
        oppholdslandSluttDatoVetIkke,
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIUtland)
    );

    /*---BODD SAMMENHENGENDE I NORGE---*/

    const nårKomBarnTilNorgeDato = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato],
        skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge)
    );

    const planleggerÅBoINorge12Mnd = useFelt<ESvar | null>({
        feltId: barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].id,
        verdi: barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            return felt.verdi !== null
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
    const sammeForelderSomAnnetBarn = useFelt<string | null>({
        feltId: 'sammeForelderSomAnnetBarn',
        verdi: null,
        valideringsfunksjon: (felt: FeltState<string | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.mangler-svar.feilmelding'} />);
        },
        skalFeltetVises: () => !barn.barnErFyltUt && andreBarnSomErFyltUt.length > 0,
    });

    const andreForelderNavnUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderNavn].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderNavnUkjent,
    });
    const andreForelderNavn = useInputFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderNavn],
        andreForelderNavnUkjent,
        'ombarnet.andre-forelder.navn.feilmelding',
        false
    );

    const andreForelderFnrUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderFnr].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFnrUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.andreForelderNavnUkjent &&
                avhengigheter.andreForelderNavnUkjent.verdi === ESvar.NEI
            );
        },
        avhengigheter: { andreForelderNavnUkjent },
        nullstillVedAvhengighetEndring: false,
    });

    const andreForelderFnr = useInputFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderFnr],
        andreForelderFnrUkjent,
        'ombarnet.andre-forelder.fnr.feilmelding',
        true,
        andreForelderNavnUkjent.verdi === ESvar.NEI
    );

    const andreForelderFødselsdatoUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.andreForelderFnrUkjent &&
                avhengigheter.andreForelderFnrUkjent.verdi === ESvar.JA &&
                avhengigheter.andreForelderNavnUkjent.verdi === ESvar.NEI
            );
        },
        avhengigheter: { andreForelderFnrUkjent, andreForelderNavnUkjent },
        nullstillVedAvhengighetEndring: false,
    });
    const andreForelderFødselsdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderFødselsdato].id,
        formaterInitVerdiForInputMedUkjent(barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar),
        andreForelderFødselsdatoUkjent,
        andreForelderFnrUkjent.verdi === ESvar.JA && andreForelderNavnUkjent.verdi === ESvar.NEI,
        sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER
    );

    useEffect(() => {
        if (andreForelderNavnUkjent.verdi === ESvar.JA) {
            andreForelderFnr.validerOgSettFelt('');
            andreForelderFnrUkjent.validerOgSettFelt(ESvar.NEI);
            andreForelderFødselsdato.validerOgSettFelt('');
            andreForelderFødselsdatoUkjent.validerOgSettFelt(ESvar.NEI);
        }
    }, [andreForelderNavnUkjent.verdi]);

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.andreForelderArbeidUtlandet],
        {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderNavnUkjent.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        }
    );

    const andreForelderArbeidUtlandetHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet(
        barn.andreForelderArbeidUtlandetHvilketLand,
        ESvar.JA,
        andreForelderArbeidUtlandet,
        sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER
    );

    const andreForelderPensjonUtland = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.andreForelderPensjonUtland],
        {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderNavnUkjent.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        }
    );

    const andreForelderPensjonHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet(
        barn.andreForelderPensjonHvilketLand,
        ESvar.JA,
        andreForelderPensjonUtland,
        sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER
    );

    const settSammeForelder = (radioVerdi: string) => {
        const annetBarn = søknad.barnInkludertISøknaden.find(barn => barn.id === radioVerdi);
        if (annetBarn) {
            andreForelderNavn.validerOgSettFelt(
                formaterInitVerdiForInputMedUkjent(annetBarn.andreForelderNavn.svar)
            );
            andreForelderFnr.validerOgSettFelt(
                formaterInitVerdiForInputMedUkjent(annetBarn.andreForelderFnr.svar)
            );
            andreForelderNavnUkjent.validerOgSettFelt(
                formaterVerdiForCheckbox(annetBarn.andreForelderNavn.svar)
            );
            andreForelderFnrUkjent.validerOgSettFelt(
                formaterVerdiForCheckbox(annetBarn.andreForelderFnr.svar)
            );

            andreForelderFødselsdato.validerOgSettFelt(
                formaterInitVerdiForInputMedUkjent(annetBarn.andreForelderFødselsdato.svar)
            );
            andreForelderFødselsdatoUkjent.validerOgSettFelt(
                formaterVerdiForCheckbox(annetBarn.andreForelderFødselsdato.svar)
            );

            andreForelderArbeidUtlandet.validerOgSettFelt(
                annetBarn.andreForelderArbeidUtlandet.svar
            );
            andreForelderArbeidUtlandetHvilketLand.validerOgSettFelt(
                annetBarn.andreForelderArbeidUtlandetHvilketLand.svar
            );
            andreForelderPensjonUtland.validerOgSettFelt(annetBarn.andreForelderPensjonUtland.svar);
            andreForelderPensjonHvilketLand.validerOgSettFelt(
                annetBarn.andreForelderPensjonHvilketLand.svar
            );
        } else {
            nullstillAndreForelderFelter();
        }
    };

    const nullstillAndreForelderFelter = () => {
        andreForelderNavn.validerOgSettFelt('');
        andreForelderNavnUkjent.validerOgSettFelt(ESvar.NEI);
        andreForelderFnr.validerOgSettFelt('');
        andreForelderFnrUkjent.validerOgSettFelt(ESvar.NEI);
        andreForelderFødselsdato.validerOgSettFelt('');
        andreForelderFødselsdatoUkjent.validerOgSettFelt(ESvar.NEI);
        andreForelderArbeidUtlandet.validerOgSettFelt(null);
        andreForelderArbeidUtlandetHvilketLand.validerOgSettFelt('');
        andreForelderPensjonUtland.validerOgSettFelt(null);
        andreForelderPensjonHvilketLand.validerOgSettFelt('');
    };

    /*--- BOSTED ---*/

    const borFastMedSøker = useJaNeiSpmFelt(barn[barnDataKeySpørsmål.borFastMedSøker], {
        andreForelderArbeidUtlandet: {
            hovedSpørsmål: andreForelderArbeidUtlandet,
            tilhørendeFelter: [andreForelderArbeidUtlandetHvilketLand],
        },
        andreForelderPensjonUtland: {
            hovedSpørsmål: andreForelderPensjonUtland,
            tilhørendeFelter: [andreForelderPensjonHvilketLand],
        },
    });

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        {
            andreForelderArbeidUtlandet: {
                hovedSpørsmål: andreForelderArbeidUtlandet,
                tilhørendeFelter: [andreForelderArbeidUtlandetHvilketLand],
            },
            andreForelderPensjonUtland: {
                hovedSpørsmål: andreForelderPensjonUtland,
                tilhørendeFelter: [andreForelderPensjonHvilketLand],
            },
        }
    );

    /*--- SØKER FOR PERIODE ---*/

    const stegErFyltUt = erStegUtfyltFrafør(hentRouteIndex(location.pathname));
    const søkerForTidsromCheckbox = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar ===
                AlternativtSvarForInput.UKJENT &&
            barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar ===
                AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.søkerIkkeForTidsrom,
        skalFeltetVises: avhengigheter =>
            stegErFyltUt ||
            (avhengigheter &&
                avhengigheter.skriftligAvtaleOmDeltBosted &&
                avhengigheter.borFastMedSøker &&
                avhengigheter.skriftligAvtaleOmDeltBosted.valideringsstatus ===
                    Valideringsstatus.OK &&
                avhengigheter.borFastMedSøker.valideringsstatus === Valideringsstatus.OK),
        avhengigheter: { skriftligAvtaleOmDeltBosted, borFastMedSøker },
        nullstillVedAvhengighetEndring: false,
    });

    const søkerForTidsromStartdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.søkerForTidsromStartdato].id,
        barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar === AlternativtSvarForInput.UKJENT
            ? ''
            : barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar,
        søkerForTidsromCheckbox,
        stegErFyltUt ||
            (borFastMedSøker.valideringsstatus === Valideringsstatus.OK &&
                skriftligAvtaleOmDeltBosted.valideringsstatus === Valideringsstatus.OK)
    );
    const søkerForTidsromSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].id,
        barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar === AlternativtSvarForInput.UKJENT
            ? ''
            : barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar,
        søkerForTidsromCheckbox,
        stegErFyltUt ||
            (borFastMedSøker.valideringsstatus === Valideringsstatus.OK &&
                skriftligAvtaleOmDeltBosted.valideringsstatus === Valideringsstatus.OK)
    );

    const { kanSendeSkjema, skjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnetUtvidetFeltTyper,
        string
    >({
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
            borFastMedSøker,
            skriftligAvtaleOmDeltBosted,
            søkerForTidsromCheckbox,
            søkerForTidsromStartdato,
            søkerForTidsromSluttdato,
            sammeForelderSomAnnetBarn,
        },
        skjemanavn: `om-barnet-${barn.id}`,
    });

    const svarForSpørsmålMedUkjent = (
        vetIkkeFelt: Felt<ESvar>,
        spørsmålFelt: Felt<string>
    ): string => {
        return vetIkkeFelt.verdi === ESvar.JA ? AlternativtSvarForInput.UKJENT : spørsmålFelt.verdi;
    };

    const genererOppdatertDokumentasjon = (
        dokumentasjon: IDokumentasjon,
        kreverDokumentasjon,
        barnId: string
    ) => {
        let oppdatertDokumentasjon = dokumentasjon;
        if (kreverDokumentasjon) {
            if (!dokumentasjon.gjelderForBarnId.includes(barnId)) {
                oppdatertDokumentasjon = {
                    ...dokumentasjon,
                    gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].concat(barnId),
                };
            }
        } else {
            oppdatertDokumentasjon = {
                ...dokumentasjon,
                gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].filter(
                    id => id !== barnId
                ),
            };
        }

        return oppdatertDokumentasjon;
    };

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] = søknad.barnInkludertISøknaden.map(
            barn =>
                barn.ident === barnetsIdent
                    ? {
                          ...barn,
                          barnErFyltUt: true,
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
                              svar: svarForSpørsmålMedUkjent(
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
                              svar: svarForSpørsmålMedUkjent(
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
                              svar: svarForSpørsmålMedUkjent(
                                  andreForelderNavnUkjent,
                                  andreForelderNavn
                              ),
                          },
                          andreForelderFnr: {
                              ...barn.andreForelderFnr,
                              svar: svarForSpørsmålMedUkjent(
                                  andreForelderFnrUkjent,
                                  andreForelderFnr
                              ),
                          },
                          andreForelderFødselsdato: {
                              ...barn.andreForelderFødselsdato,
                              svar: svarForSpørsmålMedUkjent(
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
                          borFastMedSøker: {
                              ...barn.borFastMedSøker,
                              svar: borFastMedSøker.verdi,
                          },
                          skriftligAvtaleOmDeltBosted: {
                              ...barn.skriftligAvtaleOmDeltBosted,
                              svar: skriftligAvtaleOmDeltBosted.verdi,
                          },
                          søkerForTidsromStartdato: {
                              ...barn.søkerForTidsromStartdato,
                              svar: svarForSpørsmålMedUkjent(
                                  søkerForTidsromCheckbox,
                                  søkerForTidsromStartdato
                              ),
                          },
                          søkerForTidsromSluttdato: {
                              ...barn.søkerForTidsromSluttdato,
                              svar: svarForSpørsmålMedUkjent(
                                  søkerForTidsromCheckbox,
                                  søkerForTidsromSluttdato
                              ),
                          },
                      }
                    : barn
        );

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
                        return genererOppdatertDokumentasjon(
                            dok,
                            skriftligAvtaleOmDeltBosted.verdi === ESvar.JA,
                            barn.id
                        );
                    case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
                        return genererOppdatertDokumentasjon(
                            dok,
                            borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker,
                            barn.id
                        );
                    default:
                        return dok;
                }
            }),
        });
    };
    return {
        oppdaterSøknad,
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        barn,
        andreBarnSomErFyltUt,
        settSammeForelder,
        validerAlleSynligeFelter,
    };
};
