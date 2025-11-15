import { shouldPolyfill } from '@formatjs/intl-numberformat/should-polyfill';
import { registerLocale } from 'i18n-iso-countries';

import { LocaleType } from '../common/typer/common';

export async function polyfillLocaleData() {
    await Promise.all([
        import('@formatjs/intl-numberformat/polyfill-force'),
        import('@formatjs/intl-datetimeformat/polyfill-force'),
        import(`i18n-iso-countries/langs/en.json`).then(result => registerLocale(result.default ?? result)),
        import(`i18n-iso-countries/langs/nb.json`).then(result => registerLocale(result.default ?? result)),
        import(`i18n-iso-countries/langs/nn.json`).then(result => registerLocale(result.default ?? result)),
    ]);

    const formatterForLocale: Record<string, () => Promise<void>> = {
        en: async () => {
            await Promise.all([
                import('@formatjs/intl-numberformat/locale-data/en'),
                import('@formatjs/intl-datetimeformat/locale-data/en'),
            ]);
        },
        nb: async () => {
            await Promise.all([
                import('@formatjs/intl-numberformat/locale-data/nb'),
                import('@formatjs/intl-datetimeformat/locale-data/nb'),
            ]);
        },
        nn: async () => {
            await Promise.all([
                import('@formatjs/intl-numberformat/locale-data/nn'),
                import('@formatjs/intl-datetimeformat/locale-data/nn'),
            ]);
        },
    };

    for (const locale in LocaleType) {
        if (shouldPolyfill(locale)) {
            await formatterForLocale[locale]();
        }
    }
}
