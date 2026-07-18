import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 6;
const TRAIL_SPAWN_MS = 45;

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const enabledRef = useRef(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    enabledRef.current = true;
    document.body.classList.add('custom-cursor-active');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    const trailHistory = [];
    let lastTrailSpawn = 0;
    let rafId;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      const target = e.target;
      const isPointer = !!target.closest?.(
        'a, button, [role="button"], input, select, textarea, [data-cursor="pointer"]'
      );
      const isText = !!target.closest?.('[data-cursor="text"]') && !isPointer;

      dotRef.current?.classList.toggle('is-pointer', isPointer);
      dotRef.current?.classList.toggle('is-text', isText);
      ringRef.current?.classList.toggle('is-pointer', isPointer);
      ringRef.current?.classList.toggle('is-text', isText);
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = (t) => {
      // dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
      // ring lags slightly (lerp) for a tracking feel
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      }

      // spawn trail pings periodically while moving
      if (t - lastTrailSpawn > TRAIL_SPAWN_MS) {
        lastTrailSpawn = t;
        trailHistory.push({ x: pos.x, y: pos.y, born: t });
        if (trailHistory.length > TRAIL_LENGTH) trailHistory.shift();
      }

      trailRefs.current.forEach((el, i) => {
        const point = trailHistory[trailHistory.length - 1 - i];
        if (!el) return;
        if (!point) {
          el.style.opacity = '0';
          return;
        }
        const age = t - point.born;
        const life = 420;
        const progress = Math.min(age / life, 1);
        el.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) scale(${1 - progress * 0.7})`;
        el.style.opacity = String((1 - progress) * 0.5);
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    return null;
  }

  return (
    <div className="cursor-root" aria-hidden="true">
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div key={i} className="cursor-trail" ref={(el) => (trailRefs.current[i] = el)} />
      ))}
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-dot" ref={dotRef} />
    </div>
  );
}
