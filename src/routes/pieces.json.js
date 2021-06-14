import { loadDirectory, ls } from "./_pieces";

const directory = loadDirectory();
const directoryLS = ls(directory);
const contents = JSON.stringify({ directory: directoryLS });

export function get() {
  return { 
    body: contents
  };
}