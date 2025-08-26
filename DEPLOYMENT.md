# Deployment Guide

This React SPA application uses client-side routing and requires proper server configuration to handle direct URL access to routes like `/admin`, `/article/:id`, etc.

## Problem

When you build a React SPA, all routes like `/admin` are handled by JavaScript on the client side. However, when a user directly accesses `yoursite.com/admin` or refreshes the page, the server looks for a physical `/admin` directory or file, which doesn't exist. This results in a 404 error.

## Solution

The server needs to be configured to serve `index.html` for all routes that don't correspond to actual files. This project includes configuration files for different deployment platforms:

## Platform-Specific Configurations

### 1. Netlify
- ✅ **File included**: `public/_redirects`
- **Auto-configured**: Just deploy to Netlify - it will automatically use the `_redirects` file

### 2. Vercel
- ✅ **File included**: `vercel.json`
- **Auto-configured**: Just deploy to Vercel - it will automatically use the `vercel.json` file

### 3. Apache Server
- ✅ **File included**: `public/.htaccess`
- **Requires**: Apache server with mod_rewrite enabled
- **Auto-configured**: The `.htaccess` file will be copied to the dist folder

### 4. Nginx
Add this to your nginx configuration:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 5. Express.js Server
```javascript
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});
```

### 6. GitHub Pages
GitHub Pages doesn't support server-side redirects for SPAs. You would need to:
- Use HashRouter instead of BrowserRouter, or
- Use a workaround with a custom 404.html that redirects

## Testing Locally

1. Build the project:
   ```bash
   npm run build
   ```

2. Test with Vite's preview server (supports SPA routing):
   ```bash
   npm run preview
   ```

3. Navigate to `http://localhost:8080/admin` directly - it should work!

## Routes in This Application

- `/` - Homepage (Articles list)
- `/article/:id` - Article detail page
- `/admin` - Admin dashboard
- `/admin/articles` - Admin articles management
- `/admin/articles/new` - Create new article
- `/admin/articles/edit/:id` - Edit article
- `/admin/tags` - Tag management

## Verification

After deployment, test these URLs directly:
- `yoursite.com/admin` ✅
- `yoursite.com/admin/articles` ✅
- `yoursite.com/article/some-id` ✅

If any of these return a 404 error, the server routing is not configured correctly.
