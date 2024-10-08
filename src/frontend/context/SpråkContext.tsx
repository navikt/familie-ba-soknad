import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { useCookies } from 'react-cookie';

import { onLanguageSelect, setParams } from '@navikt/nav-dekoratoren-moduler';

import { LocaleType } from '../typer/common';

const dekoratorLanguageCookieName = 'decorator-language';

export const [SpråkProvider, useSpråk] = createUseContext(() => {
    const [cookies, setCookie] = useCookies([dekoratorLanguageCookieName]);
    const { [dekoratorLanguageCookieName]: dekoratørSpråk } = cookies;

    const defaultSpråk = (dekoratørSpråk as LocaleType) ?? LocaleType.nb;

    const [valgtLocale, settValgtLocale] = useState<LocaleType>(defaultSpråk);

    useEffect(() => {
        setParams({
            language: defaultSpråk,
        }).then(); // Bryr oss egenlig ikke om hva som skjer etterpå men intellij klager på ignorert promise
    }, []);

    onLanguageSelect(language => {
        settValgtLocale(language.locale as LocaleType);
        document.documentElement.lang = language.locale;
        setCookie(dekoratorLanguageCookieName, language.locale);
    });

    return {
        valgtLocale,
    };
});
