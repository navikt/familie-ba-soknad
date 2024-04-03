export enum EKillSwitchToggle {
    SOKNAD = 'familie-ba-soknad.disable-soknad',
}

export enum EFeatureToggle {
    KOMBINER_SOKNADER = 'KOMBINER_SOKNADER',
    BE_OM_MÅNED_IKKE_DATO = 'BE_OM_MÅNED_IKKE_DATO',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    [EFeatureToggle.KOMBINER_SOKNADER]: 'familie-ba-soknad.kombiner-soknader',
    [EFeatureToggle.BE_OM_MÅNED_IKKE_DATO]: 'familie-ba-soknad.be-om-mnd-ikke-dato',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
