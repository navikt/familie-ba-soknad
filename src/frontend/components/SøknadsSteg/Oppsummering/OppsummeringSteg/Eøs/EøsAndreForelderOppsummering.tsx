import React, { Dispatch, SetStateAction } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../../../context/AppContext';
import { useSpråkContext } from '../../../../../context/SpråkContext';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { PersonType } from '../../../../../typer/personType';
import { LocaleRecordBlock } from '../../../../../typer/sanity/sanity';
import { IEøsForBarnFeltTyper } from '../../../../../typer/skjema';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { BarnetrygdsperiodeOppsummering } from '../../../../Felleskomponenter/Barnetrygdperiode/BarnetrygdperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '../../../../Felleskomponenter/Sanity/TekstBlock';
import { UtbetalingsperiodeOppsummering } from '../../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import IdNummerForAndreForelder from '../../../EøsSteg/Barn/IdNummerForAndreForelder';
import { OppsummeringFelt } from '../../OppsummeringFelt';

const EøsAndreForelderOppsummering: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
}> = ({ barn, andreForelder, skjema, settIdNummerFelter }) => {
    const { tekster, plainTekst } = useAppContext();
    const {
        hvorBorAndreForelder,
        paagaaendeSoeknadYtelseAndreForelder,
        hvilketLandSoektYtelseAndreForelder,
        arbeidNorgeAndreForelder,
        arbeidNorgeAndreForelderGjenlevende,
        pensjonNorgeAndreForelder,
        pensjonNorgeAndreForelderGjenlevende,
        utbetalingerAndreForelder,
        utbetalingerAndreForelderGjenlevende,
        ytelseFraAnnetLandAndreForelder,
        ytelseFraAnnetLandAndreForelderGjenlevende,
    } = tekster().EØS_FOR_BARN;
    const { valgtLocale } = useSpråkContext();

    const andreForelderErDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;

    const flettefelter = { barnetsNavn: barn.navn };

    const jaNeiSpmOppsummering = ({
        andreForelderDataKeySpm,
        spørsmålstekst,
    }: {
        andreForelderDataKeySpm: andreForelderDataKeySpørsmål;
        spørsmålstekst: LocaleRecordBlock;
    }) => {
        return barn.andreForelder && barn.andreForelder[andreForelderDataKeySpm].svar ? (
            <OppsummeringFelt
                tittel={<TekstBlock block={spørsmålstekst} flettefelter={flettefelter} />}
                søknadsvar={barn.andreForelder[andreForelderDataKeySpm].svar}
            />
        ) : null;
    };

    return (
        <>
            <IdNummerForAndreForelder
                skjema={skjema}
                barn={barn}
                settIdNummerFelter={settIdNummerFelter}
                lesevisning={true}
            />
            {andreForelder.adresse.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={hvorBorAndreForelder.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={
                        andreForelder.adresse.svar === AlternativtSvarForInput.UKJENT
                            ? plainTekst(hvorBorAndreForelder.checkboxLabel)
                            : andreForelder.adresse.svar
                    }
                />
            )}
            {jaNeiSpmOppsummering({
                andreForelderDataKeySpm: andreForelderDataKeySpørsmål.arbeidNorge,
                spørsmålstekst: andreForelderErDød
                    ? arbeidNorgeAndreForelderGjenlevende.sporsmal
                    : arbeidNorgeAndreForelder.sporsmal,
            })}
            {andreForelder.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-andre-forelder-norge-${index}`}
                    arbeidsperiode={arbeidsperiode}
                    nummer={index + 1}
                    personType={PersonType.AndreForelder}
                    erDød={andreForelderErDød}
                    gjelderUtlandet={false}
                    barn={barn}
                />
            ))}
            {jaNeiSpmOppsummering({
                andreForelderDataKeySpm: andreForelderDataKeySpørsmål.pensjonNorge,
                spørsmålstekst: andreForelderErDød
                    ? pensjonNorgeAndreForelderGjenlevende.sporsmal
                    : pensjonNorgeAndreForelder.sporsmal,
            })}
            {andreForelder.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                <PensjonsperiodeOppsummering
                    key={`pensjonsperiode-andre-forelder-norge-${index}`}
                    pensjonsperiode={pensjonsperiode}
                    nummer={index + 1}
                    personType={PersonType.AndreForelder}
                    erDød={andreForelderErDød}
                    barn={barn}
                    gjelderUtlandet={false}
                />
            ))}
            {jaNeiSpmOppsummering({
                andreForelderDataKeySpm: andreForelderDataKeySpørsmål.andreUtbetalinger,
                spørsmålstekst: andreForelderErDød
                    ? utbetalingerAndreForelderGjenlevende.sporsmal
                    : utbetalingerAndreForelder.sporsmal,
            })}
            {andreForelder.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                <UtbetalingsperiodeOppsummering
                    key={`utbetalingsperiode-andre-forelder-${index}`}
                    utbetalingsperiode={utbetalingsperiode}
                    nummer={index + 1}
                    personType={PersonType.AndreForelder}
                    erDød={andreForelderErDød}
                    barn={barn}
                />
            ))}
            {jaNeiSpmOppsummering({
                andreForelderDataKeySpm: andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand,
                spørsmålstekst: paagaaendeSoeknadYtelseAndreForelder.sporsmal,
            })}
            {andreForelder.pågåendeSøknadHvilketLand.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={hvilketLandSoektYtelseAndreForelder.sporsmal}
                            flettefelter={flettefelter}
                        />
                    }
                    søknadsvar={landkodeTilSpråk(
                        andreForelder.pågåendeSøknadHvilketLand.svar,
                        valgtLocale
                    )}
                />
            )}
            {jaNeiSpmOppsummering({
                andreForelderDataKeySpm: andreForelderDataKeySpørsmål.barnetrygdFraEøs,
                spørsmålstekst: andreForelderErDød
                    ? ytelseFraAnnetLandAndreForelderGjenlevende.sporsmal
                    : ytelseFraAnnetLandAndreForelder.sporsmal,
            })}
            {andreForelder.eøsBarnetrygdsperioder.map((periode, index) => (
                <BarnetrygdsperiodeOppsummering
                    key={`barnetrygdperiode-andre-forelder-${index}`}
                    nummer={index + 1}
                    barnetrygdsperiode={periode}
                    barnetsNavn={barn.navn}
                    personType={PersonType.AndreForelder}
                    erDød={andreForelderErDød}
                />
            ))}
        </>
    );
};

export default EøsAndreForelderOppsummering;
