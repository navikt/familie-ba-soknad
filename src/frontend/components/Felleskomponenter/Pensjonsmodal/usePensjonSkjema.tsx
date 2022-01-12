import { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IPensjonsperiodeFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { pensjonFraDatoFeilmeldingSpråkId, pensjonslandFeilmeldingSpråkId } from './språkUtils';
import { PensjonSpørsmålId } from './spørsmål';

export interface IUsePensjonSkjemaParams {
    barn?: IBarnMedISøknad;
    gjelderUtland?: boolean;
    gjelderAndreForelder?: boolean;
}

export const usePensjonSkjema = ({
    barn,
    gjelderUtland = true,
    gjelderAndreForelder = false,
}: IUsePensjonSkjemaParams) => {
    const { erEøsLand } = useEøs();
    const [eøsPensjon, settEøsPensjon] = useState(false);
    const intl = useIntl();

    const mottarPensjonNå = useJaNeiSpmFelt({
        søknadsfelt: { id: PensjonSpørsmålId.mottarPensjonNå, svar: null },
        feilmeldingSpråkId: gjelderAndreForelder
            ? 'ombarnet.andre-forelder.pensjonnå.feilmelding'
            : 'modal.fårdupensjonnå.feilmelding',
        feilmeldingSpråkVerdier: barn ? { barn: barnetsNavnValue(barn, intl) } : undefined,
    });
    const tilbakeITid = mottarPensjonNå.verdi === ESvar.NEI;
    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [mottarPensjonNå.verdi]);

    const pensjonsland = useLanddropdownFelt({
        søknadsfelt: { id: PensjonSpørsmålId.pensjonsland, svar: '' },
        feilmeldingSpråkId: pensjonslandFeilmeldingSpråkId(gjelderAndreForelder, tilbakeITid),
        skalFeltetVises:
            mottarPensjonNå.valideringsstatus === Valideringsstatus.OK && gjelderUtland,
    });

    useEffect(() => settEøsPensjon(erEøsLand(pensjonsland.verdi)), [pensjonsland.verdi]);

    const pensjonFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonSpørsmålId.fraDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            mottarPensjonNå.valideringsstatus === Valideringsstatus.OK &&
            (!gjelderUtland || erEøsLand(pensjonsland.verdi)),
        feilmeldingSpråkId: pensjonFraDatoFeilmeldingSpråkId(gjelderAndreForelder, tilbakeITid),
        sluttdatoAvgrensning: tilbakeITid ? gårsdagensDato() : dagensDato(),
        avhengigheter: { mottarPensjonNå },
        nullstillVedAvhengighetEndring: true,
    });

    const pensjonTilDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonSpørsmålId.tilDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            mottarPensjonNå.verdi === ESvar.NEI &&
            (!gjelderUtland || erEøsLand(pensjonsland.verdi)),
        feilmeldingSpråkId: 'felles.nåravsluttetpensjon.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: pensjonFraDato.verdi,
        avhengigheter: { mottarPensjonNå, pensjonFraDato },
        nullstillVedAvhengighetEndring: true,
    });

    const skjema = useSkjema<IPensjonsperiodeFeltTyper, 'string'>({
        felter: {
            mottarPensjonNå,
            pensjonsland,
            pensjonFraDato,
            pensjonTilDato,
        },
        skjemanavn: 'pensjonsperiode',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
        eøsPensjon,
    };
};
