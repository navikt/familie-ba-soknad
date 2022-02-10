import { Alpha3Code } from 'i18n-iso-countries';

import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';

export const idNummerKeyPrefix = 'idnummer-';

export enum PeriodeType {
    arbeidsperiode = 'arbeidsperiode',
    pensjonsperiode = 'pensjonsperiode',
    utenlandsperiode = 'utenlandsperiode',
}

export type IdNummerLandMedPeriodeType = {
    land: Alpha3Code | undefined | '';
    periodeType: PeriodeType;
};

export const fjernDuplikat = (land: (Alpha3Code | '' | undefined)[]) =>
    land.filter((land, index) => land && !land.includes(land, index + 1));

export const utenlandsperioderIdNummerLand = (
    utenlandsperioder: IUtenlandsperiode[],
    erEøsLand: (land: Alpha3Code | '') => boolean
) => {
    const landSomKreverIdNummer = utenlandsperioder
        .map(periode => periode.oppholdsland.svar)
        .filter(land => land && erEøsLand(land));
    return fjernDuplikat(landSomKreverIdNummer);
};

export const arbeidsperioderIdNummerLand = (
    arbeidsperioder: IArbeidsperiode[],
    erEøsLand: (land: Alpha3Code | '') => boolean
) => {
    const landSomKreverIdNummer = arbeidsperioder
        .map(periode => periode.arbeidsperiodeland?.svar)
        .filter(land => land && erEøsLand(land));
    return fjernDuplikat(landSomKreverIdNummer);
};

export const pensjonsperioderIdNummerLand = (
    pernsjonsperioder: IPensjonsperiode[],
    erEøsLand: (land: Alpha3Code | '') => boolean
) => {
    const landSomKreverIdNummer = pernsjonsperioder
        .map(periode => periode.pensjonsland?.svar)
        .filter(land => land && erEøsLand(land));
    return fjernDuplikat(landSomKreverIdNummer);
};

export const idNummerLandMedPeriodeType = (
    arbeidsperioderUtland: IArbeidsperiode[],
    pensjonsperioderUtland: IPensjonsperiode[],
    utenlandsperioder: IUtenlandsperiode[],
    erEøsLand: (land: Alpha3Code | '') => boolean
): IdNummerLandMedPeriodeType[] => {
    const utenlandsperioderLandSomKreverIdNummer = utenlandsperioderIdNummerLand(
        utenlandsperioder,
        erEøsLand
    );

    const arbeidsperioderLandSomKreverIdNummer = arbeidsperioderIdNummerLand(
        arbeidsperioderUtland,
        erEøsLand
    ).filter(land => land && !utenlandsperioderLandSomKreverIdNummer.includes(land));

    const pensjonsperioderLandSomKreverIdNummer = pensjonsperioderIdNummerLand(
        pensjonsperioderUtland,
        erEøsLand
    ).filter(
        land =>
            land &&
            !arbeidsperioderLandSomKreverIdNummer.includes(land) &&
            !utenlandsperioderLandSomKreverIdNummer.includes(land)
    );

    const mapArbeidTilIdNummerLandMedPeriodeType = arbeidsperioderLandSomKreverIdNummer.map(
        land => ({
            land,
            periodeType: PeriodeType.arbeidsperiode,
        })
    );
    const mapPensjonTilIdNummerLandMedPeriodeType = pensjonsperioderLandSomKreverIdNummer.map(
        land => ({
            land,
            periodeType: PeriodeType.pensjonsperiode,
        })
    );
    const mapUtenlandsppholdTilIdNummerLandMedPeriodeType =
        utenlandsperioderLandSomKreverIdNummer.map(land => ({
            land,
            periodeType: PeriodeType.utenlandsperiode,
        }));

    return [
        ...mapArbeidTilIdNummerLandMedPeriodeType,
        ...mapPensjonTilIdNummerLandMedPeriodeType,
        ...mapUtenlandsppholdTilIdNummerLandMedPeriodeType,
    ];
};
