# GitHub Pages Deployment Fix

## Common Issues & Solutions

### 1. GitHub Pages Not Enabled

**Check:**
- Go to your GitHub repo
- Settings → Pages
- Source should be: **Deploy from a branch**
- Branch: **main** (or master)
- Folder: **/ (root)**
- Click **Save**

Wait 2-3 minutes, then check: `https://yourusername.github.io/repo-name/`

---

### 2. Service Worker Path Issue

**Problem:** `firebase-messaging-sw.js` must be in root directory

**Fix:** Make sure file structure is:
```
repo-name/
├── firebase-messaging-sw.js  ← Must be in root
├── fcm-notification.js
├── index.html
├── customer.html
├── notificationadmin.html
└── ...
```

If files are in subfolder like `covai-main/covai-main/`, move everything up to root.

---

### 3. Firebase Domain Authorization

**Add GitHub Pages domain to Firebase:**

1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain
3. Add: `yourusername.github.io`
4. Save

---

### 4. CORS / Firestore Rules

**Update Firestore rules** (already created in firestore.rules):

Firebase Console → Firestore Database → Rules → Publish this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fcmTokens/{tokenId} {
      allow read, write: if true;
    }
    match /sentNotifications/{notifId} {
      allow read, write: if true;
    }
  }
}
```

---

### 5. Check File Paths

All HTML files should use **relative paths**:

```html
<!-- Good -->
<script src="fcm-notification.js"></script>
<img src="logo.jpeg">

<!-- Bad -->
<script src="/fcm-notification.js"></script>  ← Leading slash fails in subfolders
```

---

### 6. Service Worker Registration Fix

If service worker fails, update path in `fcm-notification.js`:

```javascript
// Change this:
const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

// To this (if in subfolder):
const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
```

---

### 7. Test Locally First

Before pushing to GitHub, test locally:

```bash
# Install Python 3
python -m http.server 8000

# Or Node.js
npx serve

# Then open: http://localhost:8000
```

Check browser console for errors.

---

### 8. GitHub Pages File Structure

**Option A: Root deployment** (Recommended)
```
yourusername.github.io/repo-name/
├── index.html
├── customer.html
├── firebase-messaging-sw.js
└── ...
```

**Option B: Docs folder**
- Move all files to `docs/` folder
- Settings → Pages → Folder: **docs**

---

### 9. Common Console Errors

**"Service worker not found"**
→ firebase-messaging-sw.js not in root
→ Fix path in registration

**"Failed to register service worker"**
→ HTTPS required (GitHub Pages has HTTPS)
→ Check browser console for exact error

**"Permission denied" Firestore**
→ Update Firestore rules (see #4)

**"Messaging: Requested entity was not found"**
→ Enable FCM API in Firebase Console

---

### 10. Quick Deployment Checklist

- [ ] All files in root directory (not nested)
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] firebase-messaging-sw.js in root
- [ ] Firestore rules deployed
- [ ] FCM API enabled in Firebase
- [ ] GitHub Pages domain added to Firebase Auth
- [ ] Wait 2-3 minutes after push
- [ ] Check https://yourusername.github.io/repo-name/

---

## Test Your Deployment

1. Open: `https://yourusername.github.io/repo-name/test-notification.html`
2. Check console for errors (F12)
3. Click "Request Permission"
4. Verify token generated
5. Send test notification

---

## Your GitHub Repo URL

Format: `https://github.com/yourusername/repo-name`

Share the exact URL for specific help.

---

## Still Not Working?

**Check browser console (F12):**
- Red errors? Share the error message
- Network tab: Any failed requests?
- Console tab: Service worker status?

**Common fixes:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Try incognito/private window
4. Test in different browser
