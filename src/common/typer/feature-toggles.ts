export enum KillSwitchToggle {
    SOKNAD = 'familie-ba-soknad.disable-soknad',
}

export enum FeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
}

export const ToggleKeys: Record<FeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ba-soknad.eksempel',
};

export type AllFeatureToggles = Record<FeatureToggle, boolean>;

export const defaultFeatureToggleValues: AllFeatureToggles = {
    ...Object.values(FeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as AllFeatureToggles),
    ...{},
};
