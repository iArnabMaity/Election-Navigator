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
        if (q.includes('register')) return "To register, you'll need a valid photo ID and proof of address. Would you like me to find the nearest registration office using Cloud Maps?";
        if (q.includes('timeline')) return "The election timeline usually spans 6 months, starting from voter roll updates to the final certification. You are currently in the 'Research' phase.";
        if (q.includes('step')) return "There are 4 main steps: Registration, Research, Voting, and Counting. Which one would you like to dive into?";
        return "That's a great question about the election process. I'm querying our Vertex AI knowledge base for the most accurate official answer. One moment...";
    };
});
