export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email delivery is not configured on the server. Set RESEND_API_KEY.");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM || "hello@jobkhojoai.com", to: [to], subject, html, text }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    console.error("Resend email request failed:", response.status);
    throw new Error("The email provider could not deliver the notification. Please try again.");
  }
}
