from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from dependencies import get_db, require_role

router = APIRouter()


@router.post("/{hotel_id}", response_model=schemas.RoomOut)
def add_room(
    hotel_id: int,
    room: schemas.RoomCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("hotel_owner"))
):
    hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    if hotel.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your hotel")

    new_room = models.Room(
        hotel_id=hotel_id,
        room_type=room.room_type,
        price_per_night=room.price_per_night,
        capacity=room.capacity
    )
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room


@router.get("/{hotel_id}", response_model=List[schemas.RoomOut])
def list_rooms(hotel_id: int, db: Session = Depends(get_db)):
    hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    return db.query(models.Room).filter(models.Room.hotel_id == hotel_id).all()


@router.put("/{room_id}", response_model=schemas.RoomOut)
def update_room(
    room_id: int,
    room_data: schemas.RoomCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("hotel_owner"))
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.hotel.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your room")

    room.room_type = room_data.room_type
    room.price_per_night = room_data.price_per_night
    room.capacity = room_data.capacity
    db.commit()
    db.refresh(room)
    return room


@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("hotel_owner"))
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.hotel.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your room")

    db.delete(room)
    db.commit()
    return {"message": "Room deleted successfully"}