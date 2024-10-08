import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../../Felleskomponenter/PerioderContainer';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';

import { Personopplysninger } from './Personopplysninger';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { tekster, plainTekst } = useApp();

    const { toggles } = useFeatureToggles();

    const {
        erÅpen: utenlandsoppholdmodalErÅpen,
        lukkModal: lukkUtenlandsoppholdmodal,
        åpneModal: åpneUtenlandsoppholdmodal,
    } = useModal();

    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    } = useOmdeg();

    const teksterForModal: IUtenlandsoppholdTekstinnhold =
        tekster().FELLES.modaler.utenlandsopphold.søker;
    const { flerePerioder, leggTilPeriodeForklaring } = teksterForModal;

    const stegTekster = tekster()[ESanitySteg.OM_DEG];
    const { omDegGuide } = stegTekster;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.sidetittel'} />}
            guide={omDegGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <Personopplysninger />
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.borPåRegistrertAdresse}
                spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]}
            />
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]}
                    tilleggsinfoTekstId={'felles.korteopphold.info'}
                />
                {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                    <PerioderContainer
                        tittel={uppercaseFørsteBokstav(
                            plainTekst(frittståendeOrdTekster.utenlandsopphold)
                        )}
                    >
                        {utenlandsperioder.map((periode, index) => (
                            <UtenlandsperiodeOppsummering
                                key={index}
                                periode={periode}
                                nummer={index + 1}
                                fjernPeriodeCallback={fjernUtenlandsperiode}
                            />
                        ))}
                        {!toggles.NYE_MODAL_TEKSTER && utenlandsperioder.length > 0 && (
                            <Label as="p" spacing>
                                <SpråkTekst id={'omdeg.flereopphold.spm'} />
                            </Label>
                        )}
                        <LeggTilKnapp
                            onClick={åpneUtenlandsoppholdmodal}
                            språkTekst={'felles.leggtilutenlands.knapp'}
                            leggTilFlereTekst={
                                toggles.NYE_MODAL_TEKSTER &&
                                utenlandsperioder.length > 0 &&
                                plainTekst(flerePerioder)
                            }
                            id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                            feilmelding={
                                skjema.felter.registrerteUtenlandsperioder.erSynlig &&
                                skjema.felter.registrerteUtenlandsperioder.feilmelding &&
                                skjema.visFeilmeldinger && (
                                    <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />
                                )
                            }
                        />
                    </PerioderContainer>
                )}
            </KomponentGruppe>
            {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                    spørsmålTekstId={
                        omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                    }
                />
            )}
            {utenlandsoppholdmodalErÅpen && (
                <UtenlandsoppholdModal
                    erÅpen={utenlandsoppholdmodalErÅpen}
                    lukkModal={lukkUtenlandsoppholdmodal}
                    onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                    forklaring={plainTekst(leggTilPeriodeForklaring)}
                />
            )}
        </Steg>
    );
};

export default OmDeg;
