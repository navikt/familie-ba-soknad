import React from 'react';

import { useAppContext } from '../../../../../context/AppContext';
import { useStegContext } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { hentSlektsforhold } from '../../../../../utils/språk';
import TekstBlock from '../../../../Felleskomponenter/Sanity/TekstBlock';
import SamletIdNummerForBarn from '../../../EøsSteg/Barn/SamletIdNummerForBarn';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';

import EøsAndreForelderOppsummering from './EøsAndreForelderOppsummering';
import EøsOmsorgspersonOppsummering from './EøsOmsorgspersonOppsummering';
import { tittelSpmEøsBarnOppsummering } from './utils';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    nummer: string;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn }) => {
    const { hentStegObjektForBarnEøs } = useStegContext();
    const { tekster, plainTekst } = useAppContext();
    const eøsBarnTekster = tekster().EØS_FOR_BARN;

    const eøsForBarnHook = useEøsForBarn(barn.id);

    const flettefelter = { barnetsNavn: barn.navn };

    return (
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barn.navn }}
            tittelForSanity={eøsBarnTekster.eoesForBarnTittel}
            flettefelter={flettefelter}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={eøsForBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            <SamletIdNummerForBarn
                barn={barn}
                settIdNummerFelter={eøsForBarnHook.settIdNummerFelterForBarn}
                skjema={eøsForBarnHook.skjema}
                lesevisning={true}
            />
            {barn.søkersSlektsforhold.svar && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock block={eøsBarnTekster.slektsforhold.sporsmal} flettefelter={flettefelter} />
                        }
                        søknadsvar={plainTekst(hentSlektsforhold(barn.søkersSlektsforhold.svar, eøsBarnTekster))}
                    />
                    {barn.søkersSlektsforholdSpesifisering.svar && (
                        <OppsummeringFelt
                            tittel={tittelSpmEøsBarnOppsummering(barn.søkersSlektsforholdSpesifisering.id, barn.navn)}
                            søknadsvar={barn.søkersSlektsforholdSpesifisering.svar}
                        />
                    )}
                </>
            )}

            {barn.borMedAndreForelder.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock block={eøsBarnTekster.borMedAndreForelder.sporsmal} flettefelter={flettefelter} />
                    }
                    søknadsvar={barn.borMedAndreForelder.svar}
                />
            )}
            {barn.borMedOmsorgsperson.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock block={eøsBarnTekster.borMedOmsorgsperson.sporsmal} flettefelter={flettefelter} />
                    }
                    søknadsvar={barn.borMedOmsorgsperson.svar}
                />
            )}

            {barn.omsorgsperson && <EøsOmsorgspersonOppsummering omsorgsperson={barn.omsorgsperson} barn={barn} />}

            {barn.adresse.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={eøsBarnTekster.hvorBorBarnet.sporsmal} flettefelter={flettefelter} />}
                    søknadsvar={
                        barn.adresse.svar === AlternativtSvarForInput.UKJENT
                            ? plainTekst(eøsBarnTekster.hvorBorBarnet.checkboxLabel)
                            : barn.adresse.svar
                    }
                />
            )}

            {barn.andreForelder && (
                <EøsAndreForelderOppsummering
                    barn={barn}
                    andreForelder={barn.andreForelder}
                    skjema={eøsForBarnHook.skjema}
                    settIdNummerFelter={eøsForBarnHook.settIdNummerFelterForAndreForelder}
                />
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;
