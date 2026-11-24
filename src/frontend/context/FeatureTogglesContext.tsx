import { type AllFeatureToggles, defaultFeatureToggleValues } from '@common/typer/feature-toggles';
import { createContext, type PropsWithChildren, useContext } from 'react';

export interface FeatureTogglesContext {
    toggles: AllFeatureToggles;
}

const FeatureTogglesContext = createContext<FeatureTogglesContext | undefined>(undefined);

interface Props extends PropsWithChildren {
    toggles?: AllFeatureToggles;
}

export function FeatureTogglesProvider({ toggles = defaultFeatureToggleValues, children }: Props) {
    return <FeatureTogglesContext.Provider value={{ toggles }}>{children}</FeatureTogglesContext.Provider>;
}

export function useFeatureToggles() {
    const context = useContext(FeatureTogglesContext);
    if (context === undefined) {
        throw new Error('useFeatureToggles må brukes innenfor FeatureTogglesProvider');
    }
    return context;
}
