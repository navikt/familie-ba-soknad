export enum OmBarnetSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjon-opphold-startdato',
    institusjonOppholdSluttdato = 'institusjon-opphold-sluttdato',
    institusjonOppholdVetIkke = 'institusjon-opphold-ukjent-sluttdato',
    oppholdsland = 'oppholdsland',
    oppholdslandStartdato = 'utenlandsopphold-startdato ',
    oppholdslandSluttdato = 'utenlandsopphold-sluttdato',
    oppholdslandSluttDatoVetIkke = 'utenlandsopphold-ukjent-sluttdato',
    nårKomBarnetTilNorge = 'når-kom-barnet-til-norge',
    planleggerÅBoINorge12Mnd = 'planlegger-å-bo-sammenhengende-i-norge-12mnd',
    barnetrygdFraEøslandHvilketLand = 'barnetrygd-hvilket-eøsland',
}

export const OmBarnetSpørsmålSpråkId: Record<OmBarnetSpørsmålsId, string> = {
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
};
