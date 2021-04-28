export enum OmBarnetSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStart = 'institusjon-opphold-startdato',
    institusjonOppholdSlutt = 'institusjon-opphold-sluttdato',
    institusjonOppholdVetIkke = 'institusjon-opphold-ukjent-sluttdato',
}

export const OmBarnetSpørsmålSpråkId: Record<OmBarnetSpørsmålsId, string> = {
    [OmBarnetSpørsmålsId.institusjonsnavn]: 'ombarnet.institusjon.navn.spm',
    [OmBarnetSpørsmålsId.institusjonsadresse]: 'ombarnet.institusjon.adresse.spm',
    [OmBarnetSpørsmålsId.institusjonspostnummer]: 'ombarnet.institusjon.postnummer.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdStart]: 'ombarnet.institusjon.startdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdSlutt]: 'ombarnet.institusjon.sluttdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdVetIkke]: 'ombarnet.institusjon.ukjent-sluttdato.spm',
};
