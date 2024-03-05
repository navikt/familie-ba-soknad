export enum EKillSwitchToggle {
    ORDINAER = 'familie-ba-soknad.disable-soknad-ordinaer',
    UTVIDET = 'familie-ba-soknad.disable-soknad-utvidet',
}

export enum EFeatureToggle {
    KOMBINER_SOKNADER = 'KOMBINER_SOKNADER',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    KOMBINER_SOKNADER: 'familie-ba-soknad.kombiner-soknader',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
