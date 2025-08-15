class JarvisIntroSystem {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.currentPhase = 0;
        this.voices = [];
        this.cameraPosition = { x: 0, y: 0, z: 0 };
        
        // Enhanced Bootup Sequence
        this.bootupSequence = [
            { phase: "REACTOR_INITIALIZATION", duration: 2000, audio: "reactor_startup" },
            { phase: "ELECTROMAGNETIC_CALIBRATION", duration: 1800, audio: "em_field_active" },
            { phase: "PARTICLE_ACCELERATION", duration: 2200, audio: "particle_stream" },
            { phase: "NANOTECHNOLOGY_SYNC", duration: 1600, audio: "nano_field_sync" },
            { phase: "POWER_CORE_STABLE", duration: 1400, audio: "power_stabilized" },
            { phase: "HOLOGRAPHIC_DISPLAYS_ONLINE", duration: 1200, audio: "holo_active" },
            { phase: "WORKSHOP_ENVIRONMENT_READY", duration: 1000, audio: "workshop_ready" },
            { phase: "JARVIS_CONSCIOUSNESS_LOADING", duration: 2500, audio: "consciousness_load" },
            { phase: "MARK85_SYSTEMS_OPERATIONAL", duration: 1800, audio: "systems_online" },
            { phase: "INITIALIZATION_COMPLETE", duration: 2000, audio: "jarvis_greeting" }
        ];
        
        this.initializeSystem();
    }

    async initializeSystem() {
        try {
            await this.waitForDOM();
            this.initializeAudioContext();
            this.initializeVoiceSystem();
            this.setupEventListeners();
            this.startAutoSequence();
        } catch (error) {
            console.error("System initialization failed:", error);
            this.fallbackInitialization();
        }
    }

    async waitForDOM() {
        if (document.readyState === 'loading') {
            return new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("🔊 Audio Context initialized");
        } catch (error) {
            console.warn("Audio Context not supported:", error);
        }
    }

    initializeVoiceSystem() {
        if ('speechSynthesis' in window) {
            // Wait for voices to load
            const loadVoices = () => {
                this.voices = speechSynthesis.getVoices();
                console.log("🎤 Voice system ready:", this.voices.length, "voices available");
            };
            
            speechSynthesis.addEventListener('voiceschanged', loadVoices);
            loadVoices();
        }
    }

    setupEventListeners() {
        // Auto-start after 3 seconds or on any interaction
        document.addEventListener('click', () => this.startInitialization(), { once: true });
        document.addEventListener('keydown', () => this.startInitialization(), { once: true });
        document.addEventListener('touchstart', () => this.startInitialization(), { once: true });
        
        // Auto-start timer
        setTimeout(() => {
            if (!this.isInitialized) {
                this.startInitialization();
            }
        }, 3000);
    }

    startAutoSequence() {
        // Begin subtle pre-initialization effects
        this.generateAmbientWorkshopSounds();
        this.startCameraPreMovement();
    }

    generateAmbientWorkshopSounds() {
        if (!this.audioContext) return;
        
        // Continuous workshop ambiance
        this.playWorkshopAmbience();
        
        // Periodic mechanical sounds
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.playMechanicalSound();
            }
        }, 3000);
    }

    playWorkshopAmbience() {
        if (!this.audioContext) return;
        
        // Low frequency hum (electrical systems)
        const ambientOsc = this.audioContext.createOscillator();
        const ambientGain = this.audioContext.createGain();
        
        ambientOsc.connect(ambientGain);
        ambientGain.connect(this.audioContext.destination);
        
        ambientOsc.frequency.setValueAtTime(60, this.audioContext.currentTime);
        ambientOsc.type = 'sawtooth';
        
        ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 2);
        
        ambientOsc.start();
        
        // Add some variation
        setInterval(() => {
            if (this.audioContext && ambientOsc) {
                const variation = 55 + Math.random() * 10;
                ambientOsc.frequency.setValueAtTime(variation, this.audioContext.currentTime);
            }
        }, 5000);
    }

    playMechanicalSound() {
        if (!this.audioContext) return;
        
        // Create mechanical workshop sounds
        const sounds = [
            { freq: 200, duration: 0.1, type: 'square' },  // Click
            { freq: 150, duration: 0.3, type: 'sawtooth' }, // Whir
            { freq: 800, duration: 0.05, type: 'sine' }   // Beep
        ];
        
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        this.synthesizeSound(sound.freq, sound.duration, 0.03, sound.type);
    }

    startCameraPreMovement() {
        // Subtle camera movement before initialization
        const chamber = document.querySelector('.arc-reactor-chamber');
        if (chamber) {
            chamber.style.animation = 'cameraOrbit 45s linear infinite';
        }
    }

    async startInitialization() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        console.log("🚀 JARVIS Mark 85 Initialization Starting...");
        
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        // Start reactor initialization sound
        this.playReactorStartupSequence();
        
        // Begin bootup sequence
        this.executeBootupSequence();
    }

    playReactorStartupSequence() {
        // Multi-layered reactor startup sound
        this.playReactorHum();
        setTimeout(() => this.playEnergyCharge(), 1000);
        setTimeout(() => this.playParticleAcceleration(), 2000);
        setTimeout(() => this.playSystemStabilization(), 4000);
    }

    playReactorHum() {
        if (!this.audioContext) return;
        
        // Deep reactor hum with harmonics
        const frequencies = [110, 220, 330, 440];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.synthesizeSound(freq, 3, 0.08 - (index * 0.02), 'sawtooth');
            }, index * 200);
        });
    }

    playEnergyCharge() {
        if (!this.audioContext) return;
        
        // Rising energy sound
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 2);
        osc.type = 'triangle';
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 2);
    }

    playParticleAcceleration() {
        if (!this.audioContext) return;
        
        // Particle acceleration effect
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.synthesizeSound(1000 + (i * 200), 0.1, 0.05, 'sine');
            }, i * 100);
        }
    }

    playSystemStabilization() {
        if (!this.audioContext) return;
        
        // Stabilization chord
        const chord = [440, 554.37, 659.25]; // A major chord
        chord.forEach((freq, index) => {
            setTimeout(() => {
                this.synthesizeSound(freq, 1.5, 0.06, 'sine');
            }, index * 100);
        });
    }

    synthesizeSound(frequency, duration, volume, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    async executeBootupSequence() {
        const statusDots = document.querySelectorAll('.dot');
        
        for (let i = 0; i < this.bootupSequence.length; i++) {
            const sequence = this.bootupSequence[i];
            
            console.log(`🔄 ${sequence.phase}`);
            
            // Update status indicators
            this.updateStatusIndicators(statusDots, i);
            
            // Play phase-specific audio
            this.playPhaseAudio(sequence.audio);
            
            // Camera movement for this phase
            this.executeCameraMovement(i);
            
            // Wait for phase duration
            await this.delay(sequence.duration);
        }
        
        // Final JARVIS voice synthesis
        await this.speakJarvisGreeting();
        
        // Complete initialization
        setTimeout(() => {
            this.completeInitialization();
        }, 2000);
    }

    updateStatusIndicators(dots, activeIndex) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.min(activeIndex, dots.length - 1));
        });
    }

    playPhaseAudio(audioType) {
        if (!this.audioContext) return;
        
        const audioMap = {
            reactor_startup: () => this.playReactorHum(),
            em_field_active: () => this.synthesizeSound(330, 1, 0.07, 'triangle'),
            particle_stream: () => this.playParticleAcceleration(),
            nano_field_sync: () => this.synthesizeSound(880, 0.8, 0.05, 'sine'),
            power_stabilized: () => this.synthesizeSound(220, 1.2, 0.08, 'sawtooth'),
            holo_active: () => this.synthesizeSound(660, 0.6, 0.04, 'triangle'),
            workshop_ready: () => this.synthesizeSound(440, 1, 0.06, 'sine'),
            consciousness_load: () => this.playConsciousnessLoad(),
            systems_online: () => this.playSystemsOnline(),
            jarvis_greeting: () => {} // Handled separately
        };
        
        const audioFunction = audioMap[audioType];
        if (audioFunction) {
            audioFunction();
        }
    }

    playConsciousnessLoad() {
        // Complex consciousness loading sound
        const baseFreq = 200;
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.synthesizeSound(baseFreq * (1 + i * 0.1), 0.3, 0.03, 'triangle');
            }, i * 200);
        }
    }

    playSystemsOnline() {
        // Systems coming online sequence
        const frequencies = [440, 554, 659, 880];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.synthesizeSound(freq, 0.5, 0.06, 'sine');
            }, index * 150);
        });
    }

    executeCameraMovement(phase) {
        const chamber = document.querySelector('.arc-reactor-chamber');
        if (!chamber) return;
        
        const movements = [
            'cameraOrbit 30s linear infinite',           // Phase 0
            'cameraOrbit 25s linear infinite',           // Phase 1
            'cameraOrbit 20s linear infinite',           // Phase 2
            'cameraOrbit 35s linear infinite',           // Phase 3
            'cameraOrbit 28s linear infinite',           // Phase 4
            'cameraOrbit 22s linear infinite',           // Phase 5
            'cameraOrbit 40s linear infinite',           // Phase 6
            'cameraOrbit 18s linear infinite',           // Phase 7
            'cameraOrbit 15s linear infinite',           // Phase 8
            'cameraOrbit 45s linear infinite'            // Phase 9
        ];
        
        chamber.style.animation = movements[phase] || movements[0];
    }

    async speakJarvisGreeting() {
        if (!('speechSynthesis' in window)) return;
        
        const greetingText = "JARVIS Mark 85 systems fully operational. Workshop environment stable. All systems ready for deployment.";
        
        try {
            await this.synthesizeVoice(greetingText, {
                rate: 0.8,
                pitch: 0.7,
                volume: 0.9
            });
        } catch (error) {
            console.warn("Voice synthesis failed:", error);
        }
    }

    synthesizeVoice(text, options = {}) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Apply options
            utterance.rate = options.rate || 0.8;
            utterance.pitch = options.pitch || 0.7;
            utterance.volume = options.volume || 0.9;
            
            // Select best voice
            const preferredVoices = this.voices.filter(voice => 
                voice.name.toLowerCase().includes('microsoft') ||
                voice.name.toLowerCase().includes('google') ||
                voice.lang.includes('en-US')
            );
            
            if (preferredVoices.length > 0) {
                utterance.voice = preferredVoices[0];
            }
            
            utterance.onend = resolve;
            utterance.onerror = reject;
            
            speechSynthesis.speak(utterance);
        });
    }

    completeInitialization() {
        console.log("✅ JARVIS Mark 85 Initialization Complete");
        
        // Add completion class for transition
        document.querySelector('.workshop-environment').classList.add('bootup-complete');
        
        // Final audio flourish
        this.playCompletionSound();
        
        // Redirect to main interface
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1500);
    }

    playCompletionSound() {
        if (!this.audioContext) return;
        
        // Triumphant completion chord
        const completionChord = [440, 554.37, 659.25, 880];
        completionChord.forEach((freq, index) => {
            setTimeout(() => {
                this.synthesizeSound(freq, 2, 0.1 - (index * 0.02), 'sine');
            }, index * 100);
        });
    }

    fallbackInitialization() {
        // Fallback if advanced features fail
        console.log("🔄 Fallback initialization");
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize JARVIS on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log("🤖 JARVIS Mark 85 Loading...");
    new JarvisIntroSystem();
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('System error:', event.error);
});

// Prevent context menu and selection for immersive experience
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
