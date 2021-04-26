import React, { ReactNode } from 'react';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import norskeTekster from '../assets/lang/nb.json';
import * as appContext from '../context/AppContext';
import { AppProvider } from '../context/AppContext';
import { RoutesProvider } from '../context/RoutesContext';

export const spyOnUseApp = søknad => {
    jest.spyOn(appContext, 'useApp').mockImplementation(
        jest.fn().mockReturnValue({
            søknad,
            settSisteUtfylteStegIndex: jest.fn(),
            sisteUtfylteStegIndex: 2,
            erStegUtfyltFrafør: jest.fn(),
            settSøknad: jest.fn(),
        })
    );
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

export const wrapMedProvidere = (
    // eslint-disable-next-line
    providerComponents: React.FC<any>[],
    children?: ReactNode,
    språkTekster?: Record<string, string>
) => {
    const [Første, ...resten] = providerComponents;
    const erSpråkprovider = Første === SprakProvider;
    return (
        <Første
            {...(erSpråkprovider
                ? { tekster: { [LocaleType.nb]: språkTekster }, defaultLocale: LocaleType.nb }
                : {})}
        >
            {resten.length ? wrapMedProvidere(resten, children) : children}
        </Første>
    );
};

const wrapMedDefaultProvidere = (children: ReactNode, språkTekster: Record<string, string>) =>
    wrapMedProvidere(
        [SprakProvider, HttpProvider, AppProvider, RoutesProvider],
        children,
        språkTekster
    );

export const wrapMedDefaultProvidereOgNorskeSpråktekster = (children: ReactNode) =>
    wrapMedDefaultProvidere(children, norskeTekster);

export const TestProvidere: React.FC<{ tekster?: Record<string, string> }> = ({
    tekster,
    children,
}) => wrapMedDefaultProvidere(children, tekster ?? {});

export const TestProvidereMedEkteTekster: React.FC = ({ children }) => (
    <TestProvidere tekster={norskeTekster}>{children}</TestProvidere>
);
