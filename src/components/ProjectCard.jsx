import { Github, ExternalLink } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <article className="panel project-card" data-cursor="pointer">
      <div className="project-card-top">
        <h3 className="project-title">{project.title}</h3>
        {project.featured && <span className="project-featured">featured</span>}
      </div>

      <p className="project-desc">{project.description}</p>

      {project.techStack?.length > 0 && (
        <div className="project-tech">
          {project.techStack.map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="project-links">
        {project.githubUrl ? (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" data-cursor="pointer">
            <Github size={14} /> Code
          </a>
        ) : (
          <span className="disabled">
            <Github size={14} /> Code
          </span>
        )}
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor="pointer">
            <ExternalLink size={14} /> Live
          </a>
        ) : (
          <span className="disabled">
            <ExternalLink size={14} /> Live
          </span>
        )}
      </div>
    </article>
  );
}
