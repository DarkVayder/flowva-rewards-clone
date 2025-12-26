# Flowva Rewards Clone

A **React + Supabase clone** of the Rewards page from [Flowva Hub](https://www.flowvahub.com).  
Built as part of a **React Full-Stack Developer** assessment to showcase UI accuracy, functional logic, and full-stack integration.

---

## Live Demo

[🔗 View Live Page](https://flowva-rewards-clone-chi.vercel.app/)  

## Repository

[🔗 GitHub Repo](https://github.com/DarkVayder/flowva-rewards-clone)

---

## Features

- **Authentication:** Signup, login, and logout via Supabase  
- **Rewards & Points:** Dynamic display of user rewards, points, and streaks  
- **Real-time Data:** Fetch and update user data directly from Supabase  
- **Error Handling:** Loading, empty, and error states handled gracefully  
- **Clean UI:** Responsive and visually faithful to Flowva Hub  
- **Notifications:** Toast messages for user actions  

---

## Tech Stack

- **Frontend:** React 19 + TailwindCSS  
- **Backend:** Supabase (auth, database, API queries)  
- **Routing:** React Router DOM  
- **Icons & UI:** Lucide React + React Icons, React Toastify  
- **Language:** TypeScript for type safety  
- **Linting & Quality:** ESLint  

---

## Installation & Setup

1. Clone the repo:

```bash
git clone https://github.com/DarkVayder/flowva-rewards-clone.git
cd flowva-rewards-clone
Install dependencies:

bash
Copy code
npm install
Configure Supabase:

Create a Supabase project

Add .env file at root with:

env
Copy code
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
Start the dev server:

bash
Copy code
npm run dev
Open your browser at http://localhost:5173.

Project Structure
bash
Copy code
src/
├─ assets/       # Logos, images, icons
├─ components/   # Reusable UI components
├─ hooks/        # Custom hooks (auth, points, streaks)
├─ lib/          # Supabase client setup
├─ pages/        # Main pages (Rewards, Login, Signup)
└─ App.tsx       # App routing & root component
Key Highlights
Supabase Integration: Full use of authentication, queries, and database updates

React Best Practices: Modular, reusable components, custom hooks, clean state management

UI & UX: Faithful replication of Flowva Hub Rewards page

Error & Loading States: Properly handled for seamless UX

Assumptions & Trade-offs
Focused only on Rewards functionality

Supabase calls are placed in hooks for clarity; in production, a separate service layer is recommended

Some minor styling tweaks were made for responsiveness

Author
DarkVayder
GitHub: https://github.com/DarkVayder





