from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    password: str
    finished_intro: bool = False

@router.post("/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    # Create a fresh user account with 0 XP
    new_user = models.User(username=req.username, password=req.password, total_xp=0, streak=0, hearts=5)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if req.finished_intro:
        new_user.total_xp = 15
        new_user.streak = 1
        
        # Mark the first skill (Intro) as COMPLETED
        first_skill = db.query(models.Skill).join(models.Unit).filter(models.Unit.order == 1, models.Skill.order == 1).first()
        if first_skill:
            progress = models.UserSkillProgress(
                user_id=new_user.id,
                skill_id=first_skill.id,
                completed_lessons=1,
                status="COMPLETED"
            )
            db.add(progress)
            db.commit()
        
    return {"user_id": new_user.id, "username": new_user.username}

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"user_id": user.id, "username": user.username}
