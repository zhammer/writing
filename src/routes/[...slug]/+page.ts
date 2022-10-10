import type { PageLoad } from './$types';

export const load: PageLoad = ({ data, url }) => {
  return {
    ...data,
    query: url.searchParams
  }
};