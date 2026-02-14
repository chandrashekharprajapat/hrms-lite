# 🚀 Quick Deployment Checklist

Follow these steps in order to deploy your HRMS Lite application.

## ✅ Step 1: MongoDB Atlas (5 min)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create M0 FREE cluster
4. Create database user (save password!)
5. Allow access from anywhere (0.0.0.0/0)
6. Get connection string and save it:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hrms_lite?retryWrites=true&w=majority
   ```

## ✅ Step 2: GitHub (3 min)

1. Go to https://github.com/new
2. Create repository named `hrms-lite`
3. Make it **Public**
4. **Don't** initialize with README
5. Copy the repository URL

**Then run these commands:**

```bash
cd /Users/chandrashekhar/Desktop/my_project

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git

# Push to GitHub
git push -u origin main
```

## ✅ Step 3: Deploy Backend to Render (10 min)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `hrms-lite` repository
5. Configure:
   - **Name**: `hrms-lite-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable:
   - **MONGODB_URL**: (paste your MongoDB connection string)
7. Click "Create Web Service"
8. Wait 5-10 minutes
9. **Save your backend URL**: `https://hrms-lite-backend.onrender.com`

## ✅ Step 4: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your `hrms-lite` repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - **VITE_API_URL**: `https://your-backend.onrender.com/api`
7. Click "Deploy"
8. Wait 2-3 minutes
9. **Save your frontend URL**: `https://hrms-lite-xxxxx.vercel.app`

## ✅ Step 5: Test & Submit

1. Visit your frontend URL
2. Test adding employees and marking attendance
3. Update README.md with your live URLs
4. Submit:
   - Live Application URL
   - GitHub Repository URL

---

## 📝 What You Need

- [ ] MongoDB Atlas connection string
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Live URLs saved

---

## 🆘 Need Detailed Help?

See **DEPLOYMENT_GUIDE.md** for detailed step-by-step instructions with screenshots and troubleshooting.

---

**Total Time**: ~25-30 minutes

**Good luck! 🎉**
