export default function Loader({ label = 'loading' }) {
  return (
    <div className="loader-wrap">
      <span className="loader-bracket">[</span>
      <span>{label}...</span>
      <span className="loader-bracket">]</span>
    </div>
  );
}
