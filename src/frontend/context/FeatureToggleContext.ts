import { useState } from 'react';

import createUseContext from 'constate';

import { hentDataFraRessurs } from '@navikt/familie-typer';

import { basePath } from '../Miljø';
import { EFeatureToggle } from '../typer/feature-toggles';
import { useLastRessurserContext } from './LastRessurserContext';

const [FeatureTogglesProvider, useFeatureToggles] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();
    const [toggles, setToggles] = useState<Partial<Record<EFeatureToggle, boolean>>>({});

    const fetchFeatureToggle = async (toggle: EFeatureToggle, defaultVerdi) => {
        const toggleRespons = await axiosRequest<boolean, void>({
            url: `${basePath}toggles/${toggle}`,
        });
        const toggleState = hentDataFraRessurs(toggleRespons) ?? defaultVerdi;
        setToggles(prevState => ({
            ...prevState,
            [toggle]: toggleState,
        }));

        return toggleState;
    };

    const brukFeatureToggle = async (toggle: EFeatureToggle, defaultVerdi = false) => {
        if (toggle in toggles) {
            return toggles[toggle];
        }
        return await fetchFeatureToggle(toggle, defaultVerdi);
    };

    return {
        brukFeatureToggle,
        toggles,
    };
});

export { FeatureTogglesProvider, useFeatureToggles };
