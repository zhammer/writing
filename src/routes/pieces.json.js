import { loadDirectory, ls } from "./_pieces";

const directory = loadDirectory();
const directoryLS = ls(directory);
const contents = JSON.stringify({ directory: directoryLS });

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(contents);
}
