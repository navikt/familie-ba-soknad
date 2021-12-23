import React from 'react';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { EFeatureToggle } from '../../../typer/feature-toggles';

export const FeatureToggle: React.FC<{ toggle: EFeatureToggle }> = ({ toggle, children }) => {
    const { brukFeatureToggle, toggles } = useFeatureToggles();
    const { [toggle]: toggleState } = toggles;

    useFørsteRender(() => {
        brukFeatureToggle(toggle);
    });

    return toggleState ? <>{children}</> : null;
};
