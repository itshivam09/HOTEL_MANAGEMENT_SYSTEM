from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

import models, schemas
from dependencies import get_db, require_role

router = APIRouter()


# =========================================================
# CREATE HOTEL
# =========================================================

@router.post("/", response_model=schemas.HotelOut)
def create_hotel(
    hotel: schemas.HotelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_role("hotel_owner")
    )
):
    new_hotel = models.Hotel(
        owner_id=current_user.id,
        name=hotel.name,
        city=hotel.city,
        address=hotel.address,
        description=hotel.description
    )

    db.add(new_hotel)
    db.commit()
    db.refresh(new_hotel)

    return new_hotel


# =========================================================
# GET ALL HOTELS
# Public endpoint
# =========================================================

@router.get("/", response_model=List[schemas.HotelOut])
def list_hotels(
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Hotel)

    if city:
        query = query.filter(
            models.Hotel.city.ilike(f"%{city}%")
        )

    return query.all()


# =========================================================
# GET MY HOTELS
# Only logged-in owner can access
# =========================================================

@router.get("/my", response_model=List[schemas.HotelOut])
def my_hotels(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_role("hotel_owner")
    )
):
    return (
        db.query(models.Hotel)
        .filter(
            models.Hotel.owner_id == current_user.id
        )
        .all()
    )


# =========================================================
# UPDATE HOTEL
# =========================================================

@router.put("/{hotel_id}", response_model=schemas.HotelOut)
def update_hotel(
    hotel_id: int,
    hotel_data: schemas.HotelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_role("hotel_owner")
    )
):
    hotel = (
        db.query(models.Hotel)
        .filter(models.Hotel.id == hotel_id)
        .first()
    )

    if not hotel:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    # IMPORTANT:
    # Owner can edit ONLY their own hotel
    if hotel.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not your hotel"
        )

    hotel.name = hotel_data.name
    hotel.city = hotel_data.city
    hotel.address = hotel_data.address
    hotel.description = hotel_data.description

    db.commit()
    db.refresh(hotel)

    return hotel


# =========================================================
# DELETE HOTEL
# =========================================================

@router.delete("/{hotel_id}")
def delete_hotel(
    hotel_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_role("hotel_owner")
    )
):
    hotel = (
        db.query(models.Hotel)
        .filter(models.Hotel.id == hotel_id)
        .first()
    )

    if not hotel:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    # IMPORTANT:
    # Owner can delete ONLY their own hotel
    if hotel.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not your hotel"
        )

    db.delete(hotel)
    db.commit()

    return {
        "message": "Hotel deleted successfully"
    }