import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';

marked.use({
  breaks: true,
  gfm: true,
});

export function loadMarkdown(fileName: string): string {
  try {
    const filePath = path.resolve(
      process.cwd(),
      'src/common/swagger',
      fileName,
    );
    const content = fs.readFileSync(filePath, 'utf-8');
    return marked.parse(content) as string;
  } catch (err) {
    console.error(`Fehler beim Laden von ${fileName}:`, err);
    return '';
  }
}
