import Reveal from '../components/Reveal';
import SkillBar from '../components/SkillBar';

const CATEGORY_ORDER = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills', 'Other'];

export default function Skills({ skills }) {
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);

  return (
    <section className="section" id="skills">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">~/skills</span>
          <h2 className="section-title">Tools of the trade</h2>
        </Reveal>

        {categories.length === 0 ? (
          <p className="mono-tag">No skills added yet.</p>
        ) : (
          <div className="skills-grid">
            {categories.map((cat, i) => (
              <Reveal key={cat} delay={i * 80} className="panel" as="div">
                <div style={{ padding: 'var(--space-6)' }}>
                  <div className="skill-category-title">{cat}</div>
                  {grouped[cat].map((skill) => (
                    <SkillBar key={skill._id} name={skill.name} percentage={skill.percentage} />
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
