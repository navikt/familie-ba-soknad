import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../../../context/AppContext';
import { useSpråkContext } from '../../../../../context/SpråkContext';
import { useStegContext } from '../../../../../context/StegContext';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { PersonType } from '../../../../../typer/personType';
import { formaterDato } from '../../../../../utils/dato';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import { BarnetrygdsperiodeOppsummering } from '../../../../Felleskomponenter/Barnetrygdperiode/BarnetrygdperiodeOppsummering';
import TekstBlock from '../../../../Felleskomponenter/Sanity/TekstBlock';
import { SvalbardOppholdPeriodeOppsummering } from '../../../../Felleskomponenter/SvalbardOppholdModal.tsx/SvalbardOppholdPeriodeOppsummering';
import { UtenlandsperiodeOppsummering } from '../../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useOmBarnet } from '../../../OmBarnet/useOmBarnet';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';

import AndreForelderOppsummering from './AndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    nummer: string;
    barn: IBarnMedISøknad;
    index: number;
}

const OmBarnetOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn, index }) => {
    const { tekster, plainTekst } = useAppContext();
    const { hentStegObjektForBarn } = useStegContext();
    const { valgtLocale } = useSpråkContext();
    const omBarnetTekster = tekster().OM_BARNET;
    const omBarnetHook = useOmBarnet(barn.id);

    return (
        <Oppsummeringsbolk
            tittel={'oppsummering.deltittel.ombarnet'}
            språkValues={{ nummer, navn: barn.navn }}
            tittelForSanity={omBarnetTekster.omBarnetTittel}
            flettefelter={{ barnetsNavn: barn.navn }}
            key={index}
            steg={hentStegObjektForBarn(barn)}
            skjemaHook={omBarnetHook}
            settFeilAnchors={settFeilAnchors}
        >
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={omBarnetTekster.opplystFosterbarn}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                />
            )}
            {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.opplystInstitusjon}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                    />
                    {barn[barnDataKeySpørsmål.institusjonIUtland].svar === ESvar.JA ? (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock block={omBarnetTekster.institusjonIUtlandetCheckbox} />
                            }
                        />
                    ) : (
                        <>
                            <OppsummeringFelt
                                tittel={
                                    <TekstBlock block={omBarnetTekster.institusjonNavn.sporsmal} />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.institusjonsnavn].svar}
                            />
                            <OppsummeringFelt
                                tittel={
                                    <TekstBlock
                                        block={omBarnetTekster.institusjonAdresse.sporsmal}
                                    />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.institusjonsadresse].svar}
                            />
                            <OppsummeringFelt
                                tittel={
                                    <TekstBlock
                                        block={omBarnetTekster.institusjonPostnummer.sporsmal}
                                    />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.institusjonspostnummer].svar}
                            />
                        </>
                    )}
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock block={omBarnetTekster.institusjonStartdato.sporsmal} />
                        }
                        søknadsvar={formaterDato(
                            barn[barnDataKeySpørsmål.institusjonOppholdStartdato].svar
                        )}
                    />
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock block={omBarnetTekster.institusjonSluttdato.sporsmal} />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar,
                            <TekstBlock block={omBarnetTekster.institusjonUkjentSluttCheckbox} />
                        )}
                    />
                </>
            )}
            {barn[barnDataKeySpørsmål.harBoddPåSvalbard].svar === ESvar.JA && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.opplystBoddPaaSvalbard}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                    />
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.naarBoddPaaSvalbardSpm}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                    />
                    {barn.svalbardOppholdPerioder.map((periode, index) => (
                        <SvalbardOppholdPeriodeOppsummering
                            key={index}
                            svalbardOppholdPeriode={periode}
                            nummer={index + 1}
                            personType={PersonType.Barn}
                            barn={barn}
                        />
                    ))}
                </>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.opplystBarnOppholdUtenforNorge}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                    />
                    {barn.utenlandsperioder.map((periode, index) => (
                        <UtenlandsperiodeOppsummering
                            key={index}
                            periode={periode}
                            nummer={index + 1}
                            personType={PersonType.Barn}
                            barn={barn}
                        />
                    ))}
                    {barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={omBarnetTekster.planlagtBoSammenhengendeINorge.sporsmal}
                                    flettefelter={{ barnetsNavn: barn.navn }}
                                />
                            }
                            søknadsvar={barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar}
                        />
                    )}
                </>
            )}
            {barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA && (
                <>
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.opplystFaarHarFaattEllerSoektYtelse}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                    />
                    {barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal}
                                />
                            }
                            søknadsvar={
                                barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar
                            }
                        />
                    )}
                    {barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock block={omBarnetTekster.hvilketLandYtelse.sporsmal} />
                            }
                            søknadsvar={landkodeTilSpråk(
                                barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar,
                                valgtLocale
                            )}
                        />
                    )}
                    {barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={
                                        omBarnetTekster.faarEllerHarFaattYtelseFraAnnetLand.sporsmal
                                    }
                                />
                            }
                            søknadsvar={
                                barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd].svar
                            }
                        />
                    )}
                    {barn.eøsBarnetrygdsperioder.map((periode, index) => (
                        <BarnetrygdsperiodeOppsummering
                            key={`barnetrygdperiode-søker-${index}`}
                            nummer={index + 1}
                            barnetrygdsperiode={periode}
                            barnetsNavn={barn.navn}
                            personType={PersonType.Søker}
                        />
                    ))}
                </>
            )}

            {barn.andreForelder && (
                <OppsummeringFelt tittel={plainTekst(omBarnetTekster.barnetsAndreForelder)}>
                    <AndreForelderOppsummering andreForelder={barn.andreForelder} barn={barn} />
                </OppsummeringFelt>
            )}
            <>
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={omBarnetTekster.borBarnFastSammenMedDeg.sporsmal}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.borFastMedSøker].svar}
                />
                {barn.andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]
                    .svar && (
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={omBarnetTekster.deltBosted.sporsmal}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                        søknadsvar={
                            barn.andreForelder[
                                andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted
                            ].svar
                        }
                    />
                )}
            </>
        </Oppsummeringsbolk>
    );
};

export default OmBarnetOppsummering;
