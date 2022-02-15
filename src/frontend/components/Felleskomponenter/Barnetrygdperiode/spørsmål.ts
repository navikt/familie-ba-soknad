export enum BarnetrygdperiodeSpørsmålId {
    barnetrygdsperiodeEøs = 'barnetrygdsperiode-eøs',
    mottarEøsBarnetrygdNå = 'mottar-barnetrygd-nå',
    barnetrygdsland = 'barnetrygdsland',
    fraDatoBarnetrygdperiode = 'fra-dato-barnetrygdperiode',
    tilDatoBarnetrygdperiode = 'til-dato-barnetrygdperiode',
    månedligBeløp = 'månedlig-beløp',
}

export const barnetrygdperiodeSpørsmålSpråkId = (
    tilbakeITid: boolean
): Record<BarnetrygdperiodeSpørsmålId, string> => ({
    [BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs]: 'modal.trygdandreperioder.tittel',
    [BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå]: 'modal.barnetrygdnå.spm',
    [BarnetrygdperiodeSpørsmålId.barnetrygdsland]: tilbakeITid
        ? 'modal.hvilketlandbarnetrygd.spm'
        : 'ombarnet.hvilketlandfår.spm',
    [BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode]: 'modal.trygdnårbegynte.spm',
    [BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode]: 'modal.trygdnåravsluttet.spm',
    [BarnetrygdperiodeSpørsmålId.månedligBeløp]: 'ombarnet.trygdbeløp.spm',
});
