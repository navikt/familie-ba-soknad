export enum ArbeidsperiodeSpørsmålsId {
    arbeidsperiodeAvsluttet = 'arbeidsperiode-avluttet',
    arbeidsperioder = 'arbeidsperioder',
    arbeidsperiodeLand = 'arbeidsperiode-land',
    arbeidsgiver = 'arbeidsgiver',
    fraDatoArbeidsperiode = 'fra-dato-arbeidsperiode',
    tilDatoArbeidsperiode = 'til-dato-arbeidsperiode',
    tilDatoArbeidsperiodeVetIkke = 'til-dato-arbeidsperiode-vet-ikke',
}

export const arbeidsperiodeSøkerSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<ArbeidsperiodeSpørsmålsId, string> => ({
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: periodenErAvsluttet
        ? 'dinlivssituasjon.arbeid-utland.land.spm'
        : 'omdeg.arbeid-utland.land.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: periodenErAvsluttet
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
});

export const arbeidsperiodeAndreForelderSpørsmålSpråkId = (
    periodenErAvsluttet = false
): Record<ArbeidsperiodeSpørsmålsId, string> => ({
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: periodenErAvsluttet
        ? 'enkeenkemann.andreforelder-arbeidutland.land.spm'
        : 'ombarnet.andre-forelder.arbeid-utland.land.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: periodenErAvsluttet
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
});

export const arbeidsperiodeSpørsmålSpråkId =
    (gjelderAndreForelder: boolean, periodenErAvsluttet: boolean) =>
    (spørsmålId: ArbeidsperiodeSpørsmålsId): string =>
        gjelderAndreForelder
            ? arbeidsperiodeAndreForelderSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId]
            : arbeidsperiodeSøkerSpørsmålSpråkId(periodenErAvsluttet)[spørsmålId];
