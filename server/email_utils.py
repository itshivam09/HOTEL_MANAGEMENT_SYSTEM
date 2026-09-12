import os
import json
import smtplib
import threading
import urllib.request
import urllib.error
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")


def _build_email_content(otp_code: str):
    """Builds plain-text and HTML email content."""
    plain_text = f"""Hello,

Your verification OTP code for StayEasy Hotel Management System is: {otp_code}

This code will expire in 5 minutes.
If you did not request this code, please ignore this email.

Best regards,
StayEasy Hotel Management Team
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your StayEasy Verification Code</title>
</head>
<body style="margin:0;padding:20px;background-color:#0b0f19;font-family:sans-serif;color:#e2e8f0;">
  <div style="max-width:480px;margin:0 auto;background:#111827;border:1px solid #374151;border-radius:16px;padding:24px;text-align:center;">
    <h2 style="color:#ffffff;margin-top:0;">StayEasy Luxury & Resorts</h2>
    <p style="color:#94a3b8;font-size:14px;">Your verification passcode is:</p>
    <div style="background:#1e1b4b;border:2px dashed #6366f1;border-radius:12px;padding:16px;margin:16px 0;">
      <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#818cf8;font-family:monospace;">{otp_code}</span>
      <div style="color:#f59e0b;font-size:12px;margin-top:8px;">Valid for 5 minutes only</div>
    </div>
    <p style="color:#64748b;font-size:12px;margin-bottom:0;">If you did not request this, please ignore this email.</p>
  </div>
</body>
</html>
"""
    return plain_text, html_content


def _send_via_smtp(to_email: str, subject: str, plain_text: str, html_content: str) -> bool:
    """Sends email via Gmail SMTP (tries SSL Port 465, then STARTTLS Port 587)."""
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"StayEasy Hotel Management <{EMAIL_ADDRESS}>"
    msg["To"] = to_email

    msg.attach(MIMEText(plain_text, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    # Attempt 1: SMTP SSL (Port 465)
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=6) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"[GMAIL SMTP SSL 465] OTP email sent successfully to {to_email}")
        return True
    except Exception as ssl_err:
        print(f"[GMAIL SMTP SSL 465] Notice: {ssl_err}")

    # Attempt 2: SMTP STARTTLS (Port 587)
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=6) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"[GMAIL SMTP 587] OTP email sent successfully to {to_email}")
        return True
    except Exception as tls_err:
        print(f"[GMAIL SMTP 587] Notice: {tls_err}")

    return False


def _send_via_resend(to_email: str, subject: str, plain_text: str, html_content: str) -> bool:
    """Sends email via Resend REST API."""
    if not RESEND_API_KEY:
        return False
    try:
        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "StayEasy-Backend/1.0",
        }
        payload = {
            "from": "StayEasy <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": html_content,
            "text": plain_text,
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=8) as resp:
            if resp.status in (200, 201):
                print(f"[RESEND API] OTP email successfully sent to {to_email}")
                return True
    except Exception as e:
        print(f"[RESEND API] Notice: {e}")
    return False


def _dispatch_email(to_email: str, otp_code: str):
    """Executes the multi-tier email sending strategy."""
    subject = "Your Verification Code - StayEasy Hotel Management"
    plain_text, html_content = _build_email_content(otp_code)

    # Strategy 1: Gmail SMTP (SSL 465 / TLS 587)
    if _send_via_smtp(to_email, subject, plain_text, html_content):
        return True

    # Strategy 2: Resend API Fallback
    if _send_via_resend(to_email, subject, plain_text, html_content):
        return True

    # Strategy 3: Console Output (always displays OTP for easy dev testing)
    print("\n------------------------------------------")
    print(f"[OTP CODE GENERATED] For: {to_email}")
    print(f"--> OTP: {otp_code} (Valid for 5 minutes)")
    print("------------------------------------------\n")
    return True


def send_otp_email(to_email: str, otp_code: str, background: bool = True):
    """Sends OTP verification email. Runs asynchronously in background by default for zero API latency."""
    if background:
        thread = threading.Thread(
            target=_dispatch_email,
            args=(to_email, otp_code),
            daemon=True
        )
        thread.start()
        return True
    else:
        return _dispatch_email(to_email, otp_code)
