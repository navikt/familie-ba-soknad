import { IntlShape } from 'react-intl';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getIntlMockObject = (messages?: any) => {
    const intl: IntlShape = {
        defaultFormats: {},
        defaultLocale: 'nb',
        formatDate: jest.fn(),
        formatMessage(msgDescriptor) {
            const id = msgDescriptor.id;
            const msgs = this.messages;
            const text = msgs[id].toString();
            return text;
        },
        formatNumber: jest.fn(),
        formatPlural: jest.fn(),
        formatTime: jest.fn(),
        formats: {},
        locale: 'nb',
        messages,
        onError: jest.fn(),
        formatters: {
            getDateTimeFormat: jest.fn(),
            getDisplayNames: jest.fn(),
            getListFormat: jest.fn(),
            getMessageFormat: jest.fn(),
            getNumberFormat: jest.fn(),
            getPluralRules: jest.fn(),
            getRelativeTimeFormat: jest.fn(),
        },
        formatDateTimeRange: jest.fn(),
        formatDateToParts: jest.fn(),
        formatDisplayName: jest.fn(),
        formatList: jest.fn(),
        formatListToParts: jest.fn(),
        formatNumberToParts: jest.fn(),
        formatRelativeTime: jest.fn(),
        formatTimeToParts: jest.fn(),
    };
    return intl;
};
