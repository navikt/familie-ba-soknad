import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../../typer/barn';
import { IArbeidsperiode, IPensjonsperiode } from '../../../../typer/perioder';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { PersonType } from '../../../../utils/perioder';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import SlektsforholdDropdown from '../../../Felleskomponenter/Dropdowns/SlektsforholdDropdown';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';

interface OmsorgspersonProps {
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    periodeFunksjoner: {
        leggTilArbeidsperiodeUtlandOmsorgsperson: (periode: IArbeidsperiode) => void;
        fjernArbeidsperiodeUtlandOmsorgsperson: (periode: IArbeidsperiode) => void;
        leggTilArbeidsperiodeNorgeOmsorgsperson: (periode: IArbeidsperiode) => void;
        fjernArbeidsperiodeNorgeOmsorgsperson: (periode: IArbeidsperiode) => void;
        leggTilPensjonsperiodeUtlandOmsorgsperson: (periode: IPensjonsperiode) => void;
        fjernPensjonsperiodeUtlandOmsorgsperson: (periode: IPensjonsperiode) => void;
        leggTilPensjonsperiodeNorgeOmsorgsperson: (periode: IPensjonsperiode) => void;
        fjernPensjonsperiodeNorgeOmsorgsperson: (periode: IPensjonsperiode) => void;
    };
}

const Omsorgsperson: React.FC<OmsorgspersonProps> = ({ skjema, barn, periodeFunksjoner }) => {
    const intl = useIntl();
    const {
        leggTilArbeidsperiodeUtlandOmsorgsperson,
        fjernArbeidsperiodeUtlandOmsorgsperson,
        leggTilArbeidsperiodeNorgeOmsorgsperson,
        fjernArbeidsperiodeNorgeOmsorgsperson,
        leggTilPensjonsperiodeUtlandOmsorgsperson,
        fjernPensjonsperiodeUtlandOmsorgsperson,
        leggTilPensjonsperiodeNorgeOmsorgsperson,
        fjernPensjonsperiodeNorgeOmsorgsperson,
    } = periodeFunksjoner;

    return (
        <SkjemaFieldset
            tittelId={'eøs-om-barn.annenomsorgsperson.gjenlevende'}
            språkValues={{ barn: barn.navn }}
        >
            <SkjemaFeltInput
                felt={skjema.felter.omsorgspersonNavn}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonNavn]}
            />
            {skjema.felter.omsorgspersonSlektsforhold.erSynlig && (
                <SlektsforholdDropdown
                    felt={skjema.felter.omsorgspersonSlektsforhold}
                    skjema={skjema}
                    placeholder={intl.formatMessage({
                        id: 'felles.velgslektsforhold.spm',
                    })}
                    label={
                        <SpråkTekst
                            id={
                                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonSlektsforhold]
                            }
                            values={{ barn: barn.navn }}
                        />
                    }
                    gjelderSøker={false}
                />
            )}
            {skjema.felter.omsorgpersonSlektsforholdSpesifisering.erSynlig && (
                <SkjemaFeltInput
                    felt={skjema.felter.omsorgpersonSlektsforholdSpesifisering}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={
                        eøsBarnSpørsmålSpråkId[
                            EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering
                        ]
                    }
                    språkValues={{
                        barn: barn.navn,
                    }}
                />
            )}
            <>
                <SkjemaFeltInput
                    felt={skjema.felter.omsorgspersonIdNummer}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={
                        eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonIdNummer]
                    }
                    disabled={skjema.felter.omsorgspersonIdNummerVetIkke.verdi === ESvar.JA}
                />

                <SkjemaCheckbox
                    felt={skjema.felter.omsorgspersonIdNummerVetIkke}
                    labelSpråkTekstId={
                        eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke]
                    }
                />
            </>
            <SkjemaFeltInput
                felt={skjema.felter.omsorgspersonAdresse}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonAdresse]}
                description={<SpråkTekst id={'felles.hjelpetekst.fulladresse'} />}
            />
            <Arbeidsperiode
                skjema={skjema}
                leggTilArbeidsperiode={leggTilArbeidsperiodeUtlandOmsorgsperson}
                fjernArbeidsperiode={fjernArbeidsperiodeUtlandOmsorgsperson}
                arbeiderEllerArbeidetFelt={skjema.felter.omsorgspersonArbeidUtland}
                registrerteArbeidsperioder={skjema.felter.omsorgspersonArbeidsperioderUtland}
                gjelderUtlandet
                personType={PersonType.Omsorgsperson}
                barn={barn}
            />
            <Arbeidsperiode
                skjema={skjema}
                leggTilArbeidsperiode={leggTilArbeidsperiodeNorgeOmsorgsperson}
                fjernArbeidsperiode={fjernArbeidsperiodeNorgeOmsorgsperson}
                arbeiderEllerArbeidetFelt={skjema.felter.omsorgspersonArbeidNorge}
                registrerteArbeidsperioder={skjema.felter.omsorgspersonArbeidsperioderNorge}
                gjelderUtlandet={false}
                personType={PersonType.Omsorgsperson}
                barn={barn}
            />
            <Pensjonsperiode
                skjema={skjema}
                mottarEllerMottattPensjonFelt={skjema.felter.omsorgspersonPensjonUtland}
                leggTilPensjonsperiode={leggTilPensjonsperiodeUtlandOmsorgsperson}
                fjernPensjonsperiode={fjernPensjonsperiodeUtlandOmsorgsperson}
                personType={PersonType.Omsorgsperson}
                barn={barn}
                gjelderUtlandet={true}
                registrertePensjonsperioder={skjema.felter.omsorgspersonPensjonsperioderUtland}
            />
            <Pensjonsperiode
                skjema={skjema}
                mottarEllerMottattPensjonFelt={skjema.felter.omsorgspersonPensjonNorge}
                leggTilPensjonsperiode={leggTilPensjonsperiodeNorgeOmsorgsperson}
                fjernPensjonsperiode={fjernPensjonsperiodeNorgeOmsorgsperson}
                personType={PersonType.Omsorgsperson}
                barn={barn}
                gjelderUtlandet={false}
                registrertePensjonsperioder={skjema.felter.omsorgspersonPensjonsperioderNorge}
            />
        </SkjemaFieldset>
    );
};

export default Omsorgsperson;
