export enum OmBarnetUfyllendeSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
}

export const OmBarnetSpørsmålSpråkId: Record<OmBarnetUfyllendeSpørsmålsId, string> = {
    [OmBarnetUfyllendeSpørsmålsId.institusjonsnavn]: 'ombarnet.institusjon.navn.spm',
    [OmBarnetUfyllendeSpørsmålsId.institusjonsadresse]: 'ombarnet.institusjon.adresse.spm',
    [OmBarnetUfyllendeSpørsmålsId.institusjonspostnummer]: 'ombarnet.institusjon.postnummer.spm',
};
