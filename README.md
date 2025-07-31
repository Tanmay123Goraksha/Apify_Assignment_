# 🌐 Apify Integration Web App

A full-stack React + Express application that allows users to authenticate with their Apify API key, dynamically load and view available actors, fetch input schemas in real-time, run selected actors once with user-defined input, and view results or errors immediately.

---

## 🚀 Features

- 🔐 **API Key Authentication**  
  Securely input your Apify API key to access your account's actors.

- 🎭 **Dynamic Actor Listing**  
  Fetches and displays all your available actors.

- 🧩 **Schema-Based Input Generation**  
  Parses the actor’s input schema at runtime and displays a user-friendly input form or raw JSON input.

- ▶️ **Single Execution Mode**  
  Executes exactly one actor run per request with real-time feedback.

- ⚠️ **Robust Error Handling**  
  Users are clearly informed about invalid API keys, malformed input, execution errors, or unavailable builds.

---

## 🖥️ Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Express.js + Axios
- **API:** [Apify REST API](https://docs.apify.com/api/v2)

---

## 📸 Screenshots
Authentication
<img width="941" height="446" alt="image" src="https://github.com/user-attachments/assets/bd69cc00-029d-4622-92d2-6bb69310b4d1" />
Available Actors
<img width="959" height="404" alt="image" src="https://github.com/user-attachments/assets/6163489e-ba14-4510-acc3-d2e502a30b11" />
Execute Actors
<img width="1916" height="897" alt="image" src="https://github.com/user-attachments/assets/2928d9fc-d001-4aa8-8ee0-8dd12e25c309" />
Error Handling
<img width="1896" height="896" alt="image" src="https://github.com/user-attachments/assets/f42bb1a2-dfc0-4873-8629-b84354daed1f" />





For demonstration, this app uses a simple public actor with input like:

json
{
  "url": "https://www.apify.com/"
}

Project Structure
/frontend
  └── src/
      └── App.jsx (Main logic)
      └── components/
      └── styles.css
/backend
  └── server.

  📝 How It Works
User enters Apify API key.

Backend authenticates and fetches available actors.

User selects an actor.

App fetches the actor’s input schema.

User fills form (or JSON) according to schema.

App sends POST /run to backend.

Actor is executed once, results (or errors) are returned instantly.

📌 Assumptions & Design Decisions
Schema-Driven Input: Fallback to raw JSON textarea if schema is deeply nested or unusable.

No Client-Side Storage: API key is not persisted for security.

Minimal Dependencies: No Redux, DB, or heavy frameworks.

Step-by-Step UX: Simple state-based flow between authentication, actor selection, input, and execution.

✅ Deliverables
✅ Frontend and backend source code

✅ Working UI demonstrating end-to-end flow

✅ Runtime schema fetching and execution

✅ Screenshots and documentation
