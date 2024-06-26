import { useApp } from '../context/AppContext';
import { PersonType } from '../typer/personType';
import { FlettefeltVerdier } from '../typer/sanity/sanity';
import { IModalerTekstinnhold } from '../typer/sanity/tekstInnhold';

export const hentPeriodeKnappHjelpetekst = (
    modal: keyof IModalerTekstinnhold,
    personType: PersonType,
    antallPerioder: number,
    flettefeltForLeggTilPeriodeKnappHjelpetekst?: FlettefeltVerdier | undefined,
    flettefeltForFlerePerioder?: FlettefeltVerdier | undefined
): string | undefined => {
    const { tekster, plainTekst } = useApp();

    let hjelpetekst: string | undefined = undefined;

    try {
        const modalTekst = tekster()['FELLES'].modaler[modal][personType];
        hjelpetekst =
            antallPerioder === 0
                ? plainTekst(
                      modalTekst.leggTilPeriodeKnappHjelpetekst,
                      flettefeltForLeggTilPeriodeKnappHjelpetekst
                  )
                : plainTekst(modalTekst.flerePerioder, flettefeltForFlerePerioder);
    } catch (error) {
        console.error(`Kunne ikke hente hjelpetekst for ${modal}.${personType}`, error);
    }

    return hjelpetekst;
};
