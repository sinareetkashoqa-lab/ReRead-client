# 📚 ReRead - Frontend

This is the **frontend** for ReRead, a community library web application built with **React + Vite**.

## 🎯 Description

ReRead lets neighbors share books with each other. The app supports two types of users:

- 👤 **Regular users**: browse the community's books, lend their own books, and request to borrow from others
- 🛠️ **Admins**: manage users, books, and borrow requests across the whole platform

Login and signup are included with a basic role-based flow (user/admin). Data is persisted in the backend via PostgreSQL.

## 🧑‍💻 User Requirements

1. **Register or Login** with an email and password
2. **Regular users** can:
   - Browse available books shared by the community
   - Add their own books to lend out, and edit or delete their listings
   - Request to borrow a book from another user
   - Approve, decline, or mark as returned any requests they receive as an owner
   - Track requests they've sent, received, and completed
   - Write and view reviews for books they've borrowed
   - View and update their profile, or delete their account
3. **Admin users** can:
   - View and manage all registered users (suspend or delete)
   - View and remove any book in the system
   - View and remove any borrow request in the system
4. The app remembers login sessions using `localStorage`

## 🛠️ Technologies

- React 19
- Vite
- React Router DOM
- Bootstrap (used for the Navbar component only)
- Fetch API
- LocalStorage (for session persistence)

## 🚀 Getting Started

```bash
git clone <repo-url>
cd reread-client
npm install
```

```md
##Create a `.env` file in the project root

VITE_API_BASE_URL=http://localhost:5000
```

Then start the app:

```bash
npm run dev
```
