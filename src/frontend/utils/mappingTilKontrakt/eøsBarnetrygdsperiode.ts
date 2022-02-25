import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import {
    BarnetrygdperiodeSpørsmålId,
    barnetrygdperiodeSpørsmålSpråkId,
} from '../../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IEøsBarnetrygdsperiodeIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IEøsBarnetrygdsperiode } from '../../typer/perioder';
import { barnetsNavnValue } from '../barn';
import { hentTekster, landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const tilIEøsBarnetrygsperiodeIKontraktFormat = ({
    intl,
    periode,
    periodeNummer,
    barn,
}: {
    intl: IntlShape;
    periode: IEøsBarnetrygdsperiode;
    periodeNummer: number;
    barn: IBarnMedISøknad;
}): ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormatV7> => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = periode;
    const tilbakeITid = mottarEøsBarnetrygdNå.svar === ESvar.NEI;
    const hentSpørsmålTekstId = (spørsmålId: string) =>
        hentTekster(barnetrygdperiodeSpørsmålSpråkId(tilbakeITid)[spørsmålId], {
            ...(barn && intl && { barn: barnetsNavnValue(barn, intl) }),
        });

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
