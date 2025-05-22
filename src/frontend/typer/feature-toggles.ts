export enum EKillSwitchToggle {
    SOKNAD = 'familie-ba-soknad.disable-soknad',
}

export enum EFeatureToggle {
    // EKSEMPEL = 'EKSEMPEL',
    NYE_MODAL_TEKSTER = 'NYE_MODAL_TEKSTER',
    BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD = 'BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD',
}

export const ToggleKeys: Record<EFeatureToggle, string> = {
    // [EFeatureToggle.EKSEMPEL]: 'familie-ba-soknad.eksempel',
    [EFeatureToggle.NYE_MODAL_TEKSTER]: 'familie-ba-soknad.nye-modal-tekster',
    [EFeatureToggle.BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD]:
        'familie-ba-soknad.bruk_nytt_endepunkt_for_innsending_av_soknad',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
};
