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

> _(Add your actual screenshots here)_

1. **API Key Authentication**
2. **Actor Selection List**
3. **Schema Input Form**
4. **Actor Execution Trigger**
5. **Real-Time Result Display**
6. **Error Alerts (e.g. Invalid Token, Schema Error)**

---

## 🧪 Tested Actor

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
