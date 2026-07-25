import Reveal from '../components/Reveal';

export default function About({ profile }) {
  const education = profile?.education?.length
    ? profile.education
    : [
        {
          degree: 'Bachelor of Technology (B.Tech)',
          institution: 'Add your college/university name',
          year: 'Expected graduation - add year',
          details: 'Relevant coursework: DSA, DBMS, OS, Computer Networks, Software Engineering, OOP',
        },
      ];

  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">~/about</span>
          <h2 className="section-title">A closer look</h2>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <p className="about-summary">{profile?.summary}</p>

            {profile?.softSkills?.length > 0 && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <span className="about-card-label">Soft Skills</span>
                <div className="tag-list">
                  {profile.softSkills.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.achievements?.length > 0 && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <span className="about-card-label">Achievements</span>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {profile.achievements.map((a) => (
                    <li key={a} style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      → {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          <Reveal delay={120}>
            {education.map((edu, i) => (
              <div className="panel about-card" key={i}>
                <span className="about-card-label">Education</span>
                <div className="about-edu-degree">{edu.degree}</div>
                <div className="about-edu-meta">
                  {edu.institution} {edu.year ? `— ${edu.year}` : ''}
                </div>
                {edu.details && <div className="about-edu-details">{edu.details}</div>}
              </div>
            ))}

            {profile?.certificates?.length > 0 && (
              <div className="panel about-card">
                <span className="about-card-label">Certificates</span>
                {profile.certificates.map((cert, i) => (
                  <div className="cert-item" key={i}>
                    <div className="cert-item-top">
                      <span className="cert-item-title">{cert.title}</span>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noreferrer"
                          className="cert-item-link"
                          data-cursor="pointer"
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                    <div className="cert-item-meta">
                      {cert.issuer} {cert.date ? `— ${cert.date}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {profile?.languages?.length > 0 && (
              <div className="panel about-card">
                <span className="about-card-label">Languages</span>
                <div className="tag-list">
                  {profile.languages.map((l) => (
                    <span key={l} className="tag">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
