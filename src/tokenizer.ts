export function tokenizer(text: string): string[] {
  return text.split(/\{\{\s+|\s+\}\}/);
}