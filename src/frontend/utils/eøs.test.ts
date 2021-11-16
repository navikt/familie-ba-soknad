import { Alpha3Code } from 'i18n-iso-countries';
import { mockDeep } from 'jest-mock-extended';

import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { IUtenlandsperiode } from '../typer/person';
import { ISøknad } from '../typer/søknad';
import { landSvarSomKanTriggeEøs } from './eøs';
import { mekkGyldigSøknad } from './testing';

describe('eøs', () => {
    describe('landSvarSomKanTriggeEøs', () => {
        it('returnerer riktig mengde landsvar', () => {
            const søknad = mekkGyldigSøknad();
            const mockSøknad: ISøknad = {
                ...søknad,
                søker: {
                    ...søknad.søker,
                    arbeidsland: { ...søknad.søker.arbeidsland, svar: 'ALA' },
                    pensjonsland: { ...søknad.søker.pensjonsland, svar: 'ALA' },
                    utenlandsperioder: [
                        mockDeep<IUtenlandsperiode>({ oppholdsland: { svar: 'FIN' } }),
                    ],
                },
                barnInkludertISøknaden: [
                    {
                        ...søknad.barnInkludertISøknaden[0],
                        barnetrygdFraEøslandHvilketLand: {
                            id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
                            svar: 'BEL' as Alpha3Code,
                        },
                        andreForelderArbeidUtlandetHvilketLand: {
                            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
                            svar: 'DEU' as Alpha3Code,
                        },
                        andreForelderPensjonHvilketLand: {
                            id: OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
                            svar: 'DEU' as Alpha3Code,
                        },
                    },
                ],
            };

            expect(landSvarSomKanTriggeEøs(mockSøknad)).toEqual([
                'ALA',
                'ALA',
                'FIN',
                'BEL',
                'DEU',
                'DEU',
            ]);
        });
    });
});
