import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    harFeilet: boolean;
}

/**
 * Fanger feil når panelet lastes eller tegnes, slik at de ikke når feilsiden til søknaden. Feil som oppstår etter at
 * verktøyet har satt en søknad, for eksempel i et steg som får en ugyldig søknad, fanges ikke her.
 */
export class Feilgrense extends Component<Props, State> {
    state: State = { harFeilet: false };

    static getDerivedStateFromError(): State {
        return { harFeilet: true };
    }

    render() {
        if (this.state.harFeilet) {
            return <p role="status">Testverktøyet for preutfylling feilet. Last siden på nytt for å prøve igjen.</p>;
        }
        return this.props.children;
    }
}
