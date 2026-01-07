import React from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Bleed, Box, Button, Checkbox, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';

import { ESanitySteg } from '../../../../../common/sanity';
import { useAppContext } from '../../../../context/AppContext';
import { IBarn } from '../../../../typer/person';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr, uppercaseFørsteBokstav } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

import styles from './Barnekort.module.css';
import { BarnekortInfo } from './BarnekortInfo';

interface IBarnekortProps {
    velgBarnCallback: (barn: IBarn, barnMedISøknad: boolean) => void;
    barn: IBarn;
    barnSomSkalVæreMed: IBarn[];
    fjernBarnCallback: (ident: string) => void;
}

const Barnekort: React.FC<IBarnekortProps> = ({ barn, velgBarnCallback, barnSomSkalVæreMed, fjernBarnCallback }) => {
    const { plainTekst, tekster } = useAppContext();
    const {
        søknad: { barnRegistrertManuelt },
    } = useAppContext();

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
        <Box padding="6" background={'surface-subtle'} borderRadius="medium">
            <VStack gap="6">
                <Bleed marginInline="6" marginBlock="6 0" asChild>
                    <Box
                        borderWidth={'0 0 4 0'}
                        borderRadius={`4 4 0 0`}
                        borderColor={'border-alt-1'}
                        className={styles.header}
                    >
                        <HStack align={'end'} justify={'center'} width={'100%'} height={'var(--a-spacing-32'}>
                            <TilfeldigBarnIkon />
                        </HStack>
                    </Box>
                </Bleed>
                <Heading level="3" size="medium">
                    {barn.adressebeskyttelse ? <TekstBlock block={navnErstatterForAdressesperre} /> : barn.navn}
                </Heading>
                <HGrid gap="6" columns={{ sm: 1, md: '2fr 1fr 3fr' }}>
                    <BarnekortInfo label={plainTekst(foedselsnummerLabel)} verdi={fødselsnummerTekst} />
                    {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                        <BarnekortInfo label={plainTekst(alderLabel)} verdi={`${barn.alder} ${plainTekst(aar)}`} />
                    )}
                    {!erRegistrertManuelt && (
                        <BarnekortInfo
                            label={plainTekst(registrertBostedLabel)}
                            verdi={
                                <span
                                    data-testid={
                                        barn.adressebeskyttelse ? 'registrert-bosted-adressesperre' : undefined
                                    }
                                >
                                    {plainTekst(hentBostedSpråkId(barn, teksterForSteg))}
                                </span>
                            }
                        />
                    )}
                </HGrid>
                <hr className={styles.divider} />
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
        </Box>
    );
};

export default Barnekort;
