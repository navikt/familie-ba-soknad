import { PersonType } from '../../../typer/personType';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

export const barnetrygdslandFeilmelding = (
    periodenErAvsluttet: boolean,
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'modal.annenforelder-barnetrygd-fortid.feilmelding'
                : 'modal.annenforelder-barnetrygd-nåtid.feilmelding';
        }
        case PersonType.Søker:
        default: {
            return periodenErAvsluttet
                ? 'modal.hvilketlandbarnetrygd.feilmelding'
                : 'ombarnet.hvilketlandfår.feilmelding';
        }
    }
};

export const barnetrygdSpørsmålSpråkId = (personType: PersonType, erDød?: boolean): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return erDød
                ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderBarnetrygdGjenlevende]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderBarnetrygd];
        }
        case PersonType.Søker:
        default:
            return omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.mottarEllerMottokEøsBarnetrygd];
    }
};

export const barnetrygdperiodeFlereSpørsmål = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'eøs-om-barn.andre-forelder-barnetrygd-flere-perioder.spm';
        case PersonType.Omsorgsperson:
            return 'eøs-om-barn.omsorgsperson-barnetrygd-flere-perioder.spm';
        case PersonType.Søker:
        default:
            return 'ombarnet.trygdandreperioder.spm';
    }
};

export const mottarBarnetrygdNåFeilmelding = (personType: PersonType) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'modal.barnetrygdnå-annenforelder.feilmelding';
        case PersonType.Søker:
        default:
            return 'modal.barnetrygdnå.feilmelding';
    }
};

export const barnetrygdperiodeSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<BarnetrygdperiodeSpørsmålId, string> => ({
    [BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs]: 'modal.trygdandreperioder.tittel',
    [BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå]: 'modal.barnetrygdnå.spm',
    [BarnetrygdperiodeSpørsmålId.barnetrygdsland]: periodenErAvsluttet
        ? 'modal.hvilketlandbarnetrygd.spm'
        : 'ombarnet.hvilketlandfår.spm',
    [BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode]: 'modal.trygdnårbegynte.spm',
    [BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode]: 'modal.trygdnåravsluttet.spm',
    [BarnetrygdperiodeSpørsmålId.månedligBeløp]: 'ombarnet.trygdbeløp.spm',
});

export const barnetrygdperiodeAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<BarnetrygdperiodeSpørsmålId, string> => ({
    [BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs]: 'modal.trygdandreperioder.tittel',
    [BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå]: 'modal.barnetrygdnå-annenforelder.spm',
    [BarnetrygdperiodeSpørsmålId.barnetrygdsland]: periodenErAvsluttet
        ? 'modal.annenforelder-barnetrygd-fortid.spm'
        : 'modal.annenforelder-barnetrygd-nåtid.spm',
    [BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode]: 'modal.trygdnårbegynte.spm',
    [BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode]: 'modal.trygdnåravsluttet.spm',
    [BarnetrygdperiodeSpørsmålId.månedligBeløp]: 'ombarnet.trygdbeløp.spm',
});

export const barnetrygdperiodeModalSpørsmålSpråkId =
    (personType: PersonType, periodenErAvsluttet: boolean) =>
    (spørsmålId: BarnetrygdperiodeSpørsmålId): string => {
        switch (personType) {
            case PersonType.AndreForelder:
                return barnetrygdperiodeAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[
                    spørsmålId
                ];
            case PersonType.Søker:
            default:
                return barnetrygdperiodeSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
        }
    };
