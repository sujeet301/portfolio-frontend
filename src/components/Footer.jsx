export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer container">
      <span className="mono-tag">
        // built with the MERN stack — React, Node.js, Express, MongoDB
      </span>
      <span className="mono-tag">
        © {year} {profile?.name || 'Sujeet Chaudhary'}. All rights reserved.
      </span>
      <div className="footer-links">
        {profile?.githubUrl && (
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" data-cursor="pointer">
            GitHub
          </a>
        )}
        {profile?.linkedinUrl && (
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" data-cursor="pointer">
            LinkedIn
          </a>
        )}
        <a href="/admin/login" data-cursor="pointer">
          Admin
        </a>
      </div>
    </footer>
  );
}
