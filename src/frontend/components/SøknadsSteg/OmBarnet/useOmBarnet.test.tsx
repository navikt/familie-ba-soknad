import { renderHook } from '@testing-library/react-hooks';

import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål, IBarn, IBarnMedISøknad } from '../../../typer/person';
import { genererInitialBarnMedISøknad } from '../../../utils/person';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { useOmBarnet } from './useOmBarnet';

describe('useOmBarnet', () => {
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
    });

    it('Setter institusjonsfelter til tomme strenger hvis barnet ikke bor på institusjon', () => {
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
    });

    it('Setter oppholdslandfelter til tomme dersom barnet ikke oppholder seg i utlandet', () => {
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
    });

    it('Setter opphold i Norge-felter til tomme dersom barnet har oppholdt seg i Norge siste 12 mnd', () => {
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
        expect(planleggerÅBoINorge12Mnd.verdi).toEqual(undefined);
        expect(planleggerÅBoINorge12Mnd.erSynlig).toEqual(false);
    });
});
