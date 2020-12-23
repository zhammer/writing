import { loadPieces } from "./_pieces";

const pieces = loadPieces();
const lookup = new Map();
pieces.forEach((piece) => {
  lookup.set(piece.slug, piece);
});

export function get(req, res, next) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  const { slug } = req.params;

  if (lookup.has(slug[0])) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({ piece: lookup.get(slug[0]) }));
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