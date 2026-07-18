import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Code2, Layers, User, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <div className="bg-grid" />
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="dot" />
          admin panel
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/skills" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Code2 size={15} /> Skills
          </NavLink>
          <NavLink to="/admin/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Layers size={15} /> Projects
          </NavLink>
          <NavLink to="/admin/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            <User size={15} /> Profile
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
            <ExternalLink size={12} style={{ marginRight: 6, verticalAlign: -1 }} />
            View live site
          </a>
          <div style={{ padding: '0 var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <span className="mono-tag">{admin?.email}</span>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
