import fs from "fs";
import yml from "yaml";

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

export type PieceListItem = {
  title: string;
  date: string;
  size: number;
  description: string;
  slug: string;
};

export type Piece = PieceListItem & {
  scenes: Scene[];
};

export function loadPieces(): Piece[] {
  let filenames = fs.readdirSync("pieces", { withFileTypes: true });
  return filenames
    .filter((filename) => filename.isFile())
    .map(
      (filename): Piece => {
        let file = fs.readFileSync("pieces/" + filename.name);
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
    );
}

export function loadPieceListItems(): PieceListItem[] {
  return loadPieces().map(({ scenes, ...rest }) => rest);
}
}
