import { tokenizer } from './tokenizer';

describe('tokenizer', () => {
  // success cases
  test.each([
    ["no brackets", "this text doesn't have brackets", ["this text doesn't have brackets"]],
    ["brackets with space", "this text has brackets{{ footnote \"they are great brackets!\" }}", ["this text has brackets", "footnote \"they are great brackets!\""]]
  ])
    ('%s', (_, text: string, expected: string[]) => {
      expect(tokenizer(text)).toEqual(expected);
    })

  // error cases
  test.each([
    ["unended bracket", "this text {{ has brackets but they don't close", "finished parsing without closing brackets"]
  ])
    ('%s', (_, text: string, expected: string) => {
      expect(() => { tokenizer(text) }).toThrow(expected);
    })
});