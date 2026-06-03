# MOON LOOKS — Premium Interior Architecture Platform

MOON LOOKS is a modern luxury interior design and spatial architecture web platform built for premium residential and commercial interior consultation workflows.

The platform includes:

* Client authentication system
* Interior consultation booking
* Premium project showcase
* Client dashboard
* Quotation & milestone management
* Realistic Indian luxury architecture branding
* Database integration with Firebase, Supabase, and MongoDB

---

# Features

## Premium Interior Design Experience

* Elegant modern UI/UX
* Responsive luxury architecture layout
* Realistic Indian premium interior branding
* Interactive project showcase

## Authentication System

* Firebase Authentication
* Login / Signup flow
* Protected dashboard routes
* Session persistence

## Client Dashboard

* Project timelines
* Consultation management
* Material selections
* Quotations and invoices
* Progress tracking

## Database Architecture

* Firebase integration
* Supabase integration
* MongoDB support
* Modular service architecture

## Responsive Design

* Mobile optimized
* Tablet optimized
* Desktop optimized

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite

## Backend & Database

* Firebase
* Supabase
* MongoDB Atlas

## Deployment

* Vercel

---

# Project Structure

```bash
src/
│
├── components/
├── layout/
├── pages/
├── database/
│   ├── auth/
│   ├── config/
│   ├── providers/
│   ├── queries/
│   └── services/
│
├── config/
├── assets/
└── types.ts
```

---

# Environment Variables

Create a `.env` file and add:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

VITE_MONGODB_URI=
```

---

# Installation

## Clone Repository

```bash
git clone <your-repository-url>
cd MOON-LOOKS_prototype
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# Deployment

This project is optimized for deployment on Vercel.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Security Notes

* Environment variables are required for database connectivity.
* Never expose private keys publicly.
* `.env` files are ignored using `.gitignore`.

---

# Future Enhancements

* AI-powered space estimation
* Live architect consultation
* Material recommendation engine
* Advanced CRM integration
* Real-time collaboration dashboard

---

# Author

Developed by Shreshtha Gupta

---

# License

This project is intended for educational, portfolio, and prototype demonstration purposes.
