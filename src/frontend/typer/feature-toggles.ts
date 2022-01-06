export enum EToggle {
    ORDINAER = 'familie-ba-soknad.disable-soknad-ordinaer',
    UTVIDET = 'familie-ba-soknad.disable-soknad-utvidet',
}

/**
 * true -> fullt EØS skjema
 * false -> eøs dekkes ved opplasting av utfylt pdf
 */
export enum EFeatureToggle {
    EØS_KOMPLETT = 'EØS_KOMPLETT',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    [EFeatureToggle.EØS_KOMPLETT]: 'familie-ba-soknad.nytt-eos-skjema',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;
