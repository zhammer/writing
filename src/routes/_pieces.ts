import fs from "fs";
import yml from "yaml";
import dirTree from "directory-tree";

export type SectionType =
  | "Action"
  | "Character"
  | "Dialogue"
  | "Parenthetical"
  | "SceneHeading"
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
  path: string;
  meta?: {
    description?: string;
  };
  children: (Directory | Piece)[];
};

export type DirectoryLS = {
  meta?: {
    description?: string;
  };
  children: ListItem[];
};

function readPiece(filename: string): Piece {
  let file = fs.readFileSync(filename);
  let body = file.toString();
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

export function loadPieces(): Piece[] {
  let filenames = fs.readdirSync("pieces", { withFileTypes: true });
  return filenames
    .filter((filename) => filename.isFile())
    .map((filename): Piece => readPiece("pieces/" + filename.name));
}

function readDirectory(tree: dirTree.DirectoryTree): Directory {
  let pieces = tree.children
    .filter((child) => !child.name.endsWith("__meta__.yml"))
    .map((child) => {
      if (child.type === "directory") {
        return readDirectory(child);
      }
      return readPiece(child.path);
    });
  const directory = {
    path: tree.path.slice("pieces/".length) + "/",
    children: pieces,
  };
  return directory;
}

export function loadDirectory(): Directory {
  let tree = dirTree("pieces/", { extensions: /\.yml$/ });
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
    description: element?.meta?.description || "",
    title: element.path,
    size: 0,
    date: "",
    slug: element.path,
    type: "DIR",
  };
}

export function ls(directory: Directory): DirectoryLS {
  return {
    meta: directory.meta,
    children: directory.children.map(toListItem),
  };
}
