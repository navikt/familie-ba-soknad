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
    //TODO fylle inn riktige ID
    [BarnetrygdperiodeSpørsmålsId.mottarBarnetrygdNå]: 'felles.erarbeidsperiodenavsluttet.spm',
    [BarnetrygdperiodeSpørsmålsId.barnetrygdsland]: tilbakeITid
        ? 'dinlivssituasjon.arbeid-utland.land.spm'
        : 'omdeg.arbeid-utland.land.spm',
    [BarnetrygdperiodeSpørsmålsId.fraDatoBarnetrygdperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [BarnetrygdperiodeSpørsmålsId.tilDatoBarnetrygdperiode]: tilbakeITid
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [BarnetrygdperiodeSpørsmålsId.månedligBeløp]: 'felles.nåravsluttesarbeidsperiode.sjekkboks',
});
