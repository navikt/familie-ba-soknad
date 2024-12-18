import React from 'react';

import styled from 'styled-components';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Checkbox, Heading, Box, VStack, Button, Bleed, HGrid } from '@navikt/ds-react';
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
import { formaterFnr, uppercaseFørsteBokstav } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

import { BarnekortContainer } from './BarnekortContainer';
import { BarnekortInfo } from './BarnekortInfo';

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
    const {
        søknad: { barnRegistrertManuelt },
    } = useApp();

    const teksterForSteg = tekster().VELG_BARN;
    const {
        alderLabel,
        aar,
        registrertBostedLabel,
        soekOmYtelseForBarnetSjekkboks,
        foedselsnummerLabel,
        navnErstatterForAdressesperre,
    } = teksterForSteg;

    const erMedISøknad = !!barnSomSkalVæreMed.find(barnMedISøknad => barnMedISøknad.id === barn.id);

    const erRegistrertManuelt = !!barnRegistrertManuelt.find(
        manueltRegistrertBarn => manueltRegistrertBarn.id === barn.id
    );

    const fødselsnummerTekst = !barn.adressebeskyttelse
        ? formaterFnr(barn.ident)
        : uppercaseFørsteBokstav(plainTekst(tekster()[ESanitySteg.FELLES].frittståendeOrd.skjult));

    const knappetekst = tekster()[ESanitySteg.FELLES].modaler.leggTilBarn.fjernKnapp;

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
                        <TekstBlock block={navnErstatterForAdressesperre} />
                    ) : (
                        barn.navn
                    )}
                </Heading>
                <HGrid gap="6" columns={{ sm: 1, md: '2fr 1fr 3fr' }}>
                    <BarnekortInfo
                        label={<TekstBlock block={foedselsnummerLabel} />}
                        verdi={fødselsnummerTekst}
                    />
                    {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                        <BarnekortInfo
                            label={<TekstBlock block={alderLabel} />}
                            verdi={`${barn.alder} ${plainTekst(aar)}`}
                        />
                    )}
                    {!erRegistrertManuelt && (
                        <BarnekortInfo
                            label={<TekstBlock block={registrertBostedLabel} />}
                            verdi={<TekstBlock block={hentBostedSpråkId(barn, teksterForSteg)} />}
                        />
                    )}
                </HGrid>
                <Divider />
                <Checkbox
                    checked={erMedISøknad}
                    aria-label={`${plainTekst(soekOmYtelseForBarnetSjekkboks)} ${barn.navn}`}
                    onChange={() => velgBarnCallback(barn, erMedISøknad)}
                    data-testid={`søk-om-barnetrygd-for-barn-${barn.ident}`}
                >
                    <TekstBlock block={soekOmYtelseForBarnetSjekkboks} />
                </Checkbox>
                {erRegistrertManuelt && (
                    <Button
                        type={'button'}
                        variant="tertiary"
                        onClick={() => fjernBarnCallback(barn.id)}
                        icon={<TrashFillIcon aria-hidden />}
                        data-testid="fjern-barn-knapp"
                    >
                        <TekstBlock block={knappetekst} />
                    </Button>
                )}
            </VStack>
        </BarnekortContainer>
    );
};

export default Barnekort;
