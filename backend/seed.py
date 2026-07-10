import models
from database import SessionLocal, engine

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(models.User).first():
        print("Database already seeded")
        return

    # Seed User
    user = models.User(username="test_user", password="password", total_xp=150, streak=2, hearts=5)
    
    # Fake users for leaderboard
    fake1 = models.User(username="Sara_Language", password="password", total_xp=2450, streak=45, hearts=5)
    fake2 = models.User(username="PolyglotPro", password="password", total_xp=1890, streak=12, hearts=5)
    fake3 = models.User(username="DuoFan99", password="password", total_xp=840, streak=3, hearts=5)
    fake4 = models.User(username="LearnerBot", password="password", total_xp=420, streak=1, hearts=5)
    fake5 = models.User(username="Newbie_123", password="password", total_xp=15, streak=1, hearts=5)

    db.add_all([user, fake1, fake2, fake3, fake4, fake5])
    db.commit()
    db.refresh(user)

    # Seed Units
    unit1 = models.Unit(title="Unit 1", description="Form basic sentences, greet people", order=1)
    db.add(unit1)
    db.commit()
    db.refresh(unit1)

    # Seed Skills
    skill1 = models.Skill(unit_id=unit1.id, title="Intro", order=1)
    skill2 = models.Skill(unit_id=unit1.id, title="Basics", order=2)
    skill3 = models.Skill(unit_id=unit1.id, title="Phrases", order=3)
    skill4 = models.Skill(unit_id=unit1.id, title="Phrases Quiz", order=4)
    db.add_all([skill1, skill2, skill3, skill4])
    db.commit()
    db.refresh(skill1)
    db.refresh(skill2)
    db.refresh(skill3)
    db.refresh(skill4)

    # Seed Lessons
    lesson1 = models.Lesson(skill_id=skill1.id, order=1)
    lesson2 = models.Lesson(skill_id=skill2.id, order=1)
    lesson3 = models.Lesson(skill_id=skill3.id, order=1)
    lesson4 = models.Lesson(skill_id=skill4.id, order=1)
    db.add_all([lesson1, lesson2, lesson3, lesson4])
    db.commit()
    db.refresh(lesson1)
    db.refresh(lesson2)
    db.refresh(lesson3)
    db.refresh(lesson4)

    # Seed Exercises for Lesson 1 (Learning Session)
    exercises1 = [
        models.Exercise(
            lesson_id=lesson1.id,
            type="info",
            question_data={"concept": "El hombre", "meaning": "The man"},
            answer_data={}
        ),
        models.Exercise(
            lesson_id=lesson1.id,
            type="info",
            question_data={"concept": "La mujer", "meaning": "The woman"},
            answer_data={}
        ),
        models.Exercise(
            lesson_id=lesson1.id,
            type="info",
            question_data={"concept": "El niño", "meaning": "The boy"},
            answer_data={}
        ),
        models.Exercise(
            lesson_id=lesson1.id,
            type="info",
            question_data={"concept": "La niña", "meaning": "The girl"},
            answer_data={}
        )
    ]
    
    # Seed Exercises for Lesson 2 (The Test)
    exercises2 = [
        models.Exercise(
            lesson_id=lesson2.id,
            type="multiple_choice",
            question_data={"question": "Which of these is 'the man'?", "options": ["el hombre", "la mujer", "el niño"]},
            answer_data={"correct_answer": "el hombre"}
        ),
        models.Exercise(
            lesson_id=lesson2.id,
            type="translate",
            question_data={"question": "The boy", "word_bank": ["niño", "el", "hombre", "la"]},
            answer_data={"correct_answer": "el niño"}
        ),
        models.Exercise(
            lesson_id=lesson2.id,
            type="match_pairs",
            question_data={"pairs": [{"en": "hello", "es": "hola"}, {"en": "goodbye", "es": "adiós"}]},
            answer_data={"correct_answer": "pairs_match"}
        ),
        models.Exercise(
            lesson_id=lesson2.id,
            type="fill_in_the_blank",
            question_data={"sentence": "Yo ___ un hombre.", "options": ["soy", "eres", "es"]},
            answer_data={"correct_answer": "soy"}
        ),
        models.Exercise(
            lesson_id=lesson2.id,
            type="type_the_answer",
            question_data={"question": "Translate: 'I am a boy'"},
            answer_data={"correct_answer": "yo soy un niño"}
        )
    ]
    # Seed Exercises for Lesson 3 (Phrases Learning Session)
    exercises_phrases_intro = [
        models.Exercise(
            lesson_id=lesson3.id,
            type="info",
            question_data={"concept": "Buenos días", "meaning": "Good morning"},
            answer_data={}
        ),
        models.Exercise(
            lesson_id=lesson3.id,
            type="info",
            question_data={"concept": "Cómo estás", "meaning": "How are you?"},
            answer_data={}
        ),
        models.Exercise(
            lesson_id=lesson3.id,
            type="info",
            question_data={"concept": "Hola", "meaning": "Hello"},
            answer_data={}
        )
    ]
    
    # Seed Exercises for Lesson 4 (Phrases Test)
    exercises_phrases_test = [
        models.Exercise(
            lesson_id=lesson4.id,
            type="multiple_choice",
            question_data={"question": "Which of these is 'Good morning'?", "options": ["Buenos días", "Buenas noches", "Hola"]},
            answer_data={"correct_answer": "Buenos días"}
        ),
        models.Exercise(
            lesson_id=lesson4.id,
            type="translate",
            question_data={"question": "How are you?", "word_bank": ["estás", "cómo", "tú", "bien"]},
            answer_data={"correct_answer": "cómo estás"}
        )
    ]
    db.add_all(exercises1)
    db.add_all(exercises2)
    db.add_all(exercises_phrases_intro)
    db.add_all(exercises_phrases_test)
    
    # Let's add some initial progress for the user
    progress1 = models.UserSkillProgress(
        user_id=user.id,
        skill_id=skill1.id,
        completed_lessons=0,
        status="AVAILABLE"
    )
    progress2 = models.UserSkillProgress(
        user_id=user.id,
        skill_id=skill2.id,
        completed_lessons=0,
        status="LOCKED"
    )
    progress3 = models.UserSkillProgress(
        user_id=user.id,
        skill_id=skill3.id,
        completed_lessons=0,
        status="LOCKED"
    )
    progress4 = models.UserSkillProgress(
        user_id=user.id,
        skill_id=skill4.id,
        completed_lessons=0,
        status="LOCKED"
    )
    db.add_all([progress1, progress2, progress3, progress4])
    db.commit()

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
