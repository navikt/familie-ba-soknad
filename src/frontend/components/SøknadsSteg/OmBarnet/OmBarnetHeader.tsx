import React from 'react';

import { Box, VStack } from '@navikt/ds-react';

import { ESanitySteg, Typografi } from '../../../../common/sanity';
import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { TilfeldigBarnIkon } from '../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

import styles from './OmBarnetHeader.module.css';

export const OmBarnetHeader: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const {
        søknad: { barnInkludertISøknaden },
        tekster,
    } = useAppContext();
    const barnIndex = barnInkludertISøknaden.findIndex(b => b.id === barn.id);

    return (
        <VStack align={'center'}>
            <TilfeldigBarnIkon byttVedRerender={false} />
            <hr className={styles.divider} />
            <Box padding={'space-16'}>
                <TekstBlock
                    block={tekster()[ESanitySteg.OM_BARNET].barnXAvY}
                    flettefelter={{
                        antall: (barnIndex + 1).toString(),
                        totalAntall: barnInkludertISøknaden.length.toString(),
                    }}
                    typografi={Typografi.HeadingH3}
                />
            </Box>
        </VStack>
    );
};
