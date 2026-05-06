# HelpMate Backend 🛠️

[![Live Link](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://help-mate-server-rubel6623-rubel6623s-projects.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Tech-Stack-blue?style=for-the-badge)](https://github.com/rubel6623)

HelpMate Backend is a robust, scalable, and secure API built to power the HelpMate platform. It provides essential services for user management, task outsourcing, secure payments, and community engagement through blogs.

## 🚀 Live Server
The backend is deployed and accessible at:  
[**https://help-mate-server-rubel6623-rubel6623s-projects.vercel.app**](https://help-mate-server-rubel6623-rubel6623s-projects.vercel.app)

---

## 🛠️ Technology Stack

- **Framework:** Express.js (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) & Bcryptjs
- **Payment Gateway:** Stripe
- **Validation:** Zod
- **Scheduling:** Node-cron
- **Deployment:** Vercel

---

## 🔑 Public API Routes

Below are the public endpoints available in the HelpMate API that do not require authentication:

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Authenticate user and receive token |
| `POST` | `/api/v1/auth/social-login` | Handle social (Google/Facebook) authentication |
| `POST` | `/api/v1/auth/logout` | Clear user session |

### 📂 Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | Retrieve all task categories |
| `GET` | `/api/v1/categories/:id` | Get details of a specific category |

### 📋 Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/tasks` | List all available public tasks |
| `GET` | `/api/v1/tasks/:id` | View detailed information about a task |

### 🌟 Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/reviews/user/:userId` | Get all reviews for a specific user |

### 🏅 Badges
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/badges` | List all available badges on the platform |

### ✍️ Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/blogs` | Fetch all blog posts |
| `GET` | `/api/v1/blogs/:id` | Get a specific blog by ID |
| `GET` | `/api/v1/blogs/slug/:slug` | Retrieve a blog post by its URL slug |

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/HelpMate-backend.git
   cd HelpMate-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL="your_postgresql_url"
   JWT_SECRET="your_secret"
   STRIPE_SECRET_KEY="your_stripe_key"
   ```

4. **Run Database Migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 📜 Key Features
- **Role-Based Access Control (RBAC):** Secure routes for Users, Runners, and Admins.
- **Automated Tasks:** Cron jobs for handling recurring platform operations.
- **Secure Payments:** Integration with Stripe for seamless financial transactions.
- **Optimized Queries:** Efficient data fetching using Prisma and PostgreSQL.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the ISC License.
