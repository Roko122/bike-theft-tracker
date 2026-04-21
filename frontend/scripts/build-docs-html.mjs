import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const markdownPath = path.resolve(projectRoot, 'docs/FEATURE_MAP.md');
const outputPath = path.resolve(projectRoot, 'public/docs/index.html');

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderInline(text) {
  const escaped = escapeHtml(text);
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparatorLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
    return false;
  }
  return splitTableRow(trimmed).every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim()
      });
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items = [];
      while (index < lines.length) {
        const itemLine = lines[index].trim();
        if (!itemLine.startsWith('- ')) {
          break;
        }
        items.push(itemLine.slice(2).trim());
        index += 1;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const isTableStart =
      line.startsWith('|') &&
      line.endsWith('|') &&
      index + 1 < lines.length &&
      isTableSeparatorLine(lines[index + 1]);

    if (isTableStart) {
      const header = splitTableRow(lines[index]);
      index += 2;
      const rows = [];

      while (index < lines.length) {
        const rowLine = lines[index].trim();
        if (!rowLine.startsWith('|') || !rowLine.endsWith('|')) {
          break;
        }
        rows.push(splitTableRow(rowLine));
        index += 1;
      }

      blocks.push({ type: 'table', header, rows });
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length) {
      const paragraphLine = lines[index].trim();
      if (!paragraphLine) {
        break;
      }
      if (paragraphLine.match(/^(#{1,6})\s+(.+)$/)) {
        break;
      }
      if (paragraphLine.startsWith('- ')) {
        break;
      }
      if (paragraphLine.startsWith('|') && paragraphLine.endsWith('|')) {
        break;
      }

      paragraphLines.push(paragraphLine);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paragraphLines.join(' ')
      });
      continue;
    }

    index += 1;
  }

  return blocks;
}

function slugifyHeading(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function renderBlocks(blocks) {
  let html = '';
  let sectionOpen = false;
  const sectionIds = new Set();
  const sections = [];
  let pageTitle = 'Documentation';

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 1) {
      if (sectionOpen) {
        html += '      </section>\n';
        sectionOpen = false;
      }
      pageTitle = block.text;
      html += `      <h1 id="top">${renderInline(block.text)}</h1>\n`;
      continue;
    }

    if (block.type === 'heading' && block.level === 2) {
      let sectionIdBase = slugifyHeading(block.text) || 'section';
      let sectionId = sectionIdBase;
      let suffix = 2;
      while (sectionIds.has(sectionId)) {
        sectionId = `${sectionIdBase}-${suffix}`;
        suffix += 1;
      }
      sectionIds.add(sectionId);
      sections.push({ id: sectionId, title: block.text });

      if (sectionOpen) {
        html += '      </section>\n';
      }
      sectionOpen = true;
      html += `      <section id="${sectionId}" class="doc-section">\n`;
      html += `        <h2><a href="#${sectionId}">${renderInline(block.text)}</a></h2>\n`;
      continue;
    }

    if (block.type === 'paragraph') {
      html += `      <p>${renderInline(block.text)}</p>\n`;
      continue;
    }

    if (block.type === 'list') {
      html += '      <ul>\n';
      for (const item of block.items) {
        html += `        <li>${renderInline(item)}</li>\n`;
      }
      html += '      </ul>\n';
      continue;
    }

    if (block.type === 'table') {
      html += '      <div class="table-wrap">\n';
      html += '        <table>\n';
      html += '          <thead>\n';
      html += '            <tr>\n';
      for (const cell of block.header) {
        html += `              <th>${renderInline(cell)}</th>\n`;
      }
      html += '            </tr>\n';
      html += '          </thead>\n';
      html += '          <tbody>\n';
      for (const row of block.rows) {
        html += '            <tr>\n';
        for (const cell of row) {
          html += `              <td>${renderInline(cell)}</td>\n`;
        }
        html += '            </tr>\n';
      }
      html += '          </tbody>\n';
      html += '        </table>\n';
      html += '      </div>\n';
    }
  }

  if (sectionOpen) {
    html += '      </section>\n';
  }

  return {
    contentHtml: html.trimEnd(),
    sections,
    pageTitle
  };
}

function buildHtml(contentHtml, sections, pageTitle) {
  const sectionLinks = sections
    .map((section) => `            <li><a href="#${section.id}">${renderInline(section.title)}</a></li>`)
    .join('\n');

  return `<!doctype html>
<html lang="fi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)} - Bike Theft Tracker</title>
    <style>
      :root {
        color-scheme: light;
        --background: #ffffff;
        --foreground: #09090b;
        --muted: #71717a;
        --border: #e4e4e7;
        --muted-bg: #fafafa;
      }

      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        background: var(--background);
        color: var(--foreground);
      }

      .site-header {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
        border-bottom: 1px solid var(--border);
        background: color-mix(in srgb, var(--background) 90%, white);
        backdrop-filter: blur(8px);
      }

      .site-header__brand {
        font-size: 14px;
        font-weight: 600;
      }

      .docs-layout {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr) 220px;
        gap: 24px;
        max-width: 1440px;
        margin: 0 auto;
        padding: 24px 16px 64px;
      }

      .sidebar,
      .toc {
        position: sticky;
        top: 72px;
        align-self: start;
      }

      .sidebar__title,
      .toc__title {
        margin: 0 0 10px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0;
        text-transform: uppercase;
        color: var(--muted);
      }

      .sidebar ul,
      .toc ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .sidebar li,
      .toc li {
        margin: 0;
      }

      .sidebar a,
      .toc a {
        display: block;
        padding: 6px 0;
        color: var(--muted);
        font-size: 14px;
        text-decoration: none;
      }

      .sidebar a:hover,
      .toc a:hover {
        color: var(--foreground);
      }

      h1 {
        margin: 0 0 16px;
        font-size: 34px;
        line-height: 1.2;
      }

      .content {
        min-width: 0;
      }

      h2 {
        margin: 0 0 14px;
        font-size: 22px;
        line-height: 1.3;
      }

      h2 a {
        color: inherit;
        text-decoration: none;
      }

      .doc-section {
        padding: 20px 0;
        border-top: 1px solid var(--border);
      }

      .doc-section:first-of-type {
        margin-top: 8px;
      }

      p,
      ul {
        margin: 0 0 16px;
        line-height: 1.6;
        color: var(--muted);
      }

      ul {
        padding-left: 20px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }

      .table-wrap {
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: 16px;
      }

      th,
      td {
        text-align: left;
        vertical-align: top;
        padding: 10px 12px;
        border-top: 1px solid var(--border);
      }

      th {
        border-top: 0;
        color: var(--foreground);
        background: var(--muted-bg);
        font-size: 12px;
        font-weight: 600;
      }

      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
          "Courier New", monospace;
        background: var(--muted-bg);
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 1px 6px;
        color: var(--foreground);
        font-size: 12px;
      }

      @media (max-width: 1100px) {
        .docs-layout {
          grid-template-columns: 240px minmax(0, 1fr);
        }

        .toc {
          display: none;
        }
      }

      @media (max-width: 820px) {
        .docs-layout {
          display: block;
          padding-top: 16px;
        }

        .sidebar {
          position: static;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <div class="site-header__brand">Bike Theft Tracker Docs</div>
    </header>
    <div class="docs-layout">
      <aside class="sidebar">
        <p class="sidebar__title">Sections</p>
        <ul>
          <li><a href="#top">Overview</a></li>
${sectionLinks}
        </ul>
      </aside>
      <main class="content">
${contentHtml}
      </main>
      <aside class="toc">
        <p class="toc__title">On this page</p>
        <ul>
${sectionLinks}
        </ul>
      </aside>
    </div>
  </body>
</html>
`;
}

function main() {
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const blocks = parseMarkdown(markdown);
  const { contentHtml, sections, pageTitle } = renderBlocks(blocks);
  const html = buildHtml(contentHtml, sections, pageTitle);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Generated ${path.relative(projectRoot, outputPath)} from ${path.relative(projectRoot, markdownPath)}`);
}

main();
