import React from 'react';

import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import slugify from 'slugify';

import { Input } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { IBarn } from '../../../typer/person';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../Steg/Steg';
import {
    OmBarnetUfyllendeSpørsmålsId,
    OmBarnetUfyllendeSpørsmålSpråkId,
    useOmBarnetUtfyllende,
} from './useOmBarnetUtfyllende';

const InternKomponent: React.FC<{ barn: IBarn }> = ({ barn }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
    } = useOmBarnetUtfyllende(barn);
    return (
        <Steg
            tittel={<SpråkTekst id={'ombarnet-utfyllende.tittel'} values={{ navn: barn.navn }} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            gåVidereOnClickCallback={oppdaterSøknad}
        >
            <KomponentGruppe>
                {skjema.felter.institusjonsnavn.erSynlig && (
                    <>
                        <Undertittel>
                            <FormattedMessage
                                id={'ombarnet-utfyllende.undertittel.institusjon'}
                                values={{ navn: barn.navn }}
                            />
                        </Undertittel>
                        <Input
                            label={
                                <FormattedMessage
                                    id={
                                        OmBarnetUfyllendeSpørsmålSpråkId[
                                            OmBarnetUfyllendeSpørsmålsId.institusjonsnavn
                                        ]
                                    }
                                />
                            }
                            {...skjema.felter.institusjonsnavn.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                        />
                    </>
                )}
                {skjema.felter.institusjonsnavn.erSynlig && (
                    <Input
                        label={
                            <FormattedMessage
                                id={
                                    OmBarnetUfyllendeSpørsmålSpråkId[
                                        OmBarnetUfyllendeSpørsmålsId.institusjonsadresse
                                    ]
                                }
                            />
                        }
                        {...skjema.felter.institusjonsadresse.hentNavInputProps(
                            skjema.visFeilmeldinger
                        )}
                    />
                )}
                {skjema.felter.institusjonsnavn.erSynlig && (
                    <Input
                        bredde={'S'}
                        label={
                            <FormattedMessage
                                id={
                                    OmBarnetUfyllendeSpørsmålSpråkId[
                                        OmBarnetUfyllendeSpørsmålsId.institusjonspostnummer
                                    ]
                                }
                            />
                        }
                        {...skjema.felter.institusjonspostnummer.hentNavInputProps(
                            skjema.visFeilmeldinger
                        )}
                    />
                )}
            </KomponentGruppe>
        </Steg>
    );
};

const OmBarnetUtfyllende: React.FC = () => {
    const { søknad } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const history = useHistory();
    const location = useLocation();
    const match = location.pathname.match(/\/barnet\/(.+)\/?/);

    if (!barnInkludertISøknaden.length) {
        history.push('/velg-barn');
        return <></>;
    }

    if (!match || match.length < 2) {
        history.push(`/barnet/${slugify(barnInkludertISøknaden[0].navn)}`);
        return <></>;
    }
    const navnParameter = match[1];

    const barn = barnInkludertISøknaden.find(barn => slugify(barn.navn) === navnParameter);
    if (!barn) {
        history.push('/barnet');
        return <></>;
    }

    return <InternKomponent barn={barn} />;
};

export default OmBarnetUtfyllende;
