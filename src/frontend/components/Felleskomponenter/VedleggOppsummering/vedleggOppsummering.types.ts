import type { FlettefeltVerdier } from '../../../../common/sanity';
import type { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';

export interface IVedleggOppsummering {
    skalVises: boolean;
    dokumentasjonsbehov: Dokumentasjonsbehov;
    flettefeltVerdier?: FlettefeltVerdier;
}
