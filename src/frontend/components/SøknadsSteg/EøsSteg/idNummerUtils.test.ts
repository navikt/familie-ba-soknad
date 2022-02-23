import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { mockEøs } from '../../../utils/testing';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { PensjonSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    eøsLandUtenDuplikatHof,
    fjernDuplikat,
    idNummerLandMedPeriodeType,
    PeriodeType,
} from './idnummerUtils';

describe('idNummerLandMedPeriodeType', () => {
    it('Skal returnere idnummer-landMedPeriode til utenlandsperiode dersom det er flere like land på tvers av perioder', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioder: IUtenlandsperiode[] = [
            {
                utenlandsoppholdÅrsak: {
                    id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                    svar: EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
                },
                oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: 'BGR' },
            },
        ];
        const arbeidsperioder: IArbeidsperiode[] = [
            {
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'BGR',
                },
            },
        ];
        const pensjonsperioder: IPensjonsperiode[] = [
            {
                mottarPensjonNå: { id: PensjonSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
                pensjonsland: { id: PensjonSpørsmålId.pensjonsland, svar: 'BGR' },
            },
        ];

        expect(
            idNummerLandMedPeriodeType(
                arbeidsperioder,
                pensjonsperioder,
                utenlandsperioder,
                erEøsLand
            )
        ).toEqual([{ land: 'BGR', periodeType: PeriodeType.utenlandsperiode }]);
    });

    it('Skal returnere idnummer-land til arbeidsperiode dersom landet og finnes i pensjonsperiode', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioder: IUtenlandsperiode[] = [];
        const arbeidsperioder: IArbeidsperiode[] = [
            {
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'BGR',
                },
            },
        ];
        const pensjonsperioder: IPensjonsperiode[] = [
            {
                mottarPensjonNå: { id: PensjonSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
                pensjonsland: { id: PensjonSpørsmålId.pensjonsland, svar: 'BGR' },
            },
        ];

        expect(
            idNummerLandMedPeriodeType(
                arbeidsperioder,
                pensjonsperioder,
                utenlandsperioder,
                erEøsLand
            )
        ).toEqual([{ land: 'BGR', periodeType: PeriodeType.arbeidsperiode }]);
    });

    it('Skal returnere en liste med 3 ulike land dersom det er satt 1 ulikt land på hver periode', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioder: IUtenlandsperiode[] = [
            {
                utenlandsoppholdÅrsak: {
                    id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                    svar: EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
                },
                oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: 'BEL' },
            },
        ];
        const arbeidsperioder: IArbeidsperiode[] = [
            {
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'NLD',
                },
            },
        ];
        const pensjonsperioder: IPensjonsperiode[] = [
            {
                mottarPensjonNå: { id: PensjonSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
                pensjonsland: { id: PensjonSpørsmålId.pensjonsland, svar: 'BGR' },
            },
        ];

        expect(
            idNummerLandMedPeriodeType(
                arbeidsperioder,
                pensjonsperioder,
                utenlandsperioder,
                erEøsLand
            )
        ).toEqual([
            { land: 'NLD', periodeType: PeriodeType.arbeidsperiode },
            { land: 'BGR', periodeType: PeriodeType.pensjonsperiode },
            { land: 'BEL', periodeType: PeriodeType.utenlandsperiode },
        ]);
    });
});

describe('fjernDuplikat', () => {
    it('Skal returnere land kun 1 gang dersom det er flere like land i samme liste', () => {
        expect(fjernDuplikat(['BEL', 'BEL', 'NLD'])).toEqual(['BEL', 'NLD']);
    });
});

describe('eøsLandUtenDuplikatHof', () => {
    it('Skal returnere kun eøs land uten duplikater', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const utenlandsperioderLand: Alpha3Code[] = ['BEL', 'AFG', 'BGR'];

        expect(eøsLandUtenDuplikatHof(erEøsLand)(utenlandsperioderLand)).toEqual(['BEL', 'BGR']);
    });
});
