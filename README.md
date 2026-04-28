# Election Navigator: GCP-Powered Interactive Assistant

An intelligent, interactive assistant designed to guide voters through the democratic process using **Google Cloud Platform (GCP)** services. 

## 🎯 Chosen Vertical
**Government & Civic Engagement**: Helping citizens understand complex election timelines, registration steps, and polling logistics through a conversational AI interface.

## 🛠️ The Architecture
The solution follows a modern, serverless architecture optimized for scalability and performance:

1.  **Frontend**: Built with Semantic HTML5, Vanilla CSS (Material 3 principles), and JavaScript.
2.  **Conversational AI (Dialogflow CX)**: Handles multi-turn conversations and state management for complex election flows (e.g., registration document checks).
3.  **Knowledge Base (Vertex AI Search)**: Powers the "Assistant" to answer specific legal and procedural questions by searching through official election manuals.
4.  **Backend Logic (Cloud Functions)**: Serves as the fulfillment layer to fetch real-time polling data and registration office locations.
5.  **Database (Firestore)**: Stores immutable election milestones and user progress logs.

## 🧠 Approach and Logic
-   **Contextual Assistance**: The assistant detects user intent (e.g., "how to register") and provides a tailored checklist based on the user's current phase in the election cycle.
*   **Dynamic Timeline**: The UI features a roadmap that updates as the election progresses, ensuring users only see relevant tasks.
*   **Safety & Security**: By leveraging GCP's secure infrastructure, we ensure that information regarding polling locations and registration is fetched from authoritative sources without tampering.

## 🚀 How It Works
1.  **Interact**: Users scroll through the animated **Interactive Roadmap** to see the four major phases of the election.
2.  **Consult**: Users can open the **Cloud Assistant** (floating action button) at any time to ask questions like "What documents do I need for registration?" or "Find my nearest polling station."
3.  **Learn**: The assistant provides real-time answers by querying the integrated GCP services.

## 📝 Assumptions
-   The user has a modern browser with JavaScript enabled.
-   Official election data (polling stations, dates) is accessible via GCP-integrated APIs.
-   The assistant is intended for informational purposes and guides users to official government portals for actual registration.

---
*Built with ❤️ using Google Antigravity and GCP.*
