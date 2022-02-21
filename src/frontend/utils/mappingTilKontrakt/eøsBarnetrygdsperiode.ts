import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import {
    BarnetrygdperiodeSpørsmålId,
    barnetrygdperiodeSpørsmålSpråkId,
} from '../../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
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
}): ISøknadsfelt<{
    mottarEøsBarnetrygdNå: ISøknadsfelt<ESvar | null>;
    barnetrygdsland: ISøknadsfelt<string | undefined>;
    fraDatoBarnetrygdperiode: ISøknadsfelt<string | undefined>;
    tilDatoBarnetrygdperiode: ISøknadsfelt<string | undefined>;
    månedligBeløp: ISøknadsfelt<string | undefined>;
}> => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = periode;
    const tilbakeITid = mottarEøsBarnetrygdNå.svar === ESvar.NEI;
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
                    barn: barnetsNavnValue(barn, intl),
                }),
                verdi: sammeVerdiAlleSpråk(månedligBeløp?.svar),
            },
        }),
    };
};
