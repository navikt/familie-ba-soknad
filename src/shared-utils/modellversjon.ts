import familieTyper from '@navikt/familie-typer';

export const modellVersjon = 32;

export const modellVersjonHeaderName = 'Soknad-Modell-Versjon';

export const modellMismatchMelding = 'UTDATERT_MODELL';

export interface ModellMismatchRespons {
    modellVersjon: number;
}

export const erModellMismatchResponsRessurs = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ressurs: familieTyper.ApiRessurs<any> | familieTyper.Ressurs<any>
): ressurs is familieTyper.ApiRessurs<ModellMismatchRespons> => {
    if (!('melding' in ressurs)) {
        return false;
    }

    return (
        ressurs.melding === modellMismatchMelding &&
        ressurs.status === familieTyper.RessursStatus.FEILET
    );
};
