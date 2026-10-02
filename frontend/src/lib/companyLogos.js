// Logos for well-known employers, stored in public/logos/<slug>.webp (96×96).
// Matched against the job's organization name, so admins don't need to paste a
// logo URL for these companies. A logoUrl set in the admin panel always wins.
// Logos are only shown to identify the employer of a real listing.
const COMPANY_LOGOS = [
  ["tcs", /\btata consultancy\b|\btcs\b/],
  ["infosys", /\binfosys\b/],
  ["wipro", /\bwipro\b/],
  ["hcltech", /\bhcl\b|\bhcltech\b/],
  ["techmahindra", /\btech\s*mahindra\b/],
  ["ltimindtree", /\bltimindtree\b|\blti\b|\bmindtree\b|\bltm\b/],
  ["larsentoubro", /\blarsen\b|\bl\s*&\s*t\b/],
  ["cognizant", /\bcognizant\b/],
  ["capgemini", /\bcapgemini\b/],
  ["accenture", /\baccenture\b/],
  ["coforge", /\bcoforge\b/],
  ["mphasis", /\bmphasis\b/],
  ["persistent", /\bpersistent systems\b|^persistent\b/],
  ["genpact", /\bgenpact\b/],
  ["dxc", /\bdxc\b/],
  ["ibm", /\bibm\b/],
  ["deloitte", /\bdeloitte\b/],
  ["ey", /\bey\b|\bernst\s*(&|and)?\s*young\b/],
  ["pwc", /\bpwc\b|\bpricewaterhouse/],
  ["kpmg", /\bkpmg\b/],
  ["google", /\bgoogle\b/],
  ["microsoft", /\bmicrosoft\b/],
  ["amazon", /\bamazon\b|\baws\b/],
  ["oracle", /\boracle\b/],
  ["sap", /^sap\b/],
  ["adobe", /\badobe\b/],
  ["salesforce", /\bsalesforce\b/],
  ["cisco", /\bcisco\b/],
  ["intel", /^intel\b|\bintel (corporation|india)\b/],
  ["siemens", /\bsiemens\b/],
  ["bosch", /\bbosch\b/],
  ["ptc", /^ptc\b/],
  ["jpmorganchase", /\bj\.?\s*p\.?\s*morgan\b|\bjpmc\b/],
  ["goldmansachs", /\bgoldman sachs\b/],
  ["walmart", /\bwalmart\b/],
  ["flipkart", /\bflipkart\b/],
  ["paytm", /\bpaytm\b/],
  ["swiggy", /\bswiggy\b/],
  ["zomato", /\bzomato\b/],
  ["razorpay", /\brazorpay\b/],
  ["zoho", /\bzoho\b/],
  ["indegene", /\bindegene\b/],
  ["bunge", /\bbunge\b/],
];

export function companyLogo(name){
  const n = (name || "").toLowerCase().trim();
  const hit = n && COMPANY_LOGOS.find(([, re]) => re.test(n));
  return hit ? `/logos/${hit[0]}.webp` : null;
}
