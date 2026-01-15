# Voting Platform

A secure online voting system with premium UI built using Django REST Framework and React.js.

## Tech Stack

**Backend:** Django, Django REST Framework, JWT Authentication  
**Frontend:** React.js, React Router, Axios

## Features

- User authentication (Local signup/login, Google OAuth, LinkedIn OAuth)
- One vote per user with strict enforcement
- Premium white-themed responsive UI
- Live voting results
- Voters list with LinkedIn profiles

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

Access the application at `http://localhost:3000`

---

Built with Django & React

