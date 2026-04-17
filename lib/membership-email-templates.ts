type SubmissionEmailData = {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  submittedAt: string;
};

type WelcomeEmailData = {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
};

function layout(title: string, body: string) {
  return `
    <div style="background:#f4f7fb;padding:32px 16px;font-family:Arial,sans-serif;color:#172033;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dbe4f0;">
        <div style="background:linear-gradient(180deg,#155dfc 0%,#0c3796 100%);padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">${title}</h1>
        </div>
        <div style="padding:32px;">
          ${body}
        </div>
      </div>
    </div>
  `;
}

export function getMembershipAdminRecipient() {
  return process.env.MEMBERSHIP_ADMIN_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_FROM || "";
}

export function renderAdminNewMembershipEmail(data: SubmissionEmailData) {
  const subject = `New membership application received from ${data.name}`;
  const html = layout(
    "New Membership Application",
    `
      <p style="margin-top:0;font-size:16px;line-height:1.7;">
        A new VRA membership application has been submitted and is ready for review in the admin panel.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tr><td style="padding:10px 0;font-weight:700;">Applicant</td><td style="padding:10px 0;">${data.name}</td></tr>
        <tr><td style="padding:10px 0;font-weight:700;">Email</td><td style="padding:10px 0;">${data.email}</td></tr>
        <tr><td style="padding:10px 0;font-weight:700;">Phone</td><td style="padding:10px 0;">${data.phone}</td></tr>
        <tr><td style="padding:10px 0;font-weight:700;">Membership Type</td><td style="padding:10px 0;">${data.membershipType}</td></tr>
        <tr><td style="padding:10px 0;font-weight:700;">Submitted</td><td style="padding:10px 0;">${data.submittedAt}</td></tr>
      </table>
      <p style="margin-bottom:0;font-size:15px;line-height:1.7;">
        Please review the submission in <strong>Submissions &gt; Membership</strong> and update the payment status once the transfer has been confirmed.
      </p>
    `
  );
  const text = [
    "New VRA membership application received.",
    `Applicant: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Membership Type: ${data.membershipType}`,
    `Submitted: ${data.submittedAt}`,
    "Review it in the admin panel under Submissions > Membership.",
  ].join("\n");

  return { subject, html, text };
}

export function renderMembershipPaymentInstructionsEmail(data: SubmissionEmailData) {
  const bankName =
    process.env.MEMBERSHIP_BANK_NAME ||
    "ING Bank - Treasurer VRA, Amsterdam";
  const iban = process.env.MEMBERSHIP_BANK_IBAN || "NL95 INGB 0006066048";
  const bic = process.env.MEMBERSHIP_BANK_BIC || "INGBNL2A";
  const contactEmail =
    process.env.MEMBERSHIP_CONTACT_EMAIL || "generalmanager@vra.nl";
  const reference = process.env.MEMBERSHIP_PAYMENT_REFERENCE_PREFIX
    ? `${process.env.MEMBERSHIP_PAYMENT_REFERENCE_PREFIX} - ${data.name}`
    : `Membership fee - ${data.name}`;

  const subject = "VRA membership application received";
  const html = layout(
    "Thank You For Your Application",
    `
      <p style="margin-top:0;font-size:16px;line-height:1.7;">Dear ${data.name},</p>
      <p style="font-size:16px;line-height:1.7;">
        Thank you for submitting your membership application to VRA Cricket Club. We have successfully received your request.
      </p>
      <p style="font-size:16px;line-height:1.7;">
        To continue the process, please complete your membership payment using the bank details below. Once payment has been confirmed by our administration, we will activate your membership and send your login credentials.
      </p>
      <div style="background:#f4f7fb;border:1px solid #dbe4f0;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 10px 0;"><strong>Account name:</strong> ${bankName}</p>
        <p style="margin:0 0 10px 0;"><strong>IBAN:</strong> ${iban}</p>
        <p style="margin:0 0 10px 0;"><strong>BIC:</strong> ${bic}</p>
        <p style="margin:0;"><strong>Payment reference:</strong> ${reference}</p>
      </div>
      <p style="font-size:15px;line-height:1.7;">
        If you have any questions regarding payment or your application, please contact
        <a href="mailto:${contactEmail}"> ${contactEmail}</a> and our team will be happy to help.
      </p>
      <p style="margin-bottom:0;font-size:15px;line-height:1.7;">
        Kind regards,<br />
        VRA Cricket Club
      </p>
    `
  );
  const text = [
    `Dear ${data.name},`,
    "Thank you for submitting your VRA membership application.",
    "Please complete your payment using the details below.",
    `Account name: ${bankName}`,
    `IBAN: ${iban}`,
    `BIC: ${bic}`,
    `Payment reference: ${reference}`,
    `Questions: ${contactEmail}`,
    "Once payment is confirmed, we will send your login credentials.",
  ].join("\n");

  return { subject, html, text };
}

export function renderMembershipWelcomeEmail(data: WelcomeEmailData) {
  const subject = "Welcome to VRA Cricket Club";
  const html = layout(
    "Welcome To VRA",
    `
      <p style="margin-top:0;font-size:16px;line-height:1.7;">Dear ${data.name},</p>
      <p style="font-size:16px;line-height:1.7;">
        Welcome to VRA Cricket Club. Your membership payment has been received and your member account is now active.
      </p>
      <p style="font-size:16px;line-height:1.7;">
        You can sign in using the credentials below:
      </p>
      <div style="background:#f4f7fb;border:1px solid #dbe4f0;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 10px 0;"><strong>Login email:</strong> ${data.email}</p>
        <p style="margin:0 0 10px 0;"><strong>Temporary password:</strong> ${data.password}</p>
        <p style="margin:0;"><strong>Login link:</strong> <a href="${data.loginUrl}">${data.loginUrl}</a></p>
      </div>
      <p style="font-size:15px;line-height:1.7;">
        For security, we recommend logging in as soon as possible and keeping your credentials private.
      </p>
      <p style="margin-bottom:0;font-size:15px;line-height:1.7;">
        We are delighted to welcome you as a VRA member and look forward to seeing you at the club.
      </p>
    `
  );
  const text = [
    `Dear ${data.name},`,
    "Welcome to VRA Cricket Club. Your membership payment has been received.",
    `Login email: ${data.email}`,
    `Temporary password: ${data.password}`,
    `Login link: ${data.loginUrl}`,
    "We look forward to seeing you at the club.",
  ].join("\n");

  return { subject, html, text };
}
