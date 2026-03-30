# 🚀 How to Run Linx

## ✅ Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- A terminal / command prompt

---

## 📦 Step 1 — Install Dependencies

### Backend
```bash
cd Linx-main/Backend
npm install
```

### Frontend
```bash
cd Linx-main/Frontend
npm install
```

---

## ▶️ Step 2 — Start MongoDB

Make sure MongoDB is running on your machine.

**Windows:**
```bash
mongod
```

> MongoDB runs on `mongodb://127.0.0.1:27017` by default.

---

## ▶️ Step 3 — Start the Backend

Open a terminal and run:

```bash
cd Linx-main/Backend
node server.js
```

Backend runs on → **http://localhost:5000**

On first run, an admin account is auto-created:
- Email: `admin@linx.app`
- Password: `admin123`

---

## ▶️ Step 4 — Start the Frontend

Open a **second terminal** and run:

```bash
cd Linx-main/Frontend
npm start
```

Frontend runs on → **http://localhost:3000**

---

## 🌐 Open in Browser

Go to: **http://localhost:3000**

---

## 📁 Project Structure

```
Linx-main/
├── Backend/
│   └── server.js       → Express + MongoDB API (port 5000)
└── Frontend/
    └── src/            → React app (port 3000)
```

---

## ⚠️ Common Issues

| Problem | Fix |
|---|---|
| `mongod` not found | Install MongoDB and add it to PATH |
| Port 5000 already in use | Kill the process using port 5000 or change the port in `server.js` |
| `react-scripts` not found | Run `npm install` inside the Frontend folder |
| Frontend can't reach backend | Make sure backend is running on port 5000 |
