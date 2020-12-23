import { loadPieces, find, loadDirectory, ls } from "./_pieces";

const directory = loadDirectory();
const pieces = loadPieces();
const lookup = new Map();
pieces.forEach((piece) => {
  lookup.set(piece.slug, piece);
});

export function get(req, res, next) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  const { slug } = req.params;
  let item = find(directory, slug[0].split(",").filter(Boolean));

  if (item) {
    if ("children" in item) {
      item = ls(item);
    }
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({ item }));
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    );
  }
}

function last(array) {
  return array[array.length - 1];
}
