import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import {
    feil,
    type FeltState,
    ok,
    useFelt,
    useSkjema,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { IBarnMedISøknad } from '../../../typer/barn';
import { PersonType } from '../../../typer/personType';
import { IBarnetrygdsperiodeTekstinnhold } from '../../../typer/sanity/modaler/barnetrygdperiode';
import { IBarnetrygdperioderFeltTyper } from '../../../typer/skjema';
import { dagenEtterDato, dagensDato, gårsdagensDato, stringTilDate } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import TekstBlock from '../Sanity/TekstBlock';

import {
    barnetrygdslandFeilmelding,
    mottarBarnetrygdNåFeilmelding,
} from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

export interface IUsePensjonsperiodeSkjemaParams {
    personType: PersonType;
    erDød?: boolean;
    barn: IBarnMedISøknad;
}

export const useBarnetrygdperiodeSkjema = (personType: PersonType, barn, erDød) => {
    const { tekster } = useApp();

    const teksterForPersonType: IBarnetrygdsperiodeTekstinnhold =
        tekster().FELLES.modaler.barnetrygdsperiode[personType];

    const mottarEøsBarnetrygdNå = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå, svar: null },
        feilmelding: teksterForPersonType.mottarBarnetrygdNa.feilmelding,
        feilmeldingSpråkId: mottarBarnetrygdNåFeilmelding(personType),
        feilmeldingSpråkVerdier: { barn: barn.navn },
        skalSkjules: erDød,
    });

    const andreForelderErDød = personType === PersonType.AndreForelder && erDød;

    const periodenErAvsluttet = mottarEøsBarnetrygdNå.verdi === ESvar.NEI || andreForelderErDød;

    const barnetrygdsland = useLanddropdownFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.barnetrygdsland, svar: '' },
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.barnetrygdLandFortid.sporsmal
            : teksterForPersonType.barnetrygdLandNatid.sporsmal,
        feilmeldingSpråkId: barnetrygdslandFeilmelding(periodenErAvsluttet, personType),
        skalFeltetVises:
            mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød,
        nullstillVedAvhengighetEndring: true,
        feilmeldingSpråkVerdier: { barn: barn.navn },
    });

    const fraDatoBarnetrygdperiode = useDatovelgerFeltForSanity({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises:
            mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød,
        feilmelding: teksterForPersonType.startdato.feilmelding,
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
    });

    const tilDatoBarnetrygdperiode = useDatovelgerFeltForSanity({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: periodenErAvsluttet || andreForelderErDød,
        feilmelding: teksterForPersonType.sluttdato.feilmelding,
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: fraDatoBarnetrygdperiode.verdi
            ? dagenEtterDato(stringTilDate(fraDatoBarnetrygdperiode.verdi))
            : undefined,
        avhengigheter: { fraDatoBarnetrygdperiode },
        nullstillVedAvhengighetEndring: false,
    });

    const månedligBeløp = useFelt<string>({
        verdi: '',
        feltId: BarnetrygdperiodeSpørsmålId.månedligBeløp,
        valideringsfunksjon: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9\s.\\/]{1,20}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    <TekstBlock
                        block={
                            verdi === ''
                                ? teksterForPersonType.belopPerManed.feilmelding
                                : teksterForPersonType.belopFormatFeilmelding
                        }
                    />
                );
            }
        },

        skalFeltetVises: avhengigheter =>
            avhengigheter.mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK ||
            andreForelderErDød,
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
