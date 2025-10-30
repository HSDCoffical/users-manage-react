# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# React Account Management App

A simple **React + TailwindCSS** application that allows users to:

- Create an account (Register)
- Login using their credentials
- View and edit their profile information
- Store all data securely in **Local Storage**

---

## Features

**User Registration** — create a new account with name, email & password  
 **Local Storage Persistence** — user data is saved even after reload  
 **Login Authentication** — only registered users can access the account page  
 **Edit Profile** — users can update their name, email, and password  
 **Responsive UI** — built with TailwindCSS for a clean and mobile-friendly look  
 **Logout Functionality** — clear session and redirect to login

## 🛠️ Tech Stack

- **React** (v18+ use vite)
- **TailwindCSS**
- **React Router DOM**
- **Local Storage**

---

# Setup Instructions

### Clone the repository

```bash
git clone https://github.com/your-username/account-management-app.git
cd account-management-app
```
