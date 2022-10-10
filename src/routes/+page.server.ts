import { loadDirectory, ls } from "./_pieces";
import type { PageServerLoad } from './$types';

const directory = loadDirectory();
const directoryLS = ls(directory);

export const load: PageServerLoad = () => {
  return {
    directory: directoryLS,
  };
}