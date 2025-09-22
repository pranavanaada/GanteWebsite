# 🚀 Sacred Pooja Bells - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Build & Test
```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Test production build locally
npm run preview:production
```

### ✅ Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables in `.env.local`:**
   ```bash
   # EmailJS configuration (required for contact form)
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key

   # Production settings
   VITE_APP_ENV=production
   VITE_API_BASE_URL=https://your-domain.com
   ```

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Prerequisites:**
- GitHub repository
- Vercel account

**Steps:**
1. **Connect to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

2. **Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add your EmailJS configuration variables
   - Add any other production environment variables

3. **Custom Domain:**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain

### 2. Netlify

**Prerequisites:**
- GitHub repository
- Netlify account

**Steps:**
1. **Build settings in Netlify:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Deploy:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy
   npm run deploy:netlify
   ```

### 3. AWS S3 + CloudFront

**Prerequisites:**
- AWS account
- AWS CLI configured

**Steps:**
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Create S3 bucket and upload:**
   ```bash
   aws s3 mb s3://your-bucket-name
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront distribution for React Router support**

### 4. Azure Static Web Apps

**Prerequisites:**
- Azure account
- GitHub repository

**Steps:**
1. **Create Azure Static Web App**
2. **Configure build settings:**
   ```yaml
   app_location: "/"
   output_location: "dist"
   ```

## 🔧 Production Optimizations

### Performance Features Enabled:
- ✅ Code splitting with manual chunks
- ✅ Asset optimization and caching
- ✅ Terser minification
- ✅ Tree shaking
- ✅ Image optimization
- ✅ Proper cache headers

### SEO Features:
- ✅ Meta tags for social sharing
- ✅ robots.txt
- ✅ Structured data ready
- ✅ Mobile-optimized viewport
- ✅ Accessibility features

## 📊 Post-Deployment

### 1. Domain Configuration
Update the following files with your actual domain:
- `index.html` - Update Open Graph URLs
- `robots.txt` - Update sitemap URL
- `.env.production` - Update API base URL

### 2. Analytics Setup (Optional)
Add Google Analytics or other tracking:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

### 3. Contact Form Testing
Test the contact form to ensure:
- ✅ EmailJS configuration works
- ✅ Form validation functions
- ✅ Success/error messages display
- ✅ Email delivery is successful

### 4. Performance Testing
Use tools to test performance:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse

## 🔍 Monitoring & Maintenance

### Production Monitoring:
- Monitor Vercel/Netlify analytics
- Set up error tracking (Sentry)
- Monitor contact form submissions
- Regular security updates

### Update Process:
```bash
# Update dependencies
npm update

# Test locally
npm run dev
npm run build
npm run preview

# Deploy
git push origin main  # Auto-deploys on most platforms
```

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails:**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **Routing Issues:**
   - Ensure SPA fallback is configured (`vercel.json` includes catch-all route)
   - Check that all routes redirect to `index.html`

3. **Contact Form Not Working:**
   - Verify EmailJS credentials
   - Check CORS settings
   - Validate API endpoints

4. **Assets Not Loading:**
   - Check `vite.config.ts` base path
   - Verify asset paths are relative
   - Check cache headers

## 📞 Support

For deployment issues:
1. Check build logs
2. Verify environment variables
3. Test locally first
4. Contact platform support if needed

---

**Ready for Production! 🎉**

Your Sacred Pooja Bells application is now optimized and ready for cloud deployment with excellent performance, SEO, and user experience across all devices.