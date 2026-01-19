import engelsk from './lang/en.json' with { type: 'json' };
import bokmål from './lang/nb.json' with { type: 'json' };
import nynorsk from './lang/nn.json' with { type: 'json' };

export const tekster = { nb: bokmål, nn: nynorsk, en: engelsk };
