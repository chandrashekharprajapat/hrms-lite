# Frontend Setup Guide

## Issue: npm not found

The `npm` command is not available in the current environment. You'll need to install Node.js to run the frontend.

## Solution 1: Install Node.js (Recommended)

### On macOS:

**Option A: Using Homebrew (Recommended)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

**Option B: Download from nodejs.org**
1. Visit https://nodejs.org/
2. Download the LTS version for macOS
3. Run the installer
4. Restart your terminal

### After Installing Node.js:

```bash
# Navigate to frontend directory
cd /Users/chandrashekhar/Desktop/my_project/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at **http://localhost:3000**

---

## Solution 2: Deploy Without Local Testing

If you want to skip local testing and deploy directly:

### Step 1: Push to GitHub

```bash
cd /Users/chandrashekhar/Desktop/my_project

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: HRMS Lite application"

# Create a repository on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Go to https://render.com
2. Sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable:
   - **MONGODB_URL**: Get from MongoDB Atlas (see below)
7. Deploy

### Step 3: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (M0 Free tier)
4. Create database user
5. Whitelist all IPs (0.0.0.0/0)
6. Get connection string and add to Render

### Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up/login
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - **VITE_API_URL**: Your Render backend URL + `/api`
7. Deploy

---

## Solution 3: Use Docker (Advanced)

If you're familiar with Docker, you can containerize the application.

---

## Current Status

✅ **Backend**: Running successfully on http://127.0.0.1:8000
❌ **Frontend**: Needs Node.js to be installed

## Recommended Next Steps

1. **Install Node.js** using one of the methods above
2. **Run the frontend** locally to test the application
3. **Deploy** to Render and Vercel for production

## Need Help?

If you encounter any issues:
- Make sure you have the latest version of Node.js (LTS)
- Clear npm cache if needed: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## Quick Reference

### Backend Commands
```bash
cd /Users/chandrashekhar/Desktop/my_project/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Frontend Commands (after installing Node.js)
```bash
cd /Users/chandrashekhar/Desktop/my_project/frontend
npm install
npm run dev
```

### API Documentation
- Backend API: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/docs
- Frontend: http://localhost:3000 (after npm run dev)
