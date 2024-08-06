export enum EKillSwitchToggle {
    SOKNAD = 'familie-ba-soknad.disable-soknad',
}

export enum EFeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
    VIS_GUIDE_I_STEG = 'VIS_GUIDE_I_STEG',
    NYE_VEDLEGGSTEKSTER = 'NYE_VEDLEGGSTEKSTER',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ba-soknad.eksempel',
    [EFeatureToggle.VIS_GUIDE_I_STEG]: 'familie-ba-soknad.vis-guide-i-steg',
    [EFeatureToggle.NYE_VEDLEGGSTEKSTER]: 'familie-ba-soknad.nye-vedleggstekster',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
