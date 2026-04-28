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

    // 2. Assistant Logic - Robust Initialization
    const initAssistant = () => {
        if (!assistantToggle || !assistantPanel || !sendBtn || !userInput) {
            console.error('Chatbot elements not found');
            return;
        }

        assistantToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = window.getComputedStyle(assistantPanel).display !== 'none';
            assistantPanel.style.display = isVisible ? 'none' : 'flex';
        });

        const handleSend = async () => {
            const query = userInput.value.trim();
            if (!query) return;

            addMessage(query, 'user');
            userInput.value = '';

            const CLOUD_FUNCTION_URL = 'https://election-navigator-190597456079.europe-southwest1.run.app/';

            try {
                // Controller to handle timeouts
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch(CLOUD_FUNCTION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                if (data && data.answer) {
                    addMessage(data.answer, 'assistant');
                } else {
                    throw new Error('Invalid AI response format');
                }
            } catch (error) {
                console.warn('AI API Error, switching to local intelligence:', error);
                setTimeout(() => {
                    const fallback = getLocalIntelligence(query);
                    addMessage(fallback, 'assistant');
                }, 500);
            }
        };

        sendBtn.onclick = handleSend;
        userInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleSend();
        };
    };

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;
        msg.innerHTML = `<p>${text}</p>`;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const getLocalIntelligence = (query) => {
        const q = query.toLowerCase();
        if (q.includes('election')) return "An election is the fundamental process of democracy where citizens choose their representatives. My AI is currently initializing—stay tuned for deeper insights!";
        if (q.includes('register') || q.includes('how')) return "To register, you typically need a government ID and proof of residence. You can start the process on your regional election commission website.";
        if (q.includes('timeline') || q.includes('when')) return "The election timeline includes registration deadlines, nomination dates, and finally polling day. Check your local commission for specific dates!";
        return "That's a great question about the election process. I'm currently syncing with my Vertex AI knowledge base to give you a more detailed answer. Is there a specific step you'd like to know more about?";
    };

    // Run initialization
    initAssistant();
});
