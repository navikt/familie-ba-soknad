import {
    BarnetrygdperiodeSpørsmålId,
    barnetrygdperiodeSpørsmålSpråkId,
} from '../../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IEøsBarnetrygdsperiodeIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IEøsBarnetrygdsperiode } from '../../typer/perioder';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const tilIEøsBarnetrygsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    tilbakeITid,
    barn,
}: {
    periode: IEøsBarnetrygdsperiode;
    periodeNummer: number;
    tilbakeITid: boolean;
    barn: IBarnMedISøknad;
}): ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormatV7> => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = periode;
    const hentSpørsmålTekstId = barnetrygdperiodeSpørsmålSpråkId(tilbakeITid);

    return {
        label: hentTekster('ombarnet.trygdandreperioder.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarEøsBarnetrygdNå: {
                label: hentTekster(
                    hentSpørsmålTekstId[BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå]
                ),
                verdi: sammeVerdiAlleSpråk(mottarEøsBarnetrygdNå?.svar),
            },
            barnetrygdsland: {
                label: hentTekster(
                    hentSpørsmålTekstId[BarnetrygdperiodeSpørsmålId.barnetrygdsland]
                ),
                verdi: verdiCallbackAlleSpråk(
                    locale => barnetrygdsland && landkodeTilSpråk(barnetrygdsland.svar, locale)
                ),
            },
            fraDatoBarnetrygdperiode: {
                label: hentTekster(
                    hentSpørsmålTekstId[BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode]
                ),
                verdi: sammeVerdiAlleSpråk(fraDatoBarnetrygdperiode?.svar),
            },
            tilDatoBarnetrygdperiode: {
                label: hentTekster(
                    hentSpørsmålTekstId[BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode]
                ),
                verdi: sammeVerdiAlleSpråk(tilDatoBarnetrygdperiode?.svar),
            },
            månedligBeløp: {
                label: hentTekster(hentSpørsmålTekstId[BarnetrygdperiodeSpørsmålId.månedligBeløp], {
                    barn,
                }),
                verdi: sammeVerdiAlleSpråk(månedligBeløp?.svar),
            },
        }),
    };
};
