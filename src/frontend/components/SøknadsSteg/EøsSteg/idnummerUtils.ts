import { Alpha3Code } from 'i18n-iso-countries';

import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';

export enum PeriodeType {
    arbeidsperiode = 'arbeidsperiode',
    pensjonsperiode = 'pensjonsperiode',
    utenlandsperiode = 'utenlandsperiode',
}

export type IdNummerLandMedPeriodeType = {
    periodeType: PeriodeType;
    land: Alpha3Code | undefined | '';
};

export const idNummerLandMedPeriodeType = (
    arbeidsperioderUtland: IArbeidsperiode[],
    pensjonsperioderUtland: IPensjonsperiode[],
    utenlandsperioder: IUtenlandsperiode[],
    eøsLand: (land: Alpha3Code | '') => boolean
): IdNummerLandMedPeriodeType[] => {
    const arbeidsperioderSomKreverIdNummer = arbeidsperioderUtland.filter(
        arbeidsperiode =>
            !!arbeidsperiode.arbeidsperiodeland?.svar &&
            eøsLand(arbeidsperiode.arbeidsperiodeland.svar)
    );

    const pensjonsperioderSomKreverIdNummer = pensjonsperioderUtland.filter(
        pensjonsperiode =>
            pensjonsperiode.pensjonsland?.svar && eøsLand(pensjonsperiode.pensjonsland.svar)
    );

    const utenlandsperioderSomKreverIdNummer = utenlandsperioder.filter(
        utenlandsperiode =>
            utenlandsperiode.oppholdsland.svar && eøsLand(utenlandsperiode.oppholdsland.svar)
    );

    const mapArbeidTilIdNummerLandMedPeriodeType = arbeidsperioderSomKreverIdNummer.map(
        periode => ({
            periodeType: PeriodeType.arbeidsperiode,
            land: periode.arbeidsperiodeland?.svar,
        })
    );
    const mapPensjonTilIdNummerLandMedPeriodeType = pensjonsperioderSomKreverIdNummer.map(
        periode => ({
            periodeType: PeriodeType.pensjonsperiode,
            land: periode.pensjonsland?.svar,
        })
    );
    const mapUtenlandsppholdTilIdNummerLandMedPeriodeType = utenlandsperioderSomKreverIdNummer.map(
        periode => ({
            periodeType: PeriodeType.utenlandsperiode,
            land: periode.oppholdsland.svar,
        })
    );
    return [
        ...mapArbeidTilIdNummerLandMedPeriodeType,
        ...mapPensjonTilIdNummerLandMedPeriodeType,
        ...mapUtenlandsppholdTilIdNummerLandMedPeriodeType,
    ];
};
