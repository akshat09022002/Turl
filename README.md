# Turl - Custom URL Shortener
Turl is a feature-packed URL shortener built to make link sharing easy and powerful. It’s more than just a link shrinker—it gives you tools to customize and secure your URLs. Check it live at turl.co.in!

Features
Custom Pages: Turn your shortened URLs into mini web pages! These are branded landing pages you design, perfect for sharing promos, portfolios, or anything cool. Anyone can visit them using the link, and you can add a password to keep them private.
Unique UIDs: Give each shortened URL a special code (UID) you choose. This makes your links easy to recognize and track—like naming your favorite playlist instead of a random string.
Secure & Scalable: Keeps your links safe with passwords and grows with your needs, whether it’s a small project or something bigger.
Tech Stack
Frontend: React
Backend: TypeScript, Node.js
Database: Prisma ORM
Deployment: Vercel (frontend/serverless), AWS EC2 (backend)
Prerequisites
Node.js (v16+ recommended)
npm or yarn
A database (e.g., PostgreSQL, compatible with Prisma)
Installation
Clone the GitHub repo:

bash
Wrap
Copy
git clone https://github.com/akshat09022002/Turl.git
cd Turl
The Turl folder has two subfolders: Backend and Frontend.

Backend Setup
Navigate to Backend:

bash
Wrap
Copy
cd Backend
Install dependencies:

bash
Wrap
Copy
npm install
Frontend Setup
Navigate to Frontend/Frontend:

bash
Wrap
Copy
cd ../Frontend/Frontend
Install dependencies:

bash
Wrap
Copy
npm install
Configuration
Both Backend and Frontend folders have a .env.example file. Create a .env file in each folder by copying the example and filling in the values.

1. Frontend .env
In Frontend/Frontend, make a .env file based on .env.example:

text
Wrap
Copy
VITE_BACKEND_API=http://localhost:3000
VITE_FRONTEND_API=http://localhost:5173
VITE_BACKEND_API: Where the backend runs (keep as http://localhost:3000 for local dev).
VITE_FRONTEND_API: Where the frontend runs (default is http://localhost:5173).
2. Backend .env
In Backend, make a .env file based on .env.example:

text
Wrap
Copy
EMAIL="johndoe@gmail.com"
EMAIL_PASSWORD="johndoepassword"
JWT_SECRET="JWT_SECRET"
DATABASE_URL="Enter the database url here"
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
EMAIL & EMAIL_PASSWORD: For sending emails (e.g., Gmail credentials).
JWT_SECRET: A secret key for authentication—make it long and random!
DATABASE_URL: Your database connection string (see below).
FRONTEND_URL: Matches VITE_FRONTEND_API.
BACKEND_URL: Matches VITE_BACKEND_API.
Getting a DATABASE_URL
You can use:

NeonDB: Sign up at neon.tech, create a PostgreSQL DB, and copy the connection string.
Aiven: Register at aiven.io, set up a PostgreSQL instance, and grab the URL.
Docker: Run a local PostgreSQL container:
Install Docker.
Run:
bash
Wrap
Copy
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=yourpassword postgres
Use this DATABASE_URL:
text
Wrap
Copy
postgresql://postgres:yourpassword@localhost:5432/postgres
Setting Up Prisma
In the Backend folder:

Initialize the schema:
bash
Wrap
Copy
npx prisma migrate dev --name Initialize the schema
Generate Prisma client:
bash
Wrap
Copy
npx prisma generate
Running the Project
Backend
In Backend:

bash
Wrap
Copy
npm run dev
Frontend
In Frontend/Frontend:

bash
Wrap
Copy
npm run dev
Visit http://localhost:5173 in your browser to see it live!

Deployment
Vercel: Deploy frontend and serverless functions via vercel --prod.
AWS EC2: Host the backend—configure with your DB and env vars. See the live setup at turl.co.in for reference!
Contributing
Love feedback and ideas! Fork the repo, make your changes, and submit a pull request. Keep it clean and documented.

Contact
Built by Akshat. Reach out via email: akshat@onepunchdev.com. Try Turl and let me know what you think—what works, what could improve?
