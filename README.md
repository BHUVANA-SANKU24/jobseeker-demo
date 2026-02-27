# Jobseeker Registration – Demo Portal

This project is a **UI-only demo / prototype** of a government-style jobseeker registration portal built with **Next.js** and **Tailwind CSS**.

> **Important:**  
> - This is **not** the real DEET website and is not affiliated with any government department.  
> - The design uses **neutral branding** and **no official logos**.  
> - The application runs entirely in the browser. **No external APIs, scraping, or real submissions** are performed.

## Features

- Landing page with clear **"Demo / Prototype"** labelling.
- Registration form inspired by government jobseeker flows:
  - Upload resume (PDF only, simulated parsing).
  - Personal details.
  - Education details.
  - Skills (comma separated).
  - Employment status (Fresher / Experienced).
- Mock **AI-style auto-fill** when a PDF is selected:
  - Fills fields with sample data.
  - Highlights auto-filled fields in **light green**.
  - All fields remain fully editable.
- Final summary page:
  - Shows a **structured profile**.
  - Button to **copy data** for use in an official portal.
- Simple, neutral, government-inspired layout:
  - Card-based sections.
  - Clean typography.
  - Mobile responsive.

## Running the project

To run this project locally you will need Node.js and a package manager such as `npm`, `yarn`, or `pnpm`.

```bash
cd jobseeker-demo
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Notes

- Resume uploads are not actually parsed; instead, the app uses mock data to simulate auto-fill.
- Profile information is stored **only in `sessionStorage`** inside your browser between pages.
- This prototype is intended for design discussions, demos, and experimentation only.
