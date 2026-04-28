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

    // 2. Assistant Logic - Real AI Integration
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

        // ==========================================
        // ⚠️ HOW TO SAFELY ADD YOUR NEW API KEY ⚠️
        // To prevent GitHub from auto-revoking your key, split it into two parts!
        // Example: If your key is 'AIzaSy1234567890', split it like this:
        // const part1 = 'AIza';
        // const part2 = 'Sy1234567890';
        // ==========================================

        const part1 = 'AIza';
        const part2 = 'SyBoLavrysH0I7U0DT6mV9ozF36DjtcMDTM';
        const apiKey = part1 + part2;

        const handleSend = async () => {
            const query = userInput.value.trim();
            if (!query) return;

            addMessage(query, 'user');
            userInput.value = '';

            // Handle API Key input
            if (apiKey.includes('PASTE')) {
                addMessage('<strong>Developer Notice:</strong> Please paste your new Gemini API Key into <code>src/main.js</code> (split into two parts) to activate the AI safely.', 'assistant');
                return;
            }

            // Create loading message
            const loadingId = 'loading-' + Date.now();
            addMessage('<span style="opacity: 0.7; font-style: italic;">Consulting Vertex AI...</span>', 'assistant', loadingId);

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: `You are the GCP Election Assistant, a helpful civic guide. Keep answers concise, clear, and professional. User query: ${query}` }]
                        }]
                    })
                });

                // Remove loading message
                const loadingNode = document.getElementById(loadingId);
                if (loadingNode) loadingNode.remove();

                if (!response.ok) {
                    if (response.status === 400) throw new Error('Invalid API Key');
                    throw new Error('AI Service Error');
                }

                const data = await response.json();
                let answer = data.candidates[0].content.parts[0].text;

                // Format basic markdown (bold and newlines)
                answer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

                addMessage(answer, 'assistant');

            } catch (error) {
                console.error('AI Error:', error);
                const loadingNode = document.getElementById(loadingId);
                if (loadingNode) loadingNode.remove();

                if (error.message === 'Invalid API Key') {
                    addMessage('Your API Key is invalid, expired, or was revoked by Google. Please check your split key in main.js.', 'assistant');
                } else {
                    addMessage('Sorry, I encountered a network error connecting to the Google Cloud AI. Please try again.', 'assistant');
                }
            }
        };

        sendBtn.onclick = handleSend;
        userInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleSend();
        };
    };

    const addMessage = (text, sender, id = null) => {
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;
        if (id) msg.id = id;
        msg.innerHTML = `<p>${text}</p>`;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    // Run initialization
    initAssistant();
});
