import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

function configured(value: string | undefined) {
  return Boolean(value?.trim() && !value.startsWith('replace_with'));
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM_EMAIL || user;
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  if (!configured(host) || !configured(user) || !configured(pass) || !configured(from)) {
    return null;
  }

  return {
    host: host!,
    port,
    secure,
    auth: {
      user: user!,
      pass: pass!
    },
    from: from!
  };
}

function buildVerificationEmailHtml(verifyUrl: string) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify your Apex account</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;color:#151515;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#151515;border:1px solid #2e2e2e;border-radius:12px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,0.22);">
            <tr>
              <td style="padding:0;background:#c3f400;height:6px;line-height:6px;font-size:6px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:38px 34px 24px 34px;">
                <img src="cid:apex-logo" width="64" height="64" alt="Apex" style="display:block;width:64px;height:64px;object-fit:contain;margin:0 0 20px 0;border:0;">
                <div style="font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#c3f400;font-weight:700;margin-bottom:18px;">
                  Apex
                </div>
                <h1 style="margin:0;color:#ffffff;font-size:42px;line-height:0.95;letter-spacing:1px;text-transform:uppercase;font-style:italic;font-weight:900;">
                  Verify Your Account
                </h1>
                <p style="margin:20px 0 0 0;color:#c4c9ac;font-size:15px;line-height:1.7;">
                  Confirm your email to unlock secure checkout and keep every Apex order tied to your customer profile.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 34px 34px 34px;">
                <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:#101010;border:1px solid #303030;border-radius:10px;">
                  <tr>
                    <td style="padding:28px;">
                      <p style="margin:0 0 22px 0;color:#e5e2e1;font-size:15px;line-height:1.6;">
                        Tap the button below to verify your email address. This link expires in 24 hours.
                      </p>
                      <a href="${verifyUrl}" style="display:inline-block;background:#c3f400;color:#111111;text-decoration:none;text-transform:uppercase;font-weight:900;letter-spacing:1px;font-size:14px;padding:16px 24px;border-radius:6px;">
                        Verify Email
                      </a>
                      <p style="margin:24px 0 0 0;color:#8e9379;font-size:12px;line-height:1.6;">
                        If the button does not work, paste this link into your browser:
                      </p>
                      <p style="margin:8px 0 0 0;color:#c3f400;font-size:12px;line-height:1.6;word-break:break-all;">
                        ${verifyUrl}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 34px 34px 34px;color:#777b69;font-size:12px;line-height:1.6;">
                You received this email because an Apex account was created with this address. If this was not you, ignore this message.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendVerificationEmail(email: string, token: string) {
  const smtp = getSmtpConfig();
  const verifyUrl = `${getAppUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const logoPath = path.join(process.cwd(), 'public', 'apex-logo.png');

  if (!smtp) {
    console.warn(`SMTP is not configured. Verification URL for ${email}: ${verifyUrl}`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth
  });

  await transporter.sendMail({
    to: email,
    from: `Apex <${smtp.from}>`,
    subject: 'Verify your Apex account',
    text: [
      'Verify your Apex account',
      '',
      'Confirm your email to unlock secure checkout.',
      `Verification link: ${verifyUrl}`,
      '',
      'This link expires in 24 hours.'
    ].join('\n'),
    html: buildVerificationEmailHtml(verifyUrl),
    attachments: fs.existsSync(logoPath)
      ? [
          {
            filename: 'apex-logo.png',
            content: fs.readFileSync(logoPath),
            contentType: 'image/png',
            cid: 'apex-logo'
          }
        ]
      : []
  });

  return true;
}
