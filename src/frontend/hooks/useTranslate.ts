import { useLocale } from '@hooks/useLocale';
import type { FlettefeltVerdier, LocaleRecordBlock, LocaleRecordString } from '../../common/sanity';
import type { LocaleType } from '../../common/typer/localeType';
import { plainTekstHof } from '../utils/sanity';
import { useTranslateFlettefelt } from './useTranslateFlettefelt';

type Translate = (
    localeRecord: LocaleRecordBlock | LocaleRecordString | undefined,
    flettefelter?: FlettefeltVerdier,
    spesifikkLocale?: LocaleType
) => string;

export function useTranslate(): Translate {
    const locale = useLocale();
    const translateFlettefelt = useTranslateFlettefelt();

    return plainTekstHof(translateFlettefelt, locale);
}
