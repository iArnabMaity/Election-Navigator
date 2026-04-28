document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.getElementById('timeline');
    const assistantToggle = document.getElementById('assistant-toggle');
    const assistantPanel = document.getElementById('assistant-panel');
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-query');
    const sendBtn = document.getElementById('send-query');

    // 1. Render Timeline Steps
    electionSteps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'timeline-step';
        stepEl.innerHTML = `
            <div class="step-number">${step.id}</div>
            <div class="step-content">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <span class="material-symbols-outlined" style="color: var(--gcp-blue);">${step.icon}</span>
                    <h3>${step.title}</h3>
                </div>
                <p>${step.description}</p>
                <ul style="margin-top: 1rem; padding-left: 1.5rem; color: var(--gcp-grey-700);">
                    ${step.details.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `;
        timeline.appendChild(stepEl);

        // Simple intersection observer for reveal animation
        setTimeout(() => stepEl.classList.add('active'), index * 200);
    });

    // 2. Assistant Logic
    assistantToggle.addEventListener('click', () => {
        const isVisible = assistantPanel.style.display === 'flex';
        assistantPanel.style.display = isVisible ? 'none' : 'flex';
    });

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;
        msg.innerHTML = `<p>${text}</p>`;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const handleSend = () => {
        const query = userInput.value.trim();
        if (!query) return;

        addMessage(query, 'user');
        userInput.value = '';

        // Simulate GCP API Response (Dialogflow CX Mock)
        setTimeout(() => {
            const response = getMockResponse(query);
            addMessage(response, 'assistant');
        }, 800);
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    const getMockResponse = (query) => {
        const q = query.toLowerCase();
        
        // 1. Core Election Concepts
        if (q.includes('what is election') || q.includes('define election')) {
            return "An election is a formal group decision-making process by which a population chooses an individual or multiple individuals to hold public office. It is the cornerstone of democracy, and our Navigator helps you participate with confidence.";
        }
        if (q.includes('what is registration') || q.includes('define registration') || q.includes('enrollment')) {
            return "Voter registration is the process that verifies your eligibility to vote. It ensures you are on the official 'Voter Roll' for your district. Without registration, you cannot cast a ballot on polling day.";
        }

        // 2. Actionable Guides
        if (q.includes('how to register') || q.includes('how do i register') || q.includes('registration process')) {
            return "To register: 1. Verify eligibility (age/citizenship), 2. Gather ID (Passport/Driver License), 3. Fill out the form online or at a local office. Use our 'Timeline' section above to see exactly where you are in the process!";
        }
        if (q.includes('timeline') || q.includes('dates') || q.includes('when')) {
            return "The election cycle spans several months: roll updates (6mo out), nominations (2mo out), and finally Polling Day. Our Roadmap tracks these milestones in real-time using Cloud Firestore.";
        }

        // 3. Logistics & ID
        if (q.includes('location') || q.includes('polling') || q.includes('where')) {
            return "Polling stations are assigned based on your registration address. Closer to the date, I can use the Google Maps Platform to show you the fastest route to your assigned booth.";
        }
        if (q.includes('id') || q.includes('documents') || q.includes('identification')) {
            return "Typically, you need a government-issued photo ID. This includes a Passport, Driver's License, or Military ID. Some regions also accept utility bills as proof of address.";
        }

        // 4. Candidate & Research
        if (q.includes('candidate') || q.includes('who') || q.includes('manifesto')) {
            return "I can help you analyze candidate platforms! Vertex AI allows me to summarize thousands of pages of manifestos so you can compare stances on the issues that matter to you.";
        }

        // 5. Security & Technology
        if (q.includes('secure') || q.includes('safety') || q.includes('hack') || q.includes('trust')) {
            return "We use GCP's advanced security. Data is stored in Cloud Storage with 'Bucket Lock' enabled, ensuring records are immutable and protected against unauthorized changes.";
        }

        // Intelligent Fallback
        return "That's a specific and important question. As your GCP-powered assistant, I can provide general guidance on registration, timelines, candidate research, and polling security. Which of those topics should we dive into?";
    };
});
