import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { TrashFillIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Checkbox,
    Heading,
    Box,
    VStack,
    Label,
    Button,
    Bleed,
    HGrid,
} from '@navikt/ds-react';
import {
    APurple400,
    APurple800,
    ABorderRadiusMedium,
    ASpacing32,
    ASpacing05,
    AGrayalpha200,
} from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { IBarn } from '../../../../typer/person';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

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

const Divider = styled.hr`
    height: ${ASpacing05};
    width: 100%;
    border: none;
    background-color: ${AGrayalpha200};
`;

const Barnekort: React.FC<IBarnekortProps> = ({
    barn,
    velgBarnCallback,
    barnSomSkalVæreMed,
    fjernBarnCallback,
}) => {
    const { plainTekst, tekster } = useApp();
    const { formatMessage } = useIntl();
    const {
        søknad: { barnRegistrertManuelt },
        erUtvidet,
    } = useApp();

    const erMedISøknad = !!barnSomSkalVæreMed.find(barnMedISøknad => barnMedISøknad.id === barn.id);

    const erRegistrertManuelt = !!barnRegistrertManuelt.find(
        manueltRegistrertBarn => manueltRegistrertBarn.id === barn.id
    );

    const fødselsnummerTekst = !barn.adressebeskyttelse
        ? formaterFnr(barn.ident)
        : plainTekst(tekster()[ESanitySteg.FELLES].frittståendeOrd.skjult);

    return (
        <BarnekortContainer>
            <VStack gap="6">
                <Bleed marginInline="6" marginBlock="6 0" asChild>
                    <Box>
                        <BarnekortHeader>
                            <TilfeldigBarnIkon />
                        </BarnekortHeader>
                    </Box>
                </Bleed>
                <Heading level="3" size="medium">
                    {barn.adressebeskyttelse ? (
                        <SpråkTekst id={'hvilkebarn.barn.anonym'} />
                    ) : (
                        barn.navn
                    )}
                </Heading>
                <HGrid gap="6" columns={{ sm: 1, md: '2fr 1fr 3fr' }}>
                    <BarneKortInfo
                        labelId={'hvilkebarn.barn.fødselsnummer'}
                        verdi={fødselsnummerTekst}
                    />
                    {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                        <BarneKortInfo
                            labelId={'hvilkebarn.barn.alder'}
                            verdi={<SpråkTekst id={'felles.år'} values={{ alder: barn.alder }} />}
                        />
                    )}
                    {!erRegistrertManuelt && (
                        <BarneKortInfo
                            labelId={'hvilkebarn.barn.bosted'}
                            verdi={<SpråkTekst id={hentBostedSpråkId(barn)} />}
                        />
                    )}
                </HGrid>
                <Divider />
                <Checkbox
                    checked={erMedISøknad}
                    aria-label={
                        formatMessage({
                            id: erUtvidet
                                ? 'hvilkebarn-utvidet.barn.søk-om.spm'
                                : 'hvilkebarn.barn.søk-om.spm',
                        }) + ` (${barn.navn})`
                    }
                    onChange={() => velgBarnCallback(barn, erMedISøknad)}
                >
                    {formatMessage({
                        id: erUtvidet
                            ? 'hvilkebarn-utvidet.barn.søk-om.spm'
                            : 'hvilkebarn.barn.søk-om.spm',
                    })}
                </Checkbox>
                {erRegistrertManuelt && (
                    <Button
                        type={'button'}
                        variant="tertiary"
                        onClick={() => fjernBarnCallback(barn.id)}
                        icon={<TrashFillIcon aria-hidden />}
                    >
                        <SpråkTekst id={'hvilkebarn.fjern-barn.knapp'} />
                    </Button>
                )}
            </VStack>
        </BarnekortContainer>
    );
};

export const BarnekortContainer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <Box padding="6" background="surface-subtle" borderRadius="medium">
            {children}
        </Box>
    );
};

const BarneKortInfo: React.FC<{ labelId: string; verdi: ReactNode }> = ({ labelId, verdi }) => {
    return (
        <Box>
            <Label as="p">
                <SpråkTekst id={labelId} />
            </Label>
            <BodyShort>{verdi}</BodyShort>
        </Box>
    );
};

export default Barnekort;
