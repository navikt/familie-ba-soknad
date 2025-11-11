import engelsk from '../assets/lang/en.json' with { type: 'json' };
import bokmål from '../assets/lang/nb.json' with { type: 'json' };
import nynorsk from '../assets/lang/nn.json' with { type: 'json' };

export const tekster = { nb: { ...bokmål }, nn: { ...nynorsk }, en: { ...engelsk } };
