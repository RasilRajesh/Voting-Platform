# Voting Platform

A secure, responsive online voting system for internship assignments, built with Django REST Framework and React.js.

## Tech Stack

- **Backend:** Django, Django REST Framework, JWT Authentication
- **Frontend:** React.js, React Router, Axios

## Features

- Local signup/login with email verification
- Google and LinkedIn OAuth authentication
- One vote per user (strict enforcement)
- Premium white-themed, mobile-responsive UI
- Live voting results (admin-only dashboard)
- Voters and candidates list with LinkedIn profile links
- Password reset via email
- Admin panel for candidate and voter management

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Access the application at [http://localhost:3000]

## Assignment Compliance

- Responsive UI
- Email verification for secure registration
- LinkedIn profile display for voters and candidates
- One-time voting enforcement
- Admin overview and management

---
