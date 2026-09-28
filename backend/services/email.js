const RESEND_ENDPOINT = "https://api.resend.com/emails";
const WELCOME_SUBJECT = "Welcome to JobKhojoAI – Your Next Career Opportunity Starts Here";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    const error = new Error("Email delivery is not configured.");
    error.code = "EMAIL_NOT_CONFIGURED";
    throw error;
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || result.name || "Email provider rejected the message.");
    error.code = "EMAIL_PROVIDER_REJECTED";
    throw error;
  }
  return result;
}

export function sendVerificationEmail(email, code) {
  return sendEmail({
    to: email,
    subject: "Your JobKhojoAI verification code",
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#20242a"><h2>Verify your email</h2><p>Enter this code on JobKhojoAI to continue:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#00c48c">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
    text: `Your JobKhojoAI verification code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
  });
}

export function sendWelcomeEmail(email, name) {
  const firstName = escapeHtml((name || "").trim().split(/\s+/)[0] || "there");
  const communityUrl = "https://chat.whatsapp.com/H5G6uKb2rwxF4ysTB2znfM";
  const opportunities = [
    "🏢 Full-Time Jobs", "Part-Time Jobs", "Remote & Work-From-Home Jobs", "Freelance Opportunities",
    "🎓 Internships", "Fresher Jobs", "Experienced-Level Opportunities", "Latest Hiring Updates from Companies",
  ];
  const list = opportunities.map(item => `<li style="margin:8px 0">${item}</li>`).join("");
  return sendEmail({
    to: email,
    subject: WELCOME_SUBJECT,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#252a31;line-height:1.65"><p>Hi ${firstName},</p><h2>🎉 Welcome to JobKhojoAI!</h2><p>Thanks for signing up and joining our growing career community.</p><p>Job hunting can be overwhelming — so we’re here to make it easier for you to discover the right opportunities in one place.</p><h3>What you can discover on JobKhojoAI</h3><p>Whether you're a fresher, experienced professional, freelancer, or someone looking for a career change, you'll find opportunities across:</p><ul>${list}</ul><p>We regularly bring new opportunities so you can spend less time searching and more time applying.</p><h3>Don't miss our latest job alerts</h3><p>Join our JobKhojoAI Community to get important job updates, hiring alerts, application links, and career opportunities directly on your phone.</p><p><a href="${communityUrl}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#00c48c;color:#07130f;font-weight:700;text-decoration:none">Join Our WhatsApp Community</a></p><p>Thank you for being a part of JobKhojoAI.<br>We're excited to be a part of your career journey and wish you the very best with your next opportunity!</p><p><strong>Keep applying. Keep learning. Keep growing.</strong></p><p>Best Regards,<br><strong>Team JobKhojoAI</strong></p></div>`,
    text: `Hi ${(name || "").trim().split(/\s+/)[0] || "there"},\n\n Welcome to JobKhojoAI!\n\nThanks for signing up and joining our growing career community. Job hunting can be overwhelming — so we’re here to make it easier for you to discover the right opportunities in one place.\n\nWhat you can discover on JobKhojoAI:\n${opportunities.join("\n")}\n\nWe regularly bring new opportunities so you can spend less time searching and more time applying.\n\nJoin our JobKhojoAI Community for job updates and hiring alerts: ${communityUrl}\n\nThank you for being a part of JobKhojoAI. We're excited to be a part of your career journey.\n\nKeep applying. Keep learning. Keep growing.\n\nBest Regards,\nTeam JobKhojoAI`,
  });
}
