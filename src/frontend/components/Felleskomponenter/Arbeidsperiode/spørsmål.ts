export enum ArbeidsperiodeSpørsmålsId {
    arbeidsperiodeAvsluttet = 'arbeidsperiode-avluttet',
    arbeidsperioder = 'arbeidsperioder',
    arbeidsperiodeLand = 'arbeidsperiode-land',
    arbeidsgiver = 'arbeidsgiver',
    fraDatoArbeidsperiode = 'fra-dato-arbeidsperiode',
    tilDatoArbeidsperiode = 'til-dato-arbeidsperiode',
    tilDatoArbeidsperiodeVetIkke = 'til-dato-arbeidsperiode-vet-ikke',
}

export const arbeidsperiodeSpørsmålSpråkId: Record<ArbeidsperiodeSpørsmålsId, string> = {
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: 'dinlivssituasjon.arbeid-utland.land.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
};
