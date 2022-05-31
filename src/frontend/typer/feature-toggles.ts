export enum EToggle {
    ORDINAER = 'familie-ba-soknad.disable-soknad-ordinaer',
    UTVIDET = 'familie-ba-soknad.disable-soknad-utvidet',
}

export enum EFeatureToggle {}
/**
 * true -> fullt EØS skjema
 * false -> eøs dekkes ved opplasting av utfylt pdf
 */
//EXAMPLE = 'EXAMPLE',

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EXAMPLE]: 'familie-ba-soknad.example',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;
