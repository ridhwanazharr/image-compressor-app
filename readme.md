# 🖼️ Image Converter Mini App

A simple local web app that converts uploaded images into multiple responsive sizes (`450px`, `750px`, `1200px`) using **[Sharp](https://sharp.pixelplumbing.com/)**.  
It automatically generates **AVIF** images for modern browsers, plus a **PNG fallback**, and gives you a ready-to-use `<picture>` HTML snippet.  

---

## 🚀 Features
- Upload a single image from your browser.
- Convert to **450, 750, and 1200px** AVIF images.
- Generate a **450px PNG fallback**.
- Auto-generate `<picture>` element HTML code with:
  - Custom path
  - Custom CSS class
  - Custom alt text
- Copy the snippet to clipboard with one click.
- Download converted images individually.
- Output folder auto-clears on server startup.

---

## 🛠️ Requirements
- Node.js (v18+ recommended)
- npm or yarn

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/image-converter-mini-app.git
cd image-converter-mini-app
npm install
