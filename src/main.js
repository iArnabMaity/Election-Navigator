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

    const handleSend = async () => {
        const query = userInput.value.trim();
        if (!query) return;

        addMessage(query, 'user');
        userInput.value = '';

        // Real AI Integration via GCP Cloud Function
        // Replace the URL with your actual deployed Cloud Function endpoint
        const CLOUD_FUNCTION_URL = 'https://election-navigator-190597456079.europe-southwest1.run.app/';

        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            });

            if (!response.ok) throw new Error('AI Service Offline');

            const data = await response.json();
            addMessage(data.answer, 'assistant');
        } catch (error) {
            console.error('GCP AI Error:', error);
            // Fallback to local intelligence if the cloud service is not yet deployed
            setTimeout(() => {
                const fallbackResponse = getLocalIntelligence(query);
                addMessage(fallbackResponse, 'assistant');
            }, 500);
        }
    };

    const getLocalIntelligence = (query) => {
        const q = query.toLowerCase();
        if (q.includes('election')) return "An election is a democratic process for choosing leaders. I'm currently running in 'Offline Mode'—deploy your Cloud Function to enable full Vertex AI intelligence!";
        if (q.includes('register')) return "Registration confirms your eligibility. To get full AI-powered registration help, please connect the GCP backend.";
        return "I'm currently operating with limited local knowledge. Once you deploy the GCP Cloud Function, I'll be able to use Vertex AI to answer any question!";
    };
});
