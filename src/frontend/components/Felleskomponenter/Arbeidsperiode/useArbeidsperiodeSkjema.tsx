import { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IArbeidsperioderFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import {
    arbeidslandFeilmelding,
    tilDatoArbeidsperiodeFeilmelding,
} from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

export interface IUseArbeidsperiodeSkjemaParams {
    gjelderUtlandet: boolean;
    gjelderAndreForelder: boolean;
    erAndreForelderDød?: boolean;
}

export const useArbeidsperiodeSkjema = (
    gjelderUtlandet,
    gjelderAndreForelder,
    erAndreForelderDød
) => {
    const { erEøsLand } = useEøs();

    const arbeidsperiodeAvsluttet = useJaNeiSpmFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet, svar: null },
        feilmeldingSpråkId: 'felles.erarbeidsperiodenavsluttet.feilmelding',
        skalSkjules: erAndreForelderDød,
    });

    const arbeidsperiodeLand = useLanddropdownFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand, svar: '' },
        feilmeldingSpråkId: arbeidslandFeilmelding(
            gjelderAndreForelder,
            arbeidsperiodeAvsluttet.verdi
        ),
        skalFeltetVises:
            (gjelderUtlandet &&
                arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK) ||
            !arbeidsperiodeAvsluttet.erSynlig,
        nullstillVedAvhengighetEndring: true,
    });

    const arbeidsgiver = useInputFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.arbeidsgiver, svar: '' },
        feilmeldingSpråkId: 'felles.oppgiarbeidsgiver.feilmelding',
        skalVises: gjelderUtlandet
            ? erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK,
    });

    const fraDatoArbeidsperiode = useDatovelgerFelt({
        søknadsfelt: { id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode, svar: '' },
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'felles.nårbegyntearbeidsperiode.feilmelding',
        sluttdatoAvgrensning:
            arbeidsperiodeAvsluttet.verdi === ESvar.JA ? gårsdagensDato() : dagensDato(),
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
        feilmeldingSpråkId: tilDatoArbeidsperiodeFeilmelding(arbeidsperiodeAvsluttet.verdi),
        skalFeltetVises: gjelderUtlandet
            ? !!erEøsLand(arbeidsperiodeLand.verdi)
            : arbeidsperiodeAvsluttet.valideringsstatus === Valideringsstatus.OK,
        sluttdatoAvgrensning: arbeidsperiodeAvsluttet.verdi === ESvar.JA ? dagensDato() : undefined,
        startdatoAvgrensning: fraDatoArbeidsperiode.verdi,
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
