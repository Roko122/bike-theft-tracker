import { BookText, Github } from 'lucide-react';

export default function AppFooter({ onOpenDocs, t }) {
  return (
    <footer className="app-footer">
      <div className="app-footer__content">
        <span className="app-footer__brand">&copy; RKRS</span>
        <div className="app-footer__links">
          <a
            className="app-footer__link"
            href="https://github.com/Roko122/bike-theft-tracker"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
            {t('app.github')}
          </a>
          <button
            className="app-footer__link"
            onClick={onOpenDocs}
            type="button"
            aria-label="Open documentation"
          >
            <BookText size={16} />
            {t('app.docs')}
          </button>
        </div>
      </div>
    </footer>
  );
}
