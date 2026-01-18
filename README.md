# Company Employee Billing System

## Production Deployment

This is a standalone HTML/JavaScript billing system that runs directly in the browser.

**Main File:** `public/billing.source.html` or `public/billing.html`

**No build step required** - Simply serve the `public/` folder via:
- File system (`file:///path/to/public/billing.html`)
- Any web server (Apache, Nginx, Netlify, Vercel, etc.)

## Features

- 📊 Company and employee management
- 💳 Bill creation and tracking
- 💰 Payment processing  
- ☁️ Firebase cloud sync (real-time multi-device)
- 🖨️ Thermal printer support (80mm receipts)
- 📱 Responsive design
- 🎨 Modern glassmorphism UI
- 📈 Monthly billing reports

## Files Structure

```
public/
  ├── _sdk/              # SDK shims for data and element management
  │   ├── data_sdk.js    # Data persistence with Firebase sync
  │   └── element_sdk.js # Element SDK stub
  ├── billing.html       # Entry point (redirects to billing.source.html)
  ├── billing.source.html # Main application (self-contained, 151KB)
  ├── favicon.ico        # Browser icon
  └── robots.txt         # SEO configuration
```

## Quick Start

### Option 1: Open Directly in Browser

```bash
# Windows
start public/billing.html

# Mac
open public/billing.html

# Linux
xdg-open public/billing.html
```

### Option 2: Local Web Server

```bash
# Using Python
cd public
python -m http.server 8000
# Open http://localhost:8000/billing.html

# Using Node.js (npx)
npx serve public
# Open http://localhost:3000/billing.html

# Using PHP
cd public
php -S localhost:8000
# Open http://localhost:8000/billing.html
```

### Option 3: Deploy to Hosting

Upload the `public/` folder to any static hosting provider:
- **Netlify:** Drag and drop the `public/` folder
- **Vercel:** `vercel --prod public/`
- **GitHub Pages:** Push to `gh-pages` branch
- **Firebase Hosting:** `firebase deploy --only hosting`

## Firebase Configuration

Firebase credentials are embedded in `billing.source.html` (lines 12-19).

To use your own Firebase project:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy your Firebase config
4. Replace the config in `public/billing.source.html`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Technology Stack

- **Pure HTML5/CSS3/JavaScript** - No framework dependencies
- **Firebase Firestore** - Cloud database for multi-device sync
- **Tailwind CSS** - Loaded via CDN for styling
- **Google Fonts (Inter)** - Modern typography

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Modern mobile browsers

## Data Storage

- **Primary:** Firebase Firestore (cloud sync)
- **Fallback:** localStorage (offline-first)
- **Sync:** Automatic bidirectional sync when online

## Development

This is a production-ready standalone application. **No build step or dependencies required.**

To modify:
1. Edit `public/billing.source.html` directly
2. Refresh browser to see changes
3. No compilation needed

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.
