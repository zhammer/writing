import { error } from '@sveltejs/kit';
import { loadDirectory, find, loadPieces, type Piece, type DirectoryLS, type Directory, ls } from "../_pieces";
import type { PageServerLoad } from './$types';

const directory = loadDirectory();
const pieces = loadPieces();
const lookup = new Map();
pieces.forEach((piece) => {
  lookup.set(piece.slug, piece);
});

export const load: PageServerLoad = ({ params }) => {
  const { slug } = params;
  let item = find(directory, slug.split(".")[0].split("/").filter(Boolean));
  if (!item) {
    throw error(404, 'Not found')
  }

  if (isDirectory(item)) {
    return { item: ls(item) };
  } else {
    return { item }
  }
}

function isDirectory(item: Piece | Directory): item is Directory {
  return "children" in item;
}