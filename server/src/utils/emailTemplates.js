// server/src/utils/emailTemplates.js

/**
 * Email HTML Templates for 8JJ Games
 * Themed templates matching the gaming platform design
 */

/**
 * Base email template wrapper
 * @param {string} content - HTML content to wrap
 * @returns {string} Complete HTML email
 */
export function getEmailTemplate(content) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>8JJ Games</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
      padding: 20px;
      margin: 0;
    }
    .email-wrapper {
    
      margin: 0 auto;
      background: linear-gradient(135deg, #ffffff, #003358);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.2);
    }
    .email-header {
      background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(43, 122, 226, 0.1));
      padding: 40px 30px;
      text-align: center;
      border-bottom: 1px solid rgba(0, 217, 255, 0.2);
      position: relative;
    }
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #00d9ff, #2b7ae2, #00d9ff);
    }
    .logo {
    font-size: 00px;
    font-weight: 900;
    background: linear-gradient(135deg, #121c2e, #121c2e);
    background-clip: text;
    margin-bottom: 20px;
    line-height: 1;
    }
      
    .email-title {
      font-size: 28px;
      font-weight: 900;
      background: linear-gradient(135deg, #00ff88, #00d9ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      color: #000000;
    }
    .email-body {
      padding: 40px 30px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.8;
    }
    .email-body p {
      margin: 0 0 20px 0;
      font-size: 16px;
      color:#000000 !important;
    }
    .icon-wrapper {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(102, 126, 234, 0.1));
      border-radius: 50%;
      border: 2px solid rgba(0, 217, 255, 0.3);
    }
    .icon-wrapper svg {
      width: 40px;
      height: 40px;
      color: #00d9ff;
      filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.5));
    }
    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #00d9ff, #2b7ae2);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
      box-shadow: 0 4px 20px rgba(0, 217, 255, 0.3);
    }
    .info-box {
      background: rgba(0, 217, 255, 0.05);
      border: 1px solid rgba(0, 217, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
      color:#000000 !important;
    }
      .gs li{
      color: #000000;
      }
    .warning-box {
      background: rgba(255, 165, 0, 0.05);
      border: 1px solid rgba(255, 165, 0, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .warning-box p {
      margin: 0;
      font-size: 14px;
      color: rgba(255, 165, 0, 0.9);
    }
    .email-footer {
      background: rgba(0, 0, 0, 0.3);
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(0, 217, 255, 0.1);
    }
    .email-footer p {
      margin: 10px 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }
    .email-footer a {
      color: #00d9ff !important;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.3), transparent);
      margin: 30px 0;
    }
    ul {
      margin: 10px 0 0 20px;
      padding: 0;
      color: #000000 !important;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        border-radius: 0;
      }
      .email-header,
      .email-body,
      .email-footer {
        padding: 30px 20px;
      }
      .email-title {
        font-size: 24px;
      }
      .cta-button {
        display: block;
        width: 100%;
        color:#fff !important;
      }
    }
      .brand-logo{
      }
  </style>
</head>
<body>
  <div class="email-wrapper">
    ${content}
  </div>
</body>
</html>
  `;
}

/**
 * Verification Email Content
 * @param {string} link - Verification link
 * @returns {string} Email HTML content
 */
export function getVerificationEmailContent(link) {
    return `
    <div class="email-header">
      <div class="logo">
        <img src="https://8jjgames.com/8JJ_games.png" alt="8JJ Games logo - Free online games" width="100%" style="display:block;margin:0 auto;max-width:95px;height:auto;"/>

      </div>
      <h1 class="email-title">Welcome to 8JJ Games! 🎮</h1>
    </div>
    
    <div class="email-body">
    
      
      <p style="font-size: 18px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
        You're almost ready to start gaming!
      </p>
      
      <p>
        Thank you for joining 8JJ Games - your ultimate destination for thousands of free online games! 
        To complete your registration and unlock access to our gaming library, please verify your email address.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" class="cta-button">
          ✓ Verify My Email
        </a>
      </div>
      
      <div class="info-box">
        <p><strong>🎯 What's Next?</strong></p>
        <p style="margin-top: 10px;">
          After verification, you'll be able to:
        </p>
        <ul>
          <li>Access thousands of free games</li>
          <li>Save your favorite games</li>
          <li>Track your gaming progress</li>
          <li>Get personalized recommendations</li>
        </ul>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6);">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="font-size: 13px; color: #00d9ff; word-break: break-all;">
        ${link}
      </p>
    </div>
    
    <div class="email-footer">
      <p>
        Didn't create an account? You can safely ignore this email.
      </p>
      <p>
        Need help? Contact us at <a href="mailto:support@8jjgames.com">support@8jjgames.com</a>
      </p>
      <p style="margin-top: 20px;">
        © ${new Date().getFullYear()} 8JJ Games. All rights reserved.
      </p>
    </div>
  `;
}

/**
 * Password Reset Email Content
 * @param {string} link - Reset password link
 * @returns {string} Email HTML content
 */
export function getPasswordResetEmailContent(link) {
    return `
    <div class="email-header">
     <div class="logo">
       <img src="https://8jjgames.com/8JJ_games.png" alt="8JJ Games logo - Free online games" width="100%" style="display:block;margin:0 auto;max-width:95px;height:auto;"/>

      </div>
      <h1 class="email-title">Reset Your Password 🔐</h1>
    </div>
    
    <div class="email-body">
      
      
      <p style="font-size: 18px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
        Password Reset Request
      </p>
      
      <p>
        We received a request to reset the password for your 8JJ Games account. 
        If you made this request, click the button below to create a new password.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" class="cta-button">
          🔑 Reset My Password
        </a>
      </div>
      
      <div class="warning-box">
        <p><strong>⚠️ Important Security Information</strong></p>
        <p style="margin-top: 10px;">
          • This link expires in <strong>1 hour</strong> for your security<br>
          • Only use this link if you requested a password reset<br>
          • Never share this link with anyone
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6);">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="font-size: 13px; color: #00d9ff; word-break: break-all;">
        ${link}
      </p>
      
      <div class="info-box" style="margin-top: 30px;">
        <p><strong>💡 Didn't request this?</strong></p>
        <p style="margin-top: 10px;">
          If you didn't request a password reset, you can safely ignore this email. 
          Your password will remain unchanged and your account is secure.
        </p>
      </div>
    </div>
    
    <div class="email-footer">
      <p>
        For security reasons, never share your password or this reset link with anyone.
      </p>
      <p>
        Questions? Contact us at <a href="mailto:support@8jjgames.com">support@8jjgames.com</a>
      </p>
      <p style="margin-top: 20px;">
        © ${new Date().getFullYear()} 8JJ Games. All rights reserved.
      </p>
    </div>
  `;
}