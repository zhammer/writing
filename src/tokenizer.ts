export function tokenizer(text: string): string[] {
  let out: string[] = [];
  let state: "idle" | "in_bracket" = "idle";
  let curr = text;
  while (curr) {
    let before: string, after: string;
    switch (state) {
      case "idle":
        [before, after] = curr.split(/{{\s+/, 2);
        out.push(before);
        curr = after;
        state = "in_bracket";
        break;
      case "in_bracket":
        [before, after] = curr.split(/\s+}}/, 2);
        if (!after) {
          throw new Error("finished parsing without closing brackets");
        }
        out.push(before);
        curr = after;
        state = "idle";
        break;
    }
  }

  return text.split(/\{\{\s+|\s+\}\}/);
}