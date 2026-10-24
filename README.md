# 🌸 Salon Appointment Booking System (MERN Stack)

A complete, responsive, full-stack web application for salon service discovery and online appointment booking. Built with **React (Vite)**, **Node.js/Express**, and **MongoDB Atlas** for Full Stack Development skill exams and portfolio demonstrations.

---

## Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [Target Users & Role Permissions](#2-target-users--role-permissions)
3. [Minimum Viable Product (MVP) Features](#3-minimum-viable-product-mvp-features)
4. [Features for Future Development](#4-features-for-future-development)
5. [User Stories](#5-user-stories)
6. [Acceptance Criteria](#6-acceptance-criteria)
7. [Wireframes & Screen Layouts](#7-wireframes--screen-layouts)
8. [Database Schema & Data Models](#8-database-schema--data-models)
9. [REST API Contract](#9-rest-api-contract)
10. [Folder Structure & Step-by-Step Implementation Plan](#10-folder-structure--step-by-step-implementation-plan)
11. [Design Palette & Typography](#11-design-palette--typography)
12. [Security & Business Rules](#12-security--business-rules)
13. [Installation & Setup Instructions](#13-installation--setup-instructions)

---

## 1. Problem Statement

Traditional beauty salons and spas face recurring operational bottlenecks when managing customer bookings manually:
- **Phone call dependency:** Clients can only book during business hours, causing missed appointment opportunities during evenings and weekends.
- **Double bookings and scheduling clashes:** Paper ledgers or generic spreadsheets lack real-time slot locking, leading to embarrassing schedule overlaps and customer frustration.
- **Lack of service transparency:** Customers often do not know precise service durations, inclusions, and up-to-date pricing before arriving at the salon.
- **Administrative overhead:** Salon owners spend excessive time answering routine queries, managing cancellations, and maintaining customer appointment records manually.

### Solution
The **Salon Appointment Booking System** solves this by providing a 24/7 web-based portal with:
1. An elegant, mobile-responsive service catalog showing prices, descriptions, and durations.
2. An interactive appointment booking workflow that dynamically calculates available salon time slots and prevents conflicts.
3. Dedicated dashboards for customers to track their appointments and for administrators to manage services, appointments, and business metrics.

---

## 2. Target Users & Role Permissions

| User Role | Permissions & Access Scope |
| :--- | :--- |
| **Guest / Visitor** | • Browse the public landing page, salon introduction, and contact info.<br>• View all active salon services (names, prices, durations, descriptions, photos).<br>• Access the Customer Login and Customer Registration pages. |
| **Registered Customer** | • Everything a Guest can do.<br>• Secure login and session persistence (JWT).<br>• Access the interactive Appointment Booking page.<br>• Select a service, choose a future date, and pick an unoccupied time slot.<br>• View only their own personal appointments (upcoming and past) with live status.<br>• Cancel their own pending or confirmed appointments.<br>• **Restricted:** Cannot view other customers' bookings; cannot access any admin pages or APIs. |
| **Administrator** | • Log in via protected admin authentication credentials.<br>• Access the protected Admin Dashboard with key booking statistics.<br>• View **all** customer appointments across the entire salon.<br>• Filter appointments by date and status (`pending`, `confirmed`, `rejected`, `cancelled`).<br>• Change appointment status (Confirm, Reject, Cancel).<br>• Full CRUD on salon services (Add new, Edit existing, Delete, Toggle active status).<br>• Run the first-time admin seeding script securely. |

---

## 3. Minimum Viable Product (MVP) Features

### Authentication & Authorization
- Customer registration with validation (name, email format, password min length).
- Secure password hashing using `bcryptjs` with salt rounds.
- JWT-based authentication stored safely in frontend memory/HTTP state.
- Protected customer routes and role-guarded admin routes (`verifyToken` and `isAdmin` middleware).
- Safe initial admin creation mechanism without hardcoded credentials.

### Service Management (Admin)
- Admin can add a new service (name, description, price, duration in minutes, image URL).
- Admin can edit existing services or toggle service availability.
- Admin can delete services (with safety checks against active bookings).
- Public users can view active services in a clean responsive grid.

### Appointment Booking Engine
- Dynamic date selection (strictly preventing past dates).
- Salon operating hours standard (e.g., 09:00 to 18:00 in 60-minute or 30-minute intervals).
- Real-time availability endpoint: queries MongoDB for existing non-cancelled bookings on that date and disables booked slots.
- Concurrency and overlap prevention on the backend before booking creation.

### Customer Dashboard
- Overview of booked appointments sorted chronologically.
- Color-coded status chips (`Pending` = Amber, `Confirmed` = Green, `Rejected` = Red, `Cancelled` = Gray).
- One-click cancellation for eligible appointments with confirmation dialog.

### Admin Dashboard
- Quick business summary metric cards: Total Bookings, Pending Approvals, Confirmed Appointments, Total Revenue.
- Comprehensive appointments table with filtering by status and date.
- Instant status update actions (Confirm, Reject, Cancel).
- Service catalog management interface with add/edit modal.

---

## 4. Features for Future Development

1. **Automated SMS & Email Notifications:** Integration with Nodemailer/SendGrid and Twilio for instant booking confirmations and 24-hour appointment reminders.
2. **Online Payment Gateway:** Integration with Stripe or Razorpay for optional advance deposits or full service payments.
3. **Staff/Stylist Selection:** Allow customers to select specific stylists or beauticians based on availability.
4. **Ratings & Customer Reviews:** Verified customers can leave star ratings and reviews for services they completed.
5. **Customer Loyalty Points:** Reward point system offering discounts on repeat bookings.
6. **Calendar Integration:** "Add to Google Calendar / Apple iCal" button upon booking confirmation.

---

## 5. User Stories

1. **US-01 (Service Discovery):** *As a potential salon customer*, I want to browse all available salon treatments with prices and durations *so that* I can decide which service matches my budget and schedule.
2. **US-02 (Account Registration):** *As a new customer*, I want to register an account with my name, email, and password *so that* I can manage my salon appointments securely.
3. **US-03 (Slot Availability):** *As a logged-in customer*, I want to pick a service and a date and view only the available time slots *so that* I do not book a time when the salon is already booked.
4. **US-04 (Appointment Booking):** *As a logged-in customer*, I want to confirm my appointment request *so that* the salon team receives my booking.
5. **US-05 (Customer Self-Service):** *As a customer*, I want to view my past and upcoming appointments and cancel if my plans change *so that* I don't miss an appointment or waste the salon's time.
6. **US-06 (Admin Overview):** *As a salon administrator*, I want a dashboard showing today's bookings and pending requests *so that* I can plan salon staff capacity efficiently.
7. **US-07 (Admin Appointment Actions):** *As a salon administrator*, I want to confirm or reject incoming booking requests with one click *so that* my schedule remains accurate.
8. **US-08 (Admin Catalog Control):** *As a salon administrator*, I want to add, edit, or temporarily disable services *so that* our website always reflects our current offerings and prices.

---

## 6. Acceptance Criteria

### AC-01: User Registration & Authentication
- **Given** an unregistered visitor on the Register page,
- **When** they submit valid name, unique email, and password (≥ 6 characters),
- **Then** their password must be hashed with bcrypt, saved to MongoDB, and a JWT token generated.
- **When** an email already exists in MongoDB,
- **Then** the server must return HTTP `400 Bad Request` with message `"Email already registered"`.

### AC-02: Route Protection & Authorization
- **Given** an unauthenticated visitor,
- **When** they attempt to visit `/book`, `/dashboard`, or `/admin`,
- **Then** they are redirected to `/login` with an informational notice.
- **Given** a logged-in user with role `"customer"`,
- **When** they attempt to visit `/admin` or invoke admin API routes,
- **Then** they are denied access with HTTP `403 Forbidden` and redirected to their customer dashboard.

### AC-03: Booking Engine & Overlap Prevention
- **Given** a customer selecting an appointment date,
- **When** the date is before today,
- **Then** the UI disables the date and the backend rejects requests with HTTP `400` (`"Cannot book past dates"`).
- **Given** a date where slot `14:00` has an existing `pending` or `confirmed` booking,
- **When** any customer views the available slots for that date,
- **Then** `14:00` is marked as unavailable and unclickable.
- **When** a concurrent POST request attempts to book `14:00`,
- **Then** the backend rejects the second request with HTTP `409 Conflict` (`"This time slot is already booked"`).

### AC-04: Customer Appointment Cancellation
- **Given** a customer on their Dashboard,
- **When** they click "Cancel Appointment" on an active booking and confirm the prompt,
- **Then** the appointment status becomes `cancelled`, the time slot is freed for others, and the UI immediately reflects the updated status.

### AC-05: Admin Service CRUD
- **Given** an authenticated admin on the Services Management page,
- **When** they add a new service with name, price, duration, description, and image URL,
- **Then** the service is stored in MongoDB and appears immediately in the public catalog.

---

## 7. Wireframes & Screen Layouts

### 7.1 Desktop Layouts

#### Home Page (Desktop)
```
+---------------------------------------------------------------------------------+
|  🌸 GLAMOUR HAVEN SALON         Home   Services   Book Now   [Login] [Register]  |
+---------------------------------------------------------------------------------+
|                                                                                 |
|   HERO SECTION                                                                  |
|   "Reveal Your Natural Radiance"                                                |
|   Luxury hair, skincare & spa treatments tailored for you.                      |
|   [ Book Appointment Now ]   [ Explore Services ]                               |
|                                                     [ Elegant Salon Hero Image ]|
|                                                                                 |
+---------------------------------------------------------------------------------+
|   ABOUT & WHY CHOOSE US                                                         |
|   [ Expert Stylists ]      [ Premium Products ]      [ Relaxing Atmosphere ]    |
+---------------------------------------------------------------------------------+
|   FEATURED SERVICES                                                             |
|   +-------------------+  +-------------------+  +-------------------+           |
|   | [Hair Spa Image]  |  | [Facial Image]    |  | [Manicure Image]  |           |
|   | Luxury Hair Spa   |  | Radiance Facial   |  | Deluxe Manicure   |           |
|   | 60 mins • $65     |  | 45 mins • $50     |  | 40 mins • $35     |           |
|   | [ Book Service ]  |  | [ Book Service ]  |  | [ Book Service ]  |           |
|   +-------------------+  +-------------------+  +-------------------+           |
+---------------------------------------------------------------------------------+
|   FOOTER: Opening Hours: Mon-Sun 9am - 7pm | Address | (c) 2026 Glamour Haven   |
+---------------------------------------------------------------------------------+
```

#### Booking Page (Desktop)
```
+---------------------------------------------------------------------------------+
|  🌸 GLAMOUR HAVEN SALON         Home   Services   My Dashboard   [Hi, Sarah | Logout]
+---------------------------------------------------------------------------------+
|  BOOK YOUR SALON APPOINTMENT                                                    |
|                                                                                 |
|  Step 1: Choose Service      Step 2: Choose Date        Step 3: Select Time     |
|  [Select a Service       v]  [Pick Date: 2026-10-26]    Available Slots:        |
|  - Luxury Hair Spa ($65)                                [ 09:00 AM ] [ 10:00 AM]|
|  - Radiance Facial ($50)                                [ Booked   ] [ 01:00 PM]|
|  - Deluxe Manicure ($35)                                [ 02:00 PM ] [ 03:00 PM]|
|                                                                                 |
|  -----------------------------------------------------------------------------  |
|  BOOKING SUMMARY                                                                |
|  Service: Luxury Hair Spa | Date: Oct 26, 2026 | Time: 10:00 AM | Total: $65    |
|  [ Confirm Appointment Request ]                                                |
+---------------------------------------------------------------------------------+
```

#### Admin Dashboard (Desktop)
```
+---------------------------------------------------------------------------------+
|  🌸 GLAMOUR ADMIN               Overview   Manage Services   Manage Bookings  [Logout]
+---------------------------------------------------------------------------------+
|  ADMINISTRATION CONSOLE                                                         |
|  +----------------+  +----------------+  +----------------+  +----------------+ |
|  | Total Bookings |  | Pending Action |  | Confirmed      |  | Est. Revenue   | |
|  |       48       |  |       5        |  |       38       |  |     $2,850     | |
|  +----------------+  +----------------+  +----------------+  +----------------+ |
|                                                                                 |
|  APPOINTMENTS MANAGEMENT                                                        |
|  Filter by Status: [ All v ]   Filter by Date: [ YYYY-MM-DD ]   [ Reset Filters] |
|                                                                                 |
|  Customer       Service        Date & Time       Status       Actions           |
|  -----------------------------------------------------------------------------  |
|  Sarah Jenkins  Hair Spa       2026-10-26 10:00  [PENDING]    [Confirm] [Reject]|
|  Emma Watson    Radiance Glow  2026-10-26 11:30  [CONFIRMED]  [Cancel]          |
|  Jessica Alba   Manicure       2026-10-25 15:00  [COMPLETED]  --                |
+---------------------------------------------------------------------------------+
```

---

### 7.2 Mobile Responsive Layouts

```
+------------------------------+     +------------------------------+
| 🌸 GLAMOUR HAVEN       [ ☰ ] |     | 🌸 GLAMOUR HAVEN       [ ☰ ] |
+------------------------------+     +------------------------------+
| Reveal Your Natural Radiance |     | BOOK AN APPOINTMENT          |
| Luxury hair & spa care.      |     |                              |
|                              |     | 1. Select Service:           |
| [ Book Appointment Now ]     |     | [ Luxury Hair Spa ($65)  v ] |
|                              |     |                              |
| [ Beautiful Salon Photo ]    |     | 2. Select Date:              |
|                              |     | [ 2026-10-26             ]   |
| --- OUR SERVICES ---         |     |                              |
| +--------------------------+ |     | 3. Available Slots:          |
| | [Service Image]          | |     | [ 09:00 AM ]  [ 10:00 AM ]   |
| | Luxury Hair Spa          | |     | [ Booked   ]  [ 01:00 PM ]   |
| | 60 mins • $65            | |     |                              |
| | [ Book Now ]             | |     | Booking Summary:             |
| +--------------------------+ |     | Hair Spa • 10:00 AM • $65    |
| +--------------------------+ |     | [ Confirm Appointment ]      |
| | Radiance Facial          | |     +------------------------------+
| | 45 mins • $50            | |     | (c) 2026 Glamour Haven       |
| +--------------------------+ |     +------------------------------+
| (c) 2026 Glamour Haven       |
+------------------------------+
```

---

## 8. Database Schema & Data Models

### 8.1 User Collection (`users`)
```javascript
{
  _id: ObjectId("..."),
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
}
```
- **Indexes:** `{ email: 1 }` (Unique).

---

### 8.2 Service Collection (`services`)
```javascript
{
  _id: ObjectId("..."),
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 15 }, // duration in minutes
  image: { type: String, required: true }, // high quality image URL
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```
- **Indexes:** `{ isActive: 1, name: 1 }`.

---

### 8.3 Appointment Collection (`appointments`)
```javascript
{
  _id: ObjectId("..."),
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  appointmentDate: { type: String, required: true }, // format: "YYYY-MM-DD"
  startTime: { type: String, required: true },       // format: "HH:mm" (e.g. "10:00")
  endTime: { type: String, required: false },         // format: "HH:mm" (e.g. "11:00")
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}
```
- **Indexes:**
  - `{ appointmentDate: 1, startTime: 1, status: 1 }` (for quick conflict checks).
  - `{ customerId: 1, appointmentDate: -1 }` (for customer history queries).

---

## 9. REST API Contract

### 9.1 Authentication (`/api/auth`)

| Method | Endpoint | Access | Request Body | Success Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | `201 Created`<br>`{ token, user: { id, name, email, role } }` | `400` Validation Error / Email Exists |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `200 OK`<br>`{ token, user: { id, name, email, role } }` | `400` Missing fields<br>`401` Invalid credentials |
| `GET` | `/api/auth/me` | Authenticated | `Header: Bearer <token>` | `200 OK`<br>`{ user: { id, name, email, role } }` | `401` Unauthorized |

---

### 9.2 Salon Services (`/api/services`)

| Method | Endpoint | Access | Request Body | Success Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Public | None | `200 OK`<br>`[ { _id, name, description, price, duration, image, isActive } ]` | `500` Server error |
| `GET` | `/api/services/:id` | Public | None | `200 OK`<br>`{ _id, name, description, price, duration, image, isActive }` | `404` Not found |
| `POST` | `/api/services` | Admin Only | `{ name, description, price, duration, image, isActive }` | `201 Created`<br>`{ message, service }` | `400` Missing fields<br>`403` Forbidden |
| `PUT` | `/api/services/:id` | Admin Only | `{ name, description, price, duration, image, isActive }` | `200 OK`<br>`{ message, service }` | `400` Invalid ID<br>`403` Forbidden<br>`404` Not found |
| `DELETE`| `/api/services/:id`| Admin Only | None | `200 OK`<br>`{ message: "Service deleted successfully" }` | `403` Forbidden<br>`404` Not found |

---

### 9.3 Appointments (`/api/appointments`)

| Method | Endpoint | Access | Query / Body | Success Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/appointments/available-slots` | Public | Query: `?date=YYYY-MM-DD` | `200 OK`<br>`{ date, availableSlots: ["09:00", "10:00", ...], bookedSlots: [...] }` | `400` Invalid date |
| `POST` | `/api/appointments` | Customer | `{ serviceId, appointmentDate, startTime, notes }` | `201 Created`<br>`{ message, appointment }` | `400` Past date / Invalid input<br>`409` Slot already booked |
| `GET` | `/api/appointments/my` | Customer | Header: `Bearer <token>` | `200 OK`<br>`[ appointment objects for logged-in user ]` | `401` Unauthorized |
| `GET` | `/api/appointments` | Admin Only | Query: `?status=&date=` | `200 OK`<br>`[ all appointments populated with customer & service ]` | `403` Forbidden |
| `GET` | `/api/appointments/:id` | Customer/Admin | None | `200 OK`<br>`{ appointment details }` | `403` Forbidden<br>`404` Not found |
| `PATCH`| `/api/appointments/:id/status` | Admin Only | `{ status: "confirmed"|"rejected"|"cancelled" }` | `200 OK`<br>`{ message, appointment }` | `400` Invalid status<br>`403` Forbidden |
| `PATCH`| `/api/appointments/:id/cancel` | Customer (Owner) | None | `200 OK`<br>`{ message, appointment }` | `400` Already cancelled<br>`403` Forbidden |

---

## 10. Folder Structure & Step-by-Step Implementation Plan

### 10.1 Folder Structure
```
c:\Users\agnaj\OneDrive\Desktop\PROJECT\
├── README.md
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   └── Appointment.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   └── appointmentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── appointmentRoutes.js
│   └── utils/
│       ├── seed.js
│       └── slotHelper.js
└── frontend/
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── App.css
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ServiceCard.jsx
        │   ├── AppointmentCard.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── LoadingSpinner.jsx
        │   └── Modal.jsx
        └── pages/
            ├── HomePage.jsx
            ├── ServicesPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── BookingPage.jsx
            ├── CustomerDashboard.jsx
            ├── AdminDashboard.jsx
            ├── AdminServicesPage.jsx
            └── AdminAppointmentsPage.jsx
```

### 10.2 7-Stage Implementation Roadmap

```
+-----------------------------------------------------------------------------------+
| STAGE 1: SRS, Specs, Architecture & Master README.md (Completed)                 |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| STAGE 2: React + Vite Frontend Setup & Responsive Design Components               |
| - Initialize Vite React application with clean modular structure.                |
| - Implement blush pink & cream theme with responsive CSS.                         |
| - Build all 10 responsive pages & reusable components with mock display data.     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| STAGE 3: Node.js/Express Backend & MongoDB Mongoose Models                        |
| - Setup Express app, CORS, JSON parsing, error handlers.                          |
| - Connect to MongoDB with fallback/resilience.                                    |
| - Build User, Service, and Appointment Mongoose schemas and relationships.        |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| STAGE 4: Authentication, Hashing & Protected Routes                               |
| - Implement bcrypt password hashing & JWT generation.                             |
| - Create verifyToken and isAdmin authorization middleware.                        |
| - Create secure initial admin seeder script.                                      |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| STAGE 5: End-to-End API Integration                                               |
| - Connect React to Express using Axios.                                           |
| - Implement live booking logic, real-time slot checking, and overlap rejection.   |
| - Implement Admin Service CRUD and Status Management.                             |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| STAGE 6: Full Application Verification & Error Resolution                         |
| - Run test checklist (auth, validation, booking conflict, customer isolation).    |
| - Verify mobile & desktop viewports.                                              |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
| STAGE 7: GitHub Version Control & Production Deployment Instructions              |
| - Initialize Git, write clean .gitignore, stage and commit.                       |
| - Provide Render/Vercel/MongoDB Atlas deployment documentation.                   |
+-----------------------------------------------------------------------------------+
```

---

## 11. Design Palette & Typography

- **Background Cream:** `#FAF7F2` (soft, warm, inviting)
- **Card Background:** `#FFFFFF` (clean, crisp white)
- **Blush Pink Accent:** `#F7E7E8` (soft pastel highlights)
- **Primary Rose / Berry:** `#C87D85` (primary buttons, active tabs, brand logo)
- **Deep Charcoal / Plum Text:** `#2D2529` (high contrast, ultra-readable typography)
- **Muted Gray:** `#756A72` (subtitles, metadata, card borders)
- **Status Colors:**
  - Pending: `#D97706` (amber)
  - Confirmed: `#059669` (emerald green)
  - Rejected: `#DC2626` (ruby red)
  - Cancelled: `#6B7280` (neutral slate)

---

## 12. Security & Business Rules

1. **Password Protection:** Plain text passwords are never stored; `bcryptjs` hashes passwords with 10 salt rounds before saving.
2. **JWT Security:** Bearer tokens are signed with a server secret and expire in 24 hours.
3. **Admin Privilege Safeguard:** Normal registration only ever creates `role: 'customer'`. Admin users cannot be created via public registration.
4. **Data Isolation:** The `/api/appointments/my` endpoint extracts the customer ID directly from the decoded JWT token, preventing customers from viewing or tampering with other clients' data.
5. **No Booking Past Dates:** Date validation checks `appointmentDate >= today`.
6. **No Overlapping Active Bookings:** A slot cannot be booked if an active (`pending` or `confirmed`) appointment already occupies the same service time slot on that date.

---

## 13. Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- Git installed
- MongoDB connection string (Atlas or Local MongoDB)

### Step 1: Clone or Navigate to the Workspace
```bash
cd c:\Users\agnaj\OneDrive\Desktop\PROJECT
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env to add your MONGODB_URI and JWT_SECRET
npm run seed  # (Optional: seeds initial admin and default services)
npm run dev   # Runs backend on http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev   # Runs frontend on http://localhost:5173
```
