export enum BarnetrygdperiodeSpørsmålsId {
    mottarBarnetrygdNå = 'mottar-barnetrygd-nå',
    barnetrygdsland = 'barnetrygdsland',
    fraDatoBarnetrygdperiode = 'fra-dato-barnetrygdperiode',
    tilDatoBarnetrygdperiode = 'til-dato-barnetrygdperiode',
    månedligBeløp = 'månedlig-beløp',
}

export const barnetrygdperiodeSøkerSpørsmålSpråkId = (
    tilbakeITid = false
): Record<BarnetrygdperiodeSpørsmålsId, string> => ({
    [BarnetrygdperiodeSpørsmålsId.mottarBarnetrygdNå]: 'modal.barnetrygdnå.spmm',
    [BarnetrygdperiodeSpørsmålsId.barnetrygdsland]: tilbakeITid
        ? 'modal.hvilketlandbarnetrygd.spm'
        : 'ombarnet.hvilketlandfår.spm',
    [BarnetrygdperiodeSpørsmålsId.fraDatoBarnetrygdperiode]: 'modal.trygdnårbegynte.spm',
    [BarnetrygdperiodeSpørsmålsId.tilDatoBarnetrygdperiode]: 'modal.trygdnåravsluttet.spm',
    [BarnetrygdperiodeSpørsmålsId.månedligBeløp]: 'ombarnet.trygdbeløp.spm',
});
