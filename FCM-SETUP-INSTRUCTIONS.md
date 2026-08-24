# Firebase Cloud Messaging (FCM) Setup Instructions

## Real-Life Push Notifications for COVAI SCRAP HUB

### ✅ Files Created

1. **firebase-messaging-sw.js** - Service worker for background notifications
2. **fcm-notification.js** - FCM client script
3. **notificationadmin.html** - Admin notification interface (already exists)

---

## 🔧 Setup Steps

### Step 1: Get VAPID Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **covaiscrap**
3. Click ⚙️ Settings → **Project settings**
4. Go to **Cloud Messaging** tab
5. Scroll to **Web configuration**
6. Under **Web Push certificates**, click **Generate key pair**
7. Copy the VAPID key (starts with `B...`)

### Step 2: Update VAPID Key

Open `fcm-notification.js` and replace:

```javascript
vapidKey: 'YOUR_VAPID_KEY'
```

With your actual VAPID key:

```javascript
vapidKey: 'BArG3qL...' // Your full key
```

### Step 3: Enable FCM in Firebase

1. In Firebase Console, go to **Cloud Messaging**
2. Make sure **Firebase Cloud Messaging API (V1)** is **ENABLED**
3. If not, click **Enable**

### Step 4: Update Firestore Security Rules

Add these rules to allow FCM token storage:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow FCM tokens to be written
    match /fcmTokens/{tokenId} {
      allow read, write: if true;
    }
    
    // Allow sent notifications to be read/written by admin
    match /sentNotifications/{notifId} {
      allow read, write: if true;
    }
  }
}
```

### Step 5: Add FCM to Your Pages

Add this script to **customer.html**, **track.html**, and other customer pages:

```html
<!-- Before closing </body> tag -->
<script type="module" src="fcm-notification.js"></script>
```

### Step 6: Test Notifications

#### From Admin Panel:
1. Open `notificationadmin.html`
2. Fill in title and message
3. Click **Send Notification**
4. Customers with page open will see notification

#### From Firebase Console (Manual Test):
1. Go to **Firebase Console → Cloud Messaging**
2. Click **Send your first message**
3. Enter title, body
4. Click **Send test message**
5. Paste FCM token from browser console
6. Click **Test**

---

## 📱 How It Works

### For Customers:

1. **First Visit**: Browser asks "Allow notifications?"
2. **Click Allow**: FCM token generated & saved to Firestore
3. **Admin Sends**: Notification appears on all devices
4. **Foreground**: Shows in-app banner + browser notification
5. **Background**: Shows system notification (clicks open site)

### For Admins:

1. Open `notificationadmin.html`
2. Compose notification (title, message, audience)
3. Click send → Notification queued
4. All registered devices receive notification instantly

---

## 🔔 Notification Types

Current implementation saves to **Firestore** (`sentNotifications` collection).

To send actual push notifications, you need:

### Option A: Cloud Function (Recommended)

Create Firebase Cloud Function to send FCM messages:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.firestore
  .document('sentNotifications/{notifId}')
  .onCreate(async (snap, context) => {
    const notif = snap.data();
    
    // Get all FCM tokens
    const tokensSnapshot = await admin.firestore()
      .collection('fcmTokens')
      .get();
    
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
    
    // Send multicast message
    const message = {
      notification: {
        title: notif.title,
        body: notif.body
      },
      tokens: tokens
    };
    
    const response = await admin.messaging().sendMulticast(message);
    console.log('Sent:', response.successCount, 'Failed:', response.failureCount);
  });
```

Deploy: `firebase deploy --only functions`

### Option B: Direct API Call (Simple)

Update `notificationadmin.html` to call FCM HTTP v1 API:

```javascript
async function sendFCMNotification(title, body, tokens) {
  const accessToken = await getAccessToken(); // Need OAuth 2.0
  
  for (const token of tokens) {
    await fetch(`https://fcm.googleapis.com/v1/projects/covaiscrap/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          token: token,
          notification: {
            title: title,
            body: body
          }
        }
      })
    });
  }
}
```

---

## 🧪 Testing Checklist

- [ ] VAPID key added to `fcm-notification.js`
- [ ] Service worker registered (`firebase-messaging-sw.js`)
- [ ] Firestore rules allow token writes
- [ ] FCM script included in customer pages
- [ ] Browser shows "Allow notifications" prompt
- [ ] Token saved to Firestore `fcmTokens` collection
- [ ] Admin can see token count in `notificationadmin.html`
- [ ] Foreground notification shows in-app banner
- [ ] Background notification shows system notification
- [ ] Clicking notification opens website

---

## 🚨 Common Issues

### "Messaging: Requested entity was not found"
→ Enable **Firebase Cloud Messaging API (V1)** in Firebase Console

### "Service worker not found"
→ Make sure `firebase-messaging-sw.js` is in **root directory** (not in subfolder)

### "Permission denied" for Firestore
→ Update Firestore security rules (see Step 4)

### Notifications not appearing
→ Check browser console for errors
→ Verify VAPID key is correct
→ Test with Firebase Console "Send test message"

---

## 📊 Monitor Notifications

View in Firebase Console:
1. **Cloud Messaging** → See delivery reports
2. **Firestore** → `fcmTokens` collection (all registered devices)
3. **Firestore** → `sentNotifications` collection (notification history)

---

## 🔐 Security Notes

- VAPID key is **public** (safe to expose in client code)
- Server key is **private** (never expose in client code)
- Use Cloud Functions to keep server key secure
- Validate admin access before sending notifications

---

## 📞 Support

For Firebase Cloud Messaging issues:
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [FCM Web Setup](https://firebase.google.com/docs/cloud-messaging/js/client)
- [FCM Node.js Admin SDK](https://firebase.google.com/docs/cloud-messaging/admin/send-messages)

---

**Current Status:** ⚠️ Needs VAPID key configuration

**Next Step:** Get VAPID key from Firebase Console and update `fcm-notification.js`
