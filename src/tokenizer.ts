export type TokenLiteral = {
  type: "literal";
  text: string;
}

export type TokenFunction = {
  type: "function";
  functionName: string;
  args: string[];
}

export type Token = TokenLiteral | TokenFunction;

export function tokenizer(text: string): Token[] {
  let out: Token[] = [];
  let state: "idle" | "in_bracket" = "idle";
  let curr = text;
  while (!!curr) {
    let before: string, after: string;
    switch (state) {
      case "idle":
        [before, after] = splitOnce(curr, "{{")
        out.push({
          type: "literal",
          text: before,
        });
        curr = after;
        state = "in_bracket";
        break;
      case "in_bracket":
        [before, after] = splitOnce(curr, "}}");
        if (after === undefined) {
          throw new Error("finished parsing without closing brackets");
        }
        let [functionName, argText] = splitOnce(before.trim(), " ");
        let args = [...(argText || "").matchAll(/\"([^\"]*)\"/g)].map(match => match[1])
        out.push({
          type: "function",
          functionName: functionName.trim(),
          args,
        });
        curr = after;
        state = "idle";
        break;
    }
  }

  return out;
}

function splitOnce(str: string, match: string): [string, string?] {
  let i = str.indexOf(match);
  if (i === -1) {
    return [str, undefined]
  }
  return [str.slice(0, i), str.slice(i + match.length)]
}