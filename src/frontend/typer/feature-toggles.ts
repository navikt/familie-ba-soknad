export enum EKillSwitchToggle {
    SOKNAD = 'familie-ba-soknad.disable-soknad',
}

export enum EFeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
    NYE_MODAL_TEKSTER = 'NYE_MODAL_TEKSTER',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ba-soknad.eksempel',
    [EFeatureToggle.NYE_MODAL_TEKSTER]: 'familie-ba-soknad.nye-modal-tekster',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
