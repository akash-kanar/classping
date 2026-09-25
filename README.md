# 📚 ClassPing

**ClassPing** is a smart college class reminder and timetable management web application built to help students organize their academic schedules, manage timetable changes, and receive timely class notifications.

It allows students to upload their timetable and holiday calendar, automatically organize classes, and receive reminders before each scheduled class.

---

## ✨ Features

* 🔐 **Secure Authentication**

  * JWT-based authentication
  * Student and Admin roles
  * User profile management

* 📅 **Smart Timetable Management**

  * Upload timetable as **Image, PDF, Excel, or CSV**
  * Convert uploaded timetable into structured JSON
  * Review and edit timetable before saving
  * Support for different college timetable formats

* 🏖️ **Holiday Management**

  * Upload college holiday calendar
  * Automatically prevent classes on holidays
  * Display holiday/occasion information

* ⏰ **Class Reminders**

  * Notifications **20 minutes and 10 minutes** before every class
  * Daily notification containing the next day's schedule
  * Supports both regular and extra classes

* ✏️ **Class Rescheduling**

  * Edit individual classes
  * Add extra classes for specific dates or date ranges
  * AI-assisted timetable updates

* 🤖 **AI Assistant**

  * Update timetable through natural-language instructions
  * Gemini API as the primary AI service
  * Groq API as fallback

* 📊 **Student Dashboard**

  * Today's classes
  * Upcoming classes
  * Weekly timetable
  * Quick actions
  * Statistics and notes

* 🗂️ **Storage Management**

  * View saved timetable
  * View saved holiday calendar
  * Delete previously saved data

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Material UI (MUI)
* JavaScript
* React Router
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### AI & Notifications

* Google Gemini API
* Groq API
* Web Push Notifications
* Service Workers

### Development Tools

* Git & GitHub
* REST APIs
* JSON-based timetable processing

---

## 📁 Project Structure

```text
ClassPing/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ClassPing
```

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Configure the required frontend environment variables according to your deployment setup.

### 4. Run the application

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

---

## 🔄 Application Workflow

```text
Register / Login
       ↓
Student Dashboard
       ↓
Upload Timetable
       ↓
Extract & Review Classes
       ↓
Confirm Timetable
       ↓
Save to MongoDB
       ↓
Schedule Class Reminders
       ↓
20 min / 10 min Notifications
```

Holiday data is also considered when generating and displaying the student's schedule.

---

## 👥 User Roles

### Student

* Manage personal timetable
* Upload holiday calendar
* View today's and upcoming classes
* Edit/reschedule classes
* Receive class notifications
* Use AI timetable assistant

### Admin

* Manage users
* Manage timetable-related administration
* Maintain system-level data

---

## 🔔 Notification System

ClassPing provides timely notifications for scheduled classes:

| Notification   | Timing                          |
| -------------- | ------------------------------- |
| Class Reminder | 20 minutes before               |
| Class Reminder | 10 minutes before               |
| Daily Schedule | 11:00 PM for next day's classes |

Both **regular and extra classes** are supported.

---

## 🚀 Future Improvements

* Native Android/iOS application
* Advanced attendance tracking
* Faculty and room management
* Calendar integration
* Analytics and academic insights
* Improved AI-based schedule optimization

---

## 📄 License

This project is developed for educational and academic purposes.

---

**ClassPing — Never Miss a Class. ⏰📚**
