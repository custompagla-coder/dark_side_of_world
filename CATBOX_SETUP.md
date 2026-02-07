# 🎬 DriveStream - Catbox Setup Guide

## Simple 3-Step Setup

---

## Step 1: Upload Videos to Catbox

1. **Go to:** https://catbox.moe/
2. **Drag & drop** your video files (or click "Choose files")
3. **Wait for upload**
4. **Copy each URL** you get

**Example URL:** `https://files.catbox.moe/abc123.mp4`

**Limits:**
- 200MB per file
- Unlimited number of files
- Files never expire
- No account needed

---

## Step 2: Generate Video List

### **Option A: Use the Generator Tool (For many videos)**

1. **Open:** `generate-video-list.html` (double-click it)
2. **Paste all URLs** (one per line) into the text box
3. **Click "Generate Config"**
4. **Click "Copy to Clipboard"**
5. **Paste into:** `src/config/videoList.js`
6. **Done!** ✅

### **Option B: Manually Edit (For few videos)**

Open: `src/config/videoList.js`

Replace the example with your videos:

```javascript
export const MANUAL_VIDEOS = [
    {
        id: 'video-1',
        title: 'My Video Title',               // ← Video name
        url: 'https://files.catbox.moe/abc123.mp4', // ← Your Catbox URL
        duration: '5:30',                       // Optional (MM:SS)
        resolution: '1080p',                    // Optional
    },
    {
        id: 'video-2',
        title: 'Another Video',
        url: 'https://files.catbox.moe/def456.mp4',
    },
    // Add more videos by copying the { } block above
];

export const MANUAL_CONFIG = {
    ENABLED: true,  // ← Must be true!
    AUTO_THUMBNAIL: true,
};
```

---

## Step 3: Enable and Test

1. **Make sure:** `ENABLED: true` in `src/config/videoList.js`
2. **Refresh browser** (Ctrl+R or F5)
3. **Your videos appear!** 🎉

---

## 📋 Quick Example

**After uploading to Catbox:**

```javascript
export const MANUAL_VIDEOS = [
    {
        id: 'video-1',
        title: 'Funny Cats',
        url: 'https://files.catbox.moe/a1b2c3.mp4',
    },
    {
        id: 'video-2',
        title: 'Cooking Tutorial',
        url: 'https://files.catbox.moe/d4e5f6.mp4',
    },
];

export const MANUAL_CONFIG = {
    ENABLED: true,  // ✅ Enabled
};
```

**Save, refresh → Videos appear!** ✨

---

## 🎯 Tips

### **For Large Files (>200MB):**
- Split video into parts OR
- Use Pixeldrain.com instead (unlimited size)

### **Thumbnails:**
- Auto-generated as placeholders
- Or upload custom thumbnail to Catbox and add URL

### **Video Titles:**
- Auto-extracted from filename
- Or edit manually in config

---

## ⚡ Tools Included

- **`generate-video-list.html`** - Bulk URL converter
- **`src/config/videoList.js`** - Your video configuration

---

## ❓ Troubleshooting

**Videos don't appear?**
- Check `ENABLED: true` in `MANUAL_CONFIG`
- Check URLs are correct (test in browser)
- Check console (F12) for errors

**Video won't play?**
- Make sure URL ends in `.mp4` (or `.webm`, `.mov`)
- Test URL directly in browser
- Check file format (MP4 works best)

---

## 📁 File Locations

```
Video Player/
├── generate-video-list.html    ← Tool to convert URLs
├── src/
│   └── config/
│       └── videoList.js         ← Add your videos here
```

---

## 🚀 That's It!

**Total time:** 5-10 minutes  
**Cost:** FREE  
**Works:** 100% frontend, no backend needed

---

**Need help? Questions about Catbox? Just ask!** 🎬✨
