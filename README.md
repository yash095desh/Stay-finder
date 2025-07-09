# StayFinder

StayFinder is a full-stack web application inspired by Airbnb, where users can list and book properties for short-term or long-term stays. It offers a modern interface for guests to explore listings and for hosts to manage their properties.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** Clerk
- **Deployment:** Vercel (Frontend), Render (Backend)

## Features

### Guest Features
- Sign up / Sign in
- Browse property listings
- Search by location, price, and availability
- View property details with images and calendar
- Make bookings

### Host Features
- Create and edit property listings
- View bookings and earnings in a dashboard
- Delete listings

## Folder Structure

```
stayfinder/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── public/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.js
```

## Setup Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/stayfinder.git
cd stayfinder
```

2. **Environment Variables**

Create a `.env.local` file inside `frontend`:

```
# Clerk configuration (Frontend)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

```

Create a `.env` file inside `backend`:

```
MONGO_URL=your_mongo_uri
```

3. **Install Dependencies and Start**

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run server
```


## Live Demo

[https://stayfinder.vercel.app](https://stay-finder-fawn.vercel.app)

## Author

**Yash Deshmukh**  
[GitHub](https://github.com/yash095desh) | [LinkedIn](https://www.linkedin.com)

---
