import * as appContext from '../context/AppContext';

export const spyOnUseApp = søknad => {
    jest.spyOn(appContext, 'useApp').mockImplementation(jest.fn().mockReturnValue({ søknad }));
};

export const brukUseAppMedTomSøknadForRouting = () => spyOnUseApp({ barnInkludertISøknaden: [] });

/**
 * Åpen for norsk oversettelse av funksjonsnavn
 * Denne fjerner alle console errors fra jest-output. Ikke bruk før du veit at det kun er
 * oversettelsesfeil igjen. Mulig vi heller burde mocke noe i intl.
 */
export const silenceConsoleErrors = () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {
        // Shut up about the missing translations;
    });
};
