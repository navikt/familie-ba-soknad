import { ESvar } from '@navikt/familie-form-elements';

import type { ISODateString } from '../../../common/typer/ISODateString';
import type { ISøknadsfelt, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import type { IEøsBarnetrygdsperiodeIKontraktFormat } from '../../../common/typer/kontrakt/kontrakt';
import type { IBarnMedISøknad } from '../../typer/barn';
import type { IEøsBarnetrygdsperiode } from '../../typer/perioder';
import { type PeriodePersonTypeProps, PersonType } from '../../typer/personType';
import type { IBarnetrygdsperiodeTekstinnhold } from '../../typer/sanity/modaler/barnetrygdperiode';
import type { ISøknadSpørsmål } from '../../typer/spørsmål';
import { formaterDatostringKunMåned } from '../dato';
import { landkodeTilSpråk } from '../språk';
import { uppercaseFørsteBokstav } from '../visning';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonperiodeIKontraktFormatParams {
    periode: IEøsBarnetrygdsperiode;
    periodeNummer: number;
    tekster: IBarnetrygdsperiodeTekstinnhold;
    tilRestLocaleRecord: TilRestLocaleRecord;
    barn: IBarnMedISøknad;
}

export const tilIEøsBarnetrygsperiodeIKontraktFormat = ({
    periode,
    periodeNummer,
    tekster,
    tilRestLocaleRecord,
    barn,
    personType,
    erDød,
}: PensjonperiodeIKontraktFormatParams &
    PeriodePersonTypeProps): ISøknadsfelt<IEøsBarnetrygdsperiodeIKontraktFormat> => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = periode;

    const periodenErAvsluttet =
        mottarEøsBarnetrygdNå.svar === ESvar.NEI || (personType === PersonType.AndreForelder && erDød);

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarEøsBarnetrygdNå: mottarEøsBarnetrygdNå.svar
                ? {
                      label: tilRestLocaleRecord(tekster.mottarBarnetrygdNa.sporsmal, {
                          barnetsNavn: barn?.navn,
                      }),
                      verdi: sammeVerdiAlleSpråk(mottarEøsBarnetrygdNå.svar),
                  }
                : null,
            barnetrygdsland: {
                label: tilRestLocaleRecord(
                    periodenErAvsluttet ? tekster.barnetrygdLandFortid.sporsmal : tekster.barnetrygdLandNatid.sporsmal,
                    {
                        barnetsNavn: barn?.navn,
                    }
                ),
                verdi: verdiCallbackAlleSpråk(
                    locale => barnetrygdsland && landkodeTilSpråk(barnetrygdsland.svar, locale)
                ),
            },
            fraDatoBarnetrygdperiode: {
                label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                verdi: datoTilVerdiForKontrakt(fraDatoBarnetrygdperiode),
            },
            tilDatoBarnetrygdperiode: tilDatoBarnetrygdperiode.svar
                ? {
                      label: tilRestLocaleRecord(tekster.sluttdato.sporsmal),
                      verdi: datoTilVerdiForKontrakt(tilDatoBarnetrygdperiode),
                  }
                : null,
            månedligBeløp: {
                label: tilRestLocaleRecord(tekster.belopPerManed.sporsmal, {
                    barnetsNavn: barn?.navn,
                }),
                verdi: sammeVerdiAlleSpråk(månedligBeløp.svar),
            },
        }),
    };

    function datoTilVerdiForKontrakt(skjemaSpørsmål: ISøknadSpørsmål<ISODateString | ''>) {
        return verdiCallbackAlleSpråk(locale =>
            uppercaseFørsteBokstav(formaterDatostringKunMåned(skjemaSpørsmål.svar, locale))
        );
    }
};
