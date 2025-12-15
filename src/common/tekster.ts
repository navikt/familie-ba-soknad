import * as engelsk from './lang/en.json' with { type: 'json' };
import * as bokmål from './lang/nb.json' with { type: 'json' };
import * as nynorsk from './lang/nn.json' with { type: 'json' };

export const tekster = { nb: { ...bokmål }, nn: { ...nynorsk }, en: { ...engelsk } };
