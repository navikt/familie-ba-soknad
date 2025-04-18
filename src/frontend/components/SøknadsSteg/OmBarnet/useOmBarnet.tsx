import React, { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type FeltState, type ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import useDatovelgerFeltMedUkjentForSanity from '../../../hooks/useDatovelgerFeltMedUkjentForSanity';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { usePerioder } from '../../../hooks/usePerioder';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../typer/barn';
import { AlternativtSvarForInput, BarnetsId } from '../../../typer/common';
import { IDokumentasjon } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtenlandsperiode,
} from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { IBarnetrygdsperiodeTekstinnhold } from '../../../typer/sanity/modaler/barnetrygdperiode';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IFormateringsfeilmeldingerTekstinnhold } from '../../../typer/sanity/tekstInnhold';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import { Årsak } from '../../../typer/utvidet';
import { erNorskPostnummer, valideringAdresse } from '../../../utils/adresse';
import {
    filtrerteRelevanteIdNummerForBarn,
    genererInitiellAndreForelder,
    nullstilteEøsFelterForBarn,
    skalViseBorMedOmsorgsperson,
} from '../../../utils/barn';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    morgendagensDato,
    stringTilDate,
} from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent, formaterVerdiForCheckbox } from '../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { BarnetrygdperiodeSpørsmålId } from '../../Felleskomponenter/Barnetrygdperiode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLand } from '../EøsSteg/idnummerUtils';

import { IOmBarnetTekstinnhold } from './innholdTyper';
import { OmBarnetSpørsmålsId } from './spørsmål';

export const barnErUnder16År = (barnet: IBarnMedISøknad): boolean => Number(barnet.alder) < 16;

export const useOmBarnet = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    barn: IBarnMedISøknad | undefined;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
} => {
    const { søknad, settSøknad, erUtvidet, tekster, plainTekst } = useAppContext();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs, erEøsLand } =
        useEøsContext();
    const stegTekster: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];
    const teksterForArbeidsperiode: IArbeidsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.arbeidsperiode.søker;
    const teksterForBarnetrygdsperiode: IBarnetrygdsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnetrygdsperiode.søker;
    const teksterForPensjonsperiode: IPensjonsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.pensjonsperiode.andreForelder;
    const teksterForUtenlandsopphold: IUtenlandsoppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold.søker;
    const teksterForFormateringsfeilmeldinger: IFormateringsfeilmeldingerTekstinnhold =
        tekster()[ESanitySteg.FELLES].formateringsfeilmeldinger;

    const søker = søknad.søker;
    const gjeldendeBarn = søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid);

    if (!gjeldendeBarn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        gjeldendeBarn.utenlandsperioder
    );

    const skalFeltetVises = (
        søknadsdataFelt: Exclude<
            barnDataKeySpørsmål,
            barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId
        >
    ) => {
        return gjeldendeBarn[søknadsdataFelt].svar === ESvar.JA;
    };

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt &&
            barnISøknad.id !== gjeldendeBarn.id &&
            !!barnISøknad.andreForelder &&
            (barnISøknad.sammeForelderSomAnnetBarnMedId.svar ===
                AlternativtSvarForInput.ANNEN_FORELDER ||
                barnISøknad.sammeForelderSomAnnetBarnMedId.svar === null)
    );

    /*---INSTITUSJON---*/

    const institusjonIUtlandCheckbox = useFelt<ESvar>({
        verdi: gjeldendeBarn[barnDataKeySpørsmål.institusjonIUtland].svar,
        feltId: OmBarnetSpørsmålsId.institusjonIUtland,
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonsnavn = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonsnavn],
        feilmelding: stegTekster.institusjonNavn.feilmelding,
        feilmeldingSpråkId: 'ombarnet.institusjon.navn.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
    });

    const institusjonsadresse = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonsadresse],
        feilmelding: stegTekster.institusjonAdresse.feilmelding,
        feilmeldingSpråkId: 'ombarnet.institusjon.adresse.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
        customValidering: valideringAdresse,
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: gjeldendeBarn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: gjeldendeBarn[barnDataKeySpørsmål.institusjonspostnummer].id,
        valideringsfunksjon: felt =>
            erNorskPostnummer(trimWhiteSpace(felt.verdi))
                ? ok(felt)
                : feil(
                      felt,
                      trimWhiteSpace(felt.verdi) === '' ? (
                          <TekstBlock block={stegTekster.institusjonPostnummer.feilmelding} />
                      ) : (
                          plainTekst(teksterForFormateringsfeilmeldinger.ugyldigPostnummer)
                      )
                  ),
        skalFeltetVises: avhengigheter =>
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            avhengigheter.institusjonIUtlandCheckbox.verdi === ESvar.NEI,
        avhengigheter: { institusjonIUtlandCheckbox },
    });

    const institusjonOppholdStartdato = useDatovelgerFeltForSanity({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdStartdato],
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        feilmelding: stegTekster.institusjonStartdato.feilmelding,
        sluttdatoAvgrensning: dagensDato(),
    });

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSluttdato = useDatovelgerFeltMedUkjentForSanity({
        feltId: gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].id,
        initiellVerdi: formaterInitVerdiForInputMedUkjent(
            gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar
        ),
        vetIkkeCheckbox: institusjonOppholdSluttVetIkke,
        feilmelding: stegTekster.institusjonSluttdato.feilmelding,
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        startdatoAvgrensning: erSammeDatoSomDagensDato(
            stringTilDate(institusjonOppholdStartdato.verdi)
        )
            ? morgendagensDato()
            : dagensDato(),
        customStartdatoFeilmelding: erSammeDatoSomDagensDato(
            stringTilDate(institusjonOppholdStartdato.verdi)
        )
            ? undefined
            : plainTekst(teksterForFormateringsfeilmeldinger.datoKanIkkeVaereTilbakeITid),
        avhengigheter: { institusjonOppholdStartdato },
        nullstillVedAvhengighetEndring: false,
    });

    /*---UTENLANDSOPPHOLD---*/
    const registrerteUtenlandsperioder = useFelt<IUtenlandsperiode[]>({
        feltId: UtenlandsoppholdSpørsmålId.utenlandsopphold,
        verdi: gjeldendeBarn.utenlandsperioder,
        valideringsfunksjon: felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, plainTekst(teksterForUtenlandsopphold.leggTilFeilmelding));
        },
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge),
    });

    useEffect(() => {
        registrerteUtenlandsperioder.validerOgSettFelt(utenlandsperioder);
    }, [utenlandsperioder]);

    const planleggerÅBoINorge12Mnd = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
        feilmelding: stegTekster.planlagtBoSammenhengendeINorge.feilmelding,
        feilmeldingSpråkId: 'ombarnet.oppholdtsammenhengende.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
        skalSkjules:
            !skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge) ||
            flyttetPermanentFraNorge(utenlandsperioder) ||
            !utenlandsperioder.length,
    });

    const leggTilUtenlandsperiode = (periode: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState => prevState.concat(periode));
    };

    const fjernUtenlandsperiode = (periodeSomSkalFjernes: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    /*--- PÅGÅENDE SØKNAD BARNETRYGD FRA ANNET EØSLAND ---*/
    const pågåendeSøknadFraAnnetEøsLand = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
        feilmelding: stegTekster.paagaaendeSoeknadYtelse.feilmelding,
        feilmeldingSpråkId: 'ombarnet.pågåendesøknad.feilmelding',
        skalSkjules: !skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland),
    });

    const pågåendeSøknadHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
        feilmelding: stegTekster.hvilketLandYtelse.feilmelding,
        feilmeldingSpråkId: 'ombarnet.hvilketlandsøkt.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: pågåendeSøknadFraAnnetEøsLand,
    });

    /*--- EØS SPØRSMÅL MOTTAR BARNETRYGD ---*/
    const mottarEllerMottokEøsBarnetrygd = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
        feilmelding: stegTekster.faarEllerHarFaattYtelseFraAnnetLand.feilmelding,
        feilmeldingSpråkId: 'ombarnet.fårellerharsøktbarnetrygdeøs.feilmelding',
        skalSkjules: !skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland),
    });

    const {
        fjernPeriode: fjernBarnetrygdsperiode,
        leggTilPeriode: leggTilBarnetrygdsperiode,
        registrertePerioder: registrerteEøsBarnetrygdsperioder,
    } = usePerioder<IEøsBarnetrygdsperiode>({
        feltId: `${BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs}-${barnetsUuid}`,
        verdi: gjeldendeBarn.eøsBarnetrygdsperioder,
        avhengigheter: { mottarEllerMottokEøsBarnetrygd },
        skalFeltetVises: avhengigheter =>
            avhengigheter.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.NEI ||
                (avhengigheter?.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(felt, plainTekst(teksterForBarnetrygdsperiode.leggTilFeilmelding));
        },
    });

    /*--- ANDRE FORELDER ---*/
    const andreForelder = gjeldendeBarn.andreForelder;

    const sammeForelderSomAnnetBarn = useFelt<
        BarnetsId | AlternativtSvarForInput.ANNEN_FORELDER | null
    >({
        feltId: OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn,
        verdi: gjeldendeBarn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar,
        valideringsfunksjon: (felt: FeltState<string | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(
                      felt,
                      <TekstBlock
                          block={stegTekster.hvemErBarnSinAndreForelder.feilmelding}
                          flettefelter={{ barnetsNavn: gjeldendeBarn.navn }}
                      />
                  );
        },
        skalFeltetVises: () =>
            !!andreForelder &&
            søknad.barnInkludertISøknaden.find(barn => barn.andreForelder)?.id !==
                gjeldendeBarn.id &&
            andreBarnSomErFyltUt.length > 0,
    });

    const andreForelderKanIkkeGiOpplysninger = useFelt<ESvar>({
        verdi:
            andreForelder?.[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger].svar ?? ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
        avhengigheter: { sammeForelderSomAnnetBarn },
        skalFeltetVises: avhengigheter =>
            !!andreForelder &&
            (!avhengigheter.sammeForelderSomAnnetBarn.erSynlig ||
                avhengigheter.sammeForelderSomAnnetBarn.verdi ===
                    AlternativtSvarForInput.ANNEN_FORELDER),
    });
    const andreForelderNavn = useInputFeltMedUkjent({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.navn] ?? null,
        avhengighet: andreForelderKanIkkeGiOpplysninger,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.navn.feilmelding',
        skalVises:
            !!andreForelder &&
            (!sammeForelderSomAnnetBarn.erSynlig ||
                sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER),
    });

    const andreForelderFnrUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(andreForelder?.[andreForelderDataKeySpørsmål.fnr].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFnrUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                !!andreForelder &&
                avhengigheter &&
                (!avhengigheter.sammeForelderSomAnnetBarn.erSynlig ||
                    avhengigheter.sammeForelderSomAnnetBarn.verdi ===
                        AlternativtSvarForInput.ANNEN_FORELDER) &&
                avhengigheter.andreForelderKanIkkeGiOpplysninger &&
                avhengigheter.andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
            );
        },
        avhengigheter: {
            andreForelderKanIkkeGiOpplysninger,
            sammeForelderSomAnnetBarn,
        },
        nullstillVedAvhengighetEndring: false,
    });

    const andreForelderFnr = useInputFeltMedUkjent({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.fnr] ?? null,
        avhengighet: andreForelderFnrUkjent,
        feilmelding: teksterForFormateringsfeilmeldinger.ugyldigFoedselsnummer,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.fnr.feilmelding',
        erFnrInput: true,
        skalVises:
            !!andreForelder &&
            (!sammeForelderSomAnnetBarn.erSynlig ||
                sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER) &&
            andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI,
    });

    const andreForelderFødselsdatoUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(
            andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].svar
        ),
        feltId: OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.andreForelderFnrUkjent &&
                avhengigheter.andreForelderFnrUkjent.erSynlig &&
                avhengigheter.andreForelderFnrUkjent.verdi === ESvar.JA &&
                avhengigheter.andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
            );
        },
        avhengigheter: {
            andreForelderFnrUkjent,
            andreForelderKanIkkeGiOpplysninger,
        },
        nullstillVedAvhengighetEndring: false,
    });

    const andreForelderFødselsdato = useDatovelgerFeltMedUkjentForSanity({
        feltId: andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].id,
        initiellVerdi: formaterInitVerdiForInputMedUkjent(
            andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].svar
        ),
        vetIkkeCheckbox: andreForelderFødselsdatoUkjent,
        feilmelding: stegTekster.foedselsdatoAndreForelder.feilmelding,
        skalFeltetVises:
            andreForelderFnrUkjent.erSynlig &&
            andreForelderFnrUkjent.verdi === ESvar.JA &&
            andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER,
        sluttdatoAvgrensning: dagensDato(),
    });

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandet],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelder-arbeidutland.feilmelding'
                : 'eøs.andre-forelder.arbeid-utland.feilmelding',
        avhengigheter: {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        },
        skalSkjules: andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: andreForelderArbeidsperioderUtland,
    } = usePerioder<IArbeidsperiode>({
        feltId: `${ArbeidsperiodeSpørsmålsId.arbeidsperioderUtland}-${PersonType.AndreForelder}-${barnetsUuid}`,
        verdi: andreForelder?.arbeidsperioderUtland ?? [],
        avhengigheter: { andreForelderArbeidUtlandet },
        skalFeltetVises: avhengigheter =>
            avhengigheter.andreForelderArbeidUtlandet.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(teksterForArbeidsperiode.leggTilFeilmelding, {
                          gjelderUtland: true,
                      })
                  );
        },
    });

    const andreForelderPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonUtland],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andre-forelder.utenlandspensjon.feilmelding'
                : 'ombarnet.andreforelderpensjonutland.feilmelding',
        avhengigheter: {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        },
        skalSkjules: andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: andreForelderPensjonsperioderUtland,
    } = usePerioder<IPensjonsperiode>({
        feltId: `${PensjonsperiodeSpørsmålId.pensjonsperioderUtland}-${PersonType.AndreForelder}-${barnetsUuid}`,
        verdi: andreForelder?.pensjonsperioderUtland ?? [],
        avhengigheter: { andreForelderPensjonUtland },
        skalFeltetVises: avhengigheter =>
            avhengigheter.andreForelderPensjonUtland.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, plainTekst(teksterForPensjonsperiode.leggTilFeilmelding));
        },
    });

    /*--- BOSTED ---*/
    const borFastMedSøker = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borFastMedSøker],
        feilmelding: stegTekster.borBarnFastSammenMedDeg.feilmelding,
        feilmeldingSpråkId: 'ombarnet.bor-fast.feilmelding',
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        feilmelding: stegTekster.deltBosted.feilmelding,
        feilmeldingSpråkId: 'ombarnet.delt-bosted.feilmelding',
        skalSkjules:
            !andreForelder ||
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    /*--- SØKER HAR BODD MED ANDRE FORELDER - UTVIDET BARNETRYGD---*/

    const søkerHarBoddMedAndreForelder = useJaNeiSpmFelt({
        søknadsfelt:
            andreForelder?.utvidet[andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder],
        feilmelding: stegTekster.boddSammenMedAndreForelder.feilmelding,
        feilmeldingSpråkId: 'ombarnet.boddsammenmedandreforelder.feilmelding',
        avhengigheter: {
            borFastMedSøker: {
                hovedSpørsmål: borFastMedSøker,
            },
            skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.erSynlig
                ? {
                      hovedSpørsmål: skriftligAvtaleOmDeltBosted,
                  }
                : undefined,
        },
        skalSkjules: !erUtvidet || !andreForelder,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const borMedAndreForelderCheckbox = useFelt<ESvar>({
        verdi:
            andreForelder?.utvidet[andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]
                .svar === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.søkerBorMedAndreForelder,
        skalFeltetVises: avhengigheter => {
            return (
                gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI &&
                avhengigheter &&
                avhengigheter.søkerHarBoddMedAndreForelder &&
                avhengigheter.søkerHarBoddMedAndreForelder.verdi === ESvar.JA
            );
        },
        avhengigheter: { søkerHarBoddMedAndreForelder },
    });

    const søkerFlyttetFraAndreForelderDato = useDatovelgerFeltMedUkjentForSanity({
        feltId: andreForelder?.utvidet[
            andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
        ].id,
        initiellVerdi: formaterInitVerdiForInputMedUkjent(
            andreForelder?.utvidet[andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]
                .svar
        ),
        vetIkkeCheckbox: borMedAndreForelderCheckbox,
        feilmelding: stegTekster.naarFlyttetFraAndreForelder.feilmelding,
        skalFeltetVises:
            søkerHarBoddMedAndreForelder.verdi === ESvar.JA &&
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI,
        nullstillVedAvhengighetEndring: true,
        sluttdatoAvgrensning: dagensDato(),
    });

    const { kanSendeSkjema, skjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnetFeltTyper,
        string
    >({
        felter: {
            institusjonIUtlandCheckbox,
            institusjonsnavn,
            institusjonsadresse,
            institusjonspostnummer,
            institusjonOppholdStartdato,
            institusjonOppholdSluttdato,
            institusjonOppholdSluttVetIkke,
            registrerteUtenlandsperioder,
            planleggerÅBoINorge12Mnd,
            pågåendeSøknadFraAnnetEøsLand,
            pågåendeSøknadHvilketLand,
            mottarEllerMottokEøsBarnetrygd,
            registrerteEøsBarnetrygdsperioder,
            andreForelderNavn,
            andreForelderKanIkkeGiOpplysninger,
            andreForelderFnr,
            andreForelderFnrUkjent,
            andreForelderFødselsdato,
            andreForelderFødselsdatoUkjent,
            andreForelderArbeidUtlandet,
            andreForelderArbeidsperioderUtland,
            andreForelderPensjonUtland,
            andreForelderPensjonsperioderUtland,
            borFastMedSøker,
            skriftligAvtaleOmDeltBosted,
            sammeForelderSomAnnetBarn,
            søkerHarBoddMedAndreForelder,
            borMedAndreForelderCheckbox,
            søkerFlyttetFraAndreForelderDato,
        },
        skjemanavn: `om-barnet-${gjeldendeBarn.id}`,
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

    const filtrerteRelevanteIdNummerForAndreForelder = (
        andreForelder: IAndreForelder
    ): IIdNummer[] => {
        return andreForelder.idNummer.filter(idNummer => {
            return idNummerLand(
                {
                    arbeidsperioderUtland:
                        andreForelderArbeidUtlandet.verdi === ESvar.JA
                            ? andreForelderArbeidsperioderUtland.verdi
                            : [],
                    pensjonsperioderUtland:
                        andreForelderPensjonUtland.verdi === ESvar.JA
                            ? andreForelderPensjonsperioderUtland.verdi
                            : [],
                },
                erEøsLand
            ).includes(idNummer.land);
        });
    };

    const annetBarnMedSammeForelder = (): IBarnMedISøknad | undefined =>
        andreBarnSomErFyltUt.find(barn => barn.id === sammeForelderSomAnnetBarn.verdi);

    const genererOppdatertAndreForelder = (andreForelder: IAndreForelder): IAndreForelder => {
        const barnMedSammeForelder = annetBarnMedSammeForelder();
        const andreForelderErDød = gjeldendeBarn.andreForelderErDød.svar === ESvar.JA;

        if (barnMedSammeForelder?.andreForelder) {
            return {
                ...barnMedSammeForelder.andreForelder,
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
            };
        } else if (andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA) {
            return {
                ...genererInitiellAndreForelder(null, andreForelderErDød),
                kanIkkeGiOpplysninger: {
                    ...andreForelder[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger],
                    svar: ESvar.JA,
                },
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
                utvidet: {
                    søkerHarBoddMedAndreForelder: {
                        ...andreForelder.utvidet.søkerHarBoddMedAndreForelder,
                        svar: søkerHarBoddMedAndreForelder.verdi,
                    },
                    søkerFlyttetFraAndreForelderDato: {
                        ...andreForelder.utvidet.søkerFlyttetFraAndreForelderDato,
                        svar: svarForSpørsmålMedUkjent(
                            borMedAndreForelderCheckbox,
                            søkerFlyttetFraAndreForelderDato
                        ),
                    },
                },
            };
        } else {
            return {
                ...andreForelder,
                kanIkkeGiOpplysninger: {
                    ...andreForelder[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger],
                    svar: ESvar.NEI,
                },
                idNummer: filtrerteRelevanteIdNummerForAndreForelder(andreForelder),
                navn: {
                    ...andreForelder[andreForelderDataKeySpørsmål.navn],
                    svar: trimWhiteSpace(andreForelderNavn.verdi),
                },
                fnr: {
                    ...andreForelder[andreForelderDataKeySpørsmål.fnr],
                    svar: svarForSpørsmålMedUkjent(andreForelderFnrUkjent, andreForelderFnr),
                },
                fødselsdato: {
                    ...andreForelder[andreForelderDataKeySpørsmål.fødselsdato],
                    svar: svarForSpørsmålMedUkjent(
                        andreForelderFødselsdatoUkjent,
                        andreForelderFødselsdato
                    ),
                },
                arbeidUtlandet: {
                    ...andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet],
                    svar: andreForelderArbeidUtlandet.verdi,
                },
                arbeidsperioderUtland:
                    andreForelderArbeidUtlandet.verdi === ESvar.JA
                        ? andreForelderArbeidsperioderUtland.verdi
                        : [],
                pensjonUtland: {
                    ...andreForelder[andreForelderDataKeySpørsmål.pensjonUtland],
                    svar: andreForelderPensjonUtland.verdi,
                },
                pensjonsperioderUtland:
                    andreForelderPensjonUtland.verdi === ESvar.JA
                        ? andreForelderPensjonsperioderUtland.verdi
                        : [],
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
                utvidet: {
                    søkerHarBoddMedAndreForelder: {
                        ...andreForelder.utvidet.søkerHarBoddMedAndreForelder,
                        svar: søkerHarBoddMedAndreForelder.verdi,
                    },
                    søkerFlyttetFraAndreForelderDato: {
                        ...andreForelder.utvidet.søkerFlyttetFraAndreForelderDato,
                        svar: svarForSpørsmålMedUkjent(
                            borMedAndreForelderCheckbox,
                            søkerFlyttetFraAndreForelderDato
                        ),
                    },
                },
            };
        }
    };

    const genererOppdatertBarn = (barn: IBarnMedISøknad): IBarnMedISøknad => {
        const eøsBarnetrygdsperioder =
            mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA
                ? registrerteEøsBarnetrygdsperioder.verdi
                : [];
        const utenlandsperioder = registrerteUtenlandsperioder.verdi;

        const borMedOmsorgsperson = {
            ...barn.borMedOmsorgsperson,
            svar: skalViseBorMedOmsorgsperson(
                barn.borMedAndreForelder.svar,
                borFastMedSøker.verdi,
                barn.oppholderSegIInstitusjon.svar,
                barn.andreForelderErDød.svar,
                barn.erFosterbarn.svar
            )
                ? barn.borMedOmsorgsperson.svar
                : null,
        };

        return {
            ...barn,
            idNummer: filtrerteRelevanteIdNummerForBarn(
                { eøsBarnetrygdsperioder, utenlandsperioder },
                pågåendeSøknadFraAnnetEøsLand.verdi,
                pågåendeSøknadHvilketLand.verdi,
                barn,
                erEøsLand
            ),
            barnErFyltUt: true,
            utenlandsperioder: skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge)
                ? utenlandsperioder
                : [],
            institusjonIUtland: {
                ...barn.institusjonIUtland,
                svar: institusjonIUtlandCheckbox.verdi,
            },
            institusjonsnavn: {
                ...barn.institusjonsnavn,
                svar: institusjonsnavn.erSynlig ? trimWhiteSpace(institusjonsnavn.verdi) : '',
            },
            institusjonsadresse: {
                ...barn.institusjonsadresse,
                svar: institusjonsadresse.erSynlig ? trimWhiteSpace(institusjonsadresse.verdi) : '',
            },
            institusjonspostnummer: {
                ...barn.institusjonspostnummer,
                svar: institusjonspostnummer.erSynlig
                    ? trimWhiteSpace(institusjonspostnummer.verdi)
                    : '',
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
            planleggerÅBoINorge12Mnd: {
                ...barn.planleggerÅBoINorge12Mnd,
                svar: !flyttetPermanentFraNorge(utenlandsperioder)
                    ? skjema.felter.planleggerÅBoINorge12Mnd.verdi
                    : null,
            },
            pågåendeSøknadFraAnnetEøsLand: {
                ...barn.pågåendeSøknadFraAnnetEøsLand,
                svar: pågåendeSøknadFraAnnetEøsLand.verdi,
            },
            pågåendeSøknadHvilketLand: {
                ...barn.pågåendeSøknadHvilketLand,
                svar: pågåendeSøknadHvilketLand.verdi,
            },
            mottarEllerMottokEøsBarnetrygd: {
                ...barn.mottarEllerMottokEøsBarnetrygd,
                svar: mottarEllerMottokEøsBarnetrygd.verdi,
            },
            eøsBarnetrygdsperioder:
                mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA
                    ? skjema.felter.registrerteEøsBarnetrygdsperioder.verdi
                    : [],
            borFastMedSøker: {
                ...barn.borFastMedSøker,
                svar: borFastMedSøker.verdi,
            },
            borMedOmsorgsperson,
            omsorgsperson: borMedOmsorgsperson.svar === ESvar.JA ? barn.omsorgsperson : null,
            adresse: {
                ...barn.adresse,
                svar:
                    barn.erFosterbarn.svar === ESvar.JA ||
                    (barn.borMedAndreForelder.svar === ESvar.JA &&
                        andreForelderKanIkkeGiOpplysninger.verdi == ESvar.JA)
                        ? barn.adresse.svar
                        : '',
            },
            sammeForelderSomAnnetBarnMedId: {
                ...barn.sammeForelderSomAnnetBarnMedId,
                svar: sammeForelderSomAnnetBarn.verdi,
            },
            ...(!!barn.andreForelder && {
                andreForelder: genererOppdatertAndreForelder(barn.andreForelder),
            }),
        };
    };

    useEffect(() => {
        const oppdatertBarn: IBarnMedISøknad = genererOppdatertBarn(gjeldendeBarn);
        const skalTriggeEøs = skalTriggeEøsForBarn(oppdatertBarn);
        if (
            (skalTriggeEøs && !barnSomTriggerEøs.includes(gjeldendeBarn.id)) ||
            (!skalTriggeEøs && barnSomTriggerEøs.includes(gjeldendeBarn.id))
        ) {
            settBarnSomTriggerEøs(prevState => {
                if (skalTriggeEøs) {
                    return prevState.concat(gjeldendeBarn.id);
                } else {
                    return prevState.filter(
                        barnSomTriggetEøsId => barnSomTriggetEøsId !== gjeldendeBarn.id
                    );
                }
            });
        }
    }, [andreForelderArbeidUtlandet, andreForelderPensjonUtland, utenlandsperioder]);

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] =
            søknad.barnInkludertISøknaden.map(barn => {
                let oppdatertBarn;
                if (barn === gjeldendeBarn) {
                    oppdatertBarn = genererOppdatertBarn(barn);
                } else if (barn.sammeForelderSomAnnetBarnMedId.svar === gjeldendeBarn.id) {
                    oppdatertBarn = {
                        ...barn,
                        ...(!!gjeldendeBarn.andreForelder && {
                            andreForelder: genererOppdatertAndreForelder(
                                gjeldendeBarn.andreForelder
                            ),
                        }),
                    };
                } else {
                    oppdatertBarn = barn;
                }
                const barnTriggetEøs = skalTriggeEøsForBarn(oppdatertBarn);
                const harEøsSteg = barnTriggetEøs || søker.triggetEøs;

                return {
                    ...oppdatertBarn,
                    triggetEøs: barnTriggetEøs,
                    ...(!harEøsSteg && nullstilteEøsFelterForBarn(oppdatertBarn)),
                };
            });

        const skalNullstilleEøsForSøker =
            !søker.triggetEøs && !oppdatertBarnInkludertISøknaden.find(barn => barn.triggetEøs);

        const oppgittUtvidetÅrsak = søker.utvidet.spørsmål.årsak.svar;
        const søkersSivilstand = søker.sivilstand.type;
        const skiltSeparertEnkeMenIkkeRegistrert =
            (oppgittUtvidetÅrsak === Årsak.SKILT && søkersSivilstand !== ESivilstand.SKILT) ||
            (oppgittUtvidetÅrsak === Årsak.SEPARERT && søkersSivilstand !== ESivilstand.SEPARERT) ||
            (oppgittUtvidetÅrsak === Årsak.ENKE_ENKEMANN &&
                søkersSivilstand !== ESivilstand.ENKE_ELLER_ENKEMANN);

        settSøknad({
            ...søknad,
            søker: skalNullstilleEøsForSøker
                ? { ...søker, ...nullstilteEøsFelterForSøker(søker) }
                : søker,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
                        return genererOppdatertDokumentasjon(
                            dok,
                            skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && !!andreForelder,
                            gjeldendeBarn.id
                        );
                    case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
                        return genererOppdatertDokumentasjon(
                            dok,
                            borFastMedSøker.verdi === ESvar.JA && !gjeldendeBarn.borMedSøker,
                            gjeldendeBarn.id
                        );
                    case Dokumentasjonsbehov.MEKLINGSATTEST:
                        return genererOppdatertDokumentasjon(
                            dok,
                            barnErUnder16År(gjeldendeBarn) &&
                                gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar ===
                                    ESvar.NEI &&
                                søkerHarBoddMedAndreForelder.verdi === ESvar.JA &&
                                borMedAndreForelderCheckbox.verdi === ESvar.NEI,
                            gjeldendeBarn.id
                        );
                    case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
                        return genererOppdatertDokumentasjon(
                            dok,
                            skiltSeparertEnkeMenIkkeRegistrert &&
                                søknad.søknadstype === ESøknadstype.UTVIDET,
                            gjeldendeBarn.id
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
        barn: gjeldendeBarn,
        andreBarnSomErFyltUt,
        validerAlleSynligeFelter,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilBarnetrygdsperiode,
        fjernBarnetrygdsperiode,
    };
};
