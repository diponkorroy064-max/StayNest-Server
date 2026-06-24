# StayNest Server

Backend API for the StayNest rental property platform. This server handles property management, favorites, bookings, reviews, authentication, and database operations.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB
* Better Auth
* JWT (Optional)
* CORS
* dotenv

---

## 📦 Installation

### Clone Repository

```bash
git clone <server-repository-url>
cd staynest-server
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
AUTH_DB_NAME=staynest
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

### Start Development Server

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:5000
```

---

## 📂 Project Structure

```text
staynest-server/
│
├── index.js
├── .env
├── package.json
│
├── routes/
├── middleware/
├── controllers/
├── utils/
│
└── README.md
```

---

# Database Collections

### Properties Collection

Stores all rental properties.

```json
{
  "title": "Modern Family Apartment",
  "description": "Spacious apartment",
  "location": "Dhaka",
  "propertyType": "Apartment",
  "rentAmount": 25000,
  "bedrooms": 3,
  "bathrooms": 2,
  "images": [],
  "status": "Approved",
  "ownerEmail": "owner@example.com"
}
```

---

### Favourites Collection

Stores tenant favorite properties.

```json
{
  "propertyId": "123",
  "currentUserEmail": "tenant@example.com"
}
```

---

### Reviews Collection

Stores user reviews.

```json
{
  "propertyId": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "comment": "Excellent property",
  "reviewDate": "2026-06-24T10:00:00Z"
}
```

---

# API Endpoints

## Property APIs

### Get All Properties

```http
GET /api/properties
```

### Get Property By ID

```http
GET /api/properties/:id
```

### Add Property

```http
POST /api/properties
```

### Get Properties By Owner Email

```http
GET /properties/byEmail?email=owner@example.com
```

---

## Favourite APIs

### Add Favourite

```http
POST /api/favourites
```

### Get Favourites By Email

```http
GET /api/favourites/byEmail?email=user@example.com
```

### Remove Favourite

```http
DELETE /api/favourites/:id
```

---

## Review APIs

### Add Review

```http
POST /api/reviews
```

### Get Property Reviews

```http
GET /api/reviews/:propertyId
```

---

## Booking APIs

### Create Booking

```http
POST /api/bookings
```

### Get User Bookings

```http
GET /api/bookings/byEmail?email=user@example.com
```

---

# Authentication

StayNest uses Better Auth for authentication.

### Features

* Email & Password Login
* User Registration
* Session Management
* Protected Routes
* Role Based Access Control

### Roles

```text
Admin
Owner
Tenant
```

---

# Status Values

## Property Status

```text
Pending
Approved
Rejected
```

## Booking Status

```text
Pending
Confirmed
Cancelled
```

## Payment Status

```text
Paid
Unpaid
Refunded
```

---

# Deployment

### Build Server

```bash
npm install
npm start
```

### Deploy Options

* Render
* Railway
* VPS
* DigitalOcean
* AWS EC2

---

# Author

Developed for StayNest – Smart Rental Property Management Platform.
