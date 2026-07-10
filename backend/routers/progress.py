from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models
import datetime

router = APIRouter()

class LessonCompleteRequest(BaseModel):
    user_id: int
    skill_id: int
    xp_earned: int = 15

class HeartLostRequest(BaseModel):
    user_id: int

@router.post("/lesson-complete")
def complete_lesson(req: LessonCompleteRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.total_xp += req.xp_earned
    
    now = datetime.datetime.utcnow()
    last_act = user.last_activity_date
    if last_act.date() < now.date():
        user.streak += 1
    user.last_activity_date = now
    
    progress = db.query(models.UserSkillProgress).filter(
        models.UserSkillProgress.user_id == req.user_id,
        models.UserSkillProgress.skill_id == req.skill_id
    ).first()
    
    if not progress:
        progress = models.UserSkillProgress(
            user_id=req.user_id,
            skill_id=req.skill_id,
            completed_lessons=1,
            status="AVAILABLE"
        )
        db.add(progress)
    else:
        progress.completed_lessons += 1
        
    total_lessons = db.query(models.Lesson).filter(models.Lesson.skill_id == req.skill_id).count()
    if progress.completed_lessons >= total_lessons:
        progress.status = "COMPLETED"
        
    db.commit()
    return {"message": "Progress updated successfully", "user": {"total_xp": user.total_xp, "streak": user.streak}}

@router.post("/heart-lost")
def lose_heart(req: HeartLostRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.hearts > 0:
        user.hearts -= 1
        db.commit()
    return {"hearts": user.hearts}

class RefillHeartsRequest(BaseModel):
    user_id: int

@router.post("/refill-hearts")
def refill_hearts(req: RefillHeartsRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hearts = 5
    db.commit()
    return {"hearts": user.hearts}

class BuyHeartRequest(BaseModel):
    user_id: int

@router.post("/buy-heart")
def buy_heart(req: BuyHeartRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.hearts < 5:
        user.hearts += 1
        db.commit()
    return {"hearts": user.hearts}

@router.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    completed_skills = []
    progress_records = db.query(models.UserSkillProgress).filter(
        models.UserSkillProgress.user_id == user_id,
        models.UserSkillProgress.status == "COMPLETED"
    ).all()
    
    for record in progress_records:
        skill = db.query(models.Skill).filter(models.Skill.id == record.skill_id).first()
        if skill:
            completed_skills.append(skill.title)

    return {
        "id": user.id,
        "username": user.username,
        "total_xp": user.total_xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "completed_skills": completed_skills
    }
