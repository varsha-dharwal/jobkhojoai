// Jobs don't have a dedicated country field, so it's inferred from the free-text
// location string. This board is India-first, so anything that doesn't explicitly
// say US/USA/United States is treated as India.
const US_LOCATION_RE = /\b(united states|usa|u\.s\.a?\.?)\b/i;

export function getJobCountry(job){
  return US_LOCATION_RE.test(job.location || "") ? "USA" : "India";
}
