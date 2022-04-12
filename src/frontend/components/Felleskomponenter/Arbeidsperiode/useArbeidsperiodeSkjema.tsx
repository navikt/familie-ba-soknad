import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IArbeidsperioderFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato, erSammeDatoSomDagensDato } from '../../../utils/dato';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import {
    arbeidslandFeilmelding,
    tilDatoArbeidsperiodeFeilmelding,
} from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

export interface IUseArbeidsperiodeSkjemaParams {
    gjelderUtlandet: boolean;
    andreForelderData?: { erDød: boolean };
}

export const useArbeidsperiodeSkjema = (gjelderUtlandet, andreForelderData) => {
    const { erEøsLand } = useEøs();
    const gjelderAndreForelder = !!andreForelderData;
    const erAndreForelderDød = !!andreForelderData?.erDød;

    const arbeidsperiodeAvsluttet = useJaNeiSpmFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet, svar: null },
        feilmeldingSpråkId: 'felles.erarbeidsperiodenavsluttet.feilmelding',
        skalSkjules: erAndreForelderDød,
    });

    const periodenErAvsluttet = arbeidsperiodeAvsluttet.verdi === ESvar.JA || erAndreForelderDød;

    const arbeidsperiodeLand = useLanddropdownFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand, svar: '' },
        feilmeldingSpråkId: arbeidslandFeilmelding(periodenErAvsluttet, gjelderAndreForelder),
        skalFeltetVises:
            (arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
                erAndreForelderDød) &&
            gjelderUtlandet,
        nullstillVedAvhengighetEndring: true,
    });

    const arbeidsgiver = useInputFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsgiver, svar: '' },
        feilmeldingSpråkId: 'felles.oppgiarbeidsgiver.feilmelding',
        skalVises: gjelderUtlandet
            ? erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              erAndreForelderDød,
    });

    const fraDatoArbeidsperiode = useDatovelgerFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode, svar: '' },
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              erAndreForelderDød,
        feilmeldingSpråkId: 'felles.nårbegyntearbeidsperiode.feilmelding',
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
        nullstillVedAvhengighetEndring: true,
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

    const tilDatoArbeidsperiode = useDatovelgerFeltMedUkjent({
        feltId: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
        initiellVerdi: '',
        vetIkkeCheckbox: tilDatoArbeidsperiodeUkjent,
        feilmeldingSpråkId: tilDatoArbeidsperiodeFeilmelding(periodenErAvsluttet),
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              erAndreForelderDød,
        sluttdatoAvgrensning: periodenErAvsluttet ? dagensDato() : undefined,
        startdatoAvgrensning: minTilDatoForUtbetalingEllerArbeidsperiode(
            periodenErAvsluttet,
            fraDatoArbeidsperiode.verdi
        ),
        customStartdatoFeilmelding:
            erSammeDatoSomDagensDato(fraDatoArbeidsperiode.verdi) || periodenErAvsluttet
                ? undefined
                : 'felles.dato.tilbake-i-tid.feilmelding',
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
