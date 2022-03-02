export enum OmBarnetSpørsmålsId {
    institusjonIUtland = 'institusjonIUtland',
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjon-opphold-startdato',
    institusjonOppholdSluttdato = 'institusjon-opphold-sluttdato',
    institusjonOppholdVetIkke = 'institusjon-opphold-ukjent-sluttdato',
    planleggerÅBoINorge12Mnd = 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
    pågåendeSøknadFraAnnetEøsLand = 'pågående-søknad-fra-annet-eøsland',
    barnetrygdFraEøslandHvilketLand = 'barnetrygd-hvilket-eøsland',
    mottarEllerMottokEøsBarnetrygd = 'mottar-eller-mottok-eøs-barnetrygd',
    andreForelderNavn = 'andre-forelder-navn',
    andreForelderNavnUkjent = 'andre-forelder-navn-ukjent',
    andreForelderFnr = 'andre-forelder-fødsels-/dnummer',
    andreForelderFnrUkjent = 'andre-forelder-fødsels-/dnummer-ukjent',
    andreForelderFødselsdato = 'andre-forelder-fødselsdato',
    andreForelderFødselsdatoUkjent = 'andre-forelder-fødselsdato-ukjent',
    andreForelderArbeidUtlandet = 'andre-forelder-arbeid',
    andreForelderArbeidUtlandetEnke = 'andre-forelder-arbeid-enke',
    andreForelderArbeidUtlandetHvilketLand = 'andre-forelder-arbeid-hvilket-land',
    andreForelderArbeidUtlandetHvilketLandEnke = 'andre-forelder-arbeid-hvilket-land-enke',
    andreForelderPensjonUtland = 'andre-forelder-pensjon-utland',
    andreForelderPensjonUtlandEnke = 'andre-forelder-pensjon-utland-enke',
    andreForelderPensjonHvilketLand = 'andre-forelder-pensjon-hvilket-land',
    andreForelderPensjonHvilketLandEnke = 'andre-forelder-pensjon-hvilket-land-enke',
    borFastMedSøker = 'bor-barnet-fast-med-deg',
    skriftligAvtaleOmDeltBosted = 'skriftlig-avtale-om-delt-bosted',
    søkerForTidsrom = 'søker-for-tidsrom',
    søkerForTidsromStartdato = 'søker-for-tidsrom-startdato',
    søkerForTidsromSluttdato = 'søker-for-tidsrom-sluttdato',
    søkerForTidsromSluttdatoVetIkke = 'søker-for-tidsrom-sluttdato-vetikke',
    søkerHarBoddMedAndreForelder = 'søker-har-bodd-med-andre-forelder',
    søkerFlyttetFraAndreForelderDato = 'søker-flyttet-fra-andre-forelder-dato',
    søkerBorMedAndreForelder = 'søker-bor-med-andre-forelder',
    sammeForelderSomAnnetBarn = 'samme-forelder-som-annet-barn',
}

export const omBarnetSpørsmålSpråkId: Record<OmBarnetSpørsmålsId, string> = {
    [OmBarnetSpørsmålsId.institusjonIUtland]: 'ombarnet.institusjon.i-utlandet',
    [OmBarnetSpørsmålsId.institusjonsnavn]: 'ombarnet.institusjon.navn.spm',
    [OmBarnetSpørsmålsId.institusjonsadresse]: 'ombarnet.institusjon.adresse.spm',
    [OmBarnetSpørsmålsId.institusjonspostnummer]: 'ombarnet.institusjon.postnummer.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdStartdato]: 'ombarnet.institusjon.startdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdSluttdato]: 'ombarnet.institusjon.sluttdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdVetIkke]: 'ombarnet.institusjon.ukjent-sluttdato.spm',
    [OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd]: 'ombarnet.oppholdtsammenhengende.spm',
    [OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand]: 'ombarnet.pågåendesøknad.spm',
    [OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand]: 'ombarnet.barnetrygd-eøs.land.spm',
    [OmBarnetSpørsmålsId.mottarEllerMottokEøsBarnetrygd]:
        'ombarnet.fårellerharsøktbarnetrygdeøs.spm',
    [OmBarnetSpørsmålsId.andreForelderNavn]: 'ombarnet.andre-forelder.navn.spm',
    [OmBarnetSpørsmålsId.andreForelderNavnUkjent]: 'ombarnet.andre-forelder.navn-ukjent.spm',
    [OmBarnetSpørsmålsId.andreForelderFnr]: 'felles.fødsels-eller-dnummer.label',
    [OmBarnetSpørsmålsId.andreForelderFnrUkjent]: 'ombarnet.andre-forelder.fnr-ukjent.spm',
    [OmBarnetSpørsmålsId.andreForelderFødselsdato]: 'felles.fødselsdato.label',
    [OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent]: 'felles.fødselsdato-ukjent',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandet]: 'ombarnet.andre-forelder.arbeid-utland.spm',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke]:
        'enkeenkemann.andreforelder-arbeidutland.spm',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand]:
        'ombarnet.andre-forelder.arbeid-utland.land.spm',
    [OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLandEnke]:
        'enkeenkemann.andreforelder-arbeidutland.land.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonUtland]:
        'ombarnet.andre-forelder.utenlandspensjon.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke]:
        'enkeenkemann.andre-forelder.utenlandspensjon.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand]:
        'ombarnet.andre-forelder.utenlandspensjon.land.spm',
    [OmBarnetSpørsmålsId.andreForelderPensjonHvilketLandEnke]:
        'enkeenkemann.andre-forelder.utenlandspensjon.land.spm',
    [OmBarnetSpørsmålsId.borFastMedSøker]: 'ombarnet.bor-fast.spm',
    [OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted]: 'ombarnet.delt-bosted.spm',
    [OmBarnetSpørsmålsId.søkerForTidsrom]: 'ombarnet.søker-for-periode.spm',
    [OmBarnetSpørsmålsId.søkerForTidsromStartdato]: 'ombarnet.søker-for-periode.startdato.spm',
    [OmBarnetSpørsmålsId.søkerForTidsromSluttdato]: 'ombarnet.søker-for-periode.sluttdato.spm',
    [OmBarnetSpørsmålsId.søkerForTidsromSluttdatoVetIkke]:
        'ombarnet.søker-for-periode.sluttdato.sjekkboks',
    [OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder]: 'ombarnet.boddsammenmedandreforelder.spm',
    [OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato]: 'ombarnet.nårflyttetfra.spm',
    [OmBarnetSpørsmålsId.søkerBorMedAndreForelder]: 'ombarnet.nårflyttetfra.borsammencheck',
    [OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn]: 'ombarnet.hvemerandreforelder.spm',
};
