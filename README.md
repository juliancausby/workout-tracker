# workout-tracker
A full-stack workout tracking application built with **React** and **Axios**.  
This project allows users to create workouts, log exercises with sets and reps, and view a history of past workouts with grouped details.
Currently the backend is harcoded only for single user usage, will be updated soon.

## 🖥️ Features

- **User Authentication** - Users can register or log in to see their own dashboard.
- **Add Workouts** - Create new workouts with a custom name and optional description.
- **Dynamic Exercises & Sets:** Add multiple exercises and sets for each workout on the fly.
- **Workout History:** View a list of past workouts and drill down into the details.

## 🔧 Tech Stack

**Frontend:**  
- React 
- Axios for API calls
- CSS for styling  

**Backend:**  
- Node.js 
- PostgreSQL database

## Installation

**Prerequisites**
-- Node.js (v14+)
-- PostgreSQL (v12+)
-- npm or yarn

**Clone the repository**
```bash
git clone https://github.com/juliancausby/workout-tracker.git
cd workout-tracker
```

**Install backend dependencies**
```bash
cd server
npm install
```
**Set up the PostgreSQL database**
```bash
createdb workout_tracker
psql workout_tracker -f database.sql
```

**Start the backend server**
```bash
node index.js
```

**Install frontend depdencies**
```bash
cd ../client
npm install
```

**Start the React development server**
```bash
npm start
```
**Success! Now you can open it in your browser at:**
http://localhost:3000 or whatever localhost react shows in the terminal

## 📸 Screenshots

<img width="1512" height="847" alt="Screenshot 2025-09-13 at 21 27 49" src="https://github.com/user-attachments/assets/474c9cc0-35dc-4798-b34a-00ebc404098a" />

<img width="1512" height="839" alt="Screenshot 2025-09-13 at 21 35 09" src="https://github.com/user-attachments/assets/d3613b2a-bda0-4887-b73c-472fde23effd" />

