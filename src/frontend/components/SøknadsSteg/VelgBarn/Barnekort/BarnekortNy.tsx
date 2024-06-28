import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import {
    BodyShort,
    Ingress,
    Checkbox,
    Heading,
    Box,
    VStack,
    HStack,
    Label,
    CheckboxGroup,
    Button,
    Bleed,
    HGrid,
} from '@navikt/ds-react';
import {
    AGray100,
    APurple400,
    APurple800,
    ABorderRadiusMedium,
    ASpacing32,
    ASpacing05,
    AGrayalpha200,
} from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { device } from '../../../../Theme';
import { IBarn } from '../../../../typer/person';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

import { FjernBarnKnapp } from './FjernBarnKnapp';
import { TrashFillIcon } from '@navikt/aksel-icons';

interface IBarnekortProps {
    velgBarnCallback: (barn: IBarn, barnMedISøknad: boolean) => void;
    barn: IBarn;
    barnSomSkalVæreMed: IBarn[];
    fjernBarnCallback: (ident: string) => void;
}

const BarnekortHeader = styled.div`
    height: ${ASpacing32};
    background-color: ${APurple800};
    border-bottom: 0.25rem solid ${APurple400};
    border-radius: ${ABorderRadiusMedium} ${ABorderRadiusMedium} 0 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
`;

const Divider = styled.div`
    height: ${ASpacing05};
    width: 100%;
    background-color: ${AGrayalpha200};
`;

const BarnekortNy: React.FC<IBarnekortProps> = ({
    barn,
    velgBarnCallback,
    barnSomSkalVæreMed,
    fjernBarnCallback,
}) => {
    const { formatMessage } = useIntl();
    const {
        søknad: { barnRegistrertManuelt },
        erUtvidet,
    } = useApp();

    const erMedISøknad = !!barnSomSkalVæreMed.find(barnMedISøknad => barnMedISøknad.id === barn.id);

    const erRegistrertManuelt = !!barnRegistrertManuelt.find(
        manueltRegistrertBarn => manueltRegistrertBarn.id === barn.id
    );

    return (
        <Box padding="6" background="surface-subtle" borderRadius="medium">
            <VStack gap="6">
                <Bleed marginInline="6" marginBlock="6 0" asChild>
                    <Box>
                        <BarnekortHeader>
                            <TilfeldigBarnIkon />
                        </BarnekortHeader>
                    </Box>
                </Bleed>
                <HStack gap="6" justify="space-between">
                    <Box>
                        <VStack gap="6">
                            <Heading size="medium">Barnets Navn</Heading>
                            <HStack gap="8">
                                <Box>
                                    <Label>Fødselsnummer</Label>
                                    <BodyShort>15050570800</BodyShort>
                                </Box>
                                <Box>
                                    <Label>Alder</Label>
                                    <BodyShort>5 år</BodyShort>
                                </Box>
                            </HStack>
                        </VStack>
                    </Box>
                    <Box>
                        <VStack gap="6">
                            <Box>
                                <Label>Registrert bosted</Label>
                                <BodyShort>Bosted 1</BodyShort>
                                <BodyShort>Bosted 2</BodyShort>
                                <BodyShort>Bosted 3</BodyShort>
                            </Box>
                        </VStack>
                    </Box>
                </HStack>
                <Divider />
                <HStack gap="6" justify="space-between">
                    <Checkbox value={false}>Søk om barnetrygd for barnet</Checkbox>
                    <Button variant="tertiary" icon={<TrashFillIcon aria-hidden />}>
                        Fjern fra søknad
                    </Button>
                </HStack>
                {/* <HGrid gap="6" columns={2}>
                    <Box>
                        <VStack gap="6">
                            <Heading size="small">Barnets Navn</Heading>
                            <HStack gap="8">
                                <Box>
                                    <Label>Fødselsnummer</Label>
                                    <BodyShort>15050570800</BodyShort>
                                </Box>
                                <Box>
                                    <Label>Alder</Label>
                                    <BodyShort>5 år</BodyShort>
                                </Box>
                            </HStack>
                        </VStack>
                    </Box>
                    <Box>
                        <VStack gap="6">
                            <Box>
                                <Label>Registrert bosted</Label>
                                <BodyShort>Bosted 1</BodyShort>
                                <BodyShort>Bosted 2</BodyShort>
                                <BodyShort>Bosted 3</BodyShort>
                            </Box>
                        </VStack>
                    </Box>
                    <Checkbox value={false}>Søk om barnetrygd for barnet</Checkbox>
                    <Button variant="tertiary" icon={<TrashFillIcon aria-hidden />}>
                        Fjern fra søknad
                    </Button>
                </HGrid> */}
            </VStack>
        </Box>
    );
};

export default BarnekortNy;
