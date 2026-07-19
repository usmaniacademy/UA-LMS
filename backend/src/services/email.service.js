import { Resend } from 'resend'
import { env } from '../config/env.js'

let resend

function getClient() {
  if (!resend) {
    resend = new Resend(env.resend.apiKey)
  }
  return resend
}

const FROM = `${env.resend.fromName} <${env.resend.fromEmail}>`

// ─── Base HTML layout ─────────────────────────────────────────────────────────

function baseLayout(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Usmani Academy</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    table { border-collapse: collapse; }
    td, th, div, p, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" style="max-width:600px;">
          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding-bottom: 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="font-size: 28px; font-weight: 800; color: #0d6efd; letter-spacing: -0.5px;">
                    Usmani Academy
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 13px; color: #6c757d; padding-top: 2px;">
                    Modern learning, rooted in Islamic values.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding: 40px 32px;">
                    ${bodyContent}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 16px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6c757d; line-height: 1.6;">
                Usmani Academy &mdash; Teaching and Learning for Understanding.<br>
                Need help? Contact us at
                <a href="mailto:support@usmaniacademy.com" style="color: #0d6efd; text-decoration: none;">support@usmaniacademy.com</a>
              </p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #adb5bd;">
                &copy; ${new Date().getFullYear()} Usmani Academy. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildBody(contentBlocks) {
  return contentBlocks.filter(Boolean).join('\n')
}

function heading(text) {
  return `<h1 style="margin: 0 0 8px; font-size: 22px; color: #212529; font-weight: 700;">${text}</h1>`
}

function paragraph(text) {
  return `<p style="margin: 0 0 16px; font-size: 15px; color: #495057; line-height: 1.6;">${text}</p>`
}

function divider() {
  return `<hr style="border: none; border-top: 1px solid #e9ecef; margin: 24px 0;">`
}

function button(url, text) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
    <tr>
      <td align="center" style="border-radius: 8px; background-color: #0d6efd;">
        <a href="${url}" target="_blank"
           style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; letter-spacing: 0.3px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`
}

function infoLine(label, value) {
  return `<tr>
    <td style="padding: 4px 0; font-size: 14px; color: #495057; vertical-align: top; white-space: nowrap; width: 1%;">${label}:</td>
    <td style="padding: 4px 0 4px 12px; font-size: 14px; color: #212529; font-weight: 600;">${value}</td>
  </tr>`
}

function infoTable(rows) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
    ${rows.join('\n')}
  </table>`
}

// ─── Generic send helper ──────────────────────────────────────────────────────

export async function sendEmail({ to, subject, contentBlocks }) {
  const html = baseLayout(buildBody(contentBlocks))
  const client = getClient()
  try {
    const result = await client.emails.send({ from: FROM, to, subject, html })
    console.log(`Email sent: "${subject}" -> ${to} (id: ${result.id})`)
    return result
  } catch (err) {
    console.error(`Failed to send email "${subject}" -> ${to}:`, err.message)
  }
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(to, resetLink) {
  return sendEmail({
    to,
    subject: 'Reset your Usmani Academy password',
    contentBlocks: [
      heading('Password Reset Request'),
      paragraph('We received a request to reset your password. Click the button below to set a new one.'),
      button(resetLink, 'Reset Password'),
      paragraph('This link expires in 1 hour. If you didn&#8217;t request this, you can safely ignore this email.'),
      divider(),
      paragraph('<span style="color: #6c757d; font-size: 13px;">Usmani Academy &mdash; Modern learning, rooted in Islamic values.</span>')
    ]
  })
}

// ─── Course Enrollment ────────────────────────────────────────────────────────

export async function sendEnrollmentEmail({ email, firstName, courseName, instructorName, courseSlug, enrolledAt }) {
  const courseUrl = `${env.frontendUrl}/learn/${courseSlug}`
  const date = new Date(enrolledAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return sendEmail({
    to: email,
    subject: `Welcome to ${courseName} — you're enrolled!`,
    contentBlocks: [
      heading(`Welcome, ${firstName}!`),
      paragraph([
        `You have successfully enrolled in <strong>${courseName}</strong>.`,
        'We&#8217;re excited to have you on this learning journey.',
        'Your course materials are ready and waiting for you.'
      ].join(' ')),
      divider(),
      heading('Enrollment Details'),
      infoTable([
        infoLine('Course', courseName),
        infoLine('Enrolled', date),
        ...(instructorName ? [infoLine('Instructor', instructorName)] : [])
      ]),
      button(courseUrl, 'Start Learning'),
      paragraph([
        'Access your course anytime from your student dashboard.',
        'If you have any questions, feel free to reach out to our support team.'
      ].join(' '))
    ]
  })
}
