class LoadingSynth {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private mainGain: GainNode | null = null;
  private isPlaying = false;

  init() {
    if (this.isPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      this.filter = this.ctx.createBiquadFilter();
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      this.mainGain = this.ctx.createGain();
      
      // Setup Drone Oscillators (Detuned for chorus/thickness)
      this.droneOsc1.type = "sawtooth";
      this.droneOsc1.frequency.value = 55; // A1
      
      this.droneOsc2.type = "triangle";
      this.droneOsc2.frequency.value = 55.4; // Detuned slightly
      
      // Setup Filter
      this.filter.type = "lowpass";
      this.filter.Q.value = 4;
      
      // Setup LFO to sweep filter cutoff
      this.lfo.type = "sine";
      this.lfo.frequency.value = 0.2; // 0.2Hz (very slow)
      this.lfoGain.gain.value = 180; // Sweep range (+/- 180Hz)
      
      // Setup volumes
      this.mainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.mainGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5); // Fade in
      
      // Connections
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency); // Modulate cutoff
      
      // Set base cutoff frequency
      this.filter.frequency.value = 280;
      
      this.droneOsc1.connect(this.filter);
      this.droneOsc2.connect(this.filter);
      this.filter.connect(this.mainGain);
      this.mainGain.connect(this.ctx.destination);
      
      // Start oscillators
      this.droneOsc1.start();
      this.droneOsc2.start();
      this.lfo.start();
      
      this.isPlaying = true;
    } catch (e) {
      console.warn("Failed to initialize LoadingSynth:", e);
    }
  }

  playBeep() {
    if (!this.ctx || this.ctx.state === "suspended") return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      // Random variation in pitch to sound like keyboard typing/data stream
      osc.frequency.setValueAtTime(700 + Math.random() * 400, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04); // Short decay
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  stop() {
    if (!this.isPlaying) return;
    
    // Fade out drone before stopping
    if (this.mainGain && this.ctx) {
      try {
        const curTime = this.ctx.currentTime;
        this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, curTime);
        this.mainGain.gain.linearRampToValueAtTime(0, curTime + 0.6);
        
        const osc1 = this.droneOsc1;
        const osc2 = this.droneOsc2;
        const l = this.lfo;
        const context = this.ctx;

        setTimeout(() => {
          try {
            osc1?.stop();
            osc2?.stop();
            l?.stop();
            context?.close();
          } catch (e) {}
        }, 700);
      } catch (e) {}
    }
    this.isPlaying = false;
  }
}

export const loadingSynth = new LoadingSynth();
