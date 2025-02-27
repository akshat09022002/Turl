Turl - Custom URL Shortener
=======================================

Turl is a feature-packed URL shortener built to make link sharing easy and powerful. It’s more than just a link shrinker—it gives you tools to customize and secure your URLs. Check it live at [turl.co.in](https://turl.co.in)!

## Features
- **Custom Pages**: Turn your shortened URLs into mini web pages! These branded landing pages are perfect for sharing promos, portfolios, or anything cool. You can also add a password for privacy.
- **Unique UIDs**: Assign each shortened URL a special code (UID) you choose, making your links easy to recognize and track.
- **Secure & Scalable**: Protect your links with passwords and scale effortlessly, whether for personal or business use.

## Tech Stack
- **Frontend**: React, Recoil
- **Backend**: TypeScript, Node.js
- **Database**: Prisma ORM (PostgreSQL)
- **Deployment**:
  - Frontend: Vercel (serverless functions)
  - Backend: AWS EC2

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- A database (e.g., PostgreSQL, compatible with Prisma)

## Installation

### Clone the Repository:
```bash
git clone https://github.com/akshat09022002/Turl.git
cd Turl
```
Turl contains two subfolders: **Backend** and **Frontend**.

### Backend Setup:
Navigate to the backend folder:
```bash
cd Backend
```
Install dependencies:
```bash
npm install
```

### Frontend Setup:
Navigate to the frontend folder:
```bash
cd ../Frontend/Frontend
```
Install dependencies:
```bash
npm install
```

## Configuration
Both `Backend` and `Frontend` folders contain a `.env.example` file. Create a `.env` file in each folder and fill in the required values.

### 1. Frontend `.env` Configuration
Create a `.env` file inside `Frontend/Frontend`:
```
VITE_BACKEND_API=http://localhost:3000
VITE_FRONTEND_API=http://localhost:5173
```
- `VITE_BACKEND_API`: URL where the backend runs (default: `http://localhost:3000` for local development).
- `VITE_FRONTEND_API`: URL where the frontend runs (default: `http://localhost:5173`).

### 2. Backend `.env` Configuration
Create a `.env` file inside `Backend`:
```
EMAIL="johndoe@gmail.com"
EMAIL_PASSWORD="johndoepassword"
JWT_SECRET="JWT_SECRET"
DATABASE_URL="Enter your database connection string"
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
```
- `EMAIL` & `EMAIL_PASSWORD`: Used for sending OTP's (Any SMTP mail credentials).
- `JWT_SECRET`: A long, random secret key for authentication.
- `DATABASE_URL`: Your database connection string.
- `FRONTEND_URL`: Must match `VITE_FRONTEND_API`.
- `BACKEND_URL`: Must match `VITE_BACKEND_API`.

### Getting a `DATABASE_URL`
You can set up PostgreSQL using:
- **NeonDB**: [neon.tech](https://neon.tech) (Free PostgreSQL hosting).
- **Aiven**: [aiven.io](https://aiven.io) (Managed PostgreSQL).
- **Docker**: Run a local PostgreSQL instance:
```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=yourpassword postgres
```
Use this `DATABASE_URL`:
```
postgresql://postgres:yourpassword@localhost:5432/postgres
```

## Setting Up Prisma
Navigate to the `Backend` folder and initialize the Prisma schema:
```bash
npx prisma migrate dev --name init
```
Generate the Prisma client:
```bash
npx prisma generate
```

## Running the Project

### Start Backend:
```bash
cd Backend
npm run dev
```

### Start Frontend:
```bash
cd Frontend/Frontend
npm run dev
```
Now, visit [http://localhost:5173](http://localhost:5173) in your browser!

## Contributing
Love feedback and ideas! Fork the repo, make your changes, and submit a pull request. Keep it clean and documented.

## Contact
Built by Akshat Singh. Reach out via email: **akshat@onepunchdev.com**. Try Turl and let me know what you think—what works, what could improve?

