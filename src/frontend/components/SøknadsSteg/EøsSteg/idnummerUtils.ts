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

export const idNummerLandMedPeriodeType = (
    arbeidsperioderUtland: IArbeidsperiode[],
    pensjonsperioderUtland: IPensjonsperiode[],
    utenlandsperioder: IUtenlandsperiode[],
    erEøsLand: (land: Alpha3Code | '') => boolean
): IdNummerLandMedPeriodeType[] => {
    const utenlandsperioderLandSomKreverIdNummer = utenlandsperioder
        .map(utenlandsperiode => utenlandsperiode.oppholdsland.svar)
        .filter(land => land && erEøsLand(land));

    const arbeidsperioderLandSomKreverIdNummer = arbeidsperioderUtland
        .map(arbeidsperiode => arbeidsperiode.arbeidsperiodeland?.svar)
        .filter(
            land =>
                land && erEøsLand(land) && !utenlandsperioderLandSomKreverIdNummer.includes(land)
        );

    const pensjonsperioderLandSomKreverIdNummer = pensjonsperioderUtland
        .map(periode => periode.pensjonsland?.svar)
        .filter(
            land =>
                land &&
                erEøsLand(land) &&
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
