import fs from "fs";
import path from "path";
import yml from "yaml";
import dirTree from "directory-tree";

export type SectionType =
  | "Action"
  | "Character"
  | "Dialogue"
  | "Parenthetical"
  | "SceneHeading"
  | "Text"
  | "Title";

export type Section = {
  type: SectionType;
  content: string;
};

export type Scene = {
  name: string;
  type: "Default" | "Card";
  sections: Section[];
  meta?: {
    song?: {
      name: string;
      artist: string;
      url: string;
    };
  };
};

export type ProcessedScene = Scene & {
  footnotes: string[];
}

export type ListItem = {
  title: string;
  date: string;
  size: number;
  description: string;
  slug: string;
  type: "TXT" | "DIR";
};

export type Piece = {
  pieceType: string;
  slug: string;
  title: string;
  description: string;
  size: number;
  date: string;
}

export type Processed = {
  processed: true;
}

export type ProcessedPiece = Piece & Processed;

export type WritingPiece = Piece & {
  pieceType: "WritingPiece";
  title: string;
  date: string;
  size: number;
  description: string;
  slug: string;
  scenes: Scene[];
};

export function isWritingPiece(piece: Piece): piece is WritingPiece {
  return piece.pieceType == "WritingPiece";
}

export function isProcessedWritingPiece(piece: Piece): piece is ProcessedWritingPiece {
  return isWritingPiece(piece) && piece["processed"] === true;
}

export type ProcessedWritingPiece = WritingPiece & Processed & {
  scenes: ProcessedScene[];
}

export type Directory = {
  slug: string;
  meta: {
    description?: string;
  };
  children: (Directory | Piece)[];
};

export type DirectoryLS = {
  slug: string;
  meta: {
    description?: string;
  };
  children: ListItem[];
};

// computes the 'size' of an array of scenes from a piece.
// the size is the number of characters in the actual text
// of the piece.
function computeSize(scenes: Scene[]): number {
  let size = 0;
  scenes.forEach((scene) => {
    scene.sections.forEach((section) => {
      size += section.content.length;
    });
  });
  return size;
}

function parsePieceYml(body: string): Piece {
  let piece: Piece =
  {
    // default piece type
    pieceType: "WritingPiece",
    ...yml.parse(body)
  };
  if (isWritingPiece(piece)) {
    return parseWritingPiece(piece);
  } else if (isBookPlaylist(piece)) {
    return {
      ...piece,
      size: piece.note.length,
    };
  } else {
    throw new Error(`Can't parse piece: ${body}`);
  }
}

function parseWritingPiece(piece: WritingPiece): WritingPiece {
  return {
    ...piece,
    scenes: piece.scenes.map((scene) => ({
      ...scene,
      type: scene.type || "Default",
    })),
    size: computeSize(piece.scenes),
  }
}

function parsePieceTxt(body: string): WritingPiece {
  let regex = /```piece(.*)```\n*/gs;
  let match = regex.exec(body);
  if (match.length !== 2) {
    throw new Error("didn't find piece info for piece with body: " + body);
  }
  // for now the piece's "meta" stanza gets applied to the first scene,
  // since we only make one scene out of the entire .txt file body
  let { meta = {}, ...pieceInfo } = yml.parse(match[1]);
  let cleanedBody = body.replace(regex, "");
  let scenes: Scene[] = [
    {
      name: "main",
      type: "Default",
      meta,
      sections: [
        {
          type: "Text",
          content: cleanedBody,
        },
      ],
    },
  ];
  return {
    ...pieceInfo,
    size: computeSize(scenes),
    scenes,
    pieceType: "WritingPiece",
  };
}

function readPiece(filename: string): Piece {
  let file = fs.readFileSync(filename);
  let body = file.toString();
  let extension = path.extname(filename);
  switch (extension) {
    case ".yml":
      return parsePieceYml(body);
    case ".txt":
      return parsePieceTxt(body);
    default:
      throw new Error(
        `piece with filename ${filename} has unexpected extension ${extension}`
      );
  }
}

export function loadPieces(): Piece[] {
  let filenames = fs.readdirSync("pieces", { withFileTypes: true });
  return filenames
    .filter((filename) => filename.isFile())
    .map((filename): Piece => readPiece("pieces/" + filename.name));
}

function isDirectoryMeta(child: dirTree.DirectoryTree) {
  return child.name.endsWith("__meta__.yml");
}

function readDirectory(tree: dirTree.DirectoryTree): Directory {
  let pieces = tree.children
    .filter((child) => !isDirectoryMeta(child))
    .map((child) => {
      if (child.type === "directory") {
        return readDirectory(child);
      }
      return readPiece(child.path);
    });
  let meta = {};
  let metaFile = tree.children.find(isDirectoryMeta);
  if (metaFile) {
    let file = fs.readFileSync(metaFile.path);
    let body = file.toString();
    meta = yml.parse(body);
  }
  const directory = {
    slug: tree.path.slice("pieces/".length),
    children: pieces,
    meta,
  };
  return directory;
}

export function loadDirectory(): Directory {
  let tree = dirTree("pieces/", { extensions: /\.(yml|txt)$/ });
  return readDirectory(tree);
}

function toListItem(element: Directory | Piece): ListItem {
  if ("pieceType" in element) {
    return {
      title: element.title,
      date: element.date,
      size: element.size,
      description: element.description,
      slug: element.slug,
      type: "TXT",
    };
  }
  return {
    description: "",
    title: element.slug,
    size: 0,
    date: "",
    slug: element.slug,
    type: "DIR",
  };
}

export function ls(directory: Directory): DirectoryLS {
  return {
    slug: directory.slug,
    meta: directory.meta,
    children: directory.children.map(toListItem),
  };
}

export function find(
  directory: Directory,
  slug: string[]
): Directory | Piece | null {
  let found = directory.children.find((child) => child.slug === slug[0]);
  if (!found) {
    return null;
  }

  if (slug.length === 1) {
    return found;
  }
  // was expecting directory
  if (!("meta" in found)) {
    return null;
  }
  return find(found, slug.slice(1));
}

// a very bad replacement for node 16 string.replaceAll
function replaceAll(str: string, regex: RegExp, replacer: (substring: string, ...args: any[]) => string): string {
  let prev = str;
  for (let i = 0; i < 1000; i++) {
    let curr = prev.replace(regex, replacer);
    if (prev === curr) {
      return curr;
    }
    prev = curr;
  }
  throw new Error("we may be recurring")
}

// ideally this would go in the svelte code, i guess? but i want this preprocessing
// to always happen on the backend, or, more specifically, i don't want it to happen
// on the browser.
export function processScene(scene: Scene): ProcessedScene {
  const footnoteRegex = /\{\{\s*footnote\s*"(.+?)"\s*\}\}/g;
  let processedSections: Section[] = [];
  let footnotes: string[] = [];

  scene.sections.forEach((section) => {
    let index = 0;
    let content = replaceAll(
      section.content,
      footnoteRegex,
      (_, group): string => {
        index++;
        footnotes.push(group);
        return `<sup class="footnote-ref">${index}</sup>`;
      }
    );
    content = content.replace(/\*([^=*]+?)\*/g, "<i>$1</i>")

    processedSections.push({
      ...section,
      content,
    });
  });

  return {
    ...scene,
    sections: processedSections,
    footnotes,
  };
}


function processWritingPiece(piece: WritingPiece): ProcessedWritingPiece {
  return {
    ...piece,
    scenes: piece.scenes.map(processScene),
    processed: true,
  }
}

export function processPiece(piece: Piece): ProcessedPiece {
  if (isWritingPiece(piece)) {
    return processWritingPiece(piece)
  } else if (isBookPlaylist(piece)) {
    return processBookPlaylist(piece)
  } else {
    throw new Error(`can't process piece: ${JSON.stringify(piece)}`)
  }
}

/*
-~-+=-~-+=-~-
P L U G I N S
-~-+=-~-+=-~-
*/

export type Book = {
  title: string;
  author: string;
  image: string;
  url: string;
}

export type BookPlaylist = Piece & {
  pieceType: "BookPlaylist";
  isbn: string;
  playlist: string;
  note: string;
  book: Book;
}


export type ProcessedBookPlaylist = BookPlaylist & Processed;

export function isBookPlaylist(piece: Piece): piece is BookPlaylist {
  return piece.pieceType == "BookPlaylist";
}

export function isProcessedBookPlaylist(piece: Piece): piece is ProcessedBookPlaylist {
  return isBookPlaylist(piece) && piece["processed"] === true;
}

function processBookPlaylist(piece: BookPlaylist): ProcessedBookPlaylist {
  return {
    ...piece,
    processed: true,
  }
}