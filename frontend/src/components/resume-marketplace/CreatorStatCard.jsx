export default function CreatorStatCard({ icon: Icon, label, value, tone = "blue" }) {
  return <article className="creator-stat-card"><span className={`creator-stat-icon tone-${tone}`}><Icon size={19} aria-hidden="true" /></span><div><p>{label}</p><strong>{value}</strong></div></article>;
}
