import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import { profileApi, skillsApi, projectsApi } from '../api/client';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([profileApi.get(), skillsApi.list(), projectsApi.list()])
      .then(([profileRes, skillsRes, projectsRes]) => {
        if (cancelled) return;
        setProfile(profileRes.data.data);
        setSkills(skillsRes.data.data);
        setProjects(projectsRes.data.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <>
        <div className="bg-grid" />
        <Loader label="connecting to api" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-grid" />
        <div className="loader-wrap" style={{ flexDirection: 'column', gap: 'var(--space-3)' }}>
          <span>[!] Couldn't reach the backend API.</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
            Check that the server is running and VITE_API_URL is set correctly.
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-grid" />
      <Navbar name={profile?.name} />
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </>
  );
}
