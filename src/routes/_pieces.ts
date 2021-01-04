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

export type ListItem = {
  title: string;
  date: string;
  size: number;
  description: string;
  slug: string;
  type: "TXT" | "DIR";
};

export type Piece = {
  title: string;
  date: string;
  size: number;
  description: string;
  slug: string;
  scenes: Scene[];
};

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

function parsePieceYml(body: string): Piece {
  let piece: Piece = yml.parse(body);
  return {
    ...piece,
    scenes: piece.scenes.map((scene) => ({
      ...scene,
      type: scene.type || "Default",
    })),
    size: body.length,
  };
}

function parsePieceTxt(body: string): Piece {
  let regex = /```piece(.*)```\n*/gs;
  let match = regex.exec(body);
  if (match.length !== 2) {
    throw new Error("didn't find piece info for piece with body: " + body);
  }
  // for now the piece's "meta" stanza gets applied to the first scene,
  // since we only make one scene out of the entire .txt file body
  let { meta = {}, ...pieceInfo } = yml.parse(match[1]);
  let cleanedBody = body.replace(regex, "");
  return {
    ...pieceInfo,
    scenes: [
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
    ],
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
  if ("scenes" in element) {
    const { scenes, ...rest } = element;
    return {
      ...rest,
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
  if ("scenes" in found) {
    return null;
  }
  return find(found, slug.slice(1));
}
