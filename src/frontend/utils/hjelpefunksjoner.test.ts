import { trimWhiteSpace } from './hjelpefunksjoner';

describe('hjelpefunksjoner', () => {
    describe('trimWhiteSpace', () => {
        test('Skal returnere Hans Hansen dersom man sender inn "   Hans     Hansen    "', () => {
            expect(trimWhiteSpace('   Hans     Hansen    ')).toEqual('Hans Hansen');
        });
    });
});
