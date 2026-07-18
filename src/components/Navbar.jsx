import { useState, useEffect } from 'react';

const LINKS = [
  { href: '#about', label: '~/about' },
  { href: '#skills', label: '~/skills' },
  { href: '#projects', label: '~/work' },
  { href: '#contact', label: '~/contact' },
];

export default function Navbar({ name = 'sujeet' }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="navbar" style={{ borderBottomColor: scrolled ? 'var(--border-hair)' : 'transparent' }}>
      <div className="container navbar-inner">
        <a href="#top" className="navbar-brand" data-cursor="pointer">
          <span className="dot" />
          {name.toLowerCase().replace(/\s+/g, '')}
        </a>

        <nav className="navbar-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} data-cursor="pointer">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="navbar-status">
          <span className="pulse" />
          available
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          data-cursor="pointer"
        >
          {open ? '[ x ]' : '[ = ]'}
        </button>
      </div>

      {open && (
        <nav
          className="container navbar-links"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingBottom: 'var(--space-5)' }}
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} data-cursor="pointer">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
