class JarvisAIUltimate {
    constructor() {
        this.version = "JARVIS-Ultimate-v4.0";
        this.systemName = "Just A Rather Very Intelligent System";
        this.isProcessing = false;
        this.isListening = false;
        this.conversationHistory = [];
        this.backendURL = ''; // Same origin for Vercel
        this.currentProvider = null;
        
        // Voice system
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        
        // Initialize system
        this.initialize();
    }

    async initialize() {
        console.log(`🤖 Initializing ${this.systemName} v4.0...`);
        
        try {
            await this.waitForDOM();
            this.initializeUIElements();
            this.setupEventListeners();
            this.initializeVoiceSystem();
            await this.testBackendConnection();
            this.displayWelcomeMessage();
            this.updateSystemStatus("JARVIS Online", "Multi-AI Ready");
            console.log("✅ JARVIS Ultimate System Operational");
        } catch (error) {
            console.error("❌ System initialization failed:", error);
            this.handleInitializationError(error);
        }
    }

    async waitForDOM() {
        if (document.readyState === 'loading') {
            return new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
    }

    initializeUIElements() {
        this.elements = {
            messagesContainer: document.getElementById('messagesContainer'),
            messageInput: document.getElementById('messageInput'),
            messageForm: document.getElementById('messageForm'),
            sendBtn: document.getElementById('sendBtn'),
            recordBtn: document.getElementById('recordBtn'),
            typingIndicator: document.getElementById('typingIndicator'),
            statusText: document.getElementById('statusText'),
            apiStatus: document.getElementById('apiStatus'),
            voiceIndicator: document.getElementById('jarvisVoiceIndicator')
        };

        // Validate required elements
        const missingElements = [];
        for (const [name, element] of Object.entries(this.elements)) {
            if (!element) {
                missingElements.push(name);
            }
        }

        if (missingElements.length > 0) {
            throw new Error(`Missing UI elements: ${missingElements.join(', ')}`);
        }
    }

    setupEventListeners() {
        // Form submission
        this.elements.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processUserMessage();
        });

        // Send button
        this.elements.sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.processUserMessage();
        });

        // Voice button
        this.elements.recordBtn.addEventListener('click', () => {
            this.toggleVoiceInput();
        });

        // Input handling
        this.elements.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateSendButton();
        });

        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.processUserMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.elements.messageInput.value = message;
                this.autoResizeTextarea();
                this.processUserMessage();
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.elements.messageInput.focus();
            }
            if (e.key === 'Escape' && document.activeElement === this.elements.messageInput) {
                this.elements.messageInput.value = '';
                this.autoResizeTextarea();
            }
        });
    }

    initializeVoiceSystem() {
        // Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.elements.recordBtn.classList.add('recording');
                this.elements.voiceIndicator.classList.add('listening');
                this.updateSystemStatus("Listening...", "Voice input active");
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.elements.messageInput.value = transcript;
                this.autoResizeTextarea();
                setTimeout(() => this.processUserMessage(), 500);
            };

            this.recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                this.resetVoiceButton();
                this.updateSystemStatus("Voice error", "Try again or use text");
            };

            this.recognition.onend = () => {
                this.resetVoiceButton();
            };
        } else {
            this.elements.recordBtn.style.display = 'none';
        }

        // Speech Synthesis
        if (this.synthesis) {
            const loadVoices = () => {
                this.voices = this.synthesis.getVoices();
                console.log("🎤 Voice synthesis ready:", this.voices.length, "voices available");
            };
            
            this.synthesis.addEventListener('voiceschanged', loadVoices);
            loadVoices();
        }
    }

    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        const maxHeight = 200;
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = newHeight + 'px';
    }

    updateSendButton() {
        const hasText = this.elements.messageInput.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasText || this.isProcessing;
    }

    toggleVoiceInput() {
        if (!this.recognition) return;

        if (this.isListening) {
            this.recognition.stop();
        } else {
            try {
                this.recognition.start();
            } catch (error) {
                console.error("Speech start error:", error);
                this.updateSystemStatus("Voice unavailable", "Use text input");
            }
        }
    }

    resetVoiceButton() {
        this.isListening = false;
        this.elements.recordBtn.classList.remove('recording');
        this.elements.voiceIndicator.classList.remove('listening');
        this.updateSystemStatus("JARVIS Ready", "Voice input ready");
    }

    async testBackendConnection() {
        try {
            console.log("🔍 Testing backend connection...");
            const response = await fetch('/api/health');
            
            if (response.ok) {
                const data = await response.json();
                console.log("✅ Backend connection successful:", data);
                this.updateSystemStatus("Connected", `${data.apis_configured}/${data.apis_total} APIs ready`);
            } else {
                throw new Error("Backend not responding properly");
            }
        } catch (error) {
            console.error("❌ Backend connection failed:", error);
            this.updateSystemStatus("Backend offline", "API services unavailable");
            throw new Error("Cannot connect to backend. Please check deployment.");
        }
    }

    async processUserMessage() {
        if (this.isProcessing) return;

        const message = this.elements.messageInput.value.trim();
        if (!message) {
            this.elements.messageInput.focus();
            return;
        }

        this.isProcessing = true;
        this.elements.messageInput.value = '';
        this.elements.messageInput.style.height = '54px';
        this.updateSendButton();

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        this.updateSystemStatus("Processing...", "AI thinking...");

        try {
            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: Date.now()
            });

            // Keep history manageable
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Add AI response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response.text,
                timestamp: Date.now()
            });

            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI message to chat
            this.addMessage(response.text, 'jarvis', true);
            
            // Update status
            this.updateSystemStatus("Response complete", `via ${response.provider}`);
            this.currentProvider = response.provider;

        } catch (error) {
            console.error("❌ Error processing message:", error);
            this.hideTypingIndicator();
            
            let errorMessage = "I'm experiencing technical difficulties. ";
            if (error.message.includes("backend")) {
                errorMessage += "The backend services are currently unavailable. Please try again later.";
            } else if (error.message.includes("API")) {
                errorMessage += "There's an issue with the AI providers. Please check the console for details.";
            } else {
                errorMessage += "Please check your connection and try again.";
            }
            
            this.addMessage(errorMessage, 'jarvis');
            this.updateSystemStatus("Error occurred", "System recovery in progress");
        } finally {
            this.isProcessing = false;
            this.updateSendButton();
            setTimeout(() => {
                this.elements.messageInput.focus();
            }, 100);
        }
    }

    async getAIResponse(message) {
        try {
            console.log("📡 Sending request to backend...");
            
            // Determine if this is a test generation request
            const isTestRequest = this.isTestGenerationRequest(message);
            const endpoint = isTestRequest ? '/api/test-generator' : '/api/chat';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory.slice(-6),
                    requestType: isTestRequest ? 'test-generation' : 'conversation'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(`Backend error: ${response.status} - ${errorData.error || errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return {
                text: data.response || "I apologize, but I couldn't generate a response. Please try again.",
                provider: data.provider || "Unknown"
            };

        } catch (error) {
            console.error("❌ API call failed:", error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error("Cannot connect to backend server. Please check deployment status.");
            }
            throw error;
        }
    }

    isTestGenerationRequest(message) {
        const testKeywords = [
            'test', 'quiz', 'exam', 'practice', 'questions', 'mcq', 'assessment',
            'generate test', 'create quiz', 'practice questions', 'mock test'
        ];
        
        const messageLower = message.toLowerCase();
        return testKeywords.some(keyword => messageLower.includes(keyword));
    }

    addMessage(content, sender, withSpeaker = false) {
        const messagesContainer = this.elements.messagesContainer;
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (sender === 'user') {
            messageContent.innerHTML = `<strong>👤 You:</strong> ${this.escapeHTML(content)}`;
        } else {
            messageContent.innerHTML = this.formatAIContent(content);
            
            // Add speaker icon for JARVIS messages
            if (withSpeaker) {
                const speakerIcon = document.createElement('div');
                speakerIcon.className = 'speaker-icon';
                speakerIcon.innerHTML = '🔊';
                speakerIcon.title = 'Click to hear response';
                speakerIcon.addEventListener('click', () => {
                    this.speakText(content);
                });
                messageContent.appendChild(speakerIcon);
            }
        }
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
    }

    formatAIContent(content) {
        // Enhanced formatting for AI responses
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
            .replace(/\n\n/g, '</p><p>') // Paragraphs
            .replace(/\n/g, '<br>') // Line breaks
            .replace(/^/, '<p>') // Start paragraph
            .replace(/$/, '</p>'); // End paragraph
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        const messagesContainer = this.elements.messagesContainer;
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 150);
    }

    showTypingIndicator() {
        this.elements.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.elements.typingIndicator.style.display = 'none';
    }

    updateSystemStatus(status, info) {
        this.elements.statusText.textContent = status;
        if (this.elements.apiStatus && info) {
            this.elements.apiStatus.textContent = info;
        }
    }

    speakText(text) {
        if (!this.synthesis) return;
        
        // Clean text for speech
        const cleanText = text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
            .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
            .replace(/[🤖📚📊🌱🏛️⚡🌍📖🔍💡✅❌⚠️🎯🚀🌟💎]/g, '') // Remove emojis
            .substring(0, 500); // Limit length
        
        if (cleanText.length < 10) return;
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9;
        utterance.volume = 0.8;
        utterance.pitch = 0.8;
        
        // Select best voice
        const preferredVoices = this.voices.filter(voice => 
            voice.name.toLowerCase().includes('microsoft') ||
            voice.name.toLowerCase().includes('google') ||
            voice.lang.includes('en-US')
        );
        
        if (preferredVoices.length > 0) {
            utterance.voice = preferredVoices[0];
        }
        
        // Visual feedback
        this.elements.voiceIndicator.classList.add('speaking');
        
        utterance.onend = () => {
            this.elements.voiceIndicator.classList.remove('speaking');
        };
        
        utterance.onerror = () => {
            this.elements.voiceIndicator.classList.remove('speaking');
        };
        
        this.synthesis.speak(utterance);
    }

    displayWelcomeMessage() {
        // Welcome message is already in HTML
        console.log("👋 Welcome message displayed");
    }

    handleInitializationError(error) {
        console.error("Initialization error:", error);
        
        const errorHtml = `
            <div style="
                padding: 2rem; 
                color: #ff6b6b; 
                font-family: 'Inter', sans-serif; 
                text-align: center;
                background: var(--card-bg);
                border-radius: var(--radius-xl);
                border: 1px solid #ff6b6b;
                margin: 2rem;
            ">
                <h1>🚨 JARVIS Initialization Error</h1>
                <p style="margin: 1rem 0; color: var(--text-secondary);">
                    ${error.message}
                </p>
                <button onclick="location.reload()" style="
                    background: var(--primary-gradient);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    font-size: 1rem;
                    margin-top: 1rem;
                ">
                    🔄 Restart JARVIS
                </button>
            </div>
        `;
        
        document.body.innerHTML = errorHtml;
    }
}

// Initialize JARVIS when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.jarvis = new JarvisAIUltimate();
    });
} else {
    window.jarvis = new JarvisAIUltimate();
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Console branding
console.log(`
🤖 ═══════════════════════════════════════════════════
   JARVIS AI ULTIMATE - Frontend Loaded
   ═══════════════════════════════════════════════════
   🎬 Enhanced Arc Reactor Intro
   🎨 Perplexity-Style Interface  
   🧠 Multi-AI Provider Intelligence
   🔊 Selective Voice Responses
   📝 Advanced Test Generation
   ⚡ Powered by Vercel Serverless
   ═══════════════════════════════════════════════════
`);
