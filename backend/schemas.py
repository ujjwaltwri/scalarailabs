from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# --- Exercises ---
class ExerciseBase(BaseModel):
    type: str
    question_data: Any
    answer_data: Any

class Exercise(ExerciseBase):
    id: int
    lesson_id: int

    class Config:
        from_attributes = True

# --- Lessons ---
class LessonBase(BaseModel):
    order: int

class Lesson(LessonBase):
    id: int
    skill_id: int
    exercises: List[Exercise] = []

    class Config:
        from_attributes = True

# --- Skills ---
class SkillBase(BaseModel):
    title: str
    order: int

class Skill(SkillBase):
    id: int
    unit_id: int
    lessons: List[Lesson] = []
    status: Optional[str] = None # Enriched dynamically based on User

    class Config:
        from_attributes = True

# --- Units ---
class UnitBase(BaseModel):
    title: str
    description: str
    order: int

class Unit(UnitBase):
    id: int
    skills: List[Skill] = []

    class Config:
        from_attributes = True

# --- Users ---
class UserBase(BaseModel):
    username: str

class User(UserBase):
    id: int
    total_xp: int
    streak: int
    hearts: int
    last_activity_date: datetime

    class Config:
        from_attributes = True
