import { ESvar } from '@navikt/familie-form-elements';

import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { mockEøs } from '../../../utils/testing';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { PensjonSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    arbeidsperioderIdNummerLand,
    idNummerLandMedPeriodeType,
    pensjonsperioderIdNummerLand,
    PeriodeType,
    utenlandsperioderIdNummerLand,
} from './idnummerUtils';

describe('idNummerLandMedPeriodeType', () => {
    it('Skal returnere idnummer til utenlandsperiode dersom det er flere like land på tvers av perioder', () => {
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

describe('utenlandsperioderIdNummerLand', () => {
    it('Skal returnere land kun 1 gang dersom det er flere like land i samme liste', () => {
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
            {
                utenlandsoppholdÅrsak: {
                    id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                    svar: EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
                },
                oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: 'BEL' },
            },
        ];
        expect(utenlandsperioderIdNummerLand(utenlandsperioder, erEøsLand)).toEqual(['BEL']);
    });
});

describe('arbeidsperioderIdNummerLand', () => {
    it('Skal returnere land kun 1 gang dersom det er flere like land i samme liste', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const arbeidsperioder: IArbeidsperiode[] = [
            {
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'NLD',
                },
            },
            {
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: 'NLD',
                },
            },
        ];
        expect(arbeidsperioderIdNummerLand(arbeidsperioder, erEøsLand)).toEqual(['NLD']);
    });
});

describe('pensjonsperioderIdNummerLand', () => {
    it('Skal returnere land kun 1 gang dersom det er flere like land i samme liste', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'NLD', 'BGR'].includes(landKode));

        const pensjonsperioder: IPensjonsperiode[] = [
            {
                mottarPensjonNå: { id: PensjonSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
                pensjonsland: { id: PensjonSpørsmålId.pensjonsland, svar: 'BGR' },
            },
            {
                mottarPensjonNå: { id: PensjonSpørsmålId.mottarPensjonNå, svar: ESvar.JA },
                pensjonsland: { id: PensjonSpørsmålId.pensjonsland, svar: 'BGR' },
            },
        ];
        expect(pensjonsperioderIdNummerLand(pensjonsperioder, erEøsLand)).toEqual(['BGR']);
    });
});
