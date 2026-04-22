/**
 * Parse markdown content into block elements
 * Supports headings, paragraphs, lists, and tables
 */

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

export function parseMarkdown(markdown) {
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
