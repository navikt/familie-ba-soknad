import { useState } from 'react';

import createUseContext from 'constate';

import { hentDataFraRessurs } from '@navikt/familie-typer';

import useFørsteRender from '../hooks/useFørsteRender';
import { basePath } from '../Miljø';
import { EFeatureToggle, ToggleKeys } from '../typer/feature-toggles';
import { useLastRessurserContext } from './LastRessurserContext';

const [FeatureTogglesProvider, useFeatureToggles] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();
    const [toggles, setToggles] = useState<Partial<Record<EFeatureToggle, boolean>>>({});

    useFørsteRender(() => {
        Object.entries(ToggleKeys).forEach(async ([toggleKey, toggleValue]) => {
            const toggleRespons = await axiosRequest<boolean, void>({
                url: `${basePath}toggles/${toggleValue}`,
            });

            setToggles(prevState => ({
                ...prevState,
                [EFeatureToggle[toggleKey]]: hentDataFraRessurs(toggleRespons) ?? false,
            }));
        });
    });

    return {
        toggles,
    };
});

export { FeatureTogglesProvider, useFeatureToggles };
