# Online Voting Platform

A secure, production-ready online voting system built with Django REST Framework and React.js. This platform allows authenticated users to vote for candidates, with support for Google and LinkedIn OAuth authentication.

## 🎯 Project Overview

This is an internship assignment project that implements a complete voting system with the following features:

- **User Authentication**: Local signup/login, Google OAuth, and LinkedIn OAuth
- **Voting System**: One vote per user with strict enforcement
- **Candidate Management**: Display candidates with profile images and LinkedIn links
- **Voters List**: Public list of all voters with clickable LinkedIn profiles
- **Secure API**: JWT-based authentication with Django REST Framework

## 🧱 Tech Stack

### Backend
- **Python 3.8+**
- **Django 4.2.7** - Web framework
- **Django REST Framework 3.14.0** - API framework
- **djangorestframework-simplejwt 5.3.0** - JWT authentication
- **social-auth-app-django 5.4.0** - OAuth integration
- **PostgreSQL** (production) / **SQLite** (development)
- **Pillow** - Image handling

### Frontend
- **React.js 18.2.0**
- **React Router DOM 6.20.0** - Navigation
- **Axios 1.6.2** - HTTP client
- **CSS3** - Styling (no heavy frameworks)

## 📋 Features

### Authentication
- ✅ Local user registration and login
- ✅ Google OAuth 2.0 integration
- ✅ LinkedIn OAuth 2.0 integration
- ✅ JWT token-based authentication
- ✅ Forgot password functionality (placeholder)

### Voting System
- ✅ One vote per user (enforced at database level with OneToOneField)
- ✅ Vote-once validation with `has_voted` flag
- ✅ Candidate display with profile images
- ✅ Real-time vote status tracking

### User Interface
- ✅ Clean, modern UI
- ✅ Responsive design
- ✅ Dashboard with candidate cards
- ✅ Voting page with candidate selection
- ✅ Public voters list with LinkedIn links
- ✅ Navigation bar with user info

## 🗂️ Project Structure

```
voting-platform/
├── backend/                  # Django backend
│   ├── voting_platform/     # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/               # User authentication app
│   │   ├── models.py       # Custom User model
│   │   ├── views.py        # Auth endpoints
│   │   ├── serializers.py  # User serializers
│   │   └── urls.py
│   ├── candidates/          # Candidate management app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── votes/              # Voting app
│   │   ├── models.py       # Vote model with OneToOneField
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/                # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm
- PostgreSQL (optional, SQLite works for development)
- Virtual environment (recommended)

### Backend Setup

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Create and activate a virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Create a `.env` file** in the backend directory (optional, for production):
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   GOOGLE_OAUTH2_KEY=your-google-client-id
   GOOGLE_OAUTH2_SECRET=your-google-client-secret
   LINKEDIN_OAUTH2_KEY=your-linkedin-client-id
   LINKEDIN_OAUTH2_SECRET=your-linkedin-client-secret
   ```

6. **Run database migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create a superuser** (for Django admin):
   ```bash
   python manage.py createsuperuser
   ```

8. **Create sample candidates** (using management command):
   ```bash
   python manage.py create_sample_candidates
   ```
   
   Or create manually via Django admin or shell:
   ```bash
   python manage.py shell
   ```
   ```python
   from candidates.models import Candidate
   Candidate.objects.create(
       name="Candidate 1",
       linkedin_url="https://www.linkedin.com/in/candidate1/",
       team_id=1
   )
   Candidate.objects.create(
       name="Candidate 2",
       linkedin_url="https://www.linkedin.com/in/candidate2/",
       team_id=2
   )
   ```

9. **Run the development server**:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory** (from project root):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the frontend directory (optional, for OAuth):
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_LINKEDIN_CLIENT_ID=your-linkedin-client-id
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## 🔐 OAuth Setup Instructions

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the consent screen
6. Add authorized redirect URIs:
   - `http://localhost:8000/auth/google/`
   - `http://localhost:3000/oauth/google/callback`
7. Copy the Client ID and Client Secret
8. Add them to your `.env` file:
   ```env
   GOOGLE_OAUTH2_KEY=your-client-id
   GOOGLE_OAUTH2_SECRET=your-client-secret
   ```

### LinkedIn OAuth Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. In the "Auth" tab, add redirect URLs:
   - `http://localhost:8000/auth/linkedin/`
   - `http://localhost:3000/oauth/linkedin/callback`
4. Request access to the following products:
   - Sign In with LinkedIn using OpenID Connect
   - Email Address
5. Copy the Client ID and Client Secret
6. Add them to your `.env` file:
   ```env
   LINKEDIN_OAUTH2_KEY=your-client-id
   LINKEDIN_OAUTH2_SECRET=your-client-secret
   ```

## 📡 API Endpoints

### Authentication
- `POST /auth/signup/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/forgot-password/` - Request password reset
- `POST /auth/google/` - Google OAuth authentication
- `POST /auth/linkedin/` - LinkedIn OAuth authentication
- `GET /auth/me/` - Get current user (authenticated)

### Candidates
- `GET /api/candidates/` - List all candidates

### Voting
- `POST /api/votes/<candidate_id>/` - Cast a vote (authenticated)
- `GET /api/votes/voters/` - Get list of all voters (authenticated)

## 🗄️ Database Models

### User Model
- `id` (UUID, primary key)
- `name` (CharField)
- `email` (EmailField, unique)
- `linkedin_url` (URLField, optional)
- `auth_provider` (CharField: 'google', 'linkedin', 'local')
- `has_voted` (BooleanField, default=False)
- `created_at` (DateTimeField)

### Candidate Model
- `id` (AutoField, primary key)
- `name` (CharField)
- `profile_image` (ImageField, optional)
- `linkedin_url` (URLField)
- `team_id` (IntegerField: 1 or 2)
- `created_at` (DateTimeField)

### Vote Model
- `id` (AutoField, primary key)
- `user` (OneToOneField to User) - **Enforces one vote per user**
- `candidate` (ForeignKey to Candidate)
- `created_at` (DateTimeField)

## 🔒 Security Features

- JWT token-based authentication
- One vote per user enforced at database level (OneToOneField)
- Password validation
- CORS configuration for frontend
- Secure password hashing
- OAuth 2.0 integration

## 🧪 Testing the Application

1. **Start both servers**:
   - Backend: `python manage.py runserver` (port 8000)
   - Frontend: `npm start` (port 3000)

2. **Test Registration**:
   - Navigate to `http://localhost:3000/signup`
   - Create a new account

3. **Test Voting**:
   - Login and go to Dashboard
   - Click "Vote Now" to see candidates
   - Select a candidate and vote
   - Try voting again (should be blocked)

4. **Test Voters List**:
   - After voting, you'll be redirected to the voters list
   - Click on LinkedIn links to verify they work

5. **Test OAuth** (requires OAuth setup):
   - Click "Login with Google" or "Login with LinkedIn"
   - Complete OAuth flow
   - User will be created automatically if new

## 📝 Notes

- The forgot password endpoint is a placeholder and doesn't send actual emails
- For production, configure proper email settings in Django
- Use PostgreSQL for production instead of SQLite
- Set `DEBUG=False` in production
- Configure proper CORS origins for production
- Add rate limiting for production use
- Implement proper error logging

## 👥 Team Members

[Add your team member details here]

## 📄 License

This project is created for internship assignment purposes.

## 🤝 Contributing

This is an internship assignment project. For questions or issues, please contact the project maintainer.

---

**Built with ❤️ using Django and React**

