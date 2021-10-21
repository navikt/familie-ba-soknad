import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

import { ESvar } from '@navikt/familie-form-elements';

import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    IBarn,
    IBarnMedISøknad,
} from '../../../typer/person';
import { genererInitialBarnMedISøknad } from '../../../utils/barn';
import { mockEøs, silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from './spørsmål';
import { useOmBarnet } from './useOmBarnet';

describe('useOmBarnet', () => {
    beforeEach(() => mockEøs());
    const barnFraPdl: IBarn = {
        id: 'random-id-1',
        navn: 'Barn Barnessen',
        ident: '1234',
        borMedSøker: true,
        alder: undefined,
        adressebeskyttelse: false,
    };

    beforeEach(() => {
        silenceConsoleErrors();
        jest.useFakeTimers('modern');
    });

    it('Setter institusjonsfelter til tomme strenger hvis barnet ikke bor på institusjon', async () => {
        const barn: Partial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad(barnFraPdl),
            [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { result } = renderHook(
            () => {
                return useOmBarnet('random-id-1');
            },
            { wrapper: TestProvidere }
        );

        const {
            current: {
                skjema: {
                    felter: {
                        institusjonsnavn,
                        institusjonsadresse,
                        institusjonspostnummer,
                        institusjonOppholdStartdato,
                        institusjonOppholdSluttdato,
                    },
                },
            },
        } = result;

        expect(institusjonsnavn.verdi).toEqual('');
        expect(institusjonsadresse.verdi).toEqual('');
        expect(institusjonspostnummer.verdi).toEqual('');
        expect(institusjonOppholdStartdato.verdi).toEqual('');
        expect(institusjonOppholdSluttdato.verdi).toEqual('');
        expect(institusjonsnavn.erSynlig).toEqual(false);
        expect(institusjonsadresse.erSynlig).toEqual(false);
        expect(institusjonspostnummer.erSynlig).toEqual(false);
        expect(institusjonOppholdStartdato.erSynlig).toEqual(false);
        expect(institusjonOppholdSluttdato.erSynlig).toEqual(false);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('Setter oppholdslandfelter til tomme dersom barnet ikke oppholder seg i utlandet', async () => {
        const barn: Partial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad(barnFraPdl),
            [barnDataKeySpørsmål.oppholderSegIUtland]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { result } = renderHook(
            () => {
                return useOmBarnet('random-id-1');
            },
            { wrapper: TestProvidere }
        );

        const {
            current: {
                skjema: {
                    felter: { oppholdsland, oppholdslandStartdato, oppholdslandSluttdato },
                },
            },
        } = result;

        expect(oppholdsland.verdi).toEqual('');
        expect(oppholdslandStartdato.verdi).toEqual('');
        expect(oppholdslandSluttdato.verdi).toEqual('');
        expect(oppholdsland.erSynlig).toEqual(false);
        expect(oppholdslandStartdato.erSynlig).toEqual(false);
        expect(oppholdslandSluttdato.erSynlig).toEqual(false);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('Setter opphold i Norge-felter til tomme dersom barnet har oppholdt seg i Norge siste 12 mnd', async () => {
        const barn: Partial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad(barnFraPdl),
            [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { result } = renderHook(
            () => {
                return useOmBarnet('random-id-1');
            },
            { wrapper: TestProvidere }
        );

        const {
            current: {
                skjema: {
                    felter: { nårKomBarnTilNorgeDato, planleggerÅBoINorge12Mnd },
                },
            },
        } = result;

        expect(nårKomBarnTilNorgeDato.verdi).toEqual('');
        expect(nårKomBarnTilNorgeDato.erSynlig).toEqual(false);
        expect(planleggerÅBoINorge12Mnd.verdi).toEqual(null);
        expect(planleggerÅBoINorge12Mnd.erSynlig).toEqual(false);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('Fjerner at man skal oppgi andre foreldrens fødselsnummer når man ikke vil oppgi personopplysninger', async () => {
        const barn: Partial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad(barnFraPdl),
            [barnDataKeySpørsmål.andreForelderNavn]: {
                svar: AlternativtSvarForInput.UKJENT,
                id: OmBarnetSpørsmålsId.andreForelderNavn,
            },
            [barnDataKeySpørsmål.erFosterbarn]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.hvemErFosterbarn,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { result } = renderHook(
            () => {
                return useOmBarnet('random-id-1');
            },
            { wrapper: TestProvidere }
        );

        const {
            current: {
                skjema: {
                    felter: { andreForelderNavn, andreForelderNavnUkjent, andreForelderFnr },
                },
            },
        } = result;

        expect(andreForelderNavn.verdi).toEqual('');
        expect(andreForelderNavn.erSynlig).toEqual(true);
        expect(andreForelderNavnUkjent.erSynlig).toEqual(true);
        expect(andreForelderNavnUkjent.verdi).toEqual(ESvar.JA);
        expect(andreForelderFnr.erSynlig).toEqual(false);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });
});
