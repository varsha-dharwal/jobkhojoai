import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import api from "../api/client";
import CompanyAvatar from "./CompanyAvatar";

export default function FeaturedCompanies(){
  const [companies, setCompanies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobs/meta/companies")
      .then(res => setCompanies(res.data))
      .catch(() => setCompanies([]))
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && companies.length === 0) return null;

  return (
    <motion.section
      style={{ marginBottom: "var(--space-12)" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="section-heading">
        <h2>Featured Companies</h2>
        <p>Employers actively hiring on jobkhojoAI right now.</p>
      </div>
      <div className="company-grid">
        {companies.map((c, i) => (
          <motion.button
            type="button"
            key={c.organization}
            className="card company-tile"
            onClick={() => navigate(`/?company=${encodeURIComponent(c.organization)}#jobs`)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3), ease: "easeOut" }}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
          >
            <CompanyAvatar name={c.organization} logoUrl={c.logoUrl} size={56} />
            <span className="cname">{c.organization}</span>
            <span className="ccount">{c.jobCount} open role{c.jobCount === 1 ? "" : "s"}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
