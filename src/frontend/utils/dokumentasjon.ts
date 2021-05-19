import { Dokumentasjonsbehov, IDokumentasjon } from '../typer/dokumentasjon';

export const formaterFilstørrelse = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const genererInitiellDokumentasjon = (
    dokumentasjonsbehov: Dokumentasjonsbehov,
    tittelSpråkId: string,
    beskrivelseSpråkId
): IDokumentasjon => ({
    dokumentasjonsbehov,
    tittelSpråkId,
    beskrivelseSpråkId,
    barnDetGjelderFor: [],
    harSendtInn: false,
    opplastedeVedlegg: [],
});

export const genererOppdatertDokumentasjon = (
    dokumentasjon: IDokumentasjon,
    kreverDokumentasjon,
    barneIder: string[]
) => {
    let oppdatertDokumentasjon = dokumentasjon;
    console.log('kjører');
    barneIder.forEach(barnId => {
        console.log(kreverDokumentasjon);
        if (kreverDokumentasjon) {
            if (!dokumentasjon.barnDetGjelderFor.includes(barnId)) {
                oppdatertDokumentasjon = {
                    ...dokumentasjon,
                    barnDetGjelderFor: [...oppdatertDokumentasjon.barnDetGjelderFor].concat(barnId),
                };
            }
        } else {
            oppdatertDokumentasjon = {
                ...dokumentasjon,
                barnDetGjelderFor: [...oppdatertDokumentasjon.barnDetGjelderFor].filter(
                    id => id !== barnId
                ),
            };
        }
    });

    return oppdatertDokumentasjon;
};
