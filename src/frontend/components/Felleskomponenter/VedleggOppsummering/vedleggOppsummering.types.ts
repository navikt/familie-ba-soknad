import { FlettefeltVerdier } from '../../../../common/sanity';
import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';

export interface IVedleggOppsummering {
    skalVises: boolean;
    dokumentasjonsbehov: Dokumentasjonsbehov;
    flettefeltVerdier?: FlettefeltVerdier;
}
