import { loadPieces, find, loadDirectory, ls } from "./_pieces";

const directory = loadDirectory();
const pieces = loadPieces();
const lookup = new Map();
pieces.forEach((piece) => {
  lookup.set(piece.slug, piece);
});

export function get({ params }) {
  console.log(params);
  const { slug } = params;
  let item = find(directory, slug[0].split(",").filter(Boolean));

  if (item) {
    if ("children" in item) {
      item = ls(item);
    }

    return {
      body: { item }
    };
  } else {
    return {
      status: 404,
      body: {
        message: "Not found",
      }
    }
  }
}

function last(array) {
  return array[array.length - 1];
}
