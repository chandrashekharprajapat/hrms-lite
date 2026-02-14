# HRMS Lite - Quick Deployment Guide

## 🚀 Fast Track to Deployment

### Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Render account (free)
- Vercel account (free)

## Step-by-Step Deployment

### 1️⃣ Set Up MongoDB Atlas (5 minutes)

1. Visit https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a new cluster (M0 Free tier)
4. **Database Access**: Create a user with username/password
5. **Network Access**: Add IP `0.0.0.0/0` (allow from anywhere)
6. Click "Connect" → "Connect your application"
7. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hrms_lite?retryWrites=true&w=majority
   ```
   Replace `username` and `password` with your credentials

### 2️⃣ Push to GitHub (3 minutes)

```bash
cd /Users/chandrashekhar/Desktop/my_project

# Initialize git
git init
git add .
git commit -m "Initial commit: HRMS Lite application"

# Create repository on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git push -u origin main
```

### 3️⃣ Deploy Backend on Render (10 minutes)

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hrms-lite-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables** → Add:
   - **Key**: `MONGODB_URL`
   - **Value**: Your MongoDB Atlas connection string from Step 1
6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. **Copy your backend URL** (e.g., `https://hrms-lite-backend.onrender.com`)

### 4️⃣ Deploy Frontend on Vercel (5 minutes)

1. Go to https://vercel.com and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** → Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     (Replace with your actual Render backend URL from Step 3)
6. Click **"Deploy"**
7. Wait 2-3 minutes
8. **Your app is live!** 🎉

### 5️⃣ Test Your Application (5 minutes)

1. Visit your Vercel URL
2. Test the complete flow:
   - ✅ Add an employee
   - ✅ Mark attendance
   - ✅ View attendance records
   - ✅ Filter by date/employee
   - ✅ Delete an employee
   - ✅ Verify validations work

### 6️⃣ Update README (2 minutes)

Edit `README.md` and add your live URLs:

```markdown
## 🚀 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **API Documentation**: https://your-backend.onrender.com/docs
```

Commit and push:
```bash
git add README.md
git commit -m "Add live deployment URLs"
git push
```

## 📋 Submission Checklist

- ✅ **Live Application URL**: Your Vercel URL
- ✅ **Hosted Backend API**: Your Render URL
- ✅ **GitHub Repository**: Your GitHub repo URL
- ✅ **README.md**: Updated with live URLs

## 🎯 What to Submit

**1. Live Application URL**
```
https://your-app.vercel.app
```

**2. GitHub Repository**
```
https://github.com/YOUR_USERNAME/hrms-lite
```

**3. README.md** (already included in repo)
- Project overview ✅
- Tech stack ✅
- Local setup instructions ✅
- API documentation ✅
- Assumptions and limitations ✅

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check Render logs for errors
- Verify `MONGODB_URL` environment variable is set correctly
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

**Problem**: Database connection fails
- Verify MongoDB Atlas credentials
- Check connection string format
- Ensure cluster is running

### Frontend Issues

**Problem**: API calls fail
- Verify `VITE_API_URL` environment variable
- Check CORS is enabled in backend (already configured)
- Ensure backend URL ends with `/api`

**Problem**: Build fails
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Ensure Node.js version compatibility

## 💡 Tips

1. **Free Tier Limits**:
   - Render: Backend may sleep after 15 min of inactivity (first request takes ~30s)
   - MongoDB Atlas: 512MB storage limit
   - Vercel: Unlimited deployments

2. **Testing**:
   - Use Render backend `/docs` endpoint to test API directly
   - Check browser console for frontend errors
   - Monitor Render logs for backend errors

3. **Updates**:
   - Push to GitHub → Vercel auto-deploys frontend
   - Push to GitHub → Render auto-deploys backend

## 🎉 You're Done!

Your HRMS Lite application is now:
- ✅ Deployed and accessible worldwide
- ✅ Connected to a cloud database
- ✅ Fully functional with all features
- ✅ Ready for submission

**Total deployment time**: ~30 minutes

Good luck with your submission! 🚀
