import { logError } from '@navikt/familie-logging';

export const envVar = (navn: string, påkrevd = true, defaultVerdi?: string): string => {
    const envVariabel = process.env[navn];
    if (!envVariabel && påkrevd && !defaultVerdi) {
        logError(`Mangler påkrevd miljøvariabel: '${navn}'`);
        process.exit(1);
    }
    if (!envVariabel && defaultVerdi) {
        return defaultVerdi;
    } else {
        return envVariabel as string;
    }
};

export const erProd = () => {
    return process.env.ENV === 'prod';
};

export const erPreprod = () => {
    return process.env.ENV === 'dev';
};

export const erLokalt = () => {
    return process.env.ENV === 'lokal';
};
