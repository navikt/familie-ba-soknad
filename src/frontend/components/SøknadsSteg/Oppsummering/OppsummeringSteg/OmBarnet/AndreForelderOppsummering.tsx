import React from 'react';

import { BodyShort, FormSummary } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../../../context/AppContext';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { PersonType } from '../../../../../typer/personType';
import { formaterDato } from '../../../../../utils/dato';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '../../../../Felleskomponenter/Sanity/TekstBlock';
import { OppsummeringFelt } from '../../OppsummeringFelt';

const AndreForelderOppsummering: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
}> = ({ barn, andreForelder }) => {
    const { tekster, plainTekst } = useAppContext();

    const omBarnetTekster = tekster().OM_BARNET;
    const {
        navnAndreForelder,
        foedselsnummerDnummerAndreForelder,
        foedselsdatoAndreForelder,
        arbeidUtenforNorgeAndreForelder,
        pensjonUtlandAndreForelder,
        boddSammenMedAndreForelder,
        naarFlyttetFraAndreForelder,
    } = omBarnetTekster;

    return (
        <FormSummary.Answers>
            {andreForelder[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger].svar ===
            ESvar.NEI ? (
                <>
                    {andreForelder[andreForelderDataKeySpørsmål.navn].svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={navnAndreForelder.sporsmal} />}
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.navn].svar !==
                                AlternativtSvarForInput.UKJENT
                                    ? andreForelder[andreForelderDataKeySpørsmål.navn].svar
                                    : plainTekst(navnAndreForelder.checkboxLabel)
                            }
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.fnr].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock block={foedselsnummerDnummerAndreForelder.sporsmal} />
                            }
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.fnr].svar !==
                                AlternativtSvarForInput.UKJENT
                                    ? andreForelder[andreForelderDataKeySpørsmål.fnr].svar
                                    : plainTekst(foedselsnummerDnummerAndreForelder.checkboxLabel)
                            }
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={foedselsdatoAndreForelder.sporsmal} />}
                            søknadsvar={formaterDatoMedUkjent(
                                andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar,
                                plainTekst(foedselsdatoAndreForelder.checkboxLabel)
                            )}
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={arbeidUtenforNorgeAndreForelder.sporsmal}
                                    flettefelter={{ barnetsNavn: barn.navn }}
                                />
                            }
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar
                            }
                        />
                    )}

                    {andreForelder.arbeidsperioderUtland.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            nummer={index + 1}
                            arbeidsperiode={periode}
                            gjelderUtlandet={true}
                            personType={PersonType.AndreForelder}
                            erDød={barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA}
                            barn={barn}
                        />
                    ))}

                    {andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={pensjonUtlandAndreForelder.sporsmal}
                                    flettefelter={{ barnetsNavn: barn.navn }}
                                />
                            }
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar
                            }
                        />
                    )}

                    {andreForelder.pensjonsperioderUtland.map((periode, index) => (
                        <PensjonsperiodeOppsummering
                            key={`pensjonsperiode-utland-andre-forelder${index}`}
                            nummer={index + 1}
                            pensjonsperiode={periode}
                            gjelderUtlandet={true}
                            personType={PersonType.AndreForelder}
                            erDød={barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA}
                            barn={barn}
                        />
                    ))}

                    {andreForelder.utvidet[
                        andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder
                    ].svar && (
                        <OppsummeringFelt
                            tittel={
                                <TekstBlock
                                    block={boddSammenMedAndreForelder.sporsmal}
                                    flettefelter={{ barnetsNavn: barn.navn }}
                                />
                            }
                            søknadsvar={
                                andreForelder.utvidet[
                                    andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder
                                ].svar
                            }
                        />
                    )}
                    {andreForelder.utvidet[
                        andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
                    ].svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={naarFlyttetFraAndreForelder.sporsmal} />}
                            søknadsvar={(() => {
                                const svar =
                                    andreForelder.utvidet[
                                        andreForelderDataKeySpørsmål
                                            .søkerFlyttetFraAndreForelderDato
                                    ].svar;
                                return svar === AlternativtSvarForInput.UKJENT
                                    ? plainTekst(naarFlyttetFraAndreForelder.checkboxLabel)
                                    : formaterDato(svar);
                            })()}
                        />
                    )}
                </>
            ) : (
                <BodyShort>
                    <TekstBlock block={navnAndreForelder.checkboxLabel} />
                </BodyShort>
            )}
        </FormSummary.Answers>
    );
};

export default AndreForelderOppsummering;
