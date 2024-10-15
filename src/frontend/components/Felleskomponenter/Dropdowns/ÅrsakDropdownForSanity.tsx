import React, { ReactNode } from 'react';

import { useApp } from '../../../context/AppContext';
import { muligeÅrsaker } from '../../../typer/søknad';
import { Årsak } from '../../../typer/utvidet';
import { hentÅrsak } from '../../../utils/språk';

import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

export interface ÅrsakDropdownForSanityProps extends StyledDropdownProps<Årsak | ''> {}

const ÅrsakDropdownForSanity: React.FC<ÅrsakDropdownForSanityProps> = ({ ...props }) => {
    const { plainTekst, tekster } = useApp();
    const dinLivssituasjonTekster = tekster().DIN_LIVSSITUASJON;
    return (
        <StyledDropdown<Årsak | ''> {...props}>
            {muligeÅrsaker.map(
                (årsak): ReactNode => (
                    <option value={årsak} key={årsak}>
                        {plainTekst(hentÅrsak(årsak, dinLivssituasjonTekster))}
                    </option>
                )
            )}
        </StyledDropdown>
    );
};

export default ÅrsakDropdownForSanity;
