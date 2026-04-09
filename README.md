# 📦 Packaging Dashboard

A full-stack MERN product ordering dashboard for packaging design companies. Designers can upload mockups, and clients can browse and place orders — all with role-based JWT authentication.

## 🔗 Live Links

| Service  | URL                                                     |
| -------- | ------------------------------------------------------- |
| Frontend | https://packaging-dashboard-nv23.vercel.app/login       |
| Backend  | https://packaging-dashboard.onrender.com                |
| GitHub   | https://github.com/TanishaSaini0116/packaging-dashboard |

---

## ✨ Features

- 🔐 JWT Authentication with role-based access (Designer / Client)
- 🎨 Designers can upload and manage packaging mockups via Cloudinary
- 🛒 Clients can browse mockups and place orders
- 📊 Dashboard with order stats and activity
- 🎉 Confetti effect on successful order placement
- ⚡ Fast state management with Zustand
- ✅ Form validation with Zod

---

## 🛠️ Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Frontend         | React 18, Vite, Tailwind CSS        |
| State Management | Zustand                             |
| Animations       | Framer Motion                       |
| Backend          | Node.js, Express.js                 |
| Database         | MongoDB Atlas                       |
| Authentication   | JWT + bcryptjs                      |
| File Upload      | Multer + Cloudinary                 |
| Validation       | Zod                                 |
| Deployment       | Vercel (frontend), Render (backend) |

---

## 🗂️ Project Structure

```
packaging-dashboard/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard, Mockups, Upload, Orders
│   │   ├── components/      # Sidebar, Navbar, ProtectedRoute, Loader, ConfettiEffect
│   │   ├── store/           # Zustand stores (authStore, mockupStore, orderStore)
│   │   └── utils/           # Axios config
│   └── ...
│
└── server/                  # Express backend
    ├── controllers/         # authController, mockupController, orderController
    ├── models/              # User, Mockup, Order
    ├── routes/              # /api/auth, /api/mockups, /api/orders
    ├── middleware/          # JWT auth, Multer upload
    └── config/              # MongoDB, Cloudinary config
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/TanishaSaini0116/packaging-dashboard.git
cd packaging-dashboard
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env` file:

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Run the server:

```bash
node index.js
```

✅ Server running on http://localhost:8000

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
```

✅ App running on http://localhost:5173

---

## 🔌 API Documentation

### Base URL

- Local: `http://localhost:8000/api`
- Production: `https://packaging-dashboard.onrender.com/api`

---

### 🔐 Auth Routes

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            |
| POST   | `/auth/login`    | Login user        | No            |
| GET    | `/auth/profile`  | Get user profile  | Yes           |

#### Register

```json
POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "123456",
  "role": "designer"
}
```

#### Login

```json
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "123456"
}
```

---

### 🎨 Mockup Routes

| Method | Endpoint       | Description       | Auth Required       |
| ------ | -------------- | ----------------- | ------------------- |
| GET    | `/mockups`     | Get all mockups   | Yes                 |
| GET    | `/mockups/:id` | Get single mockup | Yes                 |
| POST   | `/mockups`     | Upload new mockup | Yes (Designer only) |
| PUT    | `/mockups/:id` | Update mockup     | Yes (Designer only) |
| DELETE | `/mockups/:id` | Delete mockup     | Yes (Designer only) |

#### Upload Mockup (multipart/form-data)

```
POST /api/mockups
Fields: title, description, price, category, tags, image (file)
```

---

### 🛒 Order Routes

| Method | Endpoint             | Description         | Auth Required       |
| ------ | -------------------- | ------------------- | ------------------- |
| GET    | `/orders`            | Get orders          | Yes                 |
| GET    | `/orders/:id`        | Get single order    | Yes                 |
| POST   | `/orders`            | Place new order     | Yes (Client only)   |
| PATCH  | `/orders/:id/status` | Update order status | Yes (Designer only) |

#### Place Order

```json
POST /api/orders
{
  "mockupId": "64f...",
  "quantity": 500,
  "notes": "Matte finish please"
}
```

---

## 👥 Roles

| Role     | Permissions                                          |
| -------- | ---------------------------------------------------- |
| Designer | Upload mockups, view all orders, update order status |
| Client   | Browse mockups, place orders, view own orders        |

---

## 🚀 Deployment

### Frontend (Vercel)

1. Import GitHub repo on Vercel
2. Set Root Directory → `client`
3. Add environment variable: `VITE_API_URL=https://packaging-dashboard.onrender.com/api`
4. Deploy

### Backend (Render)

1. Connect GitHub repo on Render
2. Set Root Directory → `server`
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Add all environment variables
6. Deploy

---

## 📝 Note

Render free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.
