import { tokenizer } from './tokenizer';

describe('tokenizer', () => {
  test.each([
    ["no brackets", "this text doesn't have brackets", ["this text doesn't have brackets"]]
  ])
    ('%s', (name: string, text: string, expected: string[]) => {
      expect(tokenizer(text)).toEqual(expected);
    })
});