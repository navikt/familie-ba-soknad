import { ESvar } from '@navikt/familie-form-elements';

import { pensjonsperiodeOppsummeringOverskrift } from '../../components/Felleskomponenter/Pensjonsmodal/språkUtils';
import {
    hentPensjonsperiodeSpørsmålIder,
    PensjonsperiodeSpørsmålId,
} from '../../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IPensjonsperiodeIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IPensjonsperiode } from '../../typer/perioder';
import { PersonType } from '../perioder';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const tilIPensjonsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    personType,
    erDød,
    gjelderUtlandet,
    barn,
}: {
    periode: IPensjonsperiode;
    periodeNummer: number;
    personType: PersonType;
    erDød: boolean;
    gjelderUtlandet: boolean;
    barn?: IBarnMedISøknad;
}): ISøknadsfelt<IPensjonsperiodeIKontraktFormatV7> => {
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = periode;
    const periodenErAvsluttet =
        mottarPensjonNå?.svar === ESvar.NEI || (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålstekster = (pensjonSpørsmålId: string) =>
        hentTekster(
            hentPensjonsperiodeSpørsmålIder(personType, periodenErAvsluttet)[pensjonSpørsmålId],
            { ...(barn && { barn: barn.navn }) }
        );

    return {
        label: hentTekster(pensjonsperiodeOppsummeringOverskrift(gjelderUtlandet), {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarPensjonNå: {
                label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.mottarPensjonNå),
                verdi: sammeVerdiAlleSpråk(mottarPensjonNå?.svar),
            },
            pensjonsland: {
                label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.pensjonsland),
                verdi: verdiCallbackAlleSpråk(locale =>
                    pensjonsland ? landkodeTilSpråk(pensjonsland.svar, locale) : null
                ),
            },
            pensjonFra: {
                label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.fraDatoPensjon),
                verdi: sammeVerdiAlleSpråk(pensjonFra?.svar ?? null),
            },
            pensjonTil: {
                label: hentSpørsmålstekster(PensjonsperiodeSpørsmålId.tilDatoPensjon),
                verdi: sammeVerdiAlleSpråk(pensjonTil?.svar ?? null),
            },
        }),
    };
};
