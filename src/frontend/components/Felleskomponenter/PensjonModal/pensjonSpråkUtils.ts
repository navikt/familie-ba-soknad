import { IBarnMedISøknad } from '../../../typer/søknad';

enum SpråkIds {
    MOTTAR_NÅ_SPM = 'MOTTAR_NÅ_SPM',
    MOTTAR_NÅ_FEIL = 'MOTTAR_NÅ_FEIL',
    LAND_SPM_FORTID = 'LAND_SPM_FORTID',
    LAND_SPM_NÅTID = 'LAND_SPM_NÅTID',
    LAND_FEIL_FORTID = 'LAND_FEIL_FORTID',
    LAND_FEIL_NÅTID = 'LAND_FEIL_NÅTID',
    FRA_DATO_SPM_FORTID = 'FRA_DATO_SPM_FORTID',
    FRA_DATO_SPM_NÅTID = 'FRA_DATO_SPM_NÅTID',
    FRA_DATO_FEIL_FORTID = 'FRA_DATO_FEIL_FORTID',
    FRA_DATO_FEIL_NÅTID = 'FRA_DATO_FEIL_NÅTID',
}

const andreForelderSpråkIds: Record<SpråkIds, string> = {
    [SpråkIds.MOTTAR_NÅ_SPM]: 'ombarnet.andre-forelder.pensjonnå.spm',
    [SpråkIds.MOTTAR_NÅ_FEIL]: 'ombarnet.andre-forelder.pensjonnå.feilmelding',
    [SpråkIds.LAND_SPM_FORTID]: 'felles.hvilketlandpensjonandreforelder.spm',
    [SpråkIds.LAND_SPM_NÅTID]: 'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [SpråkIds.LAND_FEIL_FORTID]: 'felles.hvilketlandpensjonandreforelder.feilmelding',
    [SpråkIds.LAND_FEIL_NÅTID]: 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding',
    [SpråkIds.FRA_DATO_SPM_FORTID]: 'felles.modal.franårfikkpensjonandreforelder.spm',
    [SpråkIds.FRA_DATO_SPM_NÅTID]: 'ombarnet.franårandreforelderpensjon.spm',
    [SpråkIds.FRA_DATO_FEIL_FORTID]: 'felles.modal.franårfikkpensjonandreforelder.feilmelding',
    [SpråkIds.FRA_DATO_FEIL_NÅTID]: 'ombarnet.franårandreforelderpensjon.feilmelding',
};

const søkerSpråkIds: Record<SpråkIds, string> = {
    [SpråkIds.MOTTAR_NÅ_SPM]: 'modal.fårdupensjonnå.spm',
    [SpråkIds.MOTTAR_NÅ_FEIL]: 'modal.fårdupensjonnå.feilmelding',
    [SpråkIds.LAND_SPM_FORTID]: 'felles.hvilketlandpensjon.spm',
    [SpråkIds.LAND_SPM_NÅTID]: 'omdeg.utenlandspensjon.land.spm',
    [SpråkIds.LAND_FEIL_FORTID]: 'felles.hvilketlandpensjon.feilmelding',
    [SpråkIds.LAND_FEIL_NÅTID]: 'omdeg.utenlandspensjon.land.feilmelding',
    [SpråkIds.FRA_DATO_SPM_FORTID]: 'felles.modal.franårfikkpensjon.spm',
    [SpråkIds.FRA_DATO_SPM_NÅTID]: 'felles.franårpensjon.spm',
    [SpråkIds.FRA_DATO_FEIL_FORTID]: 'felles.modal.franårfikkpensjon.feilmelding',
    [SpråkIds.FRA_DATO_FEIL_NÅTID]: 'omdeg.franårpensjon.feilmelding',
};

export const mottarNåSpmSpråkId = (barn?: IBarnMedISøknad) => {
    if (barn) {
        return andreForelderSpråkIds[SpråkIds.MOTTAR_NÅ_SPM];
    }
    return søkerSpråkIds[SpråkIds.MOTTAR_NÅ_SPM];
};

export const mottarNåFeilmeldingSpråkId = (barn?: IBarnMedISøknad) => {
    if (barn) {
        return andreForelderSpråkIds[SpråkIds.MOTTAR_NÅ_FEIL];
    }
    return søkerSpråkIds[SpråkIds.MOTTAR_NÅ_FEIL];
};

const generiskOppslag = (
    mottarNå: boolean,
    nåtidId: SpråkIds,
    fortidId: SpråkIds,
    barn?: IBarnMedISøknad
) => {
    if (barn) {
        return andreForelderSpråkIds[mottarNå ? nåtidId : fortidId];
    }
    return søkerSpråkIds[mottarNå ? nåtidId : fortidId];
};

export const pensjonslandSpmSpråkId = (mottarNå: boolean, barn?: IBarnMedISøknad) => {
    return generiskOppslag(mottarNå, SpråkIds.LAND_SPM_NÅTID, SpråkIds.LAND_SPM_FORTID, barn);
};

export const pensjonslandFeilmeldingSpråkId = (mottarNå: boolean, barn?: IBarnMedISøknad) => {
    return generiskOppslag(mottarNå, SpråkIds.LAND_FEIL_NÅTID, SpråkIds.LAND_FEIL_FORTID, barn);
};

export const fraDatoSpmSpråkId = (mottarNå: boolean, barn?: IBarnMedISøknad) => {
    return generiskOppslag(
        mottarNå,
        SpråkIds.FRA_DATO_SPM_NÅTID,
        SpråkIds.FRA_DATO_SPM_FORTID,
        barn
    );
};

export const fraDatoFeilmeldingSpråkId = (mottarNå: boolean, barn?: IBarnMedISøknad) => {
    return generiskOppslag(
        mottarNå,
        SpråkIds.FRA_DATO_FEIL_NÅTID,
        SpråkIds.FRA_DATO_FEIL_FORTID,
        barn
    );
};

export const tilDatoFeilmeldingSpråkId = 'felles.nåravsluttetpensjon.feilmelding';
export const tilDatoSpørsmålSpråkId = 'felles.nåravsluttetpensjon.spm';
