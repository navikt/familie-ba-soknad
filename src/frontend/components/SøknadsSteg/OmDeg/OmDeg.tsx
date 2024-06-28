import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { PersonType } from '../../../typer/personType';
import { hentLeggTilPeriodeTekster } from '../../../utils/modaler';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PeriodeBoks from '../../Felleskomponenter/PeriodeBoks';
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

    let leggTilPeriodeTekster: ReturnType<typeof hentLeggTilPeriodeTekster> = undefined;

    if (toggles.NYE_MODAL_TEKSTER) {
        const antallPerioder = utenlandsperioder.length;
        leggTilPeriodeTekster = hentLeggTilPeriodeTekster(
            'utenlandsopphold',
            PersonType.Søker,
            antallPerioder
        );
    }

    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.sidetittel'} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <Personopplysninger />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.borPåRegistrertAdresse}
                    spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]}
                />

                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <FamilieAlert variant={'warning'}>
                        <SpråkTekst
                            id={'omdeg.borpådenneadressen.kontakt-folkeregister-ukjent.alert'}
                        />
                    </FamilieAlert>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.værtINorgeITolvMåneder}
                        spørsmålTekstId={
                            omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]
                        }
                        tilleggsinfo={
                            <FamilieAlert variant={'info'}>
                                <SpråkTekst id={'felles.korteopphold.info'} />
                            </FamilieAlert>
                        }
                    />
                    {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                        <PeriodeBoks>
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
                                forklaring={leggTilPeriodeTekster?.tekstForKnapp}
                                id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                                feilmelding={
                                    skjema.felter.registrerteUtenlandsperioder.erSynlig &&
                                    skjema.felter.registrerteUtenlandsperioder.feilmelding &&
                                    skjema.visFeilmeldinger && (
                                        <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />
                                    )
                                }
                            />
                        </PeriodeBoks>
                    )}
                </>
                {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                    <KomponentGruppe inline dynamisk>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                            spørsmålTekstId={
                                omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                            }
                        />
                        {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig &&
                            skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                                <FamilieAlert variant={'warning'} dynamisk>
                                    <SpråkTekst
                                        id={'omdeg.planlagt-opphold-sammenhengende.alert'}
                                    />
                                </FamilieAlert>
                            )}
                    </KomponentGruppe>
                )}
            </KomponentGruppe>
            {utenlandsoppholdmodalErÅpen && (
                <UtenlandsoppholdModal
                    erÅpen={utenlandsoppholdmodalErÅpen}
                    lukkModal={lukkUtenlandsoppholdmodal}
                    onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                    forklaring={leggTilPeriodeTekster?.tekstForModal}
                />
            )}
        </Steg>
    );
};

export default OmDeg;
