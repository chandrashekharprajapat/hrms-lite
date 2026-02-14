# HRMS Lite - Step-by-Step Deployment Guide

## 🎯 Overview

This guide will help you deploy your HRMS Lite application to production in ~30 minutes.

**What you'll deploy:**
- Backend API → Render (free tier)
- Frontend → Vercel (free tier)
- Database → MongoDB Atlas (free tier)

---

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (we'll create this)
- Render account (we'll create this)
- Vercel account (we'll create this)

---

## Step 1: Set Up MongoDB Atlas (5 minutes)

### 1.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Choose "Free" tier

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose **M0 FREE** tier
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Click "Create Cluster"

### 1.3 Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `hrmsadmin`
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Allow Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://hrmsadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: change `/?retryWrites` to `/hrms_lite?retryWrites`

**Save this connection string - you'll need it for Render!**

---

## Step 2: Push Code to GitHub (5 minutes)

### 2.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `hrms-lite`
3. Description: "Lightweight HR Management System"
4. Choose "Public"
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### 2.2 Push Your Code

Open a terminal and run:

```bash
cd /Users/chandrashekhar/Desktop/my_project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HRMS Lite application"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git

# Push to GitHub
git push -u origin main
```

**✅ Checkpoint**: Visit your GitHub repository URL to verify code is uploaded

---

## Step 3: Deploy Backend to Render (10 minutes)

### 3.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)

### 3.2 Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect" next to your `hrms-lite` repository
4. If you don't see it, click "Configure account" and grant access

### 3.3 Configure Service

Fill in these settings:

- **Name**: `hrms-lite-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3.4 Add Environment Variable

Scroll down to "Environment Variables":
1. Click "Add Environment Variable"
2. **Key**: `MONGODB_URL`
3. **Value**: Paste your MongoDB Atlas connection string from Step 1.5
4. Click "Add"

### 3.5 Deploy

1. Scroll down and click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll see logs - wait for "Application startup complete"

### 3.6 Get Backend URL

Once deployed:
1. Copy your backend URL (looks like): `https://hrms-lite-backend.onrender.com`
2. **Save this URL - you'll need it for Vercel!**
3. Test it: Visit `https://hrms-lite-backend.onrender.com/docs`

**✅ Checkpoint**: You should see the FastAPI documentation page

---

## Step 4: Deploy Frontend to Vercel (10 minutes)

### 4.1 Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended)

### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Find your `hrms-lite` repository
3. Click "Import"

### 4.3 Configure Project

Fill in these settings:

- **Framework Preset**: `Vite`
- **Root Directory**: Click "Edit" → Enter `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4.4 Add Environment Variable

1. Click "Environment Variables"
2. **Key**: `VITE_API_URL`
3. **Value**: Your Render backend URL + `/api`
   - Example: `https://hrms-lite-backend.onrender.com/api`
4. Click "Add"

### 4.5 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll see "Congratulations!" when done

### 4.6 Get Frontend URL

1. Click "Visit" or copy the URL (looks like): `https://hrms-lite-xxxxx.vercel.app`
2. **Save this URL - this is your live application!**

**✅ Checkpoint**: Your application should load in the browser

---

## Step 5: Test Your Deployed Application (5 minutes)

### 5.1 Test Backend
1. Visit: `https://your-backend.onrender.com/docs`
2. Try the "GET /api/employees" endpoint
3. Should return an empty array `[]`

### 5.2 Test Frontend
1. Visit your Vercel URL
2. You should see the HRMS Lite dashboard
3. Try adding an employee:
   - Employee ID: `EMP001`
   - Name: `John Doe`
   - Email: `john@example.com`
   - Department: `Engineering`
4. Try marking attendance
5. View attendance records

**✅ Checkpoint**: Everything should work!

---

## Step 6: Update README with Live URLs

### 6.1 Edit README

Open `/Users/chandrashekhar/Desktop/my_project/README.md` and update the Live Demo section:

```markdown
## 🚀 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **API Documentation**: https://your-backend.onrender.com/docs
```

### 6.2 Push Update

```bash
cd /Users/chandrashekhar/Desktop/my_project
git add README.md
git commit -m "Add live deployment URLs"
git push
```

---

## 🎉 You're Done!

### What to Submit

**1. Live Application URL**
```
https://your-app.vercel.app
```

**2. GitHub Repository**
```
https://github.com/YOUR_USERNAME/hrms-lite
```

**3. README.md** (already in your repo with all documentation)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

**Problem**: "Application error" on backend
- Check if MongoDB Atlas cluster is running
- Verify environment variable `MONGODB_URL` is set correctly

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `VITE_API_URL` environment variable
- Make sure it ends with `/api`
- Check CORS is enabled (already configured in backend)

**Problem**: Build fails
- Check Vercel build logs
- Verify `frontend` is set as root directory
- Ensure all files are committed to GitHub

### First Request Slow

**Note**: Render free tier sleeps after 15 minutes of inactivity
- First request may take 30-60 seconds
- Subsequent requests will be fast
- This is normal for free tier

---

## 💡 Tips

1. **MongoDB Atlas**: Free tier has 512MB storage limit
2. **Render**: Backend may sleep after inactivity (first request slower)
3. **Vercel**: Unlimited deployments, auto-deploys on git push
4. **Updates**: Push to GitHub → Both services auto-deploy

---

## 📞 Need Help?

If you get stuck:
1. Check the error logs in Render/Vercel dashboard
2. Verify all environment variables are set correctly
3. Make sure MongoDB Atlas is accessible (0.0.0.0/0)
4. Test backend API directly at `/docs` endpoint

**Good luck with your deployment! 🚀**
