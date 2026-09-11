import os
import socket
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

# Force IPv4 resolution to prevent network unreachable issues on some cloud platforms/hosts
_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_otp_email(to_email: str, otp_code: str):
    """Sends OTP verification email via Gmail SMTP."""
    subject = "Your OTP Code - Hotel Management System"
    body = f"""Hello,

Your verification OTP code for StayEasy Hotel Management System is: {otp_code}

This code will expire in 5 minutes.
If you did not request this code, please ignore this email.
"""

    # 1. Send via Gmail SMTP
    if EMAIL_ADDRESS and EMAIL_PASSWORD:
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = f"StayEasy Hotel Management <{EMAIL_ADDRESS}>"
            msg["To"] = to_email

            with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
                server.starttls()
                server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
                server.send_message(msg)

            print(f"OTP email sent successfully via SMTP to {to_email}")
            return True
        except Exception as e:
            print(f"SMTP email sending failed: {e}")

    # Fallback for local testing / offline dev
    print(f"[TEST / FALLBACK] OTP for {to_email} is {otp_code}")
    return False

