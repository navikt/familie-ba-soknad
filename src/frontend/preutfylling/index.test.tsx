import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { silenceConsoleErrors } from '../utils/testing';

import { Preutfylling } from './index';

const panelet = vi.hoisted(() => ({ antallGangerLastet: 0, skalFeile: false }));

vi.mock('./Preutfyllingspanel', () => {
    panelet.antallGangerLastet += 1;
    return {
        default: () => {
            if (panelet.skalFeile) {
                throw new Error('Feil i panelet');
            }
            return <p>Panelet</p>;
        },
    };
});

describe('Preutfylling', () => {
    afterEach(() => {
        window.history.pushState({}, '', '/');
        panelet.skalFeile = false;
        vi.restoreAllMocks();
    });

    // Må stå først: panelet lastes bare én gang i testfilen, så etter de andre testene er det allerede lastet.
    it('skal verken vise eller laste panelet når det ikke skal vises', async () => {
        const { container } = render(<Preutfylling />);

        await expect(screen.findByText('Panelet', {}, { timeout: 300 })).rejects.toThrow();
        expect(container).toBeEmptyDOMElement();
        expect(panelet.antallGangerLastet).toBe(0);
    });

    it('skal laste og vise panelet når det skal vises', async () => {
        window.history.pushState({}, '', '/?preutfylling');

        render(<Preutfylling />);

        expect(await screen.findByText('Panelet')).toBeInTheDocument();
        expect(panelet.antallGangerLastet).toBe(1);
    });

    it('skal vise en melding i stedet for å la en feil i panelet gå videre til søknaden', async () => {
        silenceConsoleErrors();
        panelet.skalFeile = true;
        window.history.pushState({}, '', '/?preutfylling');

        render(<Preutfylling />);

        expect(await screen.findByRole('status')).toHaveTextContent('Testverktøyet for preutfylling feilet.');
    });
});
