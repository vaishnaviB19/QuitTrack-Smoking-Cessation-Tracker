# QuitTrack 🚭 https://quittrack.vercel.app/

QuitTrack is an open-source, full-stack web application that helps users reduce and quit smoking through structured tracking, goal setting, and progress visualization. It transforms daily smoking habits into actionable insights using data, charts, and motivation-driven features.

Built with the MERN stack, QuitTrack is designed to be simple, scalable, and practical for real-world use.

---

## ✨ Features

* **Authentication** – Secure user signup/login with JWT-based authorization.
* **Dashboard** – Centralized overview of goals, daily trends, streaks, and progress.
* **Cigarette Logging** – Simple daily logging with automatic data aggregation.
* **Goal Setting** – Personalized quit or reduction goals with baseline and deadlines.
* **Streak Tracking** – Tracks consecutive smoke-free or reduced-smoking days.
* **Health Timeline** – Visual health recovery milestones based on progress.
* **Savings Tracker** – Calculates money saved from reduced smoking.
* **Profile Management** – View user stats and manage sessions securely.

---

## 🛠 Tech Stack

### Frontend

* React
* React Router
* Axios
* Chart.js
* Framer Motion
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* RESTful APIs

### Database

* MongoDB
* Mongoose

---

## 🏗 Project Structure

```
QuitTrack/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16+ recommended)
* MongoDB (local or cloud)
* npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/QuitTrack.git
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Configure environment variables
   Create a `.env` file in the backend directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

5. Run the application

```bash
# backend
npm run dev

# frontend
npm start
```

---

## 📊 User Flow

1. User registers or logs in
2. Sets a smoking reduction or quit goal
3. Logs daily cigarette consumption
4. Dashboard updates charts, streaks, and progress
5. User tracks health recovery and savings

---

## 📌 Project Highlights

* Real-world habit tracking use case
* Clean and minimal UI
* Data-driven motivation system
* Modular and scalable architecture

---

## 🔮 Future Enhancements

* Push notifications and reminders
* Community and peer support features
* AI-driven insights and relapse prediction
* Mobile app version
* Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the MIT License.

---

## ⭐ Acknowledgements

If you find this project useful, consider giving it a star ⭐ to support the work.
