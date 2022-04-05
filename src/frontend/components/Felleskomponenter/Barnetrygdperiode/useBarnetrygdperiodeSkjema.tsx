import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnetrygdperioderFeltTyper } from '../../../typer/skjema';
import { dagenEtterDato, dagensDato, gårsdagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { barnetrygdslandFeilmelding } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

export const useBarnetrygdperiodeSkjema = () => {
    const mottarEøsBarnetrygdNå = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå, svar: null },
        feilmeldingSpråkId: 'modal.barnetrygdnå.feilmelding',
    });

    const tilbakeITid = mottarEøsBarnetrygdNå.verdi === ESvar.NEI;

    const barnetrygdsland = useLanddropdownFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.barnetrygdsland, svar: '' },
        feilmeldingSpråkId: barnetrygdslandFeilmelding(tilbakeITid),
        skalFeltetVises: mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        nullstillVedAvhengighetEndring: true,
    });

    const fraDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'modal.trygdnårbegynte.feilmelding',
        sluttdatoAvgrensning: tilbakeITid ? gårsdagensDato() : dagensDato(),
        nullstillVedAvhengighetEndring: true,
    });

    const tilDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: tilbakeITid,
        feilmeldingSpråkId: 'modal.trygdnåravsluttet.spm',
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: dagenEtterDato(fraDatoBarnetrygdperiode.verdi),
    });

    const månedligBeløp = useFelt<string>({
        verdi: '',
        feltId: BarnetrygdperiodeSpørsmålId.månedligBeløp,
        valideringsfunksjon: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9\s.\\/]{1,7}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    <SpråkTekst
                        id={
                            verdi === ''
                                ? 'ombarnet.trygdbeløp.feilmelding'
                                : 'ombarnet.trygdbeløp.format.feilmelding'
                        }
                    />
                );
            }
        },

        skalFeltetVises: avhengigheter =>
            avhengigheter.mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        avhengigheter: { mottarEøsBarnetrygdNå },
    });

    const skjema = useSkjema<IBarnetrygdperioderFeltTyper, 'string'>({
        felter: {
            mottarEøsBarnetrygdNå,
            barnetrygdsland,
            fraDatoBarnetrygdperiode,
            tilDatoBarnetrygdperiode,
            månedligBeløp,
        },

        skjemanavn: 'barnetrygdperioder',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
