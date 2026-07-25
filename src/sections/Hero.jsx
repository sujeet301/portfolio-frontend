import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Mail, Github, Linkedin, FileText, Code2 } from 'lucide-react';

const TYPE_SPEED = 55;

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '');
  return initials.join('') || '?';
}

function buildSteps(summary) {
  const trimmedSummary = summary && summary.length > 260 ? `${summary.slice(0, 257)}...` : summary;
  return [
    { type: 'command', id: 'cmd1', text: 'whoami' },
    { type: 'output', id: 'out1', delay: 250 },
    { type: 'pause', delay: 550 },
    { type: 'command', id: 'cmd2', text: 'cat mission.txt' },
    { type: 'output', id: 'out2', delay: 250, extra: trimmedSummary },
    { type: 'pause', delay: 550 },
    { type: 'command', id: 'cmd3', text: 'status --check' },
    { type: 'output', id: 'out3', delay: 250 },
    { type: 'pause', delay: 200 },
  ];
}

export default function Hero({ profile }) {
  const [typed, setTyped] = useState({});
  const [visible, setVisible] = useState({});
  const [finished, setFinished] = useState(false);
  const timeoutRef = useRef(null);

  const name = profile?.name || 'Sujeet Chaudhary';
  const title = profile?.title || 'Full-Stack Web Developer (MERN)';
  const summary =
    profile?.summary ||
    'Building responsive, scalable web applications with React, Node.js, Express & MongoDB.';

  useEffect(() => {
    const steps = buildSteps(summary);
    let cancelled = false;
    let stepIndex = 0;

    const runStep = () => {
      if (cancelled || stepIndex >= steps.length) {
        if (!cancelled) setFinished(true);
        return;
      }
      const step = steps[stepIndex];

      if (step.type === 'command') {
        let charIndex = 0;
        const typeChar = () => {
          if (cancelled) return;
          charIndex++;
          setTyped((prev) => ({ ...prev, [step.id]: step.text.slice(0, charIndex) }));
          if (charIndex < step.text.length) {
            timeoutRef.current = setTimeout(typeChar, TYPE_SPEED);
          } else {
            stepIndex++;
            timeoutRef.current = setTimeout(runStep, 250);
          }
        };
        typeChar();
      } else if (step.type === 'output') {
        setVisible((prev) => ({ ...prev, [step.id]: true }));
        stepIndex++;
        timeoutRef.current = setTimeout(runStep, step.delay);
      } else {
        stepIndex++;
        timeoutRef.current = setTimeout(runStep, step.delay);
      }
    };

    runStep();
    return () => {
      cancelled = true;
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-photo-wrap">
            <div className="hero-photo-frame">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={name} className="hero-photo" />
              ) : (
                <div className="hero-photo-placeholder">{getInitials(name)}</div>
              )}
              <span className="frame-corner tl" />
              <span className="frame-corner tr" />
              <span className="frame-corner bl" />
              <span className="frame-corner br" />
              <span className="hero-photo-scan" />
            </div>
            <div className="hero-photo-caption mono-tag">
              <span className="terminal-status">●</span> operator_verified
            </div>
          </div>

          <div className="hero-terminal-col">
            <div className="terminal">
              <div className="terminal-bar">
                <span className="path">visitor@{name.toLowerCase().replace(/\s+/g, '-')}: ~</span>
                <span className="terminal-dot" />
              </div>

              <div className="terminal-body">
                {/* whoami */}
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-output">{typed.cmd1 || ''}</span>
                </div>
                {visible.out1 && (
                  <div style={{ marginBottom: 'var(--space-5)' }}>
                    <div className="terminal-output name">{name}</div>
                    <div className="terminal-output title-line">{title}</div>
                  </div>
                )}

                {/* cat mission.txt */}
                {typed.cmd2 !== undefined && (
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-output">{typed.cmd2}</span>
                  </div>
                )}
                {visible.out2 && (
                  <div className="terminal-output dim" style={{ marginBottom: 'var(--space-5)', maxWidth: '54ch' }}>
                    {summary && summary.length > 260 ? `${summary.slice(0, 257)}...` : summary}
                  </div>
                )}

                {/* status check */}
                {typed.cmd3 !== undefined && (
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-output">{typed.cmd3}</span>
                  </div>
                )}
                {visible.out3 && (
                  <div className="terminal-line">
                    <span className="terminal-output terminal-status">[✓] Available for new opportunities</span>
                  </div>
                )}

                {finished && (profile?.githubUrl || profile?.linkedinUrl || profile?.leetcodeUrl || profile?.resumeUrl) && (
              <div className="hero-social">
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-social-link"
                    data-cursor="pointer"
                    aria-label="GitHub"
                  >
                    <Github size={17} /> GitHub
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-social-link"
                    data-cursor="pointer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={17} /> LinkedIn
                  </a>
                )}
                {profile?.leetcodeUrl && (
                  <a
                    href={profile.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-social-link"
                    data-cursor="pointer"
                    aria-label="LeetCode"
                  >
                    <Code2 size={17} /> LeetCode
                  </a>
                )}
                {profile?.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-social-link"
                    data-cursor="pointer"
                    aria-label="Resume"
                  >
                    <FileText size={17} /> Resume
                  </a>
                )}
              </div>
            )}

            <br />

                {finished && <span className="terminal-caret" aria-hidden="true" />}
              </div>
            </div>

            {finished && (
              <div className="hero-cta">
                <a href="#projects" className="btn btn-primary" data-cursor="pointer">
                  <ArrowDown size={15} /> View Work
                </a>
                <a href="#contact" className="btn btn-ghost" data-cursor="pointer">
                  <Mail size={15} /> Get in Touch
                </a>
              </div>
            )}

           
          </div>
        </div>
      </div>

      <div className="hero-side">REACT · NODE · EXPRESS · MONGODB</div>
    </section>
  );
}