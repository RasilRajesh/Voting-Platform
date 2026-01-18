# LinkedIn OAuth Setup Instructions

## Step 1: Get LinkedIn Credentials

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app or select your existing app
3. Copy your **Client ID** and **Client Secret**

## Step 2: Configure LinkedIn App

In your LinkedIn app settings:

### Authorized redirect URLs:
Add these URLs to your LinkedIn app:
- `http://localhost:3000/login`
- `http://localhost:3000/signup`
- `http://127.0.0.1:8000/complete/linkedin-oauth2/`

### Products/Scopes:
Make sure you have these scopes enabled:
- `openid`
- `profile`  
- `email`

(Older apps might use `r_liteprofile` and `r_emailaddress`)

## Step 3: Backend Configuration

1. Create or edit `backend/.env` file
2. Add your LinkedIn credentials:

```env
LINKEDIN_OAUTH2_KEY=your_linkedin_client_id
LINKEDIN_OAUTH2_SECRET=your_linkedin_client_secret
```

## Step 4: Frontend Configuration

1. Create `frontend/.env` file (copy from `.env.example` if it exists)
2. Add your LinkedIn Client ID:

```env
REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

## Step 5: Restart Your Servers

```bash
# Backend
cd backend
python manage.py runserver

# Frontend (in another terminal)
cd frontend
npm start
```

## Testing LinkedIn Login

1. Go to `http://localhost:3000/login`
2. Click "Continue with LinkedIn"
3. You'll be redirected to LinkedIn to authorize
4. After authorization, you'll be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" error:
- Make sure the redirect URL in LinkedIn app matches exactly (including http/https, port, path)
- Check for trailing slashes

### "Invalid scope" error:
- Verify you have the correct products/scopes enabled in LinkedIn app
- Some scopes require LinkedIn app review

### Backend errors:
- Make sure `python-social-auth` packages are installed
- Check that settings.py has LinkedIn backend configured
- Verify .env variables are loaded correctly

## Notes

- The LinkedIn OAuth flow redirects users to LinkedIn, then back to your app with an authorization code
- The backend exchanges this code for user profile information
- User accounts are created automatically on first login
