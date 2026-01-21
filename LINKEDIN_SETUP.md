# LinkedIn OAuth Setup Instructions

## Step 1: Get LinkedIn Credentials

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app or select your existing app
3. Copy your **Client ID** and **Client Secret**

## Step 2: Configure LinkedIn App

In your LinkedIn app settings:

### Authorized redirect URLs:
**IMPORTANT:** Add ALL of these URLs to your LinkedIn app (exact match required):
- `http://localhost:3000/login`
- `http://localhost:3000/signup`
- `http://127.0.0.1:3000/login`
- `http://127.0.0.1:3000/signup`
- `http://127.0.0.1:8000/complete/linkedin-oauth2/` (if using social-auth)

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

### "LinkedIn login failed. Please try again." error:

**The error message will now show the actual backend error.** Check the browser console or the error message displayed on screen for details.

### Common issues and fixes:

#### 1. "Redirect URI mismatch" error:
- Make sure the redirect URL in LinkedIn app matches **exactly** (including http/https, port, path)
- The app uses `${window.location.origin}/login` as redirect URI
- If running on `http://localhost:3000`, add `http://localhost:3000/login` to LinkedIn app
- If running on `http://127.0.0.1:3000`, add `http://127.0.0.1:3000/login` to LinkedIn app
- Check for trailing slashes - they must match exactly
- **Important**: Add both `http://localhost:3000/login` AND `http://127.0.0.1:3000/login` if you're unsure which one will be used

#### 2. "Invalid scope" or "Failed to exchange code for token" error:
- Verify you have the correct products/scopes enabled in LinkedIn app:
  - Go to LinkedIn Developers → Your App → Products
  - Enable "Sign In with LinkedIn using OpenID Connect"
  - Required scopes: `openid`, `profile`, `email`
- Some scopes require LinkedIn app review
- Make sure your LinkedIn app is not in "Development" mode restrictions

#### 3. "Failed to fetch LinkedIn profile" or "Invalid access token" error:
- Check backend logs for detailed error messages
- Verify your LinkedIn app has the correct API access
- Ensure `LINKEDIN_OAUTH2_KEY` and `LINKEDIN_OAUTH2_SECRET` are set correctly in `backend/.env`
- Restart the backend server after changing `.env` file

#### 4. "Email not found in LinkedIn profile" error:
- Make sure you've requested the `email` scope
- Verify your LinkedIn app has access to email information
- Check that the user has granted email permissions during authorization

#### 5. Backend errors:
- Make sure `requests` package is installed: `pip install requests`
- Check that settings.py has LinkedIn backend configured
- Verify .env variables are loaded correctly (check for typos)
- Check backend console/logs for detailed error messages
- Ensure backend server is running on `http://127.0.0.1:8000`

#### 6. Network/CORS errors:
- Make sure backend CORS settings allow requests from frontend origin
- Check that backend server is running and accessible
- Verify the API endpoint URL is correct: `http://127.0.0.1:8000/auth/linkedin/`

### Debugging steps:

1. **Check browser console** (F12) for detailed error messages
2. **Check backend logs** for LinkedIn API responses
3. **Verify environment variables**:
   ```bash
   # Backend
   cd backend
   python -c "from django.conf import settings; print(settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY)"
   
   # Frontend - check .env file exists and has REACT_APP_LINKEDIN_CLIENT_ID
   ```
4. **Test LinkedIn OAuth URL directly**:
   - The URL should look like: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...`
   - Check browser network tab to see the exact redirect URI being used

## Notes

- The LinkedIn OAuth flow redirects users to LinkedIn, then back to your app with an authorization code
- The backend exchanges this code for user profile information
- User accounts are created automatically on first login
