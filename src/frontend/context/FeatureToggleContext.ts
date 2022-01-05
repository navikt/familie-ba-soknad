import { useState } from 'react';

import createUseContext from 'constate';

import { hentDataFraRessurs } from '@navikt/familie-typer';

import useFørsteRender from '../hooks/useFørsteRender';
import { basePath } from '../Miljø';
import { EToggle, ToggleKeys } from '../typer/feature-toggles';
import { useLastRessurserContext } from './LastRessurserContext';

const [TogglesProvider, useToggles] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();
    const [toggles, setToggles] = useState<Partial<Record<EToggle, boolean>>>({});

    useFørsteRender(() => {
        Object.entries(ToggleKeys).forEach(async ([toggleKey, toggleValue]) => {
            const toggleRespons = await axiosRequest<boolean, void>({
                url: `${basePath}toggles/${toggleValue}`,
            });

            setToggles(prevState => ({
                ...prevState,
                [EToggle[toggleKey]]: hentDataFraRessurs(toggleRespons) ?? false,
            }));
        });
    });

    return {
        toggles,
    };
});

export { TogglesProvider, useToggles };
