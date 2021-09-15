import React, { useEffect, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useLocation } from 'react-router-dom';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import {
    feil,
    FeltState,
    ISkjema,
    ok,
    useFelt,
    useSkjema,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useRoutes } from '../../../context/RoutesContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { Dokumentasjonsbehov, IDokumentasjon } from '../../../typer/dokumentasjon';
import { ILokasjon } from '../../../typer/lokasjon';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    barnDataKeySpørsmålUtvidet,
    BarnetsId,
    DatoMedUkjent,
    IBarnMedISøknad,
} from '../../../typer/person';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import useLanddropdownFeltMedJaNeiAvhengighet from '../OmDeg/useLanddropdownFeltMedJaNeiAvhengighet';
import { ANNEN_FORELDER } from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId } from './spørsmål';
import useDatovelgerFelt from './useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from './useDatovelgerFeltMedUkjent';
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
    nårKomBarnTilNorgeDatoIkkeAnkommet: ESvar;
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
    søkerHarBoddMedAndreForelder: ESvar | null;
    borMedAndreForelderCheckbox: ESvar;
    søkerFlyttetFraAndreForelderDato: ISODateString;
}

export const useOmBarnet = (
    barnetsUuid: BarnetsId
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
    const { søknad, settSøknad, erStegUtfyltFrafør, erUtvidet } = useApp();
    const { hentRouteIndex } = useRoutes();
    const location = useLocation<ILokasjon>();

    const [barn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid)
    );

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const skalFeltetVises = (søknadsdataFelt: barnDataKeySpørsmål) => {
        return barn[søknadsdataFelt].svar === ESvar.JA;
    };

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt &&
            barnISøknad.id !== barn.id &&
            barnISøknad[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
    );

    useFørsteRender(() => {
        if (barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA) {
            nullstillAndreForelderFelter();
            skriftligAvtaleOmDeltBosted.validerOgSettFelt(null);
        }
    });

    /*---INSTITUSJON---*/

    const institusjonsnavn = useInputFelt(
        barn[barnDataKeySpørsmål.institusjonsnavn],
        'ombarnet.institusjon.navn.feilmelding',
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const institusjonsadresse = useInputFelt(
        barn[barnDataKeySpørsmål.institusjonsadresse],
        'ombarnet.institusjon.adresse.feilmelding',
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const institusjonspostnummer = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonspostnummer].id,
        valideringsfunksjon: felt =>
            felt.verdi.match(/^[0-9]{4}$/)
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
        'ombarnet.oppholdutland.land.feilmelding',
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
    const nårKomBarnTilNorgeDatoIkkeAnkommet = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].svar === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.nårKomBarnetTilNorgeIkkeAnkommet,
    });

    const nårKomBarnTilNorgeDato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].id,
        barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].svar !== AlternativtSvarForInput.UKJENT
            ? barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].svar
            : '',
        nårKomBarnTilNorgeDatoIkkeAnkommet,
        skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge)
    );

    const planleggerÅBoINorge12Mnd = useFelt<ESvar | null>({
        feltId: barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].id,
        verdi: barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst id={'ombarnet.planlagt-sammenhengende-opphold.feilmelding'} />
                  );
        },
        skalFeltetVises: () => {
            return skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge);
        },
        nullstillVedAvhengighetEndring: false,
    });

    /*--- MOTTAR BARNETRYFD FRA ANNET EØSLAND ---*/

    const barnetrygdFraEøslandHvilketLand = useLanddropdownFelt(
        barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand],
        'ombarnet.barnetrygd-eøs.land.feilmelding',
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
        skalFeltetVises: () =>
            !barn.barnErFyltUt &&
            barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI &&
            andreBarnSomErFyltUt.length > 0,
    });

    const andreForelderNavnUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderNavn].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderNavnUkjent,
        skalFeltetVises: () => barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI,
    });
    const andreForelderNavn = useInputFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderNavn],
        andreForelderNavnUkjent,
        'ombarnet.andre-forelder.navn.feilmelding',
        false,
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
    );

    const andreForelderFnrUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderFnr].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFnrUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI &&
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
        andreForelderNavnUkjent.verdi === ESvar.NEI &&
            barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
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
        'ombarnet.andre-forelder.arbeid-utland.feilmelding',
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
        },
        false,
        false,
        { navn: barn.navn }
    );

    const andreForelderArbeidUtlandetHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet(
        barn.andreForelderArbeidUtlandetHvilketLand,
        'ombarnet.andre-forelder.arbeid-utland.land.feilmelding',
        ESvar.JA,
        andreForelderArbeidUtlandet,
        sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER
    );

    const andreForelderPensjonUtland = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.andreForelderPensjonUtland],
        'ombarnet.andre-forelder.utenlandspensjon.feilmelding',
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
        },
        false,
        false,
        { navn: barn.navn }
    );

    const andreForelderPensjonHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet(
        barn.andreForelderPensjonHvilketLand,
        'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding',
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

    const avhengigheterForBosted = () => {
        return barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
            ? {
                  andreForelderArbeidUtlandet: {
                      hovedSpørsmål: andreForelderArbeidUtlandet,
                      tilhørendeFelter: [andreForelderArbeidUtlandetHvilketLand],
                  },
                  andreForelderPensjonUtland: {
                      hovedSpørsmål: andreForelderPensjonUtland,
                      tilhørendeFelter: [andreForelderPensjonHvilketLand],
                  },
              }
            : undefined;
    };

    const borFastMedSøker = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.borFastMedSøker],
        'ombarnet.bor-fast.feilmelding',
        avhengigheterForBosted(),
        false,
        false,
        { navn: barn.navn }
    );

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        'ombarnet.delt-bosted.feilmelding',
        avhengigheterForBosted(),
        false,
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA,
        { navn: barn.navn }
    );

    /*--- SØKER FOR PERIODE ---*/

    const stegErFyltUt = erStegUtfyltFrafør(hentRouteIndex(location.pathname));
    const tidsromSkalVises = (avhengigheter): boolean => {
        const avhengigheterEksisterer =
            avhengigheter &&
            avhengigheter.skriftligAvtaleOmDeltBosted &&
            avhengigheter.borFastMedSøker;
        const skriftligAvtaleValidert =
            avhengigheterEksisterer &&
            avhengigheter.skriftligAvtaleOmDeltBosted.valideringsstatus === Valideringsstatus.OK;
        const borFastMedSøkerValidert =
            avhengigheterEksisterer &&
            avhengigheter.borFastMedSøker.valideringsstatus === Valideringsstatus.OK;
        return (
            stegErFyltUt ||
            (borFastMedSøkerValidert &&
                (barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA ||
                    skriftligAvtaleValidert))
        );
    };
    const søkerForTidsromCheckbox = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar ===
                AlternativtSvarForInput.UKJENT &&
            barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar ===
                AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.søkerIkkeForTidsrom,
        skalFeltetVises: tidsromSkalVises,
        avhengigheter: { skriftligAvtaleOmDeltBosted, borFastMedSøker },
        nullstillVedAvhengighetEndring: false,
    });

    const søkerForTidsromStartdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.søkerForTidsromStartdato].id,
        barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar === AlternativtSvarForInput.UKJENT
            ? ''
            : barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar,
        søkerForTidsromCheckbox,
        tidsromSkalVises({ borFastMedSøker, skriftligAvtaleOmDeltBosted })
    );
    const søkerForTidsromSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].id,
        barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar === AlternativtSvarForInput.UKJENT
            ? ''
            : barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar,
        søkerForTidsromCheckbox,
        tidsromSkalVises({ borFastMedSøker, skriftligAvtaleOmDeltBosted })
    );

    /*--- SØKER HAR BODD MED ANDRE FORELDER - UTVIDET BARNETRYGD---*/

    const søkerHarBoddMedAndreForelder = useJaNeiSpmFelt(
        barn.utvidet[barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder],
        'ombarnet.boddsammenmedandreforelder.feilmelding',
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
            ? {
                  borFastMedSøker: {
                      hovedSpørsmål: borFastMedSøker,
                  },
                  skriftligAvtaleOmDeltBosted: {
                      hovedSpørsmål: skriftligAvtaleOmDeltBosted,
                  },
              }
            : {
                  borFastMedSøker: {
                      hovedSpørsmål: borFastMedSøker,
                  },
              },
        false,
        !erUtvidet
    );

    const borMedAndreForelderCheckbox = useFelt<ESvar>({
        verdi:
            barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.søkerBorMedAndreForelder,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.søkerHarBoddMedAndreForelder &&
                avhengigheter.søkerHarBoddMedAndreForelder.verdi === ESvar.JA
            );
        },
        avhengigheter: { søkerHarBoddMedAndreForelder },
        nullstillVedAvhengighetEndring: false,
    });

    const søkerFlyttetFraAndreForelderDato = useDatovelgerFeltMedUkjent(
        barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].id,
        barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar ===
            AlternativtSvarForInput.UKJENT
            ? ''
            : barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar,
        borMedAndreForelderCheckbox,
        søkerHarBoddMedAndreForelder.verdi === ESvar.JA
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
            nårKomBarnTilNorgeDatoIkkeAnkommet,
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
            søkerHarBoddMedAndreForelder,
            borMedAndreForelderCheckbox,
            søkerFlyttetFraAndreForelderDato,
        },
        skjemanavn: `om-barnet-${barn.id}`,
    });

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
                barn.id === barnetsUuid
                    ? {
                          ...barn,
                          barnErFyltUt: true,
                          institusjonsnavn: {
                              ...barn.institusjonsnavn,
                              svar: trimWhiteSpace(institusjonsnavn.verdi),
                          },
                          institusjonsadresse: {
                              ...barn.institusjonsadresse,
                              svar: trimWhiteSpace(institusjonsadresse.verdi),
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
                              svar: svarForSpørsmålMedUkjent(
                                  nårKomBarnTilNorgeDatoIkkeAnkommet,
                                  nårKomBarnTilNorgeDato
                              ),
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
                              svar: trimWhiteSpace(
                                  svarForSpørsmålMedUkjent(
                                      andreForelderNavnUkjent,
                                      andreForelderNavn
                                  )
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
                          utvidet: {
                              søkerHarBoddMedAndreForelder: {
                                  ...barn.utvidet.søkerHarBoddMedAndreForelder,
                                  svar: søkerHarBoddMedAndreForelder.verdi,
                              },
                              søkerFlyttetFraAndreForelderDato: {
                                  ...barn.utvidet.søkerFlyttetFraAndreForelderDato,
                                  svar: svarForSpørsmålMedUkjent(
                                      borMedAndreForelderCheckbox,
                                      søkerFlyttetFraAndreForelderDato
                                  ),
                              },
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
                            skriftligAvtaleOmDeltBosted.verdi === ESvar.JA &&
                                barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI,
                            barn.id
                        );
                    case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
                        return genererOppdatertDokumentasjon(
                            dok,
                            borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker,
                            barn.id
                        );
                    case Dokumentasjonsbehov.MEKLINGSATTEST:
                        return genererOppdatertDokumentasjon(
                            dok,
                            søkerHarBoddMedAndreForelder.verdi === ESvar.JA &&
                                borMedAndreForelderCheckbox.verdi === ESvar.NEI,
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
