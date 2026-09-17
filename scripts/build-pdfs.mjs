import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import { chromium } from 'playwright';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rulesDirectory = path.join(projectRoot, 'brass-birmingham', 'rules');
const outputDirectory = path.join(rulesDirectory, 'pdf');
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

const pdfFiles = (await readdir(rulesDirectory, { withFileTypes: true }))
  .filter(({ name, isFile }) => isFile && /^(explication|variant)-.*\.md$/i.test(name))
  .map(({ name }) => name)
  .sort((left, right) => left.localeCompare(right, 'en'));

if (pdfFiles.length === 0) {
  throw new Error(`No explication or variant Markdown files found in ${rulesDirectory}`);
}

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();
try {
  for (const fileName of pdfFiles) {
    const source = await readFile(path.join(rulesDirectory, fileName), 'utf8');
    const html = createDocument(markdown.render(source), fileName);
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({
      path: path.join(outputDirectory, fileName.replace(/\.md$/i, '.pdf')),
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', right: '18mm', bottom: '18mm', left: '18mm' }
    });
    await page.close();
    console.log(`Created ${path.relative(projectRoot, path.join(outputDirectory, fileName.replace(/\.md$/i, '.pdf')))}`);
  }
} finally {
  await browser.close();
}

function createDocument(content, fileName) {
  const title = fileName
    .replace(/\.md$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light; }
      @page { size: A4; }
      body {
        color: #202124;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 11.5pt;
        line-height: 1.55;
        margin: 0;
      }
      h1, h2, h3 { color: #172b4d; line-height: 1.2; }
      h1 { border-bottom: 2px solid #c89b3c; font-size: 23pt; padding-bottom: 8pt; }
      h2 { border-bottom: 1px solid #d9dee8; font-size: 16pt; margin-top: 22pt; padding-bottom: 4pt; }
      h3 { font-size: 13pt; margin-top: 18pt; }
      p { margin: 8pt 0; }
      ul, ol { padding-left: 22pt; }
      li { margin: 4pt 0; }
      blockquote {
        border-left: 4px solid #c89b3c;
        color: #4a5568;
        margin: 14pt 0;
        padding: 4pt 12pt;
      }
      code { background: #f1f3f5; padding: 1pt 3pt; }
      a { color: #1d5d8f; }
    </style>
  </head>
  <body>${content}</body>
</html>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}