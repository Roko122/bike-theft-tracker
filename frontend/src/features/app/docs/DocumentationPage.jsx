import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { parseMarkdown } from './parseMarkdown.js';
import './DocumentationPage.css';

function renderInline(text) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

function DocumentationBlock({ block }) {
  switch (block.type) {
    case 'heading':
      const Tag = `h${Math.min(block.level, 6)}`;
      const id = block.level <= 2 ? slugifyHeading(block.text) : undefined;
      return (
        <Tag className={`docs-heading docs-heading--h${block.level}`} id={id}>
          {block.text}
        </Tag>
      );

    case 'paragraph':
      return <p className="docs-paragraph">{renderInline(block.text)}</p>;

    case 'list':
      return (
        <ul className="docs-list">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                {block.header.map((cell, i) => (
                  <th key={i}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function TableOfContents({ blocks, onClose }) {
  const headings = blocks
    .filter((block) => block.type === 'heading' && block.level <= 2)
    .map((block) => ({
      text: block.text,
      level: block.level,
      id: slugifyHeading(block.text)
    }));

  return (
    <aside className="docs-toc">
      <div className="docs-toc__header">
        <h3>Sisällysluettelo</h3>
        <button
          className="docs-toc__close-mobile"
          onClick={onClose}
          aria-label="Close table of contents"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="docs-toc__nav">
        <ul className="docs-toc__list">
          {headings.map((heading, i) => (
            <li
              key={i}
              className={`docs-toc__item docs-toc__item--level${heading.level}`}
            >
              <a href={`#${heading.id}`} className="docs-toc__link">
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default function DocumentationPage({ onClose }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    async function loadDocumentation() {
      try {
        const response = await fetch('/docs/FEATURE_MAP.md');
        if (!response.ok) {
          throw new Error(
            `Failed to load documentation: ${response.statusText}`
          );
        }
        const markdown = await response.text();
        const parsed = parseMarkdown(markdown);
        setBlocks(parsed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDocumentation();
  }, []);

  if (loading) {
    return <div className="docs-loading">Ladataan dokumentaatiota...</div>;
  }

  if (error) {
    return (
      <div className="docs-error">
        Virhe dokumentaation lataamisessa: {error}
      </div>
    );
  }

  return (
    <div className="docs-page">
      <div className="docs-page__header">
        <h1>Bike Theft Tracker docs</h1>
        {onClose && (
          <button
            className="docs-page__close"
            onClick={onClose}
            aria-label="Close documentation"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="docs-page__container">
        <TableOfContents blocks={blocks} onClose={() => setTocOpen(false)} />
        <button
          className="docs-toc__toggle"
          onClick={() => setTocOpen(!tocOpen)}
          aria-label="Toggle table of contents"
        >
          ☰
        </button>

        {tocOpen && (
          <div className="docs-page__toc-mobile">
            <TableOfContents
              blocks={blocks}
              onClose={() => setTocOpen(false)}
            />
          </div>
        )}

        <main className="docs-content">
          {blocks.map((block, i) => (
            <DocumentationBlock key={i} block={block} />
          ))}
        </main>
      </div>

      <div className="docs-page__footer">
        <p>Tekoälyä hyödynnetty dokumentoinnissa</p>
      </div>
    </div>
  );
}
