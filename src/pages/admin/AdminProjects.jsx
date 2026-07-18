import { useEffect, useState } from 'react';
import { Trash2, Plus, Pencil, X } from 'lucide-react';
import { projectsApi } from '../../api/client';
import Loader from '../../components/Loader';

const EMPTY_FORM = {
  title: '',
  description: '',
  techStack: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
};

function toFormState(project) {
  return {
    title: project.title || '',
    description: project.description || '',
    techStack: (project.techStack || []).join(', '),
    githubUrl: project.githubUrl || '',
    liveUrl: project.liveUrl || '',
    featured: !!project.featured,
  };
}

function toPayload(form) {
  return {
    title: form.title,
    description: form.description,
    techStack: form.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    githubUrl: form.githubUrl,
    liveUrl: form.liveUrl,
    featured: form.featured,
  };
}

function ProjectForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(toPayload(form));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="e.g. MultiShop (MERN E-Commerce)"
          required
        />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          required
        />
      </div>
      <div className="field">
        <label>Tech stack (comma-separated)</label>
        <input
          value={form.techStack}
          onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
          placeholder="React, Node.js, MongoDB"
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label>GitHub URL</label>
          <input value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} />
        </div>
        <div className="field">
          <label>Live URL</label>
          <input value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} />
        </div>
      </div>
      <div className="field field-checkbox">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
        />
        <label htmlFor="featured" style={{ margin: 0 }}>
          Featured project
        </label>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const load = () => {
    setLoading(true);
    projectsApi
      .list()
      .then((res) => setProjects(res.data.data))
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleCreate = async (payload) => {
    try {
      const res = await projectsApi.create(payload);
      setProjects((prev) => [...prev, res.data.data]);
      setAdding(false);
      flashSuccess('Project added');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add that project.');
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const res = await projectsApi.update(id, payload);
      setProjects((prev) => prev.map((p) => (p._id === id ? res.data.data : p)));
      setEditingId(null);
      flashSuccess('Project updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update that project.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsApi.remove(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Could not delete that project.');
    }
  };

  if (loading) return <Loader label="loading projects" />;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Projects</h1>
          <p>Add, edit, or remove the projects shown on your portfolio.</p>
        </div>
        {!adding && (
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            <Plus size={14} /> New Project
          </button>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      {adding && (
        <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div className="admin-section-label">New project</div>
          <ProjectForm initial={EMPTY_FORM} onSubmit={handleCreate} onCancel={() => setAdding(false)} submitLabel="Add Project" />
        </div>
      )}

      {projects.length === 0 && !adding ? (
        <div className="panel admin-empty">No projects yet — add your first one above.</div>
      ) : (
        <div className="admin-list">
          {projects.map((project) =>
            editingId === project._id ? (
              <div className="panel" style={{ padding: 'var(--space-6)' }} key={project._id}>
                <div className="admin-section-label">Editing: {project.title}</div>
                <ProjectForm
                  initial={toFormState(project)}
                  onSubmit={(payload) => handleUpdate(project._id, payload)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="Save Changes"
                />
              </div>
            ) : (
              <div className="panel admin-row" key={project._id}>
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {project.title} {project.featured && <span className="mono-tag">· featured</span>}
                  </div>
                  <div className="admin-row-meta">{(project.techStack || []).join(' · ') || 'no tech listed'}</div>
                </div>
                <div className="admin-row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(project._id)}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project._id)} aria-label="Delete project">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
