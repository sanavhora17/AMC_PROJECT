# 🛠️ AMC Pro — Annual Maintenance Contract Management System

A full-stack web application for managing Annual Maintenance Contracts with three separate portals — **Admin**, **Customer**, and **Technician**.

---

## 🌐 Live URLs

| Portal | URL |
|--------|-----|
| 🖥️ Frontend (All Portals) | `https://your-project.vercel.app` |
| ⚙️ Backend API | `https://your-backend.onrender.com` |

> Update these URLs after deployment.

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Manage users, technicians, services, AMC plans, contracts, payments, reports |
| **Customer** | Register, login, book services, manage AMC plans, view contracts, make payments |
| **Technician** | Login, view assigned tasks, update service request status |

---

## 🧰 Tech Stack

### Frontend
- React.js 19
- React Router DOM v7
- Tailwind CSS
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv, cors, crypto

### Database
- MongoDB Atlas (cloud)

---

## 📁 Folder Structure

```
AMC-Project/
├── backend/
│   ├── controllers/
│   │   ├── contractController.js
│   │   └── planController.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   ├── Contract.js
│   │   ├── Plan.js
│   │   ├── Service.js
│   │   ├── ServiceRequest.js
│   │   ├── Technician.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── contractRoutes.js
│   │   ├── planRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── technicianRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── Sidebar.js
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.js
    │   │   │   ├── AdminLogin.js
    │   │   │   ├── AMCContracts.js
    │   │   │   ├── AmcPlans.js
    │   │   │   ├── AssignTask.js
    │   │   │   ├── ManageServices.js
    │   │   │   ├── ManageTechnicians.js
    │   │   │   ├── PaymentHistory.js
    │   │   │   ├── ReportAnalysis.js
    │   │   │   ├── ServiceRequest.js
    │   │   │   └── UserList.js
    │   │   ├── customer/
    │   │   │   ├── AboutPage.js
    │   │   │   ├── CustomerDashboard.js
    │   │   │   ├── CustomerLogin.js
    │   │   │   ├── CustomerPlans.js
    │   │   │   ├── CustomerRegister.js
    │   │   │   ├── CustomerServicePage.js
    │   │   │   ├── LandingPage.js
    │   │   │   ├── Payment.js
    │   │   │   ├── Profile.js
    │   │   │   ├── ServicesPage.js
    │   │   │   └── SuccessStories.js
    │   │   └── technician/
    │   │       ├── TechnicianDashboard.js
    │   │       └── TechnicianLogin.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```                                                    

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AMC-Project.git
cd AMC-Project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

Start the backend server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) |


## 🔗 API Endpoints

| Route | Description |
|-------|-------------|
| `/api/users` | Customer auth & profile |
| `/api/admin` | Admin operations |
| `/api/technicians` | Technician management |
| `/api/services` | Service management |
| `/api/requests` | Service requests |
| `/api/bookings` | Booking management |
| `/api/plans` | AMC plans |
| `/api/contracts` | AMC contracts |

---


---

## 👨‍💻 Developer

Built with ❤️ — AMC Pro Management System"# AMC Project" 
