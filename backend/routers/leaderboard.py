from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter()

@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.total_xp.desc()).limit(10).all()
    return [{"id": u.id, "username": u.username, "total_xp": u.total_xp} for u in users]
