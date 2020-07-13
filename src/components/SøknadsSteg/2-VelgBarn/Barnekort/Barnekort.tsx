import React, { useEffect } from 'react';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import KnappBase, { Knapp, Fareknapp, Flatknapp } from 'nav-frontend-knapper';
import { EtikettSuksess } from 'nav-frontend-etiketter';
import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import { IBarn, useApp } from '../../../../context/AppContext';

const Barnekort: React.FC<IBarn> = ({
    navn,
    ident,
    alder,
    borMedSøker,
    medISøknad,
    fødselsdato,
}) => {
    const formaterFnr = (fødselsnummer: string) => {
        return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
    };

    const { søknad, settSøknad } = useApp();

    function settMedISøknad(erMed: boolean) {
        settSøknad({
            ...søknad,
            barn: [
                ...søknad.barn.filter(b => b.ident != ident),
                {
                    navn: navn,
                    alder: alder,
                    fødselsdato: fødselsdato,
                    ident: ident,
                    borMedSøker: borMedSøker,
                    medISøknad: { label: medISøknad.label, verdi: erMed },
                },
            ],
        });
    }

    function fjernBarnFraSøknad() {
        settMedISøknad(false);
    }

    function leggTilBarnISøknad() {
        settMedISøknad(true);
    }

    const ikoner = [barn1, barn2, barn3];
    const ikon = ikoner[Math.floor(Math.random() * ikoner.length)];

    return (
        <div className="barnekort">
            <div className="barnekort__header">
                <img alt="barn" className="barneikon" src={ikon} />
            </div>
            <div className="barnekort__informasjonsboks">
                <div className="informasjonsboks-innhold">
                    <Element>{navn.verdi}</Element>
                    <div className="informasjonselement">
                        <Normaltekst>{ident.label}</Normaltekst>
                        <Normaltekst>{formaterFnr(ident.verdi)}</Normaltekst>
                    </div>
                    <div className="informasjonselement">
                        <Normaltekst>{alder.label}</Normaltekst>
                        <Normaltekst>{alder.verdi}</Normaltekst>
                    </div>
                    <div className="informasjonselement">
                        {borMedSøker.verdi && <Normaltekst>{borMedSøker.label}</Normaltekst>}
                        {!borMedSøker.verdi && (
                            <Normaltekst>{`Ikke registrert på din adresse`}</Normaltekst>
                        )}
                    </div>
                    <div className="knappe-container">
                        {!medISøknad.verdi && (
                            <Knapp mini onClick={leggTilBarnISøknad}>
                                Legg til søknad
                            </Knapp>
                        )}
                        {medISøknad.verdi && (
                            <>
                                <EtikettSuksess className={'med-i-søknad'}>
                                    Med i søknad
                                </EtikettSuksess>
                                <Normaltekst>
                                    <div className="lenke fjern-barn" onClick={fjernBarnFraSøknad}>
                                        {'Fjern fra søknad'}
                                    </div>
                                </Normaltekst>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Barnekort;
