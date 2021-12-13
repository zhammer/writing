import { writeFile, readFile } from "fs/promises";
import { argv } from "process";

function basename(path) {
    return path.split('/').reverse()[0];
}

function removeRedundant(base, content) {
    let title = base.replace(/-/g, " ");
    let lines = content.split("\n").filter(line => !(
        new RegExp(`^title:\\s+${title}`).test(line) ||
        new RegExp(`^slug:\\s+${base}`).test(line) ||
        /^description:\s+""$/.test(line)
    ));
    return lines.join("\n");
}

let filePath = argv[2];
let file = await readFile(filePath);
let base = basename(filePath).split(".")[0];
let out = removeRedundant(base, file.toString());
await writeFile(filePath, out);