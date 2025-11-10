import { ReactNode } from 'react';

import { useAppContext } from '../../../context/AppContext';
import { muligeÅrsaker } from '../../../typer/søknad';
import { Årsak } from '../../../typer/utvidet';
import { hentÅrsak } from '../../../utils/språk';

import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

export type ÅrsakDropdownProps = StyledDropdownProps<Årsak | ''>;

const ÅrsakDropdown: React.FC<ÅrsakDropdownProps> = ({ ...props }) => {
    const { plainTekst, tekster } = useAppContext();
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

export default ÅrsakDropdown;
