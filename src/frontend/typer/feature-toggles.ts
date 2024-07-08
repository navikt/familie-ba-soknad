export enum EKillSwitchToggle {
    SOKNAD = 'familie-ba-soknad.disable-soknad',
}

export enum EFeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
    NYE_MODAL_TEKSTER = 'NYE_MODAL_TEKSTER',
    NYE_VEDLEGGSTEKSTER = 'NYE_VEDLEGGSTEKSTER',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ba-soknad.eksempel',
    [EFeatureToggle.NYE_MODAL_TEKSTER]: 'familie-ba-soknad.nye-modal-tekster',
    [EFeatureToggle.NYE_VEDLEGGSTEKSTER]: 'familie-ba-soknad.nye-vedleggstekster',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
