export enum OmBarnetUfyllendeSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
}

export const OmBarnetUfyllendeSpørsmålSpråkId: Record<OmBarnetUfyllendeSpørsmålsId, string> = {
    [OmBarnetUfyllendeSpørsmålsId.institusjonsnavn]: 'ombarnet-utfyllende.spm.institusjonsnavn',
    [OmBarnetUfyllendeSpørsmålsId.institusjonsadresse]:
        'ombarnet-utfyllende.spm.institusjonsadresse',
    [OmBarnetUfyllendeSpørsmålsId.institusjonspostnummer]:
        'ombarnet-utfyllende.spm.institusjonspostnummer',
};
