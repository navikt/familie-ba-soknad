import { ESvar } from '@navikt/familie-form-elements';

import { barnetrygdperiodeModalSpørsmålSpråkId } from '../../components/Felleskomponenter/Barnetrygdperiode/barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from '../../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IEøsBarnetrygdsperiodeIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IEøsBarnetrygdsperiode } from '../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../typer/personType';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonperiodeIKontraktFormatParams {
    periode: IEøsBarnetrygdsperiode;
    periodeNummer: number;
    barn: IBarnMedISøknad;
}

export const tilIEøsBarnetrygsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    barn,
    personType,
    erDød,
}: PensjonperiodeIKontraktFormatParams &
    PeriodePersonTypeProps): ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormatV7> => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = periode;
    const periodenErAvsluttet =
        mottarEøsBarnetrygdNå.svar === ESvar.NEI ||
        (personType === PersonType.AndreForelder && erDød);
    const hentSpørsmålTekstId = (spørsmålId: string) =>
        hentTekster(
            barnetrygdperiodeModalSpørsmålSpråkId(personType, periodenErAvsluttet)[spørsmålId],
            {
                ...(barn && { barn: barn.navn }),
            }
        );

    return {
        label: hentTekster('ombarnet.trygdandreperioder.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarEøsBarnetrygdNå: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå),
                verdi: sammeVerdiAlleSpråk(mottarEøsBarnetrygdNå?.svar),
            },
            barnetrygdsland: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.barnetrygdsland),
                verdi: verdiCallbackAlleSpråk(
                    locale => barnetrygdsland && landkodeTilSpråk(barnetrygdsland.svar, locale)
                ),
            },
            fraDatoBarnetrygdperiode: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode),
                verdi: sammeVerdiAlleSpråk(fraDatoBarnetrygdperiode?.svar),
            },

            tilDatoBarnetrygdperiode: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode),
                verdi: sammeVerdiAlleSpråk(tilDatoBarnetrygdperiode?.svar ?? null),
            },

            månedligBeløp: {
                label: hentSpørsmålTekstId(BarnetrygdperiodeSpørsmålId.månedligBeløp),
                verdi: sammeVerdiAlleSpråk(månedligBeløp.svar),
            },
        }),
    };
};
