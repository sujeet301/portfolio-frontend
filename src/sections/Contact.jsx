import { Mail, Github, Linkedin, Phone, FileText } from 'lucide-react';
import Reveal from '../components/Reveal';

export default function Contact({ profile }) {
  const links = [
    profile?.email && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile?.phone && { icon: Phone, label: profile.phone, href: `tel:${profile.phone}` },
    profile?.githubUrl && { icon: Github, label: 'GitHub', href: profile.githubUrl },
    profile?.linkedinUrl && { icon: Linkedin, label: 'LinkedIn', href: profile.linkedinUrl },
    profile?.resumeUrl && { icon: FileText, label: 'Resume', href: profile.resumeUrl },
  ].filter(Boolean);

  return (
    <section className="section" id="contact" style={{ borderBottom: 'none' }}>
      <div className="container">
        <Reveal>
          <div className="panel contact-panel">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              ~/contact
            </span>
            <h2 className="section-title">Let's build something</h2>
            <p className="contact-lead">
              Open to full-stack roles, freelance projects, and interesting problems.
              Reach out through any of the channels below.
            </p>
            {links.length > 0 && (
              <div className="contact-links">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="contact-link"
                    data-cursor="pointer"
                  >
                    <l.icon size={15} />
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
