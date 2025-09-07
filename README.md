# 🏨 Hotel Room Booking System with IVR Integration and Admin Portal

## ✅ Project Overview  
This project is a comprehensive **Hotel Room Booking and Management System** that integrates an **IVR (Interactive Voice Response) solution** for automated voice-based interactions and a secure **Admin Web Portal** for managing bookings.

---

## 🚀 Features

### ✅ IVR System (Xtend Technologies)
- Automated voice-driven room booking  
- Booking status inquiry by Booking ID  
- Booking cancellation flow  
- Dynamic interaction with MySQL database  
- Cost calculation and confirmation process  
- Generates unique Booking IDs  

### ✅ Admin Web Portal
- Secure admin login authentication  
- Search booking details by Booking ID  
- Displays booking information in a structured table  
- Responsive and user-friendly UI  

---

## 🛠️ Technologies Used  
- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js, Express.js  
- Database: MySQL  
- IVR Scripting: Xtend Technologies (hotel.dt script)  
- RESTful API for communication between frontend and backend  
- Data Persistence: MySQL database (hotel table)  

---

## ⚡ Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/YourUsername/Hotel-Booking-System.git
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```

3. Set up MySQL database:
    - Create a database (e.g., `hotel_db`)  
    - Create `hotel` and `admin` tables as per schema  
    - Insert default admin credentials

4. Start the backend server:
    ```bash
    node server.js
    ```

5. Open `login.html` in your browser to access the admin portal.

---

## 🎯 Usage
- Admin logs in via **login.html**  
- Search and manage booking records using Booking ID  
- The IVR system handles voice-based booking, checking, and cancellation (executed externally via Xtend platform).

---

## 📄 Notes  
- The IVR system requires Xtend Technologies runtime environment to execute the script (`hotel.dt`).  
- Ensure proper MySQL ODBC connection configured in the script for IVR functionality.

---

## ✅ Author  
Adarsh Mohan P  
4th Year B.Tech Computer Science | [GitHub](https://github.com/Adarshmohanp)

---

## 📄 License  
MIT License
