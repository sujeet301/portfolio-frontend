import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { profileApi } from '../../api/client';
import Loader from '../../components/Loader';

const EMPTY_EDU = { degree: '', institution: '', year: '', details: '' };
const EMPTY_CERT = { title: '', issuer: '', date: '', url: '' };

export default function AdminProfile() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    profileApi
      .get()
      .then((res) => {
        const data = res.data.data;
        setForm({
          name: data.name || '',
          title: data.title || '',
          summary: data.summary || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          leetcodeUrl: data.leetcodeUrl || '',
          portfolioUrl: data.portfolioUrl || '',
          resumeUrl: data.resumeUrl || '',
          profileImage: data.profileImage || '',
          education: data.education?.length ? data.education : [EMPTY_EDU],
          certificates: data.certificates?.length ? data.certificates : [EMPTY_CERT],
          softSkills: (data.softSkills || []).join(', '),
          achievements: (data.achievements || []).join('\n'),
          languages: (data.languages || []).join(', '),
        });
      })
      .catch(() => setError('Could not load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setEdu = (index, key, value) => {
    setForm((f) => {
      const education = [...f.education];
      education[index] = { ...education[index], [key]: value };
      return { ...f, education };
    });
  };

  const addEdu = () => setForm((f) => ({ ...f, education: [...f.education, EMPTY_EDU] }));
  const removeEdu = (index) =>
    setForm((f) => ({ ...f, education: f.education.filter((_, i) => i !== index) }));

  const setCert = (index, key, value) => {
    setForm((f) => {
      const certificates = [...f.certificates];
      certificates[index] = { ...certificates[index], [key]: value };
      return { ...f, certificates };
    });
  };

  const addCert = () => setForm((f) => ({ ...f, certificates: [...f.certificates, EMPTY_CERT] }));
  const removeCert = (index) =>
    setForm((f) => ({ ...f, certificates: f.certificates.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        softSkills: form.softSkills.split(',').map((s) => s.trim()).filter(Boolean),
        achievements: form.achievements.split('\n').map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
        education: form.education.filter((e) => e.degree || e.institution),
        certificates: form.certificates.filter((c) => c.title || c.issuer),
      };
      await profileApi.update(payload);
      setSuccess('Profile saved');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Loader label="loading profile" />;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Profile</h1>
          <p>This powers your hero, about, and contact sections.</p>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
          <div className="admin-section-label">Basics</div>
          <div className="field-row">
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div className="field">
              <label>Title</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Summary</label>
            <textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} />
            <div className="field-hint">Shown in the hero terminal and about section.</div>
          </div>
          <div className="field" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{ flexGrow: 1 }}>
              <label>Profile image URL</label>
              <input
                value={form.profileImage}
                onChange={(e) => set('profileImage', e.target.value)}
                placeholder="https://... (Cloudinary, imgur, etc.)"
              />
              <div className="field-hint">
                Paste a link to a hosted photo. Shown in the framed panel next to your hero terminal —
                leave blank to show your initials instead.
              </div>
            </div>
            {form.profileImage && (
              <img
                src={form.profileImage}
                alt="Profile preview"
                style={{
                  width: 64,
                  height: 64,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-hair-bright)',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        </div>

        <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
          <div className="admin-section-label">Contact</div>
          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Location</label>
            <input value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>GitHub URL</label>
              <input value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} />
            </div>
            <div className="field">
              <label>LinkedIn URL</label>
              <input value={form.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>LeetCode URL</label>
              <input value={form.leetcodeUrl} onChange={(e) => set('leetcodeUrl', e.target.value)} placeholder="https://leetcode.com/u/..." />
            </div>
            <div className="field">
              <label>Portfolio URL</label>
              <input value={form.portfolioUrl} onChange={(e) => set('portfolioUrl', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Resume URL</label>
              <input value={form.resumeUrl} onChange={(e) => set('resumeUrl', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
          <div className="admin-section-label">Education</div>
          {form.education.map((edu, i) => (
            <div className="repeatable-item" key={i}>
              {form.education.length > 1 && (
                <button type="button" className="repeatable-remove" onClick={() => removeEdu(i)} aria-label="Remove education entry">
                  <X size={14} />
                </button>
              )}
              <div className="field-row">
                <div className="field">
                  <label>Degree</label>
                  <input value={edu.degree} onChange={(e) => setEdu(i, 'degree', e.target.value)} />
                </div>
                <div className="field">
                  <label>Institution</label>
                  <input value={edu.institution} onChange={(e) => setEdu(i, 'institution', e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Year</label>
                <input value={edu.year} onChange={(e) => setEdu(i, 'year', e.target.value)} placeholder="e.g. 2026" />
              </div>
              <div className="field">
                <label>Details</label>
                <textarea value={edu.details} onChange={(e) => setEdu(i, 'details', e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={addEdu}>
            <Plus size={13} /> Add education entry
          </button>
        </div>

        <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
          <div className="admin-section-label">Certificates</div>
          {form.certificates.map((cert, i) => (
            <div className="repeatable-item" key={i}>
              {form.certificates.length > 1 && (
                <button type="button" className="repeatable-remove" onClick={() => removeCert(i)} aria-label="Remove certificate">
                  <X size={14} />
                </button>
              )}
              <div className="field-row">
                <div className="field">
                  <label>Title</label>
                  <input
                    value={cert.title}
                    onChange={(e) => setCert(i, 'title', e.target.value)}
                    placeholder="e.g. Full Stack Web Development"
                  />
                </div>
                <div className="field">
                  <label>Issuer</label>
                  <input
                    value={cert.issuer}
                    onChange={(e) => setCert(i, 'issuer', e.target.value)}
                    placeholder="e.g. Coursera"
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Date</label>
                  <input value={cert.date} onChange={(e) => setCert(i, 'date', e.target.value)} placeholder="e.g. 2025" />
                </div>
                <div className="field">
                  <label>Certificate URL</label>
                  <input
                    value={cert.url}
                    onChange={(e) => setCert(i, 'url', e.target.value)}
                    placeholder="https://... (link to view/verify)"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={addCert}>
            <Plus size={13} /> Add certificate
          </button>
        </div>

        <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div className="admin-section-label">More</div>
          <div className="field">
            <label>Soft skills (comma-separated)</label>
            <input value={form.softSkills} onChange={(e) => set('softSkills', e.target.value)} />
          </div>
          <div className="field">
            <label>Achievements (one per line)</label>
            <textarea value={form.achievements} onChange={(e) => set('achievements', e.target.value)} />
          </div>
          <div className="field">
            <label>Languages (comma-separated)</label>
            <input value={form.languages} onChange={(e) => set('languages', e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}