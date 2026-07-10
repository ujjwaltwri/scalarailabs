# Duolingo Web App Clone

A functional clone of the Duolingo web application that replicates Duolingo's design, user experience, and core lesson and gamification workflows. Built for the SDE Fullstack Assignment.

## Features

- **Learning Path / Skill Tree**: A visual path of units and skills with lock/unlock progression.
- **Lesson Player**: A core lesson loop with multiple exercise types (multiple choice, translate, match pairs, fill in the blank, type the answer).
- **Gamification**: Includes a streak counter, XP totals, hearts system, and a simulated gems economy.
- **Bonus Features**: Native Web Speech API for Text-to-Speech audio, "Legendary" timed mode, Dark mode, fully responsive design, and an achievements system.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion for animations.
- **Backend**: Python 3, FastAPI, SQLAlchemy.
- **Database**: SQLite (via SQLAlchemy ORM).

## Architecture Overview

The application follows a standard decoupled Client-Server architecture:
1. **Frontend Application (Next.js)**: Responsible for rendering the UI, managing client-side state (hearts, gems, active lesson progress), and animating transitions. It makes RESTful HTTP calls to the backend.
2. **Backend API (FastAPI)**: A lightweight Python web server that handles data persistence, progress tracking, and serves course content. It exposes REST endpoints for users, progress, and learning paths.
3. **Database (SQLite)**: Stores relational data including user profiles, course structures (Units > Skills > Lessons > Exercises), and user progression tracking.

## Database Schema

The SQLite database consists of the following core tables:

- `users`: Stores user profiles.
  - `id` (PK), `username`, `password`, `total_xp`, `streak`, `hearts`, `last_activity_date`, `created_at`.
- `units`: The top-level containers for the learning path.
  - `id` (PK), `title`, `description`, `order`.
- `skills`: The individual nodes on the learning path (e.g., "Basics 1", "Phrases").
  - `id` (PK), `unit_id` (FK), `title`, `order`.
- `lessons`: The actual sessions within a skill.
  - `id` (PK), `skill_id` (FK), `order`.
- `exercises`: The individual questions/challenges inside a lesson.
  - `id` (PK), `lesson_id` (FK), `type` (String: multiple_choice, translate, etc.), `question_data` (JSON), `answer_data` (JSON).
- `user_skill_progress`: Tracks which skills a user has unlocked or completed.
  - `id` (PK), `user_id` (FK), `skill_id` (FK), `completed_lessons`, `status` (LOCKED, AVAILABLE, COMPLETED).

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database (This will create `sql_app.db` and populate it with sample language content and users):
   ```bash
   python seed.py
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:3000`.

## Assumptions Made

- **Authentication**: A simplified login/registration flow is used without JWT or secure session cookies. The `userId` is stored as a plain cookie for demonstration purposes, assuming a trusted local testing environment.
- **Economy**: The "gems" economy is mocked in local storage to easily test the shop functionality without needing a complex backend transaction system.
- **Course Content**: The app seeds a small, functional Spanish curriculum for demonstration. The system is designed to be easily extensible to other languages.
- **Audio**: Text-to-speech leverages the browser's native `SpeechSynthesis` API, assuming the user is running a modern browser that supports it.
