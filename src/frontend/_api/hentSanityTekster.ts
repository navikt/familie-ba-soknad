import type { SanityDokument } from '../../common/sanity';
import { sanityKlient } from './client/sanity';

export async function hentSanityTekster() {
    return sanityKlient.fetch<SanityDokument[]>('*');
}
