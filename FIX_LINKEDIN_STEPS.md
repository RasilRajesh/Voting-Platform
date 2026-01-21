# Step-by-Step Fix for LinkedIn Login/Signup Error

## Current Error:
```
REVOKED_ACCESS_TOKEN - The token used in the request has been revoked by the user
```

## Follow These Steps IN ORDER:

### ✅ Step 1: Fix LinkedIn App Redirect URIs

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Select your app
3. Go to **Auth** tab (or **OAuth 2.0** settings)
4. Find **Authorized redirect URLs** section
5. **Add ALL of these URLs** (one per line):
   ```
   http://localhost:3000/login
   http://localhost:3000/signup
   http://127.0.0.1:3000/login
   http://127.0.0.1:3000/signup
   ```
6. **Click Save** (very important!)

### ✅ Step 2: Verify Backend Configuration

1. Open `backend/.env` file
2. Make sure you have these lines (replace with YOUR actual values):
   ```env
   LINKEDIN_OAUTH2_KEY=your_actual_client_id_here
   LINKEDIN_OAUTH2_SECRET=your_actual_client_secret_here
   ```
3. **Important:** 
   - No quotes around values
   - No spaces before/after `=`
   - These must match your LinkedIn app credentials exactly

### ✅ Step 3: Verify Frontend Configuration

1. Open `frontend/.env` file
2. Make sure you have this line:
   ```env
   REACT_APP_LINKEDIN_CLIENT_ID=your_actual_client_id_here
   ```
3. **Important:** 
   - Must be the SAME Client ID as in backend `.env`
   - No quotes, no spaces

### ✅ Step 4: Restart Both Servers

**Backend:**
```bash
cd backend
# Stop server (Ctrl+C if running)
python manage.py runserver
```

**Frontend (in new terminal):**
```bash
cd frontend
# Stop server (Ctrl+C if running)
npm start
```

### ✅ Step 5: Clear Old LinkedIn Permissions

1. Go to LinkedIn website (not your app)
2. Click your profile picture → **Settings & Privacy**
3. Go to **Data privacy** → **Other applications** (or **Permitted services**)
4. Find your app in the list
5. Click **Remove** or **Revoke access**
6. **Log out** of LinkedIn completely

### ✅ Step 6: Test Fresh Login

1. **Close ALL browser windows**
2. Open a **NEW Incognito/Private window** (very important!)
3. Go to `http://localhost:3000/login`
4. Click **"Continue with LinkedIn"**
5. You should see LinkedIn login page
6. Log in and **approve permissions**
7. You should be redirected back to your app

### ✅ Step 7: Test Signup

1. Go to `http://localhost:3000/signup`
2. Click **"Continue with LinkedIn"**
3. Approve permissions again
4. Should redirect back successfully

## If Still Getting Errors:

### Check Browser Console (F12):
- Look for any error messages
- Check Network tab for failed requests

### Check Backend Console:
- Look for detailed error messages
- Should show what LinkedIn is complaining about

### Common Issues:

**"Redirect URI mismatch":**
- Make sure you added ALL redirect URIs in Step 1
- Check for typos (localhost vs 127.0.0.1)
- Make sure you saved LinkedIn app settings

**"Invalid client_id":**
- Verify Client ID matches in both `.env` files
- Restart servers after changing `.env`

**"Code expired":**
- Don't refresh pages with `?code=...` in URL
- Always start fresh from `/login` or `/signup` page

## Need Help?

Copy the **exact error message** you see and share it - it will tell us exactly what's wrong!

