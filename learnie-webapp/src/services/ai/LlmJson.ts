export class LlmJson {

  static parse(json: string): unknown {
    const extractedJson = this.extractJsonFromMarkdown(json);
    return JSON.parse(extractedJson);
  }

  private static extractJsonFromMarkdown(text: string): string {
    // Handle case where text is in markdown format starting with ```json
    if (text.startsWith('```json')) {
      // Extract the JSON content from the markdown format
      const jsonStartIndex = text.indexOf('\n') + 1;
      const jsonEndIndex = text.lastIndexOf('```');

      // Make sure we found both the start and end markers
      if (jsonStartIndex > 0 && jsonEndIndex > jsonStartIndex) {
        return text.substring(jsonStartIndex, jsonEndIndex).trim();
      } else {
        console.warn('Markdown JSON format detected but could not extract content properly');
      }
    }
    return text;
  }
}
