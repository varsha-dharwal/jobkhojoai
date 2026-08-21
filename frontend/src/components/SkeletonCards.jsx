export default function SkeletonCards({ count = 6 }){
  return (
    <div className="jobs-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton-line" style={{ width: "70%" }} />
            <div className="skeleton-line" style={{ width: "45%" }} />
            <div className="skeleton-line" style={{ width: "60%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
