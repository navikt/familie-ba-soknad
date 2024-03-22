export enum EKillSwitchToggle {
    SOKNAD = 'familie-ba-soknad.disable-soknad',
}

export enum EFeatureToggle {} // EKSEMPEL = 'EKSEMPEL',

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ba-soknad.eksempel',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
