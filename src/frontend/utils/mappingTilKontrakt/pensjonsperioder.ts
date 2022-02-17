import { pensjonsperiodeOppsummeringOverskrift } from '../../components/Felleskomponenter/Pensjonsmodal/språkUtils';
import {
    hentPensjonsperiodeSpørsmålIder,
    PensjonSpørsmålId,
} from '../../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IPensjonsperiodeIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IPensjonsperiode } from '../../typer/perioder';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const tilIPensjonsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    tilbakeITid,
    gjelderAndreForelder,
    erAndreForelderDød,
    gjelderUtlandet,
}: {
    periode: IPensjonsperiode;
    periodeNummer: number;
    tilbakeITid: boolean;
    gjelderAndreForelder: boolean;
    erAndreForelderDød: boolean;
    gjelderUtlandet: boolean;
}): ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7> => {
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = periode;

    return {
        label: hentTekster(pensjonsperiodeOppsummeringOverskrift(gjelderUtlandet), {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarPensjonNå: {
                label: hentTekster(
                    hentPensjonsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[PensjonSpørsmålId.mottarPensjonNå]
                ),
                verdi: sammeVerdiAlleSpråk(mottarPensjonNå?.svar),
            },
            pensjonsland: {
                label: hentTekster(
                    hentPensjonsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[PensjonSpørsmålId.pensjonsland]
                ),
                verdi: verdiCallbackAlleSpråk(
                    locale => pensjonsland && landkodeTilSpråk(pensjonsland.svar, locale)
                ),
            },
            pensjonFra: {
                label: hentTekster(
                    hentPensjonsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[PensjonSpørsmålId.fraDatoPensjon]
                ),
                verdi: sammeVerdiAlleSpråk(pensjonFra?.svar),
            },
            pensjonTil: {
                label: hentTekster(
                    hentPensjonsperiodeSpørsmålIder(
                        gjelderAndreForelder,
                        tilbakeITid,
                        erAndreForelderDød
                    )[PensjonSpørsmålId.tilDatoPensjon]
                ),
                verdi: sammeVerdiAlleSpråk(pensjonTil?.svar),
            },
        }),
    };
};
