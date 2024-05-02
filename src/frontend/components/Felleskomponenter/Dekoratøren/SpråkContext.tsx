import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { useCookies } from 'react-cookie';

import { onLanguageSelect, setParams } from '@navikt/nav-dekoratoren-moduler';

export enum LocaleType {
    en = 'en',
    nb = 'nb',
    nn = 'nn',
}

const dekoratorLanguageCookieName = 'decorator-language';

export const [SpråkProvider, useSpråk] = createUseContext(() => {
    const [cookies] = useCookies([dekoratorLanguageCookieName]);
    const { [dekoratorLanguageCookieName]: dekoratørSpråk } = cookies;

    const defaultSpråk = (dekoratørSpråk as LocaleType) ?? LocaleType.nb;

    const [valgtLocale, settValgtLocale] = useState<LocaleType>(defaultSpråk);

    useEffect(() => {
        setParams({
            language: defaultSpråk,
            availableLanguages: [
                { locale: 'nb', handleInApp: true },
                { locale: 'nn', handleInApp: true },
                { locale: 'en', handleInApp: true },
            ],
        }).then(); // Bryr oss egenlig ikke om hva som skjer etterpå men intellij klager på ignorert promise
    }, []);

    onLanguageSelect(language => {
        settValgtLocale(language.locale as LocaleType);
        document.documentElement.lang = language.locale;
    });

    return {
        valgtLocale,
    };
});
