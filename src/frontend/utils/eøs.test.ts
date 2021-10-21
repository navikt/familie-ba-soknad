import { Alpha3Code } from 'i18n-iso-countries';

import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
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
                    oppholdsland: { ...søknad.søker.oppholdsland, svar: 'ALA' },
                    arbeidsland: { ...søknad.søker.arbeidsland, svar: 'ALA' },
                    pensjonsland: { ...søknad.søker.pensjonsland, svar: 'ALA' },
                },
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
                'ALA',
                'BEL',
                'BEL',
                'DEU',
                'DEU',
            ]);
        });
    });
});
