import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { IRoute } from '../../../context/RoutesContext';
import { IBarn } from '../../../typer/person';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { samletSpørsmålId, samletSpørsmålSpråkTekstId } from '../../../utils/spørsmål';
import { barnetsNavnValue } from '../../../utils/visning';
import { OmDegSpørsmålId } from '../../SøknadsSteg/OmDeg/spørsmål';
import { VelgBarnSpørsmålId } from '../../SøknadsSteg/VelgBarn/spørsmål';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { lagRouteFeilRenderer } from './lagRouteFeilRenderer';

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    barn?: IBarn;
    routeForFeilmeldinger?: IRoute;
    id?: string;
}

const Container = styled.div`
    margin-top: 2rem;
`;

export const SkjemaFeiloppsummering: React.FC<Props> = ({
    skjema,
    barn,
    routeForFeilmeldinger,
    id,
}) => {
    const intl = useIntl();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const hentFeilmelding = (felt: Felt<any>) => {
        const gyldigId = !!Object.values(samletSpørsmålId).find(id => id === felt.id);
        return !gyldigId ||
            (felt.id === OmDegSpørsmålId.borPåRegistrertAdresse && felt.verdi === ESvar.NEI) ||
            felt.id === VelgBarnSpørsmålId.velgBarn ? (
            felt.feilmelding
        ) : (
            <SpråkTekst
                id={samletSpørsmålSpråkTekstId[felt.id]}
                values={{ navn: barn && barnetsNavnValue(barn, intl) }}
            />
        );
    };

    return (
        <Container>
            <Feiloppsummering
                role={'alert'}
                id={id}
                tittel={
                    <Element>
                        <SpråkTekst id={'felles.feiloppsummering.tittel'} />
                    </Element>
                }
                customFeilRender={
                    routeForFeilmeldinger ? lagRouteFeilRenderer(routeForFeilmeldinger) : undefined
                }
                feil={Object.values(skjema.felter)
                    .filter(felt => {
                        return felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL;
                    })
                    .map(
                        (felt): FeiloppsummeringFeil => {
                            return {
                                skjemaelementId: felt.id,
                                feilmelding: hentFeilmelding(felt) as string,
                            };
                        }
                    )}
            />
        </Container>
    );
};
