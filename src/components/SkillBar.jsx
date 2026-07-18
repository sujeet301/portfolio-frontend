import { useEffect, useRef, useState } from 'react';

export default function SkillBar({ name, percentage }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(percentage);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div className="skill-row" ref={ref}>
      <div className="skill-row-top">
        <span className="skill-row-name">{name}</span>
        <span className="skill-row-pct">{percentage}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
