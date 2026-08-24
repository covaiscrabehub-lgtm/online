# How to Send Push Notifications to Customer Phones

## Current Setup Problem
❌ `notificationadmin.html` saves to Firebase Realtime Database
❌ Does NOT send actual push notifications to phones
❌ Customers won't get alerts

## Solution: 3 Methods

---

## Method 1: Firebase Console (Easiest)

### Step 1: Get Customer Tokens
1. Go to: https://console.firebase.google.com/
2. Select project: `covaiscrap`
3. Go to: Realtime Database
4. Navigate to: `/notificationTokens/`
5. Copy any token (long string starting with letters/numbers)

### Step 2: Send Notification
1. In Firebase Console, go to: **Cloud Messaging**
2. Click: **Send your first message**
3. Fill in:
   - **Notification title:** `New Scrap Rate Update`
   - **Notification text:** `Today's scrap rates have been updated!`
4. Click: **Next**
5. Select: **Single device**
6. Paste the **FCM token** you copied
7. Click: **Send test message**

✓ Customer phone receives notification!

---

## Method 2: Using Node.js Admin SDK (Backend)

### Step 1: Install Firebase Admin
```bash
npm install firebase-admin
```

### Step 2: Get Service Account Key
1. Go to: https://console.firebase.google.com/
2. Project Settings → Service Accounts
3. Click: **Generate new private key**
4. Save as: `serviceAccountKey.json`

### Step 3: Create Send Script
Create file: `send-notification.js`

```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://covaiscrap-default-rtdb.firebaseio.com'
});

// Get all customer tokens
async function sendNotificationToAll(title, body) {
  const db = admin.database();
  const tokensRef = db.ref('notificationTokens');
  
  const snapshot = await tokensRef.once('value');
  const tokens = [];
  
  snapshot.forEach((child) => {
    const data = child.val();
    if (data.token && data.enabled) {
      tokens.push(data.token);
    }
  });
  
  console.log(`Found ${tokens.length} tokens`);
  
  if (tokens.length === 0) {
    console.log('No tokens to send to');
    return;
  }
  
  // Send notification
  const message = {
    notification: {
      title: title,
      body: body
    },
    tokens: tokens
  };
  
  const response = await admin.messaging().sendEachForMulticast(message);
  
  console.log('Success:', response.successCount);
  console.log('Failed:', response.failureCount);
}

// Usage
sendNotificationToAll(
  'COVAI SCRAP HUB',
  'New scrap rates updated! Check the app now.'
).then(() => {
  console.log('Done!');
  process.exit();
});
```

### Step 4: Run Script
```bash
node send-notification.js
```

✓ Sends to ALL registered customers!

---

## Method 3: Update Admin Panel (Recommended)

Replace `notificationadmin.html` with FCM-enabled version.

### Option A: Quick Fix (Add Backend API)

Create `send-fcm.php` on your server:

```php
<?php
header('Content-Type: application/json');

// Get request
$input = json_decode(file_get_contents('php://input'), true);
$title = $input['title'];
$body = $input['message'];

// Your Firebase Server Key
$serverKey = 'YOUR_FIREBASE_SERVER_KEY_HERE';

// Get all tokens from Firebase
// (You need to fetch these from your Realtime Database)
$tokens = [
    'token1_here',
    'token2_here'
];

// Send via FCM API
$url = 'https://fcm.googleapis.com/fcm/send';

$notification = [
    'title' => $title,
    'body' => $body,
    'icon' => '/logo.jpeg',
    'click_action' => 'https://yoursite.com/customer.html'
];

$results = [];

foreach($tokens as $token){
    $data = [
        'to' => $token,
        'notification' => $notification
    ];
    
    $headers = [
        'Authorization: key=' . $serverKey,
        'Content-Type: application/json'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    $results[] = json_decode($result, true);
}

echo json_encode(['success' => true, 'sent' => count($results)]);
?>
```

### Option B: Use Firebase Cloud Functions

Create `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotificationToAll = functions.https.onCall(async (data, context) => {
  const { title, message } = data;
  
  // Get all tokens
  const db = admin.database();
  const snapshot = await db.ref('notificationTokens').once('value');
  
  const tokens = [];
  snapshot.forEach((child) => {
    const tokenData = child.val();
    if (tokenData.token && tokenData.enabled) {
      tokens.push(tokenData.token);
    }
  });
  
  if (tokens.length === 0) {
    return { success: false, error: 'No tokens found' };
  }
  
  // Send to all
  const payload = {
    notification: {
      title: title,
      body: message
    }
  };
  
  const response = await admin.messaging().sendEachForMulticast({
    ...payload,
    tokens: tokens
  });
  
  return {
    success: true,
    successCount: response.successCount,
    failureCount: response.failureCount
  };
});
```

Deploy:
```bash
firebase deploy --only functions
```

---

## Quick Test Right Now

### Using cURL (Command Line)

```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
-H "Authorization: key=YOUR_SERVER_KEY" \
-H "Content-Type: application/json" \
-d '{
  "to": "CUSTOMER_FCM_TOKEN_HERE",
  "notification": {
    "title": "Test from Covai Scrap Hub",
    "body": "This is a test notification!",
    "icon": "/logo.jpeg"
  }
}'
```

Replace:
- `YOUR_SERVER_KEY` - Get from Firebase Console → Project Settings → Cloud Messaging → Server Key
- `CUSTOMER_FCM_TOKEN_HERE` - Get from Realtime Database `/notificationTokens/`

---

## Get Your Firebase Server Key

1. Go to: https://console.firebase.google.com/
2. Select: `covaiscrap` project
3. Click: Settings (gear icon) → Project Settings
4. Go to: **Cloud Messaging** tab
5. Find: **Server key** (legacy)
6. Copy the long key

---

## Summary

**Easiest Right Now:**
1. Get token from: Firebase Console → Realtime Database → `/notificationTokens/`
2. Get server key from: Project Settings → Cloud Messaging
3. Use cURL command above
4. Customer phone gets notification!

**Best Long-term:**
Use Node.js script (Method 2) - sends to all customers automatically

**Need Help?**
Run: `node send-notification.js` (after setting up Method 2)
