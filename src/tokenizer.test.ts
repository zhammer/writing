import { tokenizer, type Token } from './tokenizer';

describe('tokenizer', () => {
  // success cases
  test.each([
    ["no brackets", "this text doesn't have brackets", [{ type: "literal", text: "this text doesn't have brackets" }]],
    [
      "brackets with space", `this text has brackets{{ footnote "they are great brackets!" }}`,
      [{ type: "literal", text: "this text has brackets" }, { type: "function", functionName: "footnote", args: ["they are great brackets!"] }]
    ]
  ])
    ('%s', (_, text: string, expected: Token[]) => {
      expect(tokenizer(text)).toEqual(expected);
    })

  // error cases
  test.each([
    ["unended bracket", `this text {{ has brackets but they don't close`, "finished parsing without closing brackets"]
  ])
    ('%s', (_, text: string, expected: string) => {
      expect(() => { tokenizer(text) }).toThrow(expected);
    })
});