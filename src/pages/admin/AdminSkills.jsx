import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { skillsApi } from '../../api/client';
import Loader from '../../components/Loader';

const CATEGORIES = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills', 'Other'];

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingId, setSavingId] = useState(null);

  const [form, setForm] = useState({ name: '', category: 'Frontend', percentage: 70 });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    skillsApi
      .list()
      .then((res) => setSkills(res.data.data))
      .catch(() => setError('Could not load skills.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handlePercentageChange = (id, value) => {
    setSkills((prev) => prev.map((s) => (s._id === id ? { ...s, percentage: Number(value) } : s)));
  };

  const savePercentage = async (skill) => {
    setSavingId(skill._id);
    try {
      await skillsApi.update(skill._id, { percentage: skill.percentage });
      flashSuccess('Saved');
    } catch {
      setError('Could not save that change.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await skillsApi.remove(id);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch {
      setError('Could not delete that skill.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await skillsApi.create(form);
      setSkills((prev) => [...prev, res.data.data]);
      setForm({ name: '', category: 'Frontend', percentage: 70 });
      flashSuccess('Skill added');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add that skill.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader label="loading skills" />;

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Skills</h1>
          <p>Adjust proficiency percentages or add new skills. Changes save instantly.</p>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      {grouped.length === 0 ? (
        <div className="panel admin-empty">No skills yet — add your first one below.</div>
      ) : (
        grouped.map(({ cat, items }) => (
          <div key={cat} style={{ marginBottom: 'var(--space-6)' }}>
            <div className="admin-section-label">{cat}</div>
            <div className="admin-list">
              {items.map((skill) => (
                <div className="panel admin-row" key={skill._id}>
                  <div className="admin-row-main">
                    <div className="admin-row-title">{skill.name}</div>
                  </div>
                  <div className="admin-row-pct-edit">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.percentage}
                      onChange={(e) => handlePercentageChange(skill._id, e.target.value)}
                      onMouseUp={() => savePercentage(skills.find((s) => s._id === skill._id))}
                      onTouchEnd={() => savePercentage(skills.find((s) => s._id === skill._id))}
                    />
                    <span className="admin-row-pct-value">
                      {savingId === skill._id ? '...' : `${skill.percentage}%`}
                    </span>
                  </div>
                  <div className="admin-row-actions">
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(skill._id)} aria-label="Delete skill">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="panel" style={{ padding: 'var(--space-6)' }}>
        <div className="admin-section-label">Add a new skill</div>
        <form onSubmit={handleCreate}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="skill-name">Name</label>
              <input
                id="skill-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. TypeScript"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="skill-category">Category</label>
              <select
                id="skill-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="skill-pct">Percentage: {form.percentage}%</label>
            <input
              id="skill-pct"
              type="range"
              min="0"
              max="100"
              value={form.percentage}
              onChange={(e) => setForm((f) => ({ ...f, percentage: Number(e.target.value) }))}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={creating}>
            <Plus size={14} /> {creating ? 'Adding...' : 'Add Skill'}
          </button>
        </form>
      </div>
    </div>
  );
}
