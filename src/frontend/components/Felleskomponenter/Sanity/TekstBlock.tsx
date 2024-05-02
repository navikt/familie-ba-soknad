import React, { ReactNode } from 'react';

import { PortableText } from '@portabletext/react';
import styled from 'styled-components';

import { BodyLong, BodyShort, Detail, Heading, Label } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { FlettefeltVerdier, LocaleRecordBlock, Typografi } from '../../../typer/sanity/sanity';

const StyledLabel = styled(Label)`
    display: block;
`;

interface Props {
    typografi?: Typografi;
    style?: React.CSSProperties;
    children?: ReactNode;
}

const StyledBodyLong = styled(BodyLong)`
    :empty {
        height: 1.625rem;
    }
`;

export function TypografiWrapper({ typografi, style, children }: Props) {
    switch (typografi) {
        case Typografi.StegHeadingH1:
            return (
                <Heading level={'1'} size={'xsmall'} style={style}>
                    {children}
                </Heading>
            );
        case Typografi.ModalHeadingH1:
            return (
                <Heading level={'1'} size={'large'} style={style}>
                    {children}
                </Heading>
            );
        case Typografi.ForsideHeadingH1:
            return (
                <Heading level={'1'} size={'xlarge'} style={style}>
                    {children}
                </Heading>
            );
        case Typografi.HeadingH2:
            return (
                <Heading level={'2'} size={'xsmall'} spacing style={style}>
                    {children}
                </Heading>
            );
        case Typografi.BodyLong:
            return <StyledBodyLong style={style}>{children}</StyledBodyLong>;
        case Typografi.BodyShort:
            return <BodyShort style={style}>{children}</BodyShort>;
        case Typografi.Label:
            return (
                <StyledLabel spacing style={style}>
                    {children}
                </StyledLabel>
            );
        case Typografi.Detail:
            return <Detail style={style}>{children}</Detail>;
        case undefined:
            return <div style={style}>{children}</div>;
    }
}

const TekstBlock: React.FC<{
    block: LocaleRecordBlock | undefined;
    flettefelter?: FlettefeltVerdier;
    typografi?: Typografi;
}> = ({ block, flettefelter, typografi }) => {
    const { valgtLocale } = useSpråk();
    const { flettefeltTilTekst } = useApp();

    return block ? (
        <PortableText
            value={block[valgtLocale]}
            components={{
                block: ({ children }) => (
                    <TypografiWrapper typografi={typografi} style={{ minHeight: '1rem' }}>
                        {children}
                    </TypografiWrapper>
                ),
                marks: {
                    flettefelt: props => {
                        if (props?.value?.flettefeltVerdi) {
                            return (
                                <span>
                                    {flettefeltTilTekst(props.value.flettefeltVerdi, flettefelter)}
                                </span>
                            );
                        } else {
                            throw new Error(`Fant ikke flettefeltVerdi`);
                        }
                    },
                    link: props => {
                        return (
                            <a
                                target={props.value.blank ? '_blank' : '_self'}
                                rel={'noopener noreferrer'}
                                href={encodeURI(props.value.href)}
                            >
                                {props.text}
                            </a>
                        );
                    },
                },
                types: {
                    flettefelt: props =>
                        flettefeltTilTekst(props.value.flettefelt, flettefelter, valgtLocale),
                },
            }}
        />
    ) : null;
};

export default TekstBlock;
