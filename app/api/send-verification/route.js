// /app/api/send-verification/route.js or .ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // Set this in .env.local

export async function POST(req) {
  const { email, token } = await req.json();
  try {
    const data = await resend.emails.send({
      from: "Schuletable <noreply@schultetable.com>", // Use a verified domain
      to: email,
      subject: "Verify your email address",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="min-height: 100vh; padding: 40px 20px; display: flex; align-items: center; justify-content: center;">
    
    <!-- Main Container -->
    <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2); max-width: 520px; width: 100%; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.18);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 32px; text-align: center; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E') repeat;"></div>
        <div style="position: relative; z-index: 1;">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.02em;">SchulteTable</h1>
        </div>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 32px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #0f172a; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.02em;">Verify your email</h2>
          <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.5;">Enter the verification code below to complete your account setup</p>
        </div>
        
        <!-- Verification Code -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 32px 0; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 16px; z-index: -1;"></div>
          <div style="background: #ffffff; border-radius: 14px; padding: 20px; position: relative;">
            <p style="color: #475569; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Verification Code</p>
            <div style="font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #0f172a; letter-spacing: 0.2em; margin: 8px 0;">${token}</div>
            <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">This code expires in 10 minutes</p>
          </div>
        </div>
        
        <!-- Instructions -->
        <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="width: 20px; height: 20px; border-radius: 10px; background: #3b82f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p style="color: #1e293b; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">Next steps:</p>
              <p style="color: #475569; font-size: 14px; margin: 0; line-height: 1.5;">Return to SchulteTable and enter this code to verify your email address and start using your account.</p>
            </div>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="#" style="display: inline-block; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2); transition: all 0.2s ease;">
            Continue to SchulteTable →
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
        <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0; line-height: 1.5;">
          This verification code was sent to <strong>${email}</strong>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.4;">
          If you didn't request this verification code, you can safely ignore this email. 
          <br>This code will expire automatically.
        </p>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            © 2025 SchulteTable. All rights reserved.
          </p>
        </div>
      </div>
      
    </div>
  </div>
</body>
</html>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Resend error:", error);
    return new Response(JSON.stringify({ error: "Email failed to send." }), {
      status: 500,
    });
  }
}
