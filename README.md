# Aurelia Residences & Hotel Booking System

A premium, full-stack MERN (MongoDB, Express, React, Node.js) Hotel Booking application styled with a modern glassmorphic dark design system.

## Key Features

- **Role-Based Authentication**: Secure customer registration and login with JWT and custom middleware. Includes role segregation (Customer vs. Admin).
- **Hotel Catalog**: Clean property listing with multi-parameter searches (location, property type) and detailed views.
- **Real-Time Date Availability**: Smart date range overlapping checks preventing double-bookings.
- **Interactive Reviews**: Authenticated guest feedback logs, star ratings, and automatically updated hotel averages.
- **Sandboxed Payments Checkout**: Integrated mock card validator and receipt summary worksheets.
- **Admin Management Panel**: Dashboard tabs to delete hotels/rooms, register new listings, and monitor global reservations.
- **Seeded Datasets**: Pre-populated Unsplash high-resolution mock data for immediate exploration.

## Directory Layout

```text
hotel-booking-system/
├── backend/
│   ├── config/          # DB connection helper
│   ├── controllers/     # Route logic handlers (auth, hotel, room, booking, review)
│   ├── middleware/      # JWT protection & error formatting
│   ├── models/          # Mongoose Schemas (User, Hotel, Room, Booking, Review)
│   ├── routes/          # Express route setups
│   ├── .env             # Server configurations
│   ├── seed.js          # DB seeder script
│   └── server.js        # Main entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProtectedRoute, RatingStars
│   │   ├── context/     # React AuthContext
│   │   ├── pages/       # Home, SearchResults, HotelDetails, Checkout, Dashboards
│   │   ├── App.jsx      # Navigation routing setup
│   │   └── index.css    # Central styling (tokens and glassmorphism)
│   └── package.json
├── package.json         # Workspace launcher scripts
└── README.md
```

## Running the Application

### 1. Prerequisite: Start MongoDB

A local MongoDB instance is required. If your local MongoDB Service is stopped (due to permission constraints in terminal), start it by:
1. Open Windows **Services** (Press `Win + R`, type `services.msc`, and press Enter).
2. Locate **MongoDB Server (MongoDB)**.
3. Right-click and choose **Start** (needs administrator rights).

Alternatively, you can supply your own **MongoDB Atlas connection string** inside `backend/.env` under `MONGO_URI`.

### 2. Install Dependencies

Install all root, backend, and frontend packages simultaneously:
```bash
npm run install-all
```

### 3. Seed Mock Datasets

Pre-populate the database with the premium hotel listings, rooms, and test accounts:
```bash
npm run seed
```
*Note: This creates two default login accounts:*
- **Customer User**: `user@hotel.com` / `user12345`
- **Admin User**: `admin@hotel.com` / `admin12345`

### 4. Start Development Servers

Run the backend API and frontend client concurrently:
```bash
npm run dev
```
The application will open the client at [http://localhost:5173](http://localhost:5173).

## Design System Customizations

Global aesthetic controls are located in [frontend/src/index.css](file:///c:/Users/Suraj%20Kumar%20sharma/Desktop/hotel%20mern%20stack/frontend/src/index.css). Accent tokens utilize:
- Background: `#090a0f` (Deep Obsidian)
- Accent: `#d4af37` (Aurelia Luxe Gold)
- Surface panels: `rgba(18, 22, 33, 0.65)` (Glass backdrop)
