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
import {
    arbeidslandFeilmelding,
    tilDatoArbeidsperiodeFeilmelding,
} from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';
import { minAvgrensningArbeidsperiodeTilDato } from './utils';

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

    const tilbakeITid = arbeidsperiodeAvsluttet.verdi === ESvar.JA || erAndreForelderDød;

    const arbeidsperiodeLand = useLanddropdownFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand, svar: '' },
        feilmeldingSpråkId: arbeidslandFeilmelding(tilbakeITid, gjelderAndreForelder),
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
        sluttdatoAvgrensning: tilbakeITid ? gårsdagensDato() : dagensDato(),
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
        feilmeldingSpråkId: tilDatoArbeidsperiodeFeilmelding(tilbakeITid),
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK ||
              erAndreForelderDød,
        sluttdatoAvgrensning: tilbakeITid ? dagensDato() : undefined,
        startdatoAvgrensning: minAvgrensningArbeidsperiodeTilDato(
            tilbakeITid,
            fraDatoArbeidsperiode
        ),
        customStartdatoFeilmelding:
            erSammeDatoSomDagensDato(fraDatoArbeidsperiode.verdi) || tilbakeITid
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
