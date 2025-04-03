import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import useDatovelgerFeltMedUkjentForSanity from '../../../hooks/useDatovelgerFeltMedUkjentForSanity';
import useInputFelt from '../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { IArbeidsperioderFeltTyper } from '../../../typer/skjema';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';
import { minTilDatoForPeriode } from '../../../utils/perioder';

import { arbeidslandFeilmelding } from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

export interface IUseArbeidsperiodeSkjemaParams {
    gjelderUtlandet: boolean;
    personType: PersonType;
    erDød?: boolean;
}

export const useArbeidsperiodeSkjema = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    erDød = false
) => {
    const { toggles } = useFeatureToggles();
    const { tekster, plainTekst } = useAppContext();
    const { erEøsLand } = useEøsContext();

    const teksterForPersonType: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];

    const andreForelderErDød = personType === PersonType.AndreForelder && erDød;

    const arbeidsperiodeAvsluttet = useJaNeiSpmFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet, svar: null },
        feilmelding: teksterForPersonType.arbeidsperiodenAvsluttet.feilmelding,
        feilmeldingSpråkId: 'felles.erarbeidsperiodenavsluttet.feilmelding',
        skalSkjules: andreForelderErDød,
    });

    const periodenErAvsluttet = arbeidsperiodeAvsluttet.verdi === ESvar.JA || andreForelderErDød;

    const arbeidsperiodeLand = useLanddropdownFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand, svar: '' },
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.hvilketLandFortid.feilmelding
            : teksterForPersonType.hvilketLandNaatid.feilmelding,
        feilmeldingSpråkId: arbeidslandFeilmelding(periodenErAvsluttet, personType),
        skalFeltetVises:
            (arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
                andreForelderErDød) &&
            gjelderUtlandet,
        nullstillVedAvhengighetEndring: true,
    });

    const arbeidsgiver = useInputFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsgiver, svar: '' },
        feilmelding: teksterForPersonType.arbeidsgiver.feilmelding,
        feilmeldingSpråkId: 'felles.oppgiarbeidsgiver.feilmelding',
        skalVises: gjelderUtlandet
            ? erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              andreForelderErDød,
    });

    const fraDatoArbeidsperiode = useDatovelgerFeltForSanity({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode, svar: '' },
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              andreForelderErDød,
        feilmelding: teksterForPersonType.startdato.feilmelding,
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
    });

    const tilDatoArbeidsperiodeUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke,
        skalFeltetVises: avhengigheter => {
            if (avhengigheter.arbeidsperiodeAvsluttet?.verdi !== ESvar.NEI) return false;
            return gjelderUtlandet ? !!erEøsLand(avhengigheter.arbeidsperiodeLand?.verdi) : true;
        },
        avhengigheter: { arbeidsperiodeAvsluttet, arbeidsperiodeLand },
    });

    const tilArbeidsperiodeSluttdatoAvgrensning = toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
        ? sisteDagDenneMåneden()
        : dagensDato();

    const tilDatoArbeidsperiode = useDatovelgerFeltMedUkjentForSanity({
        feltId: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
        initiellVerdi: '',
        vetIkkeCheckbox: tilDatoArbeidsperiodeUkjent,
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.sluttdatoFortid.feilmelding
            : teksterForPersonType.sluttdatoFremtid.feilmelding,
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              andreForelderErDød,
        sluttdatoAvgrensning: periodenErAvsluttet
            ? tilArbeidsperiodeSluttdatoAvgrensning
            : undefined,
        startdatoAvgrensning: minTilDatoForPeriode(
            periodenErAvsluttet,
            fraDatoArbeidsperiode.verdi
        ),
        customStartdatoFeilmelding:
            erSammeDatoSomDagensDato(stringTilDate(fraDatoArbeidsperiode.verdi)) ||
            periodenErAvsluttet
                ? undefined
                : plainTekst(
                      tekster().FELLES.formateringsfeilmeldinger.datoKanIkkeVaereTilbakeITid
                  ),
        avhengigheter: { fraDatoArbeidsperiode },
        nullstillVedAvhengighetEndring: false,
    });

    const skjema = useSkjema<IArbeidsperioderFeltTyper, 'string'>({
        felter: {
            arbeidsperiodeAvsluttet,
            arbeidsperiodeLand,
            arbeidsgiver,
            fraDatoArbeidsperiode,
            tilDatoArbeidsperiode,
            tilDatoArbeidsperiodeUkjent,
        },
        skjemanavn: 'arbeidsperioder',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
