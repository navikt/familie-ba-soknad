import engelsk from '../../common/lang/en.json' with { type: 'json' };
import bokmål from '../../common/lang/nb.json' with { type: 'json' };
import nynorsk from '../../common/lang/nn.json' with { type: 'json' };

export const tekster = { nb: { ...bokmål }, nn: { ...nynorsk }, en: { ...engelsk } };
