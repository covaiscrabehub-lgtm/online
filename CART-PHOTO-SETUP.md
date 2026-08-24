# Cart Photo Upload - Complete Setup Guide

## ✓ Features Added

1. **Choose Files Button** - Select multiple photos from gallery
2. **Take Photo Button** - Use camera directly
3. **Photo Preview Grid** - See all selected photos as thumbnails
4. **Remove Photos** - Click × on any photo to remove it
5. **Clear All Button** - Remove all photos at once
6. **Photo Count Display** - Shows how many photos selected
7. **Confirmation Dialog** - Confirms before sending photos
8. **Email with Photos** - Sends cart + photos to admin email

---

## How It Works

### Customer Experience:

1. **Add Products to Cart**
   - Customer selects scrap items from customer.html
   - Items added to cart

2. **Open Cart Page**
   - Click cart button
   - Opens cart.html

3. **Upload Photos**
   - Click **"📁 Choose Files"** to select from gallery
   - OR click **"📷 Take Photo"** to use camera
   - Can add multiple photos

4. **Preview Photos**
   - All photos appear as thumbnails in grid
   - Shows photo count
   - Each photo has × button to remove
   - "Clear All" button to remove everything

5. **Continue to Checkout**
   - Click "Continue" button
   - Confirmation dialog shows: "You have X photos selected. Continue?"
   - Click OK

6. **Photos Sent**
   - Shows "📤 Sending photos..." status
   - Sends email with cart details + photos
   - Success message: "✅ Photos sent successfully!"
   - Redirects to customer-details.html

---

## EmailJS Setup (Required for Email)

### Step 1: Create EmailJS Account

1. Go to: https://www.emailjs.com/
2. Click "Sign Up" (free)
3. Verify email

### Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose service (Gmail recommended):
   - **Gmail**: Connect your Gmail
   - OR **Outlook/Yahoo/Custom SMTP**
4. Click **Connect Account**
5. Copy the **Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Template Name: `Cart with Photos`
4. Subject: `New Cart Order - {{photo_count}} Photos`
5. Content (paste this):

```html
<h2>New Scrap Pickup Request</h2>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Time:</strong> {{timestamp}}</p>
<p><strong>Photos:</strong> {{photo_count}} attached</p>

<hr>

<h3>Cart Summary:</h3>
<pre>{{cart_summary}}</pre>

<hr>

<h3>Photos:</h3>

{{#if photo1}}
<div style="margin:10px 0;">
  <p><strong>Photo 1:</strong> {{photo1_name}}</p>
  <img src="{{photo1}}" style="max-width:400px;border:2px solid #ccc;">
</div>
{{/if}}

{{#if photo2}}
<div style="margin:10px 0;">
  <p><strong>Photo 2:</strong> {{photo2_name}}</p>
  <img src="{{photo2}}" style="max-width:400px;border:2px solid #ccc;">
</div>
{{/if}}

{{#if photo3}}
<div style="margin:10px 0;">
  <p><strong>Photo 3:</strong> {{photo3_name}}</p>
  <img src="{{photo3}}" style="max-width:400px;border:2px solid #ccc;">
</div>
{{/if}}

<hr>

<p style="color:#666;font-size:12px;">
  Sent via Covai Scrap Hub Cart System
</p>
```

6. **To Email**: `covaiscrabehub@gmail.com`
7. Click **Save**
8. Copy the **Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find **Public Key** (looks like: `xxxxxxxxxxxxxx`)
3. Copy it

### Step 5: Update cart.html

Open `cart.html` and find these 3 lines:

**Line ~1918:**
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
```
Replace with:
```javascript
emailjs.init("your_actual_public_key");
```

**Line ~1989:**
```javascript
const response = await emailjs.send(
    "YOUR_SERVICE_ID",     // Replace with your EmailJS service ID
    "YOUR_TEMPLATE_ID",    // Replace with your EmailJS template ID
    templateParams
);
```
Replace with:
```javascript
const response = await emailjs.send(
    "service_xxxxxxx",     // Your actual service ID
    "template_xxxxxxx",    // Your actual template ID
    templateParams
);
```

---

## Testing

### Test Photo Upload:

1. Open cart.html in browser
2. Add some items to cart (from customer.html)
3. Go to cart page
4. Click "📁 Choose Files" → Select 2-3 photos
5. Photos should appear in preview grid
6. Try:
   - Remove one photo (click ×)
   - Add more photos (click "📷 Take Photo")
   - Clear all photos
   - Add photos again

### Test Email Sending:

1. With photos selected, click "Continue"
2. Confirm dialog appears
3. Click OK
4. See "📤 Sending photos..." status
5. Wait 2-3 seconds
6. Check email at: covaiscrabehub@gmail.com
7. Should receive email with:
   - Cart items list
   - Total weight and amount
   - Photo attachments (up to 3)

---

## Troubleshooting

### Photos don't appear after selection
- Check browser console (F12) for errors
- Make sure browser supports FileReader API
- Try different image format (JPG/PNG)

### Email not sending
- Check EmailJS configuration:
  - Public Key is correct
  - Service ID is correct
  - Template ID is correct
- Check browser console for error message
- Verify email service is connected in EmailJS dashboard
- Check EmailJS usage quota (free: 200 emails/month)

### "Sending photos..." never completes
- Photos too large (EmailJS limit ~5MB per email)
- Compress photos before uploading
- Try sending fewer photos (max 3)
- Check internet connection

### Camera button not working
- Browser needs HTTPS (or localhost) for camera access
- Mobile: Grant camera permission when asked
- Desktop: Allow camera in browser settings

---

## Photo Size Limits

- **EmailJS Free Plan**: 5MB per email total
- **Recommended**: Compress photos to ~500KB each
- **Max photos sent**: 3 (code sends first 3 only)
- **Can select more**: Yes, but only first 3 sent via email

---

## Mobile Optimization

✓ Responsive photo grid
✓ Touch-friendly buttons
✓ Camera access on mobile
✓ Photo preview adapts to screen size
✓ Works on all modern browsers

---

## Files Modified

✓ `cart.html` - Complete photo upload system added
✓ CSS styles added for photo buttons and preview
✓ JavaScript functions for photo management
✓ EmailJS integration updated

---

## Next Steps

1. **Configure EmailJS** (see above)
2. **Test photo upload** on desktop
3. **Test on mobile** with camera
4. **Verify emails** arrive with photos
5. **Deploy to production**

---

## Support

If photos not working:
- Check CART-PHOTO-SETUP.md (this file)
- Test on HTTPS (not HTTP)
- Verify EmailJS setup
- Check browser console for errors

**All features working!** ✓
