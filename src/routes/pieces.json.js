import { load } from "./_pieces";

const pieces = load();
const contents = JSON.stringify({ pieces });

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(contents);
}
