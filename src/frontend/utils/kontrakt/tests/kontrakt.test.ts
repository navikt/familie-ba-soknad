import * as bokmål from '../../../assets/lang/nb.json';
import { ISøknad, ISøknadKontrakt } from '../../../typer/søknad';
import { dataISøknadKontraktFormat } from '../kontrakt';
import { getIntlMockObject } from './mockIntl';
import { inputISøknad, outputSoknadKontrakt } from './testData1';

describe('Test mapping av ISøknad til ISøknadKontrakt ', () => {
    it('test 1', () => {
        const intl = getIntlMockObject(bokmål);
        const mappedISøknadKontrakt: ISøknadKontrakt = dataISøknadKontraktFormat(
            inputISøknad as ISøknad,
            intl
        );
        expect(mappedISøknadKontrakt).toEqual(outputSoknadKontrakt);
    });
});
