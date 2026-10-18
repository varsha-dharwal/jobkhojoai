const ANNOUNCEMENT = "Latest Tech Jobs | Remote Jobs | Fresher & Internship Opportunities | AI Jobs & Latest Tech News | Walk-in Jobs | International Jobs: USA, UK, Canada, Australia & Germany";

export default function AnnouncementBar(){
  return (
    <section className="announcement-bar" aria-label={ANNOUNCEMENT}>
      <div className="announcement-track" aria-hidden="true">
        <span className="announcement-sequence">{ANNOUNCEMENT}</span>
        <span className="announcement-sequence">{ANNOUNCEMENT}</span>
      </div>
    </section>
  );
}
