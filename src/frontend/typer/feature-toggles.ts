export enum EToggle {
    ORDINAER = 'familie-ba-soknad.disable-soknad-ordinaer',
    UTVIDET = 'familie-ba-soknad.disable-soknad-utvidet',
}

export enum EFeatureToggle {}

export const ToggleKeys: Record<EFeatureToggle, string> = {};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
