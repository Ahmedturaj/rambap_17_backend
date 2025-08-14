# rambap_17

A minimal yet functional **Credit Rating MVP** web application built with **Next.js**, **Node.js**, **Express.js**, and **MongoDB**.  
This project focuses on demonstrating the **credit scoring concept** with a simple, intuitive UI and essential backend features.

---

## 📌 Project Overview
`rambap_17` is a proof-of-concept credit rating platform that allows clients to fill out a form, receive a calculated credit score based on predefined rules, and share their data with lenders for credit approval.

The application is built with a modern frontend, a lightweight backend, and secure API communication.

---

## 🚀 Features

### 1. Client Functionality
- Fill out a **credit scoring form** (Age, City, Income, etc.).
- Get an **instant credit rating score** using a **rule-based model** (no ML).
- View a **simple dashboard** showing:
  - Credit score and category (with gauge visualization).
  - Suggested credit amount (`30k`, `50k`, or `100k` FCFA) based on score range.
- Option to **give consent** to share data with lenders.

### 2. Lender Functionality
- View **client data** and credit ratings.
- **Filter** or **search** clients by criteria (e.g., city, score).
- Approve or reject credit requests based on provided information.

### 3. Additional Details
- Pre-created user accounts for demo purposes (**no signup form**).
- No admin panel – data is handled manually for MVP.
- Modern, clear UI/UX design in **Figma**.
- Deployment-ready for platforms like **Hostinger**, **Zenexcloud**, or **Namecheap**.

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- Next.js

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)

**Others:**
- Nodemailer (for possible notifications)
- JWT (for minimal authentication)
- QA Testing before delivery

---

## 📂 Development Process

1. **UI/UX** → Figma designs for a modern, intuitive look.
2. **Backend Development** → API endpoints for client & lender functionality.
3. **Frontend Development** → Integration with backend APIs.
4. **Deployment** → Hosting on recommended cloud provider.

---

## 📦 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/rambap_17.git
cd rambap_17
2️⃣ Install dependencies

cd backend (github clone link)
npm install

3️⃣ Configure environment variables
Create a .env file in both backend and frontend folders and set:

env
Copy

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:5000

#clone the repository and the command
npm install
npm run dev

📊 Credit Scoring Logic
The score is calculated using a simple rule-based model:

Age

City

Income

Other predefined parameters

Based on the score:

Low Score → 30k FCFA

Medium Score → 50k FCFA

High Score → 100k FCFA

📅 Updates & Support
Regular updates every 2–3 days during development.

15 days free support after delivery.

📜 License
This project is licensed for demonstration purposes only.

👨‍💻 Developer
Sheikh Toukir Ahmed Turaj
Backend Developer
