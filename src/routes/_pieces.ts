import fs from "fs";
import path from "path";
import yml from "yaml";
import dirTree from "directory-tree";
import { tokenizer } from "./../tokenizer";

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
  tokens: string[];
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

export type Directory = {
  slug: string;
  meta: {
    description?: string;
    title?: string;
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
      size: piece.book.pageCount,
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
      sections: scene.sections.map(section => ({
        ...section,
        tokens: tokenizer(section.content)
      }))
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
          tokens: tokenizer(cleanedBody)
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
  let piece: Piece;
  switch (extension) {
    case ".yml":
      piece = parsePieceYml(body);
      break;
    case ".txt":
      piece = parsePieceTxt(body);
      break;
    default:
      throw new Error(
        `piece with filename ${filename} has unexpected extension ${extension}`
      );
  }
  // defaults
  let basename = filename.split("/").reverse()[0].split(".")[0];
  let title = basename.replace(/-/g, " ");
  return {
    description: "",
    slug: basename,
    title,
    ...piece,
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
    title: element.meta.title || element.slug,
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
  pageCount: number;
}

export type BookPlaylist = Piece & {
  pieceType: "BookPlaylist";
  isbn: string;
  playlist: string;
  note?: string;
  book: Book;
}


export function isBookPlaylist(piece: Piece): piece is BookPlaylist {
  return piece.pieceType == "BookPlaylist";
}