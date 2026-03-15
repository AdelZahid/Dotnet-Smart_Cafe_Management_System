# Cafe Management System

A full-stack Cafe Management System built using **ASP.NET Core Web API** and **React (Vite + TailwindCSS)**.  
The system manages cafe operations including **orders, payments, staff management, inventory, and reports** with different roles such as **Owner, Manager, and Waiter**.

---

# Features

## Multi Role System
The system supports three main roles:

### Owner
- Manage employees
- View cafe dashboard
- View sales reports
- View cost reports
- Manage menu items
- Approve or reject employee requests

### Manager
- Manage menu items
- Manage ingredients
- Track purchased orders
- Manage additional costs
- Handle refunds
- Manage reservations
- Manage salary payments

### Waiter
- Create orders
- Update order status
- View menu
- Process payments
- Handle refunds

---

# System Workflow

1. Owner registers a cafe.
2. Employees send **job requests** to the cafe using the cafe email.
3. Owner approves or rejects employee requests.
4. Waiters create orders.
5. Orders move through status:
   - Pending
   - Processing
   - Ready
   - Served
6. Waiter processes payment.
7. Payment is saved to database.
8. Manager can view purchased orders.
9. Owner dashboard and reports update automatically.

---

# Tech Stack

## Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

## Frontend
- React
- Vite
- TailwindCSS
- Axios
- React Router

---

# Project Structure

# Cafe Management System

A full-stack Cafe Management System built using **ASP.NET Core Web API** and **React (Vite + TailwindCSS)**.  
The system manages cafe operations including **orders, payments, staff management, inventory, and reports** with different roles such as **Owner, Manager, and Waiter**.

---

# Features

## Multi Role System
The system supports three main roles:

### Owner
- Manage employees
- View cafe dashboard
- View sales reports
- View cost reports
- Manage menu items
- Approve or reject employee requests

### Manager
- Manage menu items
- Manage ingredients
- Track purchased orders
- Manage additional costs
- Handle refunds
- Manage reservations
- Manage salary payments

### Waiter
- Create orders
- Update order status
- View menu
- Process payments
- Handle refunds

---

# System Workflow

1. Owner registers a cafe.
2. Employees send **job requests** to the cafe using the cafe email.
3. Owner approves or rejects employee requests.
4. Waiters create orders.
5. Orders move through status:
   - Pending
   - Processing
   - Ready
   - Served
6. Waiter processes payment.
7. Payment is saved to database.
8. Manager can view purchased orders.
9. Owner dashboard and reports update automatically.

---

# Tech Stack

## Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

## Frontend
- React
- Vite
- TailwindCSS
- Axios
- React Router

---

# Project Structure
# Cafe Management System

A full-stack Cafe Management System built using **ASP.NET Core Web API** and **React (Vite + TailwindCSS)**.  
The system manages cafe operations including **orders, payments, staff management, inventory, and reports** with different roles such as **Owner, Manager, and Waiter**.

---

# Features

## Multi Role System
The system supports three main roles:

### Owner
- Manage employees
- View cafe dashboard
- View sales reports
- View cost reports
- Manage menu items
- Approve or reject employee requests

### Manager
- Manage menu items
- Manage ingredients
- Track purchased orders
- Manage additional costs
- Handle refunds
- Manage reservations
- Manage salary payments

### Waiter
- Create orders
- Update order status
- View menu
- Process payments
- Handle refunds

---

# System Workflow

1. Owner registers a cafe.
2. Employees send **job requests** to the cafe using the cafe email.
3. Owner approves or rejects employee requests.
4. Waiters create orders.
5. Orders move through status:
   - Pending
   - Processing
   - Ready
   - Served
6. Waiter processes payment.
7. Payment is saved to database.
8. Manager can view purchased orders.
9. Owner dashboard and reports update automatically.

---

# Tech Stack

## Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

## Frontend
- React
- Vite
- TailwindCSS
- Axios
- React Router

---

# Project Structure
CafeManagementSystem
│
├── API (ASP.NET Core Web API)
│ ├── Controllers
│ ├── Services
│ ├── Models
│ ├── Dtos
│ └── Data (DbContext)
│
├── Frontend (React)
│ ├── pages
│ │ ├── owner
│ │ ├── manager
│ │ └── waiter
│ ├── services
│ ├── store
│ └── components
│
└── Database (SQL Server)

---

# Main API Endpoints

## Authentication


POST /api/auth/register
POST /api/auth/login


---

## Owner APIs


GET /api/owner/dashboard
GET /api/owner/employees
POST /api/owner/employees/approve
DELETE /api/owner/employees
GET /api/owner/sales
GET /api/owner/costs

---

## Manager APIs


GET /api/manager/items
POST /api/manager/items
PUT /api/manager/items/{id}
DELETE /api/manager/items/{id}

GET /api/manager/purchased-orders
POST /api/manager/refund

GET /api/manager/ingredients
POST /api/manager/ingredients


---

## Waiter APIs


GET /api/waiter/menu
POST /api/waiter/orders
PUT /api/waiter/orders/status
POST/api/waiter/payments
POST/api/waiter/refund


---

# Database Tables

The system uses the following main tables:

- Users
- CafeProfiles
- Employees
- MenuItems
- Orders
- OrderItems
- Payments
- Reservations
- Ingredients
- IngredientPurchases
- Attendance
- SalaryPayments
- AdditionalCosts

---

# Installation Guide

## Clone the Repository

#Backend Setup
Navigate to API folder
->cd API/CafeManagementAPI

#Restore dependencies
dotnet restore


#Apply database migrations
dotnet ef database update


#Run the backend server
dotnet run 

##For Frontend

#Navigate to Frontend folder


#Install dependencies
npm install

#Run development server
npm run dev





