import type { SanityDokument } from '../../common/sanity';
import { sanityKlient } from './client/sanity';

export function hentSanityTekster() {
    return sanityKlient.fetch<SanityDokument[]>('*');
}
