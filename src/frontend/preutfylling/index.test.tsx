import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Feilgrense } from './Feilgrense';
import { Preutfylling } from './index';

const panelet = vi.hoisted(() => ({ antallGangerLastet: 0 }));

vi.mock('./Preutfyllingspanel', () => {
    panelet.antallGangerLastet += 1;
    return { default: () => <p>Panelet</p> };
});

const Feiler = (): never => {
    throw new Error('Feil i panelet');
};

// jsdom kjører på localhost, der panelet bare skal vises med ?preutfylling i adressen.
describe('Preutfylling', () => {
    afterEach(() => {
        window.history.pushState({}, '', '/');
    });

    it('skal verken vise eller laste panelet når det ikke skal vises', async () => {
        const lastetFørTesten = panelet.antallGangerLastet;

        const { container } = render(<Preutfylling />);

        // Panelet lastes asynkront, så testen venter lenge nok til at det ville ha dukket opp.
        await expect(screen.findByText('Panelet', {}, { timeout: 300 })).rejects.toThrow();
        expect(container).toBeEmptyDOMElement();
        expect(panelet.antallGangerLastet).toBe(lastetFørTesten);
    });

    it('skal laste og vise panelet når det skal vises', async () => {
        window.history.pushState({}, '', '/?preutfylling');

        render(<Preutfylling />);

        expect(await screen.findByText('Panelet')).toBeInTheDocument();
    });
});

describe('Feilgrense', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {
            // React logger feilen som fanges
        });
    });

    it('skal vise en melding i stedet for å la feilen gå videre til søknaden', () => {
        render(
            <Feilgrense>
                <Feiler />
            </Feilgrense>
        );

        expect(screen.getByRole('status')).toHaveTextContent('Testverktøyet for preutfylling feilet.');
    });
});
