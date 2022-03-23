export enum EøsBarnSpørsmålId {
    andreForelderPensjonNorge = 'andre-forelder-pensjon-norge',
    andreForelderPensjonNorgeEnke = 'andre-forelder-pensjon-norge-enke',
    andreForelderArbeidNorge = 'andre-forelder-arbeid-norge',
    andreForelderArbeidNorgeEnke = 'andre-forelder-arbeid-norge-enke',
    andreForelderAndreUtbetalinger = 'andre-forelder-andre-utbetalinger',
    andreForelderAndreUtbetalingerEnke = 'andre-forelder-andre-utbetalinger-enke',
    søkersSlektsforhold = 'søkers-slektsforhold',
    søkersSlektsforholdSpesifisering = 'søkers-slektsforhold-spesifisering',
    borMedAndreForelder = 'bor-med-andre-forelder',
    omsorgspersonNavn = 'omsorgsperson-navn',
    omsorgspersonSlektsforhold = 'omsorgsperson-slektsforhold',
    omsorgspersonSlektsforholdSpesifisering = 'omsorgsperson-slektsforhold-spesifisering',
    omsorgspersonIdNummerVetIkke = 'omsorgsperson-id-nummer-vet-ikke',
    omsorgspersonIdNummer = 'omsorgsperson-id-nummer',
    omsorgspersonAdresse = 'omsorgsperson-adresse',
    idNummer = 'id-nummer',
    idNummerAndreForelder = 'id-nummer-andre-forelder',
    idNummerUkjent = 'id-nummer-ukjent',
}

export const eøsBarnSpørsmålSpråkId: Record<EøsBarnSpørsmålId, string> = {
    [EøsBarnSpørsmålId.andreForelderPensjonNorge]: 'eøs-om-barn.andreforelderpensjon.spm',
    [EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke]: 'enkeenkemann.andreforelderpensjon.spm',
    [EøsBarnSpørsmålId.andreForelderArbeidNorge]:
        'eøs-om-barn.annenforelderarbeidsperiodenorge.spm',
    [EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke]: 'enkeenkemann.annenforelderarbeidnorge.spm',
    [EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke]: 'enkeenkemann.annenforelderytelser.spm',
    [EøsBarnSpørsmålId.andreForelderAndreUtbetalinger]: 'eøs-om-barn.andreforelderutbetalinger.spm',
    [EøsBarnSpørsmålId.søkersSlektsforhold]: 'eøs-om-barn.dittslektsforhold.spm',
    [EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering]: 'eøs-om-barn.dinrelasjon.spm',
    [EøsBarnSpørsmålId.borMedAndreForelder]: 'eøs-om-barn.borbarnmedandreforelder.spm',
    [EøsBarnSpørsmålId.omsorgspersonNavn]: 'eøs-om-barn.annenomsorgspersonnavn.spm',
    [EøsBarnSpørsmålId.omsorgspersonSlektsforhold]:
        'eøs-om-barn.annenomsorgspersonslektsforhold.spm',
    [EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering]:
        'eøs-om-barn.annenomsorgspersonrelasjon.spm',
    [EøsBarnSpørsmålId.omsorgspersonIdNummer]: 'eøs-om-barn.annenomsorgspersonidnummer.spm',
    [EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke]: 'felles.kjennerikkeidnummer.sjekkboks',
    [EøsBarnSpørsmålId.omsorgspersonAdresse]: 'eøs-om-barn.annenomsorgspersonoppholdssted.spm',
    [EøsBarnSpørsmålId.idNummer]: 'eøs-om-barn.barnidnummer.spm',
    [EøsBarnSpørsmålId.idNummerAndreForelder]: 'eøs-om-barn.andreforelderidnummer.spm',
    [EøsBarnSpørsmålId.idNummerUkjent]: 'felles.kjennerikkeidnummer.sjekkboks',
};
