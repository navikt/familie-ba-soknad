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
    gjelderForBarnId: [],
    gjelderForSøker: false,
    harSendtInn: false,
    opplastedeVedlegg: [],
});

// [12345, 12346]
// [12345]

export const genererOppdatertDokumentasjon = (
    dokumentasjon: IDokumentasjon,
    kreverDokumentasjon,
    barneIder: string[]
) => {
    let oppdatertDokumentasjon = dokumentasjon;
    barneIder.forEach(barnId => {
        if (kreverDokumentasjon) {
            if (!dokumentasjon.gjelderForBarnId.includes(barnId)) {
                oppdatertDokumentasjon = {
                    ...dokumentasjon,
                    gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].concat(barnId),
                };
            }
        } else {
            oppdatertDokumentasjon = {
                ...dokumentasjon,
                gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].filter(
                    id => id !== barnId
                ),
            };
        }
    });

    return oppdatertDokumentasjon;
};

export const erDokumentasjonRelevant = (dokumentasjon: IDokumentasjon) =>
    dokumentasjon.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON ||
    dokumentasjon.gjelderForSøker ||
    dokumentasjon.gjelderForBarnId.length;
