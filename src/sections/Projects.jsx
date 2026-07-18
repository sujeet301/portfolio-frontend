import Reveal from '../components/Reveal';
import ProjectCard from '../components/ProjectCard';

export default function Projects({ projects }) {
  return (
    <section className="section" id="projects">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">~/work</span>
          <h2 className="section-title">Things I've built</h2>
        </Reveal>

        {projects.length === 0 ? (
          <p className="mono-tag">No projects added yet.</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project, i) => (
              <Reveal key={project._id} delay={(i % 3) * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
