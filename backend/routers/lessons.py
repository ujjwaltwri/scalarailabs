from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.get("/{skill_id}", response_model=schemas.Lesson)
def get_next_lesson(skill_id: int, user_id: int, db: Session = Depends(get_db)):
    progress = db.query(models.UserSkillProgress).filter(
        models.UserSkillProgress.user_id == user_id,
        models.UserSkillProgress.skill_id == skill_id
    ).first()
    
    completed_lessons = progress.completed_lessons if progress else 0
    next_order = completed_lessons + 1
    
    lesson = db.query(models.Lesson).filter(
        models.Lesson.skill_id == skill_id,
        models.Lesson.order == next_order
    ).first()
    
    if not lesson:
        lesson = db.query(models.Lesson).filter(
            models.Lesson.skill_id == skill_id
        ).order_by(models.Lesson.order.desc()).first()
        
    if not lesson:
        raise HTTPException(status_code=404, detail="No lessons found for this skill")
        
    return lesson
