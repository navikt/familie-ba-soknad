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

export const fjernDuplikat = (landList: Alpha3Code[]): Alpha3Code[] =>
    landList.filter((land, index) => land && !landList.includes(land, index + 1));

const eøsLandUtenDuplikatHof =
    (erEøsLand: (land: Alpha3Code | '') => boolean) =>
    (landListe: (Alpha3Code | '' | undefined)[]): Alpha3Code[] => {
        const eøsLand: Alpha3Code[] = landListe.filter(
            land => !!land && erEøsLand(land)
        ) as Alpha3Code[];
        return fjernDuplikat(eøsLand);
    };

export const idNummerLandMedPeriodeType = (
    arbeidsperioderUtland: IArbeidsperiode[],
    pensjonsperioderUtland: IPensjonsperiode[],
    utenlandsperioder: IUtenlandsperiode[],
    erEøsLand: (land: Alpha3Code | '') => boolean
): IdNummerLandMedPeriodeType[] => {
    const eøsLandUtenDuplikat = eøsLandUtenDuplikatHof(erEøsLand);

    const utenlandsperioderLandSomKreverIdNummer: Alpha3Code[] = eøsLandUtenDuplikat(
        utenlandsperioder.map(periode => periode.oppholdsland.svar)
    );

    const arbeidsperioderLandSomKreverIdNummer: Alpha3Code[] = eøsLandUtenDuplikat(
        arbeidsperioderUtland.map(periode => periode.arbeidsperiodeland?.svar)
    ).filter(land => land && !utenlandsperioderLandSomKreverIdNummer.includes(land));

    const pensjonsperioderLandSomKreverIdNummer: Alpha3Code[] = eøsLandUtenDuplikat(
        pensjonsperioderUtland.map(periode => periode.pensjonsland?.svar)
    ).filter(
        land =>
            land &&
            !arbeidsperioderLandSomKreverIdNummer.includes(land) &&
            !utenlandsperioderLandSomKreverIdNummer.includes(land)
    );

    const mapArbeidTilIdNummerLandMedPeriodeType: IdNummerLandMedPeriodeType[] =
        arbeidsperioderLandSomKreverIdNummer.map(land => ({
            land,
            periodeType: PeriodeType.arbeidsperiode,
        }));
    const mapPensjonTilIdNummerLandMedPeriodeType: IdNummerLandMedPeriodeType[] =
        pensjonsperioderLandSomKreverIdNummer.map(land => ({
            land,
            periodeType: PeriodeType.pensjonsperiode,
        }));
    const mapUtenlandsppholdTilIdNummerLandMedPeriodeType: IdNummerLandMedPeriodeType[] =
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

export const idNummerLand = (
    arbeidsperioderUtland: IArbeidsperiode[],
    pensjonsperioderUtland: IPensjonsperiode[],
    utenlandsperioder: IUtenlandsperiode[],
    erEøsLand: (land: Alpha3Code | '') => boolean
) =>
    idNummerLandMedPeriodeType(
        arbeidsperioderUtland,
        pensjonsperioderUtland,
        utenlandsperioder,
        erEøsLand
    ).map(landMedPeriode => landMedPeriode.land);
