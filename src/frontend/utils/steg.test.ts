import { erStegUtfyltFrafør } from './steg';

describe('erStegUtfyltFraFør', () => {
    test('Skal returnere false dersom siste utfylte steg er før nåværende steg', () => {
        const nåværendeSteg = 2;
        const sisteUtfylteSteg = 3;
        expect(erStegUtfyltFrafør(nåværendeSteg, sisteUtfylteSteg)).toEqual(false);
    });

    test('Skal returnere true dersom siste utfylte steg er det samme som nåværende steg', () => {
        const nåværendeSteg = 2;
        const sisteUtfylteSteg = 2;
        expect(erStegUtfyltFrafør(nåværendeSteg, sisteUtfylteSteg)).toEqual(true);
    });

    test('Skal returnere true dersom siste utfylte steg er etter nåværende steg', () => {
        const nåværendeSteg = 2;
        const sisteUtfylteSteg = 1;
        expect(erStegUtfyltFrafør(nåværendeSteg, sisteUtfylteSteg)).toEqual(true);
    });
});
