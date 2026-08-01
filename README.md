# BlogSphere — Full-Stack Blog Application (MERN)

A full CRUD blogging platform built with **React**, **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.
Built for the Main Flow Services and Technologies Pvt. Ltd. Full-Stack Web Development Internship — Project 2.

---

## ✦ Features

- User Registration & Login with JWT authentication
- Protected routes — only logged-in users can create/edit/delete posts
- View all blog posts on the homepage, with pagination and category filtering
- View a single blog post with full content, tags, author, date, and views
- Create, edit, and delete blog posts (owner-only for edit/delete)
- Responsive, modern UI with a gradient navbar, cards, and hover animations
- 404 Not Found page, loading spinner, and friendly error messages

## ✦ Tech Stack

| Layer    | Technology                                                   |
|----------|---------------------------------------------------------------|
| Frontend | React.js, Vite, React Router DOM, Axios, CSS                 |
| Backend  | Node.js, Express.js                                            |
| Database | MongoDB (Mongoose ODM) — MongoDB Atlas                        |
| Auth     | JSON Web Tokens (JWT), bcryptjs                               |

## ✦ Folder Structure

```
blog-app/
├── client/                  # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/      # Navbar, Footer, PostCard, Spinner, ProtectedRoute
│       ├── pages/           # Home, Login, Register, SinglePost, CreatePost, EditPost, NotFound
│       ├── context/         # AuthContext (global auth state)
│       ├── services/        # api.js (Axios instance)
│       ├── styles/          # global.css
│       ├── App.jsx
│       └── main.jsx
├── server/                  # Node.js backend
│   ├── models/               # User.js, Post.js
│   ├── routes/                # auth.js, posts.js
│   ├── middleware/            # auth.js (JWT verification)
│   ├── server.js
│   └── .env.example
└── README.md
```

---

## ✦ Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ and npm
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier is enough)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/blog-app.git
cd blog-app
```

### 2. MongoDB Atlas Setup
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Cluster** (the free M0 tier works fine).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` to allow access from anywhere, for development).
5. Click **Connect → Drivers**, and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/blogDB?retryWrites=true&w=majority
   ```
6. Replace `<username>`, `<password>`, and `<cluster-url>` with your own values.

### 3. Environment Variables

Copy the example env file and fill in your own values:

```bash
cd server
cp .env.example .env
```

`server/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/blogDB?retryWrites=true&w=majority
JWT_SECRET=myVerySecretKeyChangeThis123!
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

> Optionally, create `client/.env` with `VITE_API_URL=http://localhost:5000/api` if your backend runs on a different host/port.

### 4. Backend Commands

```bash
cd server
npm install
npm run dev      # starts with nodemon (auto-restart)
# or
npm start        # starts normally
```
The API will run at `http://localhost:5000`.

### 5. Frontend Commands

```bash
cd client
npm install
npm run dev
```
The app will run at `http://localhost:5173`.

### 6. Open the app
Visit **http://localhost:5173** in your browser.

---

## ✦ API Endpoints

### Auth
| Method | Endpoint             | Description               | Auth required |
|--------|-----------------------|----------------------------|----------------|
| POST   | `/api/auth/register`  | Register a new user        | No             |
| POST   | `/api/auth/login`     | Log in and receive a JWT   | No             |
| GET    | `/api/auth/me`        | Get current user           | Yes            |

### Posts
| Method | Endpoint          | Description                          | Auth required |
|--------|--------------------|----------------------------------------|----------------|
| GET    | `/api/posts`       | Get all posts (pagination/category)   | No             |
| GET    | `/api/posts/:id`   | Get a single post (increments views)  | No             |
| POST   | `/api/posts`       | Create a new post                     | Yes            |
| PUT    | `/api/posts/:id`   | Update a post (owner only)            | Yes            |
| DELETE | `/api/posts/:id`   | Delete a post (owner only)            | Yes            |

---

## ✦ Testing the API

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass1234"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass1234"}'

# Create a post (replace TOKEN)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My First Post","content":"Hello world!","category":"Technology"}'

# Get all posts
curl http://localhost:5000/api/posts
```

---

## ✦ Screenshots

_Add your own screenshots here before submission:_

- Homepage with posts
- Login page
- Create post page
- MongoDB Atlas collection with data

```
screenshots/
├── homepage.png
├── login.png
├── create-post.png
└── mongodb-atlas.png
```

---

## ✦ Deployment (Bonus)

- **Backend** → [Render.com](https://render.com) (free tier)
  1. Push your repo to GitHub.
  2. Create a new **Web Service** on Render, point it at the `server/` folder.
  3. Set the build command to `npm install` and start command to `npm start`.
  4. Add the environment variables from `.env.example` in Render's dashboard.

- **Frontend** → [Vercel.com](https://vercel.com) (free tier)
  1. Import the repo into Vercel, set the root directory to `client/`.
  2. Set the environment variable `VITE_API_URL` to your deployed backend URL (e.g. `https://your-app.onrender.com/api`).
  3. Deploy.

---

## ✦ Author / Submission

- Internship: Full-Stack Web Development
- Provider: Main Flow Services and Technologies Pvt. Ltd.
- Project: Project 2 — Full-Stack Blog Application
