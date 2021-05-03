export enum OmBarnetSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjon-opphold-startdato',
    institusjonOppholdSluttdato = 'institusjon-opphold-sluttdato',
    institusjonOppholdVetIkke = 'institusjon-opphold-ukjent-sluttdato',
    oppholdsland = '',
    oppholdslandStartdato = '',
    oppholdslandSluttdato = '',
}

export const OmBarnetSpørsmålSpråkId: Record<OmBarnetSpørsmålsId, string> = {
    [OmBarnetSpørsmålsId.institusjonsnavn]: 'ombarnet.institusjon.navn.spm',
    [OmBarnetSpørsmålsId.institusjonsadresse]: 'ombarnet.institusjon.adresse.spm',
    [OmBarnetSpørsmålsId.institusjonspostnummer]: 'ombarnet.institusjon.postnummer.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdStartdato]: 'ombarnet.institusjon.startdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdSluttdato]: 'ombarnet.institusjon.sluttdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdVetIkke]: 'ombarnet.institusjon.ukjent-sluttdato.spm',
    [OmBarnetSpørsmålsId.oppholdsland]: '',
    [OmBarnetSpørsmålsId.oppholdslandStartdato]: '',
    [OmBarnetSpørsmålsId.oppholdslandSluttdato]: '',
};
