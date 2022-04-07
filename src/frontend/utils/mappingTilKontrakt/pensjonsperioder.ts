import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { pensjonsperiodeOppsummeringOverskrift } from '../../components/Felleskomponenter/Pensjonsmodal/språkUtils';
import {
    hentPensjonsperiodeSpørsmålIder,
    PensjonSpørsmålId,
} from '../../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IPensjonsperiodeIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IPensjonsperiode } from '../../typer/perioder';
import { barnetsNavnValue } from '../barn';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const tilIPensjonsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    gjelderAndreForelder,
    erAndreForelderDød,
    gjelderUtlandet,
    barn,
    intl,
}: {
    periode: IPensjonsperiode;
    periodeNummer: number;
    gjelderAndreForelder: boolean;
    erAndreForelderDød: boolean;
    gjelderUtlandet: boolean;
    barn?: IBarnMedISøknad;
    intl?: IntlShape;
}): ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7> => {
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = periode;
    const tilbakeITid = mottarPensjonNå?.svar === ESvar.NEI || erAndreForelderDød;

    const hentSpørsmålstekster = (pensjonSpørsmålId: string) =>
        hentTekster(
            hentPensjonsperiodeSpørsmålIder(gjelderAndreForelder, tilbakeITid)[pensjonSpørsmålId],
            { ...(barn && intl && { barn: barnetsNavnValue(barn, intl) }) }
        );

    return {
        label: hentTekster(pensjonsperiodeOppsummeringOverskrift(gjelderUtlandet), {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarPensjonNå: {
                label: hentSpørsmålstekster(PensjonSpørsmålId.mottarPensjonNå),
                verdi: sammeVerdiAlleSpråk(mottarPensjonNå?.svar),
            },
            pensjonsland: {
                label: hentSpørsmålstekster(PensjonSpørsmålId.pensjonsland),
                verdi: verdiCallbackAlleSpråk(locale =>
                    pensjonsland ? landkodeTilSpråk(pensjonsland.svar, locale) : null
                ),
            },
            pensjonFra: {
                label: hentSpørsmålstekster(PensjonSpørsmålId.fraDatoPensjon),
                verdi: sammeVerdiAlleSpråk(pensjonFra?.svar ?? null),
            },
            pensjonTil: {
                label: hentSpørsmålstekster(PensjonSpørsmålId.tilDatoPensjon),
                verdi: sammeVerdiAlleSpråk(pensjonTil?.svar ?? null),
            },
        }),
    };
};
