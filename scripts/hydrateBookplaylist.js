import { writeFile, readFile } from "fs/promises";
import fetch from "node-fetch";
import { argv } from "process";
import yml from "yaml";

function pluckBook(isbn, payload) {
    let firstBook = payload.items[0];
    let volumeInfo = firstBook.volumeInfo;
    return {
        title: volumeInfo.title,
        author: volumeInfo.authors[0],
        image: volumeInfo.imageLinks.thumbnail,
        url: `https://books.google.com/books?vid=ISBN${isbn}`
    }
}

let filePath = argv[2];

let file = await readFile(filePath);
let bookplaylist = yml.parse(file.toString());
if (!bookplaylist.isbn) {
    console.log("no isbn, exiting")
    process.exit(0);
}
let res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${bookplaylist.isbn}`);
let resJson = await res.json();
let book = pluckBook(bookplaylist.isbn, resJson);
let hydrated = {
    ...bookplaylist,
    book,
}
let out = yml.stringify(hydrated);
await writeFile(filePath, out);