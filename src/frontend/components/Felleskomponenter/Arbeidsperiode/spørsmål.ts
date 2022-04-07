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
    tilbakeITid = false
): Record<ArbeidsperiodeSpørsmålsId, string> => ({
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: tilbakeITid
        ? 'dinlivssituasjon.arbeid-utland.land.spm'
        : 'omdeg.arbeid-utland.land.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: tilbakeITid
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
});

export const arbeidsperiodeAndreForelderSpørsmålSpråkId = (
    tilbakeITid = false
): Record<ArbeidsperiodeSpørsmålsId, string> => ({
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]: 'felles.erarbeidsperiodenavsluttet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperioder]: 'eøs.arbeidetiutlandet.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]: tilbakeITid
        ? 'enkeenkemann.andreforelder-arbeidutland.land.spm'
        : 'ombarnet.andre-forelder.arbeid-utland.land.spm',
    [ArbeidsperiodeSpørsmålsId.arbeidsgiver]: 'felles.oppgiarbeidsgiver',
    [ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]: 'felles.nårbegyntearbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]: tilbakeITid
        ? 'felles.nåravsluttetarbeidsperiode.spm'
        : 'felles.nåravsluttesarbeidsperiode.spm',
    [ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]:
        'felles.nåravsluttesarbeidsperiode.sjekkboks',
});

export const arbeidsperiodeSpørsmålSpråkId =
    (gjelderAndreForelder: boolean, tilbakeITid: boolean) =>
    (spørsmålId: ArbeidsperiodeSpørsmålsId): string =>
        gjelderAndreForelder
            ? arbeidsperiodeAndreForelderSpørsmålSpråkId(tilbakeITid)[spørsmålId]
            : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[spørsmålId];
