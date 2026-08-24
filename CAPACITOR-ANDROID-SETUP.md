# Covai Scrap Hub - Android App Setup with Capacitor

## ✅ Files Created/Modified

### 1. package.json
**Location:** `./package.json`
**Status:** ✓ Updated with Capacitor dependencies

### 2. capacitor.config.json
**Location:** `./capacitor.config.json`
**Status:** ✓ Created with Android configuration

### 3. capacitor.config.ts
**Location:** `./capacitor.config.ts`
**Status:** ✓ Created TypeScript config

### 4. .capacitor.gitignore
**Location:** `./.capacitor.gitignore`
**Status:** ✓ Created

---

## 📋 Prerequisites

Before running commands, ensure you have:

1. **Node.js** (v16 or higher)
   ```bash
   node --version
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Android Studio** (latest version)
   - Download from: https://developer.android.com/studio

4. **Java JDK 17**
   - Download from: https://www.oracle.com/java/technologies/downloads/

5. **Android SDK** (install via Android Studio)
   - SDK Platform 33 (Android 13)
   - SDK Platform 26 (Android 8.0 minimum)
   - SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools

---

## 🚀 Step-by-Step Build Commands

### Step 1: Install Node Modules
```bash
cd "c:\Users\MUTHU KRISHNAN\Downloads\covai-main\covai-main"
npm install
```

**What this does:**
- Installs all Capacitor dependencies
- Downloads Android platform tools
- Sets up development environment

**Expected output:**
```
added 245 packages in 45s
```

---

### Step 2: Initialize Capacitor
```bash
npx cap init "Covai Scrap Hub" com.covaiscraphub.app
```

**What this does:**
- Initializes Capacitor project
- Sets app name to "Covai Scrap Hub"
- Sets app ID to com.covaiscraphub.app

**Expected output:**
```
✔ Initializing Capacitor project in...
```

---

### Step 3: Add Android Platform
```bash
npx cap add android
```

**What this does:**
- Creates `android/` directory
- Generates Android project files
- Sets up Gradle build system
- Creates manifest and configuration

**Expected output:**
```
✔ Adding native android project in android in 3.50s
✔ Syncing Gradle in 25.32s
✔ add in 29.43s
✔ Copying web assets from . to android\app\src\main\assets\public in 1.23s
✔ Creating capacitor.config.json in android\app\src\main\assets in 12.05ms
✔ copy android in 1.25s
✔ Updating Android plugins in 1.81ms
✔ update android in 23.10ms
```

**Directory created:**
```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       ├── res/
│   │       └── assets/
│   ├── build.gradle
│   └── capacitor.build.gradle
├── gradle/
├── build.gradle
└── settings.gradle
```

---

### Step 4: Sync Web Assets
```bash
npx cap sync android
```

**What this does:**
- Copies all HTML/CSS/JS files to Android assets
- Updates AndroidManifest.xml
- Configures permissions
- Updates plugins

**Expected output:**
```
✔ Copying web assets from . to android\app\src\main\assets\public in 856.40ms
✔ Creating capacitor.config.json in android\app\src\main\assets in 2.26ms
✔ copy android in 860.97ms
✔ Updating Android plugins in 3.16ms
✔ update android in 21.98ms
✔ Syncing Gradle in 0.99ms
✔ sync android in 891.87ms
```

---

### Step 5: Configure App Icon

#### Option A: Automatic (using Capacitor resources)

1. Install resources tool:
```bash
npm install -g @capacitor/assets
```

2. Create resources directory:
```bash
mkdir resources
```

3. Copy logo.jpeg to resources:
```bash
copy logo.jpeg resources\icon.png
```

4. Generate all icon sizes:
```bash
npx capacitor-assets generate
```

#### Option B: Manual Icon Setup

Create icon files manually in Android project:

**Required icon sizes:**

```
android/app/src/main/res/
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png (192x192)
```

**Generate icons from logo.jpeg:**

1. Open logo.jpeg in image editor
2. Export as PNG at these sizes:
   - 48x48 → mipmap-mdpi/ic_launcher.png
   - 72x72 → mipmap-hdpi/ic_launcher.png
   - 96x96 → mipmap-xhdpi/ic_launcher.png
   - 144x144 → mipmap-xxhdpi/ic_launcher.png
   - 192x192 → mipmap-xxxhdpi/ic_launcher.png

---

### Step 6: Configure Android Permissions

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.covaiscraphub.app">

    <!-- Internet Permission -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <!-- Camera Permission (for photo upload) -->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- Storage Permissions -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />

    <!-- Location Permissions (for GPS tracking) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <!-- Notification Permission (Android 13+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Covai Scrap Hub"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:networkSecurityConfig="@xml/network_security_config">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:theme="@style/AppTheme.NoActionBarLaunch">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
```

---

### Step 7: Configure Network Security

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
        <domain includeSubdomains="true">firebase.googleapis.com</domain>
        <domain includeSubdomains="true">firebaseio.com</domain>
    </domain-config>
</network-security-config>
```

---

### Step 8: Configure File Provider

Create `android/app/src/main/res/xml/file_paths.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <files-path name="files" path="." />
    <cache-path name="cache" path="." />
    <external-path name="external" path="." />
    <external-files-path name="external_files" path="." />
    <external-cache-path name="external_cache" path="." />
</paths>
```

---

### Step 9: Update build.gradle (App Level)

Edit `android/app/build.gradle`:

```gradle
android {
    namespace "com.covaiscraphub.app"
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.covaiscraphub.app"
        minSdkVersion 26  // Android 8.0+
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

### Step 10: Build Debug APK

```bash
cd android
./gradlew assembleDebug
```

**For Windows:**
```bash
cd android
gradlew.bat assembleDebug
```

**What this does:**
- Compiles Android project
- Packages web assets
- Generates debug APK
- Signs with debug certificate

**Expected output:**
```
> Task :app:assembleDebug

BUILD SUCCESSFUL in 2m 15s
```

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Step 11: Build Release APK

#### Generate Signing Key:
```bash
cd android
keytool -genkey -v -keystore covai-scrap-hub.keystore -alias covai-key -keyalg RSA -keysize 2048 -validity 10000
```

**Enter when prompted:**
- Password: [Create secure password]
- Name: Covai Scrap Hub
- Organization: Covai Scrap Hub
- City: Coimbatore
- State: Tamil Nadu
- Country: IN

#### Update capacitor.config.json:
```json
"buildOptions": {
  "keystorePath": "android/covai-scrap-hub.keystore",
  "keystorePassword": "YOUR_PASSWORD",
  "keystoreAlias": "covai-key",
  "keystoreAliasPassword": "YOUR_PASSWORD",
  "releaseType": "APK"
}
```

#### Build Release APK:
```bash
cd android
./gradlew assembleRelease
```

**Windows:**
```bash
cd android
gradlew.bat assembleRelease
```

**APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

### Step 12: Build AAB (For Google Play)

```bash
cd android
./gradlew bundleRelease
```

**Windows:**
```bash
cd android
gradlew.bat bundleRelease
```

**AAB Location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🔧 Troubleshooting Commands

### Clear Cache and Rebuild:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Check Gradle Version:
```bash
cd android
./gradlew --version
```

### List All Tasks:
```bash
cd android
./gradlew tasks
```

### Sync Assets Again:
```bash
npx cap sync android
```

### Open in Android Studio:
```bash
npx cap open android
```

---

## 📱 Testing on Device

### Install Debug APK:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### View Logs:
```bash
adb logcat | findstr Capacitor
```

### Restart App:
```bash
adb shell am force-stop com.covaiscraphub.app
adb shell am start -n com.covaiscraphub.app/.MainActivity
```

---

## 📂 Final Directory Structure

```
covai-main/
├── android/                        # Android project (generated)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── assets/public/      # Your web files
│   │   │   ├── res/
│   │   │   │   ├── mipmap-*/        # App icons
│   │   │   │   └── xml/             # Config files
│   │   │   └── java/
│   │   ├── build.gradle
│   │   └── capacitor.build.gradle
│   ├── gradle/
│   ├── build.gradle
│   └── settings.gradle
├── node_modules/                   # Dependencies (generated)
├── package.json                    # ✓ Updated
├── capacitor.config.json           # ✓ Created
├── capacitor.config.ts             # ✓ Created
├── .capacitor.gitignore            # ✓ Created
├── index.html                      # Your entry point
├── customer.html
├── cart.html
├── logo.jpeg                       # App icon source
└── [all other website files]
```

---

## ✅ Verification Checklist

Before building APK:

- [ ] Node.js installed (v16+)
- [ ] npm install completed
- [ ] Android Studio installed
- [ ] Java JDK 17 installed
- [ ] Android SDK installed
- [ ] capacitor.config.json created
- [ ] npx cap add android completed
- [ ] AndroidManifest.xml configured
- [ ] Permissions added
- [ ] Icons generated
- [ ] network_security_config.xml created
- [ ] file_paths.xml created

---

## 🎯 Quick Command Summary

```bash
# 1. Install dependencies
npm install

# 2. Initialize Capacitor (if not already done)
npx cap init "Covai Scrap Hub" com.covaiscraphub.app

# 3. Add Android platform
npx cap add android

# 4. Sync web assets
npx cap sync android

# 5. Generate icons (optional)
npx capacitor-assets generate

# 6. Build debug APK
cd android && gradlew.bat assembleDebug

# 7. Build release APK (after keystore setup)
cd android && gradlew.bat assembleRelease

# 8. Open in Android Studio
npx cap open android
```

---

## 📦 Output Files

After successful build:

**Debug APK:**
```
android/app/build/outputs/apk/debug/app-debug.apk
Size: ~10-15 MB
Ready for testing
```

**Release APK:**
```
android/app/build/outputs/apk/release/app-release.apk
Size: ~8-12 MB
Ready for distribution
```

**AAB (Google Play):**
```
android/app/build/outputs/bundle/release/app-release.aab
Size: ~7-10 MB
Upload to Play Console
```

---

## 🚀 Next Steps

1. Test debug APK on physical device
2. Verify all features work
3. Generate release keystore
4. Build signed release APK
5. Test release APK
6. Upload to Google Play Console (optional)
7. Distribute APK directly (alternative)

---

## 📞 Support

If build fails, check:
1. Android Studio SDK Manager
2. Java version (must be JDK 17)
3. Gradle version compatibility
4. Internet connection (for dependencies)
5. Disk space (need ~5GB free)

---

**Status:** ✓ All configuration files created
**Ready:** Yes
**Next:** Run `npm install` to begin

