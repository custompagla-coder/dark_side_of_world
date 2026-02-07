# 🎬 DriveStream - Modern Video Player

A beautiful, modern video streaming platform with Catbox integration.

---

## ✨ Features

- 🎥 **Modern YouTube-style player** with Plyr.js
- ⏪⏩ **Double-tap to skip** (10 seconds forward/backward)
- 📱 **Mobile responsive** with touch controls
- 🎨 **Premium dark theme** with smooth animations
- 🔍 **Search functionality**
- 📥 **Download support**
- ⚡ **100% Frontend** - No backend required

---

## 🚀 Quick Setup (3 Steps)

### **1. Upload Videos to Catbox**
- Go to: https://catbox.moe/
- Upload your videos (200MB limit per file)
- Copy the URLs

### **2. Add Videos to Config**
- Use `generate-video-list.html` for bulk conversion
- Or edit `src/config/videoList.js` manually

### **3. Enable and Run**
- Set `ENABLED: true` in `videoList.js`
- Run: `npm run dev`
- Open: http://localhost:5173

**Done!** 🎉

---

## 📖 Full Guide

See **`CATBOX_SETUP.md`** for detailed instructions.

---

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/      # React components (VideoPlayer, VideoCard, etc.)
├── pages/          # Pages (Home, Watch, About)
├── config/         
│   └── videoList.js # ← Add your videos here!
├── services/       # Video fetching logic
└── utils/          # Helper functions
```

---

## 🎯 Key Files

- **`src/config/videoList.js`** - Your video configuration
- **`generate-video-list.html`** - Bulk URL converter tool
- **`CATBOX_SETUP.md`** - Setup guide

---

## 🎨 Technologies

- React 19.2
- Vite 7.2
- Plyr.js (video player)
- React Router
- Modern CSS with animations

---

## 📱 Mobile Features

- Touch-optimized controls (44px+ targets)
- Double-tap to skip
- Landscape mode support
- Responsive grid layout
- No horizontal scroll

---

## ⚙️ Configuration

Edit `src/config/videoList.js`:

```javascript
export const MANUAL_VIDEOS = [
    {
        id: 'video-1',
        title: 'My Video',
        url: 'https://files.catbox.moe/abc123.mp4',
        duration: '5:30',    // Optional
        resolution: '1080p', // Optional
    },
];

export const MANUAL_CONFIG = {
    ENABLED: true,  // Must be true to use Catbox
};
```

---

## 🚢 Deployment

```bash
# Build production files
npm run build

# Deploy 'dist/' folder to:
# - Netlify (drag & drop)
# - Vercel
# - GitHub Pages
# - Any static host
```

---

## 📝 License

MIT License - Free to use for any purpose!

---

## 🎬 Ready to Start?

1. **Read:** `CATBOX_SETUP.md`
2. **Upload:** Videos to Catbox
3. **Configure:** `videoList.js`
4. **Enjoy!** 🚀

---

**Questions? Check `CATBOX_SETUP.md` for full instructions!** ✨
