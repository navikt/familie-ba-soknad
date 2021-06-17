import { useState } from 'react';

import createUseContext from 'constate';
import { IRoute } from './RoutesContext';


const [AppNavigationProvider, useAppNavigation] = createUseContext(() => {
    const [komFra, settKomFra] = useState<IRoute>();

    return {
        komFra,
        settKomFra
    }
});

export { AppNavigationProvider, useAppNavigation };