import { useApp } from '../context/AppContext';
import { PersonType } from '../typer/personType';
import { FlettefeltVerdier } from '../typer/sanity/sanity';
import { IModalerTekstinnhold } from '../typer/sanity/tekstInnhold';

export const hentLeggTilPeriodeTekster = (
    modal: keyof IModalerTekstinnhold,
    personType: PersonType,
    antallPerioder: number,
    flettefeltForLeggTilPeriodeForklaring?: FlettefeltVerdier | undefined,
    flettefeltForFlerePerioder?: FlettefeltVerdier | undefined
): { tekstForKnapp: string; tekstForModal: string } | undefined => {
    try {
        const { tekster, plainTekst } = useApp();

        const modalTekster = tekster()['FELLES'].modaler[modal][personType];

        const tekstForKnapp =
            antallPerioder === 0
                ? plainTekst(
                      modalTekster.leggTilPeriodeForklaring,
                      flettefeltForLeggTilPeriodeForklaring
                  )
                : plainTekst(modalTekster.flerePerioder, flettefeltForFlerePerioder);

        const tekstForModal = plainTekst(
            modalTekster.leggTilPeriodeForklaring,
            flettefeltForLeggTilPeriodeForklaring
        );

        return {
            tekstForKnapp,
            tekstForModal,
        };
    } catch (error) {
        console.error(`Kunne ikke hente modal-tekster for ${modal}.${personType}`, error);
        return undefined;
    }
};
