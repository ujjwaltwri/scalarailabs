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
- **Deployment**: Docker Compose, Nginx Reverse Proxy, Google Cloud Platform (Compute Engine).

## Architecture Overview

The application follows a decoupled Client-Server architecture, containerized for production:
1. **Frontend Application (Next.js)**: Responsible for rendering the UI, managing client-side state, and animating transitions.
2. **Backend API (FastAPI)**: A lightweight Python web server that handles data persistence and serves course content.
3. **Database (SQLite)**: Stores relational data including user profiles, course structures, and progress.
4. **Nginx Proxy**: A reverse proxy container that serves the frontend on `/` and routes `/api/*` to the FastAPI backend, eliminating CORS issues and ensuring everything runs smoothly on a single origin.

## Deployment & CI/CD (Google Cloud)

This application is configured for easy deployment to a single Google Cloud VM using Docker Compose. A GitHub Action is also included to provide automatic continuous deployment upon push.

### Cloud Deployment Instructions
1. Clone the repository onto your VM:
   ```bash
   git clone https://github.com/ujjwaltwri/scalarailabs.git
   cd scalarailabs
   mkdir -p data
   ```
2. Give your user permission to run Docker without sudo (required for the CI/CD pipeline to work over SSH):
   ```bash
   sudo usermod -aG docker $USER
   sudo chmod 666 /var/run/docker.sock
   ```
3. Run the Docker Compose stack:
   ```bash
   docker compose up -d --build
   ```
4. Visit the VM's public IP address, or your custom domain if configured (e.g. `http://duolingo-ujjwal.duckdns.org`). *Note: The FastAPI backend will automatically seed the SQLite database on startup if it detects an empty database.*

### CI/CD Pipeline
The `.github/workflows/deploy.yml` action automatically connects via SSH and restarts the Docker containers whenever code is pushed to `main`. It requires three GitHub Repository Secrets: `GCP_SSH_PRIVATE_KEY`, `GCP_VM_IP`, and `GCP_VM_USERNAME`. Note that you must have configured the `usermod` step above for this to run successfully.

## Local Development Setup

If you prefer to run the application locally without Docker:

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server (it will auto-seed the database):
   ```bash
   uvicorn main:app --reload
   ```

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

- **Authentication**: A simplified login/registration flow is used without secure session cookies. The `userId` is stored as a plain cookie for demonstration purposes.
- **Economy**: The "gems" economy is mocked in local storage to test shop functionality easily.
- **Course Content**: The app seeds a functional Spanish curriculum for demonstration. 
- **Audio**: Text-to-speech leverages the browser's native `SpeechSynthesis` API.
