import { renderHook } from '@testing-library/react-hooks';

import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/person';
import { genererInitialBarnMedISøknad } from '../../../utils/person';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { useOmBarnet } from './useOmBarnet';

describe('useOmBarnet', () => {
    it('Setter institusjonsfelter til tome strenger hvis barnet ikke bor på institusjon', () => {
        const barn: Partial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad({
                navn: 'Barn Barnessen',
                ident: '1234',
                borMedSøker: true,
                alder: undefined,
                adressebeskyttelse: false,
            }),
            [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });
        silenceConsoleErrors();

        const { result } = renderHook(
            () => {
                return useOmBarnet('1234');
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
    });
});
