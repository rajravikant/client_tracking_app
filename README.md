# Cargo Shipment Tracker (MERN Stack)

## 🚀 Project Overview
This **Cargo Shipment Tracker** is a **MERN stack** application designed to track cargo shipments with real-time geospatial data. It includes features such as tracking locations, routes, estimated arrival times, and shipment statuses.

---

## 📌 Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 14.x)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

---

## 🖥 Backend Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/rajravikant/tracking-api.git
cd backend
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the `backend` (root) directory:
```sh
touch .env
```
Add the following environment variables:
```
PORT=8080
MONGODB_URI = <your mongo db connection uri>
```

### **5️⃣ Run the Backend Server**
```sh
npm start
```
The backend should be running on `http://localhost:8080/`

---

## 🌐 Frontend Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/rajravikant/client_tracking_app.git
cd client
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the `client` (root) directory:
```sh
touch .env
```
Add the following environment variables:
```
VITE_API_URL = 8080
```

### **4️⃣ Start the Frontend Server**
```sh
npm start
```
The frontend should be running on `http://localhost:/5173`

---

## 🔥 Database Seeding
# after running the backend api hit the following api for seeding the mongodb database with dummy shipments
```sh
http://localhost:8080/api/seed`
```

---

## 🚀 Features
✅ **Real-time Shipment Tracking** (MongoDB GeoJSON & Leaflet.js)  
✅ **CRUD Operations** for managing shipments  
✅ **Geospatial Queries** for location-based searches  
✅ **Redux Toolkit for State Management**  
✅ **Tailwind CSS for Styling**  

---

## 🤝 Contributing
Feel free to submit pull requests or report issues.

---

## Note: This is not the final version of the app . It need lot of improvement as it is at early stage of development 
