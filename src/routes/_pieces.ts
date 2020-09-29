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
  sections: Section[];
  meta?: {
    song?: {
      name: string;
      artist: string;
      url: string;
    };
  };
};

export type Piece = {
  title: string;
  date: string;
  size: number;
  description: string;
  slug: string;
  scenes: Scene[];
};

export function load(): Piece[] {
  let filenames = fs.readdirSync("pieces");
  return filenames.map(
    (filename): Piece => {
      let file = fs.readFileSync("pieces/" + filename);
      let body = file.toString();
      return {
        ...yml.parse(body),
        size: body.length,
      };
    }
  );
}
