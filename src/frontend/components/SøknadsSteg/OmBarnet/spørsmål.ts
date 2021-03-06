export enum OmBarnetSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjon-opphold-startdato',
    institusjonOppholdSluttdato = 'institusjon-opphold-sluttdato',
    institusjonOppholdVetIkke = 'institusjon-opphold-ukjent-sluttdato',
    oppholdsland = 'barn-oppholdsland',
    oppholdslandStartdato = 'barn-utenlandsopphold-startdato',
    oppholdslandSluttdato = 'barn-utenlandsopphold-sluttdato',
    oppholdslandSluttDatoVetIkke = 'barn-utenlandsopphold-ukjent-sluttdato',
    nårKomBarnetTilNorge = 'når-kom-barnet-til-norge',
    planleggerÅBoINorge12Mnd = 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
    barnetrygdFraEøslandHvilketLand = 'barnetrygd-hvilket-eøsland',
    andreForelderNavn = 'andre-forelder-navn',
    andreForelderNavnUkjent = 'andre-forelder-navn-ukjent',
    andreForelderFnr = 'andre-forelder-fødsels-/dnummer',
    andreForelderFnrUkjent = 'andre-forelder-fødsels-/dnummer-ukjent',
    andreForelderFødselsdato = 'andre-forelder-fødselsdato',
    andreForelderFødselsdatoUkjent = 'andre-forelder-fødselsdato-ukjent',
    andreForelderArbeidUtlandet = 'andre-forelder-arbeid',
    andreForelderArbeidUtlandetHvilketLand = 'andre-forelder-arbeid-hvilket-land',
    andreForelderPensjonUtland = 'andre-forelder-pensjon-utland',
    andreForelderPensjonHvilketLand = 'andre-forelder-pensjon-hvilket-land',
    borFastMedSøker = 'bor-barnet-fast-med-deg',
    skriftligAvtaleOmDeltBosted = 'skriftlig-avtale-om-delt-bosted',
    søkerForSpesieltTidsrom = 'søker-for-tidsrom',
    søkerForTidsromStartdato = 'søker-for-tidsrom-startdato',
    søkerForTidsromSluttdato = 'søker-for-tidsrom-sluttdato',
    søkerIkkeForTidsrom = 'søker-ikke-for-tidsrom',
}

export const omBarnetSpørsmålSpråkId: Record<OmBarnetSpørsmålsId, string> = {
    [OmBarnetSpørsmålsId.institusjonsnavn]: 'ombarnet.institusjon.navn.spm',
    [OmBarnetSpørsmålsId.institusjonsadresse]: 'ombarnet.institusjon.adresse.spm',
    [OmBarnetSpørsmålsId.institusjonspostnummer]: 'ombarnet.institusjon.postnummer.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdStartdato]: 'ombarnet.institusjon.startdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdSluttdato]: 'ombarnet.institusjon.sluttdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdVetIkke]: 'ombarnet.institusjon.ukjent-sluttdato.spm',
    [OmBarnetSpørsmålsId.oppholdsland]: 'ombarnet.oppholdutland.land.spm',
    [OmBarnetSpørsmålsId.oppholdslandStartdato]: 'ombarnet.oppholdutland.startdato.spm',
    [OmBarnetSpørsmålsId.oppholdslandSluttdato]: 'ombarnet.oppholdutland.sluttdato.spm',
    [OmBarnetSpørsmålsId.oppholdslandSluttDatoVetIkke]:
        'ombarnet.oppholdutland.ukjent-sluttdato.spm',
    [OmBarnetSpørsmålsId.nårKomBarnetTilNorge]: 'ombarnet.sammenhengende-opphold.dato.spm',
    [OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd]: 'ombarnet.planlagt-sammenhengende-opphold.spm',
    [OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand]: 'ombarnet.barnetrygd-eøs.land.spm',
    [OmBarnetSpørsmålsId.andreForelderNavn]: 'ombarnet.andre-forelder.navn.spm',
    [OmBarnetSpørsmålsId.andreForelderNavnUkjent]: 'ombarnet.andre-forelder.navn-ukjent.spm',
    [OmBarnetSpørsmålsId.andreForelderFnr]: 'felles.fødsels-eller-dnummer.label',
    [OmBarnetSpørsmålsId.andreForelderFnrUkjent]: 'ombarnet.andre-forelder.fnr-ukjent.spm',
    [OmBarnetSpørsmålsId.andreForelderFødselsdato]: 'felles.fødselsdato.label',
    [OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent]: 'felles.fødselsdato-ukjent',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandet]: 'ombarnet.andre-forelder.arbeid-utland.spm',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand]:
        'ombarnet.andre-forelder.arbeid-utland.land.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonUtland]:
        'ombarnet.andre-forelder.utenlandspensjon.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand]:
        'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [OmBarnetSpørsmålsId.borFastMedSøker]: 'ombarnet.bor-fast.spm',
    [OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted]: 'ombarnet.delt-bosted.spm',
    [OmBarnetSpørsmålsId.søkerForSpesieltTidsrom]: 'ombarnet.søker-for-periode.spm',
    [OmBarnetSpørsmålsId.søkerForTidsromStartdato]: 'ombarnet.søker-for-periode.startdato.spm',
    [OmBarnetSpørsmålsId.søkerForTidsromSluttdato]: 'ombarnet.søker-for-periode.sluttdato.spm',
    [OmBarnetSpørsmålsId.søkerIkkeForTidsrom]: 'ombarnet.søker-for-periode.vetikke.spm',
};
