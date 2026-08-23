from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List

import models, schemas
from dependencies import get_db, get_current_user, require_role

router = APIRouter()


@router.post("/", response_model=schemas.BookingOut)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if booking.check_in >= booking.check_out:
        raise HTTPException(status_code=400, detail="check_out must be after check_in")

    # overlapping booking check
    overlapping = db.query(models.Booking).filter(
        models.Booking.room_id == booking.room_id,
        models.Booking.status != "cancelled",
        and_(
            booking.check_in < models.Booking.check_out,
            booking.check_out > models.Booking.check_in
        )
    ).first()

    if overlapping:
        raise HTTPException(status_code=409, detail="Room is not available for these dates")

    nights = (booking.check_out - booking.check_in).days
    total_price = nights * room.price_per_night

    new_booking = models.Booking(
        user_id=current_user.id,
        room_id=booking.room_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        status="confirmed",
        total_price=total_price
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking


@router.get("/my", response_model=List[schemas.BookingOut])
def my_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()

# ============================================================
# OWNER BOOKINGS
# ============================================================

@router.get("/owner", response_model=List[schemas.OwnerBookingOut])
def owner_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only hotel owners can view customer bookings
    if current_user.role != "hotel_owner":
        raise HTTPException(
            status_code=403,
            detail="Only hotel owners can view customer bookings"
        )

    # Get bookings only from hotels owned by current owner
    bookings = (
        db.query(models.Booking)
        .join(
            models.Room,
            models.Booking.room_id == models.Room.id
        )
        .join(
            models.Hotel,
            models.Room.hotel_id == models.Hotel.id
        )
        .join(
            models.User,
            models.Booking.user_id == models.User.id
        )
        .filter(
            models.Hotel.owner_id == current_user.id
        )
        .all()
    )

    result = []

    for booking in bookings:

        result.append({
            "id": booking.id,

            # Customer
            "user_id": booking.user_id,
            "customer_name": booking.user.name,
            "customer_email": booking.user.email,

            # Hotel
            "hotel_id": booking.room.hotel.id,
            "hotel_name": booking.room.hotel.name,

            # Room
            "room_id": booking.room.id,
            "room_type": booking.room.room_type,

            # Booking
            "check_in": booking.check_in,
            "check_out": booking.check_out,
            "status": booking.status,
            "total_price": booking.total_price
        })

    return result


@router.get("/{booking_id}", response_model=schemas.BookingOut)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your booking")
    return booking


@router.put("/{booking_id}/cancel", response_model=schemas.BookingOut)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your booking")
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking already cancelled")

    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/hotel/{hotel_id}", response_model=List[schemas.BookingOut])
def get_hotel_bookings(
    hotel_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("hotel_owner"))
):
    hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    if hotel.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your hotel")

    bookings = (
        db.query(models.Booking)
        .join(models.Room, models.Booking.room_id == models.Room.id)
        .filter(models.Room.hotel_id == hotel_id)
        .all()
    )
    return bookings