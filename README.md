🎯 AudienceQuery — AI-Powered Unified Inbox (Hackathon Submission)
🚀 Live Demo

🔗 https://your-live-url.com

🎥 Demo Video


🧠 Summary

AudienceQuery is an AI-powered unified ticketing system that helps marketing and support teams manage customer messages across email, chat, and social platforms — all in one clean dashboard.

The system automatically classifies, prioritizes, and routes tickets using AI, and updates the interface in real-time.

This project was built for the RapidQuest AI Marketing Hackathon.

⭐ Key Features
🔥 1. Unified Inbox

Manage email, chat, Instagram, Twitter, and Facebook tickets in one place.

🤖 2. AI Ticket Classification

Automatically generates:

Ticket Type

Priority

Department

Tags

Suggested Reply

Powered by Gemini 2.5 Flash (via Lovable AI Gateway).

⚡ 3. Live Simulation

A “Simulate Ticket” button instantly creates a new ticket and triggers AI classification.

📊 4. Analytics Dashboard

Visual insights with:

Ticket type distribution

Priority distribution

Resolution metrics

🔄 5. Real-time Updates

New tickets and status changes update instantly using Supabase Realtime.

📌 6. Full Ticket Workflow

Open → Assigned → In Progress → Resolved
Status changes tracked with history timeline.

🏗️ Tech Stack

React + TypeScript + Vite

TailwindCSS + shadcn/ui

Supabase (Database + Realtime + Edge Functions)

Lovable AI Gateway (Gemini Model)

Recharts for analytics

🛠️ How to Run Locally
git clone <repo-url>
cd audiencequery
npm install
npm run dev


Then open:
👉 http://localhost:5173

No extra environment setup required (Lovable Cloud preconfigured).

🤖 How AI Classification Works

When a ticket is created or simulated, the frontend sends the message text to:

/functions/v1/classify-ticket


The Edge Function:

Applies the system prompt

Calls Gemini 2.5 Flash

Returns structured JSON:

{
  "type": "complaint",
  "priority": "high",
  "department": "technical",
  "tags": ["login", "bug"],
  "suggestedReply": "Short professional response."
}


The UI updates instantly.

📈 Why This Solves the Challenge

Marketing teams receive thousands of messages across platforms.
AudienceQuery solves this by:

Centralizing all messages in one dashboard

Automating triage using AI

Highlighting urgent issues

Providing instant insights through analytics

Improving response time with suggested replies

This directly addresses Challenge #3: Audience Query Management & Response System.

📚 What’s Implemented

✔ React + Vite + TypeScript frontend

✔ TailwindCSS UI

✔ Unified inbox with filters

✔ AI classification (Gemini 2.5 Flash)

✔ Real-time updates

✔ Ticket workflow + assignment

✔ Analytics dashboard

✔ Demo data seeding

✔ Simulate Ticket button

✔ Deployment + public live URL

✔ GitHub repository

🔮 Next Improvements (Post-hackathon)

Authentication (Agents)

Scheduled auto-escalation

Email integration

Bulk ticket actions

More advanced analytics

🙌 Thank You

Built by Hrushikesh Behera for the RapidQuest AI Marketing Hackathon.