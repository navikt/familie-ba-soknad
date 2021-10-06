import { Alpha3Code } from 'i18n-iso-countries';

import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { landSvarSomKanTriggeEøs } from './eøs';
import { mekkGyldigSøknad } from './testing';

describe('eøs', () => {
    describe('landSvarSomKanTriggeEøs', () => {
        it('should ', () => {
            const søknad = mekkGyldigSøknad();
            const mockSøknad = {
                ...søknad,
                barnInkludertISøknaden: [
                    {
                        ...søknad.barnInkludertISøknaden[0],
                        oppholdsland: {
                            id: OmBarnetSpørsmålsId.oppholdsland,
                            svar: 'BEL' as Alpha3Code,
                        },
                        barnetrygdFraEøslandHvilketLand: {
                            id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
                            svar: 'BEL' as Alpha3Code,
                        },
                    },
                    {
                        ...søknad.barnInkludertISøknaden[0],
                        oppholdsland: {
                            id: OmBarnetSpørsmålsId.oppholdsland,
                            svar: 'BEL' as Alpha3Code,
                        },
                        barnetrygdFraEøslandHvilketLand: {
                            id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
                            svar: 'BEL' as Alpha3Code,
                        },
                    },
                ],
            };

            expect(landSvarSomKanTriggeEøs(mockSøknad)).toEqual(['BEL', 'BEL', 'BEL', 'BEL']);
        });
    });
});
