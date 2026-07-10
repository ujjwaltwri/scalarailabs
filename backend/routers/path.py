from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.get("/{user_id}", response_model=list[schemas.Unit])
def get_learning_path(user_id: int, db: Session = Depends(get_db)):
    if user_id != 0:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    units = db.query(models.Unit).order_by(models.Unit.order).all()
    
    unlock_next = False
    for unit in units:
        for skill in unit.skills:
            progress = db.query(models.UserSkillProgress).filter(
                models.UserSkillProgress.user_id == user_id,
                models.UserSkillProgress.skill_id == skill.id
            ).first()
            if progress:
                if unlock_next and progress.status == "LOCKED":
                    progress.status = "AVAILABLE"
                    db.commit()
                
                skill.status = progress.status
                if progress.status == "COMPLETED":
                    unlock_next = True
                else:
                    unlock_next = False
            else:
                if (unit.order == 1 and skill.order == 1) or unlock_next:
                    skill.status = "AVAILABLE"
                    unlock_next = False
                else:
                    skill.status = "LOCKED"
                    
    return units
