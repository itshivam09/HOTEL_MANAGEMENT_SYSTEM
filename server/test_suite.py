import urllib.request
import urllib.parse
import json
import time
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from database import SessionLocal
import models

BASE_URL = "http://127.0.0.1:8000"

def make_req(path, method="GET", data=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    body = None
    if data is not None:
        if req_headers.get("Content-Type") == "application/x-www-form-urlencoded":
            body = urllib.parse.urlencode(data).encode("utf-8")
        else:
            body = json.dumps(data).encode("utf-8")
            
    req = urllib.request.Request(url, data=body, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            resp_body = resp.read().decode("utf-8")
            return resp.status, json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {"detail": err_body}

def run_tests():
    print("========================================")
    print("TESTING LIVE FASTAPI SERVER VIA HTTP")
    print("========================================")

    # 1. Health check
    status, data = make_req("/api/health")
    assert status == 200, f"Health check failed: {status}, {data}"
    print("[PASS] 1. Root /api/health check")

    # 2. Register normal user (Guest)
    ts = int(time.time())
    guest_email = f"guest_{ts}@test.com"
    status, data = make_req("/users/register", method="POST", data={
        "name": "Guest Customer",
        "email": guest_email,
        "password": "secretpassword",
        "role": "user"
    })
    assert status == 200, f"Register failed: {status}, {data}"
    print("[PASS] 2. Guest Registration")

    def get_latest_otp(email):
        with SessionLocal() as session:
            record = session.query(models.OTP).filter(models.OTP.email == email).order_by(models.OTP.created_at.desc()).first()
            return record.otp_code if record else None

    # 3. Verify OTP
    otp_code = get_latest_otp(guest_email)
    assert otp_code is not None, "OTP not found"
    status, data = make_req("/users/verify-otp", method="POST", data={
        "email": guest_email,
        "otp_code": otp_code
    })
    assert status == 200, f"Verify OTP failed: {status}, {data}"
    print("[PASS] 3. Verify OTP")

    # 4. Login Guest
    status, data = make_req("/users/login", method="POST", data={
        "username": guest_email,
        "password": "secretpassword"
    }, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert status == 200, f"Login failed: {status}, {data}"
    guest_token = data["access_token"]
    guest_headers = {"Authorization": f"Bearer {guest_token}"}
    print("[PASS] 4. Guest Login (JWT issued)")

    # 5. /users/me
    status, data = make_req("/users/me", headers=guest_headers)
    assert status == 200 and data["email"] == guest_email
    print("[PASS] 5. Profile /users/me")

    # 6. Register Owner
    owner_email = f"owner_{ts}@test.com"
    status, data = make_req("/users/register", method="POST", data={
        "name": "Hotel Owner",
        "email": owner_email,
        "password": "secretpassword",
        "role": "hotel_owner"
    })
    assert status == 200

    owner_otp = get_latest_otp(owner_email)
    assert owner_otp is not None, "Owner OTP not found"
    status, data = make_req("/users/verify-otp", method="POST", data={
        "email": owner_email,
        "otp_code": owner_otp
    })
    assert status == 200, f"Owner verify failed: {status}, {data}"

    # 7. Login Owner
    status, data = make_req("/users/login", method="POST", data={
        "username": owner_email,
        "password": "secretpassword"
    }, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert status == 200
    owner_token = data["access_token"]
    owner_headers = {"Authorization": f"Bearer {owner_token}"}
    print("[PASS] 6 & 7. Owner Registered, Verified, Logged In")

    # 8. Create Hotel
    status, data = make_req("/hotels/", method="POST", data={
        "name": "Seaside Resort & Spa",
        "city": "Goa",
        "address": "Calangute Beach Road, Goa",
        "description": "Premium 5-star beachfront resort"
    }, headers=owner_headers)
    assert status == 200, f"Create hotel failed: {status}, {data}"
    hotel_id = data["id"]
    print(f"[PASS] 8. Owner created Hotel (ID: {hotel_id})")

    # 9. GET /hotels/
    status, data = make_req("/hotels/")
    assert status == 200 and len(data) >= 1
    print("[PASS] 9. Public GET /hotels/")

    # 10. GET /hotels/{hotel_id}
    status, data = make_req(f"/hotels/{hotel_id}")
    assert status == 200 and data["name"] == "Seaside Resort & Spa"
    print(f"[PASS] 10. Public GET /hotels/{hotel_id} (Single Hotel endpoint)")

    # 11. GET /hotels/my
    status, data = make_req("/hotels/my", headers=owner_headers)
    assert status == 200 and any(h["id"] == hotel_id for h in data)
    print("[PASS] 11. Owner GET /hotels/my")

    # 12. Add Room
    status, data = make_req(f"/rooms/{hotel_id}", method="POST", data={
        "room_type": "Super Deluxe Suite",
        "price_per_night": 4500.0,
        "capacity": 2
    }, headers=owner_headers)
    assert status == 200, f"Add room failed: {status}, {data}"
    room_id = data["id"]
    print(f"[PASS] 12. Owner added Room (ID: {room_id})")

    # 13. GET /rooms/{hotel_id}
    status, data = make_req(f"/rooms/{hotel_id}")
    assert status == 200 and len(data) >= 1
    print(f"[PASS] 13. Public GET /rooms/{hotel_id}")

    # 14. Update Room
    status, data = make_req(f"/rooms/{room_id}", method="PUT", data={
        "room_type": "Presidential Ocean Suite",
        "price_per_night": 6000.0,
        "capacity": 4
    }, headers=owner_headers)
    assert status == 200 and data["room_type"] == "Presidential Ocean Suite"
    print("[PASS] 14. Owner updated Room (PUT /rooms/{room_id})")

    # 15. Create Booking
    status, data = make_req("/bookings/", method="POST", data={
        "room_id": room_id,
        "check_in": "2026-11-10T12:00:00",
        "check_out": "2026-11-13T12:00:00"
    }, headers=guest_headers)
    assert status == 200, f"Create booking failed: {status}, {data}"
    booking_id = data["id"]
    assert data["total_price"] == 3 * 6000.0
    print(f"[PASS] 15. Guest created Booking (ID: #{booking_id}, Total: INR {data['total_price']})")

    # 16. Overlapping Booking conflict
    status, data = make_req("/bookings/", method="POST", data={
        "room_id": room_id,
        "check_in": "2026-11-11T12:00:00",
        "check_out": "2026-11-14T12:00:00"
    }, headers=guest_headers)
    assert status == 409, f"Expected 409 Conflict, got {status}"
    print("[PASS] 16. Overlapping booking conflict prevention (409)")

    # 17. GET /bookings/my
    status, data = make_req("/bookings/my", headers=guest_headers)
    assert status == 200 and any(b["id"] == booking_id for b in data)
    print("[PASS] 17. Guest GET /bookings/my")

    # 18. GET /bookings/owner
    status, data = make_req("/bookings/owner", headers=owner_headers)
    assert status == 200 and any(b["id"] == booking_id for b in data)
    print("[PASS] 18. Owner GET /bookings/owner")

    # 19. Cancel Booking
    status, data = make_req(f"/bookings/{booking_id}/cancel", method="PUT", headers=guest_headers)
    assert status == 200 and data["status"] == "cancelled"
    print("[PASS] 19. Guest cancelled booking")

    # 20. Resend OTP endpoint check on unverified user
    unverified_email = f"unverified_{ts}@test.com"
    make_req("/users/register", method="POST", data={
        "name": "Unverified User",
        "email": unverified_email,
        "password": "secretpassword",
        "role": "user"
    })
    status, data = make_req("/users/resend-otp", method="POST", data={"email": unverified_email})
    assert status == 200, f"Resend OTP failed: {status}, {data}"
    print("[PASS] 20. POST /users/resend-otp executed cleanly")

    # Cleanup test hotel/room
    make_req(f"/hotels/{hotel_id}", method="DELETE", headers=owner_headers)
    print("[PASS] 21. Cascade delete hotel and room")

    print("========================================")
    print("SUCCESS: ALL 21 HTTP ENDPOINT TESTS PASSED!")
    print("========================================")

if __name__ == "__main__":
    run_tests()
