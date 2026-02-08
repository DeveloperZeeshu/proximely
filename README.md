# Proximely 🛍️

A full-stack, location-based platform that helps users find nearby shops selling the products they search for — complete with prices, distance, and Google Maps navigation. Built with the **MERN / Next.js stack**, Proximely delivers an intuitive experience for both customers and shop owners, now with **email verification, Google OAuth, and scalable pagination**.

---

## 🚀 Features

### 🧑‍💼 For Users
- 🔍 Search for products by name or category.
- 📍 Discover nearby shops using real-time GPS coordinates.
- 💰 Compare prices across local shops.
- 📌 View shop details: price, distance, availability, and map directions.
- 🗺️ Get redirected to shop location via Google Maps.
- ⚡ Cursor-based **pagination** for faster, scalable search results.
- 🔐 **Optional Google OAuth** login and **email verification** for secure accounts.

### 🏪 For Shop Owners
- 📝 Register and manage shop profiles.
- 📦 Add, update, or deactivate product listings.
- 📊 Access a **personalized shop dashboard** with stats (total products, in-stock, out-of-stock).
- 🔐 Secure login with JWT and email verification.
- 🛠️ Real-time product management for nearby buyers.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, React Hook Form
- **Backend**: Node.js, Next.js API routes, Mongoose (MongoDB)
- **Authentication & Security**: JWT, Google OAuth, Email Verification, Argon2
- **Database**: MongoDB
- **State Management**: Redux Toolkit
- **Others**: Google Maps API, Cursor-based pagination

---

## 🔐 Authentication & Security
- Passwords hashed using **argon2**
- JSON Web Token (**JWT**) + optional session-based authentication
- Email verification for account activation
- Google OAuth integration for login
- Protected routes for shop dashboards and management

---

## 🧭 How It Works
1. **User searches** for a product by name or category.
2. **Backend fetches nearby shops** using location data in MongoDB.
3. **Products are filtered** by shop proximity, availability, and optionally sorted by distance or price.
4. **Cursor-based pagination** ensures smooth and scalable browsing of results.
5. **Shops are displayed** with product details, price, distance, and Google Maps links.
6. **Shop owners manage products** via secure, real-time dashboards.

---

## 🙋‍♂️ Author
Made with ❤️ by **Jeesan Abbas**
