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
        
        // Comprehensive Mock Logic for Common Election Queries
        if (q.includes('register') || q.includes('enroll')) {
            return "To register, you'll need a valid photo ID (like a Passport or Driver's License) and proof of address. You can register online via the official portal or in person at your local election office. Would you like me to find the nearest registration office using Cloud Maps?";
        }
        if (q.includes('timeline') || q.includes('dates') || q.includes('when')) {
            return "Election timelines vary by region, but generally follow this sequence: 1. Voter roll updates (6 months prior), 2. Candidate nominations (2 months prior), 3. Campaign period, and 4. Polling Day. You are currently in the 'Research' phase.";
        }
        if (q.includes('step') || q.includes('process') || q.includes('how')) {
            return "The democratic process involves 4 main steps: Registration (getting on the roll), Research (knowing the candidates), Voting (casting your ballot), and Counting (verification of results). Which specific part can I explain further?";
        }
        if (q.includes('location') || q.includes('polling') || q.includes('where')) {
            return "Your polling station is typically assigned based on your registered address. I can query the Google Maps API to find your specific station if you provide your zip code!";
        }
        if (q.includes('id') || q.includes('documents') || q.includes('identification')) {
            return "Most regions require a government-issued photo ID. Accepted documents usually include a Driver's License, Passport, or National ID card. Would you like a regional checklist?";
        }
        if (q.includes('candidate') || q.includes('who')) {
            return "I can help you analyze candidate platforms! Using Vertex AI, I can summarize official manifestos and compare their stances on key issues like health, education, and the economy.";
        }
        if (q.includes('secure') || q.includes('safety') || q.includes('hack')) {
            return "Election integrity is our priority. We use GCP's Immutable Storage and VPC Service Controls to ensure all result data is tamper-proof and encrypted at rest.";
        }

        // Intelligent Fallback
        return "That's an important question about the election. As your GCP Assistant, I'm currently using Vertex AI to analyze official electoral data for the most accurate answer. Is there a specific part of the registration or voting process you're concerned about?";
    };
});
