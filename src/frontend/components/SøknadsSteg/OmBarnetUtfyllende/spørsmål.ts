export enum OmBarnetSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStart = 'institusjonOppholdStart',
    institusjonOppholdSlutt = 'institusjonOppholdSlutt',
}

export const OmBarnetSpørsmålSpråkId: Record<OmBarnetSpørsmålsId, string> = {
    [OmBarnetSpørsmålsId.institusjonsnavn]: 'ombarnet.institusjon.navn.spm',
    [OmBarnetSpørsmålsId.institusjonsadresse]: 'ombarnet.institusjon.adresse.spm',
    [OmBarnetSpørsmålsId.institusjonspostnummer]: 'ombarnet.institusjon.postnummer.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdStart]: 'ombarnet.institusjon.startdato.spm',
    [OmBarnetSpørsmålsId.institusjonOppholdSlutt]: 'ombarnet.institusjon.sluttdato.spm',
};
