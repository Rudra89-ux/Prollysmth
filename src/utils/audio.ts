/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for premium soft emotional piano and sound effects.
class AudioSynth {
  private ctx: AudioContext | null = null;
  private backgroundLoopInterval: any = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private mainVolumeNode: GainNode | null = null;

  // Initialize the audio context
  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.mainVolumeNode = this.ctx.createGain();
      this.mainVolumeNode.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.mainVolumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft synth piano note key press generator
  private playPianoNote(frequency: number, duration: number = 2.5, velocity: number = 0.3) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      
      // Node creation
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Osc 1: Warm triangle wave
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(frequency, now);

      // Osc 2: Sub-octave/overtone sine wave for warmth
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 1.5, now);

      // Filter settings for warm soft tone (low-pass)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration);

      // Volume envelope (Piano dynamic response)
      gainNode.gain.setValueAtTime(0, now);
      // Extra crisp attack
      gainNode.gain.linearRampToValueAtTime(velocity, now + 0.03); 
      // Gentle decay & release
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Connections
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      if (this.mainVolumeNode) {
        gainNode.connect(this.mainVolumeNode);
      } else {
        gainNode.connect(this.ctx.destination);
      }

      // Playback
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.error('Audio error playing piano note', e);
    }
  }

  // Play a beautiful, gentle arpeggiator chord (emotional warm chords)
  private playSoftChord(notes: number[], delayBetweenNotes: number = 0.12) {
    if (!this.ctx) return;
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playPianoNote(freq, 3.5, 0.18);
      }, index * delayBetweenNotes * 1000);
    });
  }

  // Start continuous, beautiful soft piano ambient loops
  public startMusicLoop() {
    this.init();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Frequencies representing Cmaj9, Am9, Fmaj7, G6 chords (beautiful dreamy key of C major)
    const chordsFrequencies = [
      // Frame 1: Cmaj9 (C3=130.81, G3=196.00, C4=261.63, E4=329.63, B4=493.88, D5=587.33)
      [130.81, 196.00, 261.63, 329.63, 493.88, 587.33],
      // Frame 2: Am9 (A2=110.00, E3=164.81, A3=220.00, C4=261.63, G4=392.00, B5=987.77)
      [110.00, 164.81, 220.00, 261.63, 392.00, 493.88],
      // Frame 3: Fmaj7 (F2=87.31, C3=130.81, F3=174.61, A3=220.00, E4=329.63, G4=392.00)
      [87.31, 130.81, 174.61, 220.00, 329.63, 392.00],
      // Frame 4: Gadd9 (G2=98.00, D3=146.83, G3=196.00, B3=246.94, D4=293.66, A4=440.00)
      [98.00, 146.83, 196.00, 246.94, 293.66, 440.00]
    ];

    // High register romantic sweet melodies to random play over the chords
    const highMelodyNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50]; // C5, D5, E5, G5, A5, B5, C6

    let chordIndex = 0;

    const playCycle = () => {
      this.init();
      const currentChord = chordsFrequencies[chordIndex];
      this.playSoftChord(currentChord, 0.16);

      // Play 2 cute random melody notes at intervals after the chord base
      setTimeout(() => {
        const randMelody1 = highMelodyNotes[Math.floor(Math.random() * highMelodyNotes.length)];
        this.playPianoNote(randMelody1, 2.0, 0.12);
      }, 1500);

      setTimeout(() => {
        const randMelody2 = highMelodyNotes[Math.floor(Math.random() * highMelodyNotes.length)];
        this.playPianoNote(randMelody2, 2.0, 0.10);
      }, 3000);

      chordIndex = (chordIndex + 1) % chordsFrequencies.length;
    };

    // Initial play
    playCycle();

    // Loop interval which matches our chord pacing (every 5 seconds)
    this.backgroundLoopInterval = setInterval(playCycle, 5000);
  }

  // Stops the ambient piano loops
  public stopMusicLoop() {
    if (this.backgroundLoopInterval) {
      clearInterval(this.backgroundLoopInterval);
      this.backgroundLoopInterval = null;
    }
    this.isMusicPlaying = false;
  }

  // Play magical celebratory birthday bell chords
  public playBirthdayChime() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    // Arpeggio matching sweet chime tones (E5, G5, C6, E6, G6, C7)
    const bells = [659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    const now = this.ctx.currentTime;

    bells.forEach((freq, index) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const noteTime = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const sineOsc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        sineOsc.type = 'triangle';
        sineOsc.frequency.setValueAtTime(freq * 2, noteTime);

        gainNode.gain.setValueAtTime(0, noteTime);
        gainNode.gain.linearRampToValueAtTime(0.12, noteTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.2);

        osc.connect(gainNode);
        sineOsc.connect(gainNode);
        if (this.mainVolumeNode) {
          gainNode.connect(this.mainVolumeNode);
        } else {
          gainNode.connect(this.ctx.destination);
        }

        osc.start(noteTime);
        sineOsc.start(noteTime);
        osc.stop(noteTime + 1.3);
        sineOsc.stop(noteTime + 1.3);
      }, index * 100);
    });
  }

  // Sound effect for page navigation click (gentle clean ping)
  public playPageClick() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // Sweet high A note
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gainNode);
      if (this.mainVolumeNode) {
        gainNode.connect(this.mainVolumeNode);
      } else {
        gainNode.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Sound effect for popping the gift/balloon elements
  public playPopSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      
      // Noise buffer for the pop texture
      const bufferSize = this.ctx.sampleRate * 0.05; // 50ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      if (this.mainVolumeNode) {
        gainNode.connect(this.mainVolumeNode);
      } else {
        gainNode.connect(this.ctx.destination);
      }

      noiseNode.start(now);
      noiseNode.stop(now + 0.06);

      // Low frequency thump for fullness
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(180, now);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      subOsc.connect(subGain);
      if (this.mainVolumeNode) {
        subGain.connect(this.mainVolumeNode);
      } else {
        subGain.connect(this.ctx.destination);
      }
      subOsc.start(now);
      subOsc.stop(now + 0.06);
    } catch {}
  }

  // Toggles the mute state
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.mainVolumeNode) {
      this.mainVolumeNode.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx?.currentTime || 0);
    }
    // Proactively start if music was blocked by browser
    if (!this.isMuted && !this.isMusicPlaying) {
      this.startMusicLoop();
    }
    return this.isMuted;
  }

  // Checking audio state
  public getMuteState() {
    return this.isMuted;
  }
}

export const audioSynth = new AudioSynth();
