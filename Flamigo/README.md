


# 🌿 FloraLingo

**FloraLingo** is an interactive app that lets you capture or upload an image of a plant, translate its "vibe" into a fun quote, and even chat with it! If it’s not a plant, the app adapts its responses accordingly. Built using a Python-powered backend and a Node.js + React frontend, it integrates image classification, quote generation, and real-time AI chat.

---

## 📁 Project Structure

```

src/
├── backend/
│   ├── server.js
│   ├── analyzer/
│   │   └── analyzer.py
│   └── .env
└── frontend/
└── UI.jsx

````

---

## ⚙️ Prerequisites

### Backend:
- Node.js ≥ 18.x
- Python ≥ 3.8
- Required Python packages (TensorFlow, Flask, etc.)

### Frontend:
- React (via Vite, Create React App, etc.)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/floralingo.git
cd floralingo
````

---

### 2. Backend Setup (`src/backend`)

#### Install Node dependencies:

```bash
cd src/backend
npm install
```

#### Install Python dependencies:

```bash
pip install tensorflow flask pillow
```

> 💡 Make sure the Python version used here matches the one in your system path or virtual environment.

#### Update `.env` file:

Create a `.env` file in `src/backend`:

```env
PORT=5000
PYTHON_PATH=/usr/bin/python3   # Replace with your actual python path
```

To find your Python path:

```bash
which python3
```

Replace `/usr/bin/python3` with the output if it's different.

---

### 3. Frontend Setup (`src/frontend`)

```bash
cd ../frontend
npm install
npm run dev
```

> Adjust the frontend to point API requests to the correct backend server (e.g., `http://localhost:5000/api`).

---

## 🚀 Running the App

### Start Backend

```bash
cd src/backend
node server.js
```

### Start Frontend

```bash
cd ../frontend
npm run dev
```

Now open your browser and go to:

```
http://localhost:5173
```

---

## 📸 Features

* 🌱 Upload or capture plant images
* 🤖 Image classification (plant vs non-plant)
* 💬 Chat with plants (or non-plants!)
* 🔥 Uses Groq AI for interactive chat
* 🎨 Beautiful UI in React

---

## 📦 Deployment Notes

* Make sure `.env` values are correctly set in production.
* On deployment servers, Python must be accessible at the path specified in `.env`.

---

## 🙏 Credits

* TensorFlow for plant detection
* Groq AI for conversational backend
* OpenAI + React for inspiration and implementation

---

