import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import { FlettefeltVerdier } from '../../../typer/sanity/sanity';

export interface IVedleggOppsummering {
    skalVises: boolean;
    dokumentasjonsbehov: Dokumentasjonsbehov;
    flettefeltVerdier?: FlettefeltVerdier;
}
