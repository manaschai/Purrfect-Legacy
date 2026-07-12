/* ==========================================================================
   PURRFECT LEGACY - GAME LOGIC
   ========================================================================== */

// --- DYNAMIC AUDIO ENGINE (Web Audio API) ---
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }

  playMeow(pitchMultiplier = 1) {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(750 * pitchMultiplier, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(500 * pitchMultiplier, now + 0.35);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  playPurr() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const duration = 1.0;
    
    // Purr is simulated by low frequency oscillations modulating a low drone
    const carrier = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const mainGain = this.ctx.createGain();

    carrier.type = 'sawtooth';
    carrier.frequency.value = 85;

    modulator.type = 'sine';
    modulator.frequency.value = 25; // 25 Hz flutter

    modGain.gain.value = 15; // frequency modulation depth

    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    mainGain.gain.setValueAtTime(0.08, now + duration - 0.15);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Apply lowpass filter to make it warmer/muffled
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    modulator.connect(modGain);
    modGain.connect(carrier.frequency); // frequency modulation
    
    carrier.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    carrier.start(now);
    modulator.start(now);
    
    carrier.stop(now + duration);
    modulator.stop(now + duration);
  }

  playCrunch() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    // Generate buffer of noise for crunching
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.08);
  }

  playSqueak() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.12);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playScoop() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const duration = 0.25;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  playPhoneTone(f1, f2, duration = 0.15) {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.setValueAtTime(f1, now);
    osc2.frequency.setValueAtTime(f2, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playPhoneRing() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const ringStyle = (state.data && state.data.phoneRingtone) ? state.data.phoneRingtone : 'classic';
    const now = this.ctx.currentTime;
    
    if (ringStyle === 'classic') {
      const playRing = (delay) => {
        const t = now + delay;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.frequency.setValueAtTime(440, t);
        osc2.frequency.setValueAtTime(480, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.05);
        gain.gain.setValueAtTime(0.06, t + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.45);
        osc2.stop(t + 0.45);
      };
      playRing(0);
      playRing(0.65);
    } else if (ringStyle === 'meow') {
      const playChirp = (freq, delay, dur) => {
        const t = now + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.2, t + dur);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + dur);
      };
      playChirp(523, 0, 0.15);
      playChirp(659, 0.2, 0.15);
      playChirp(784, 0.4, 0.25);
    } else if (ringStyle === 'retro') {
      const playBeep = (freq, delay, dur) => {
        const t = now + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.02);
        gain.gain.setValueAtTime(0.05, t + dur - 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + dur);
      };
      playBeep(880, 0, 0.08);
      playBeep(1200, 0.09, 0.08);
      playBeep(880, 0.18, 0.08);
      playBeep(1200, 0.27, 0.18);
    } else if (ringStyle === 'disco') {
      const playFunk = (freq, delay, dur) => {
        const t = now + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(t);
        osc.stop(t + dur);
      };
      playFunk(261.63, 0, 0.12);
      playFunk(392.00, 0.15, 0.12);
      playFunk(349.23, 0.3, 0.08);
      playFunk(440.00, 0.4, 0.22);
    }
  }

  playSneeze() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    
    // Sneezing consists of a brief high-pitched inhalation ("a-") followed by a white-noise puff ("-choo!")
    
    // 1. Inhalation ("A-")
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.15);
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // 2. Exhalation Puff ("-choo!")
    const duration = 0.25;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.5;
    
    const noiseGain = this.ctx.createGain();
    const puffTime = now + 0.15;
    noiseGain.gain.setValueAtTime(0, puffTime);
    noiseGain.gain.linearRampToValueAtTime(0.15, puffTime + 0.03);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, puffTime + duration);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start(puffTime);
    noise.stop(puffTime + duration);
  }

  playVacuum() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const duration = 1.5;
    
    // Synthesize motor buzz + white noise suction hum
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    
    const oscFilter = this.ctx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.value = 220;
    
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.04, now + 0.15);
    oscGain.gain.setValueAtTime(0.04, now + duration - 0.2);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + duration);

    // Suction Noise
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 800;
    noiseFilter.Q.value = 1.0;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.15);
    noiseGain.gain.setValueAtTime(0.05, now + duration - 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start(now);
    noise.stop(now + duration);
  }

  playCameraClick() {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    // 1. High frequency mechanical "shutter click"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

    // 2. Short noise burst for shutter leaf slide
    const duration = 0.05;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4000;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.1, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.02);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start(now + 0.02);
    noise.stop(now + duration + 0.02);
  }
}

const audio = new AudioEngine();

// --- CONSTANTS & CONFIGS ---
const BASE_COLORS = [
  { name: 'Cream', hex: '#ffd8a8' },
  { name: 'Ginger', hex: '#ff922b' },
  { name: 'Charcoal', hex: '#495057' },
  { name: 'Grey', hex: '#adb5bd' },
  { name: 'Chocolate', hex: '#873e23' },
  { name: 'White', hex: '#f8f9fa' }
];

const ACCENT_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Ginger', hex: '#ff922b' },
  { name: 'Dark Charcoal', hex: '#212529' },
  { name: 'Peach', hex: '#ffc078' },
  { name: 'Cream', hex: '#ffe8cc' }
];

const EYE_COLORS = [
  { name: 'Emerald', hex: '#20c997' },
  { name: 'Sapphire', hex: '#339af0' },
  { name: 'Amber', hex: '#fcc419' },
  { name: 'Aqua', hex: '#15aabf' }
];

const PERSONALITIES = {
  playful: {
    name: 'Playful',
    desc: 'Loves play; energy decays 30% slower during play, hunger decays 20% faster, loves feathers.',
    hungerMult: 1.2,
    thirstMult: 1.0,
    affectionMult: 1.0,
    energyMult: 0.8,
    cleanMult: 1.0
  },
  lazy: {
    name: 'Couch Potato',
    desc: 'Recovers energy 1.5x faster when sleeping, moves around less, loses interest in games quickly.',
    hungerMult: 0.8,
    thirstMult: 0.8,
    affectionMult: 0.9,
    energyMult: 1.1,
    cleanMult: 0.9
  },
  glutton: {
    name: 'Glutton',
    desc: 'Hungry/thirsty 30% faster, but gets massive +15 coin bonuses when fed high-quality treats.',
    hungerMult: 1.3,
    thirstMult: 1.3,
    affectionMult: 1.0,
    energyMult: 1.0,
    cleanMult: 1.1
  },
  needy: {
    name: 'Velcro Cat',
    desc: 'Affection decays 40% faster, but gains double affection and purrs loudest when petted.',
    hungerMult: 1.0,
    thirstMult: 1.0,
    affectionMult: 1.4,
    energyMult: 1.0,
    cleanMult: 1.0
  },
  sassy: {
    name: 'Sassy',
    desc: 'Affection decays 30% slower, but will hiss and lose affection if petted when energy is under 30.',
    hungerMult: 1.0,
    thirstMult: 1.0,
    affectionMult: 0.7,
    energyMult: 1.0,
    cleanMult: 0.8
  }
};

const SHOP_ITEMS = [
  { id: 'salmon_treats', name: 'Premium Salmon', cost: 15, desc: 'Feeds a cat: +45 Hunger, +15 Affection.', reusable: false, icon: '🐟' },
  { id: 'spring_water', name: 'Glacier Water', cost: 10, desc: 'Quenches thirst: +50 Thirst, +5 Energy.', reusable: false, icon: '💧' },
  { id: 'feather_wand', name: 'Feather Wand', cost: 25, desc: 'Play toy: +30 Affection, -12 Energy. (Reusable)', reusable: true, icon: '🪶' },
  { id: 'laser_pointer', name: 'Red Laser Pointer', cost: 45, desc: 'Premium toy: +45 Affection, -18 Energy. (Reusable)', reusable: true, icon: '🔦' },
  { id: 'catnip_mouse', name: 'Catnip Mouse', cost: 65, desc: 'Ultimate Toy: +60 Affection, +20 Energy, boost growth! (Reusable)', reusable: true, icon: '🐭' },
  { id: 'brush', name: 'Soft Slicker Brush', cost: 35, desc: 'Grooming tool: +35 Cleanliness, +15 Affection. (Reusable)', reusable: true, icon: '🪮' },
  { id: 'deluxe_bed', name: 'Deluxe Heated Bed', cost: 80, desc: 'Active item: sleep recovers energy 2x faster.', reusable: true, isPassive: true, icon: '🛏️' },
  { id: 'auto_feeder', name: 'Robo Auto-Feeder', cost: 120, desc: 'Passive: hunger decay is cut in half.', reusable: true, isPassive: true, icon: '🤖' },
  { id: 'litter_robot', name: 'Self-Scooping Robot', cost: 150, desc: 'Passive: cleanliness decay is cut in half.', reusable: true, isPassive: true, icon: '🧹' }
];

// --- VECTOR CAT SVG RENDERER ---
function renderCatSVG(cat, isThumbnail = false) {
  const genes = cat.genes;
  const state = cat.status || 'idle';
  const size = isThumbnail ? 70 : (cat.growth >= 100 ? 120 : 70 + (cat.growth * 0.5));
  
  // Choose face/eyes based on state
  let eyesHTML = '';
  let mouthHTML = '';
  let faceClasses = 'cat-breathing';
  let bodyClasses = 'cat-breathing';
  let tailClasses = 'cat-tail-wag';

  // Base eye path coordinates (left: cx=40, right: cx=60, cy=45, r=5)
  if (state === 'sleeping') {
    eyesHTML = `
      <path d="M 36 46 Q 40 50 44 46" stroke="${genes.eyeColor}" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M 56 46 Q 60 50 64 46" stroke="${genes.eyeColor}" stroke-width="2.5" fill="none" stroke-linecap="round" />
    `;
    mouthHTML = `<path d="M 47 52 Q 50 50 53 52" stroke="#331811" stroke-width="1.5" fill="none" stroke-linecap="round" />`;
    bodyClasses += ' cat-sleeping';
    faceClasses += ' cat-sleeping';
  } else if (state === 'petting' || state === 'happy') {
    eyesHTML = `
      <path d="M 36 47 Q 40 43 44 47" stroke="${genes.eyeColor}" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 56 47 Q 60 43 64 47" stroke="${genes.eyeColor}" stroke-width="3" fill="none" stroke-linecap="round" />
    `;
    mouthHTML = `<path d="M 46 51 Q 50 55 54 51" fill="#ec407a" />`;
    bodyClasses += ' cat-purring';
    faceClasses += ' cat-purring';
  } else if (cat.hunger < 30 || cat.affection < 30) {
    eyesHTML = `
      <ellipse cx="40" cy="46" rx="5" ry="3" fill="${genes.eyeColor}" />
      <circle cx="40" cy="46" r="1.5" fill="#ffffff" />
      <ellipse cx="60" cy="46" rx="5" ry="3" fill="${genes.eyeColor}" />
      <circle cx="60" cy="46" r="1.5" fill="#ffffff" />
    `;
    mouthHTML = `<path d="M 47 53 Q 50 51 53 53" stroke="#331811" stroke-width="1.5" fill="none" stroke-linecap="round" />`;
  } else {
    eyesHTML = `
      <circle cx="40" cy="46" r="6.5" fill="${genes.eyeColor}" />
      <circle cx="40" cy="46" r="3" fill="#111111" class="cat-eye-blink" />
      <circle cx="38" cy="44" r="2" fill="#ffffff" />
      <circle cx="60" cy="46" r="6.5" fill="${genes.eyeColor}" />
      <circle cx="60" cy="46" r="3" fill="#111111" class="cat-eye-blink" />
      <circle cx="58" cy="44" r="2" fill="#ffffff" />
    `;
    mouthHTML = `
      <path d="M 46 51 Q 50 53 50 51 Q 50 53 54 51" stroke="#331811" stroke-width="1.5" fill="none" stroke-linecap="round" />
    `;
  }

  if (state === 'eating') {
    mouthHTML = `<ellipse cx="50" cy="52" rx="3.5" ry="4.5" fill="#ec407a" class="cat-eating" />`;
    bodyClasses += ' cat-eating';
  }

  if (state === 'playing') {
    bodyClasses += ' cat-playing';
    faceClasses += ' cat-playing';
  }

  let patternGraphicsHTML = '';
  if (genes.pattern === 'tabby') {
    patternGraphicsHTML = `
      <path d="M 46 32 L 48 37 M 50 31 L 50 37 M 54 32 L 52 37" stroke="${genes.accentColor}" stroke-width="2" stroke-linecap="round" />
      <path d="M 31 43 L 36 44 M 30 47 L 35 47" stroke="${genes.accentColor}" stroke-width="2" stroke-linecap="round" />
      <path d="M 69 43 L 64 44 M 70 47 L 65 47" stroke="${genes.accentColor}" stroke-width="2" stroke-linecap="round" />
      <path d="M 28 66 L 35 68 M 27 74 L 34 75 M 29 82 L 35 82" stroke="${genes.accentColor}" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 72 66 L 65 68 M 73 74 L 66 75 M 71 82 L 65 82" stroke="${genes.accentColor}" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (genes.pattern === 'tuxedo') {
    patternGraphicsHTML = `
      <path d="M 38 62 C 34 74 38 88 50 90 C 62 88 66 74 62 62 Z" fill="#ffffff" />
      <path d="M 44 51 L 50 47 L 56 51 L 50 56 Z" fill="#ffffff" />
    `;
  } else if (genes.pattern === 'pointed') {
    patternGraphicsHTML = `
      <path d="M 40 40 C 34 44 34 50 40 55 C 44 58 56 58 60 55 C 66 50 66 44 60 40 Z" fill="${genes.accentColor}" opacity="0.85" />
    `;
  }

  let leftPawColor = genes.baseColor;
  let rightPawColor = genes.baseColor;
  if (genes.pattern === 'tuxedo') {
    leftPawColor = '#ffffff';
    rightPawColor = '#ffffff';
  } else if (genes.pattern === 'pointed') {
    leftPawColor = genes.accentColor;
    rightPawColor = genes.accentColor;
  }

  let tailHTML = '';
  if (genes.tailStyle === 'bobtail') {
    tailHTML = `<path d="M 23 88 C 20 86 18 88 20 92 C 22 95 25 94 25 90 Z" fill="${genes.pattern === 'pointed' ? genes.accentColor : genes.baseColor}" class="${tailClasses}" />`;
  } else if (genes.tailStyle === 'fluffy') {
    tailHTML = `
      <path d="M 24 88 C 12 84 4 68 12 58 C 16 54 22 58 20 66 C 18 72 26 80 26 85 Z" fill="${genes.pattern === 'pointed' ? genes.accentColor : genes.baseColor}" class="${tailClasses}" />
      <path d="M 12 70 Q 15 65 10 60" stroke="${genes.pattern === 'tabby' ? genes.accentColor : 'rgba(255,255,255,0.2)'}" stroke-width="1.5" fill="none" class="${tailClasses}" />
    `;
  } else {
    tailHTML = `<path d="M 24 90 C 14 90 6 78 12 60 C 14 55 18 56 16 63 C 12 76 19 84 25 84 Z" fill="${genes.pattern === 'pointed' ? genes.accentColor : genes.baseColor}" class="${tailClasses}" />`;
  }

  let innerEarLeftColor = '#ffcdd2';
  let earColorLeft = genes.baseColor;
  let earColorRight = genes.baseColor;
  
  if (genes.pattern === 'pointed') {
    earColorLeft = genes.accentColor;
    earColorRight = genes.accentColor;
  }

  // --- ACCESSORY RENDERING ---
  let accessoriesHTML = '';
  if (cat.accessories) {
    const acc = cat.accessories;
    
    // 1. Glasses (render before hat/neckwear)
    if (acc.glasses && acc.glasses.style !== 'none') {
      const pColor = acc.glasses.primaryColor || '#212121';
      const aColor = acc.glasses.accentColor || '#ffca28';
      
      if (acc.glasses.style === 'sunglasses') {
        accessoriesHTML += `
          <g class="${faceClasses}">
            <ellipse cx="40" cy="46" rx="8" ry="6" fill="${pColor}" opacity="0.95" />
            <ellipse cx="60" cy="46" rx="8" ry="6" fill="${pColor}" opacity="0.95" />
            <path d="M 45,45 Q 50,42 55,45" stroke="${aColor}" stroke-width="2.2" fill="none" />
          </g>
        `;
      } else if (acc.glasses.style === 'smart_glasses') {
        accessoriesHTML += `
          <g class="${faceClasses}">
            <circle cx="40" cy="46" r="7.5" stroke="${pColor}" stroke-width="2.2" fill="none" />
            <circle cx="60" cy="46" r="7.5" stroke="${pColor}" stroke-width="2.2" fill="none" />
            <line x1="47.5" y1="46" x2="52.5" y2="46" stroke="${pColor}" stroke-width="2.2" />
          </g>
        `;
      } else if (acc.glasses.style === 'monocle') {
        accessoriesHTML += `
          <g class="${faceClasses}">
            <circle cx="60" cy="46" r="8" stroke="${aColor}" stroke-width="2" fill="none" />
            <path d="M 68,46 Q 74,50 72,66" stroke="${aColor}" stroke-width="1.2" fill="none" />
          </g>
        `;
      }
    }

    // 2. Neckwear
    if (acc.neckwear && acc.neckwear.style !== 'none') {
      const pColor = acc.neckwear.primaryColor || '#c62828';
      const aColor = acc.neckwear.accentColor || '#ffca28';
      
      if (acc.neckwear.style === 'bowtie') {
        accessoriesHTML += `
          <g class="${bodyClasses}">
            <path d="M 40,62 L 40,68 L 50,65 L 60,68 L 60,62 Z" fill="${pColor}" stroke="${aColor}" stroke-width="1" />
            <circle cx="50" cy="65" r="3" fill="${aColor}" />
          </g>
        `;
      } else if (acc.neckwear.style === 'bell_collar') {
        accessoriesHTML += `
          <g class="${bodyClasses}">
            <path d="M 33,63 Q 50,68 67,63" stroke="${pColor}" stroke-width="3.8" fill="none" stroke-linecap="round" />
            <circle cx="50" cy="67" r="4.5" fill="${aColor}" stroke="#3e2723" stroke-width="1" />
          </g>
        `;
      } else if (acc.neckwear.style === 'custom_collar') {
        const charmText = acc.neckwear.charmText || 'A';
        const hasBeads = acc.neckwear.beads;
        const beadCol = acc.neckwear.accentColor || '#ffca28';
        
        let beadsHTML = '';
        if (hasBeads) {
          beadsHTML = `
            <circle cx="38" cy="64.8" r="2" fill="${beadCol}" />
            <circle cx="44" cy="66.2" r="2" fill="${beadCol}" />
            <circle cx="56" cy="66.2" r="2" fill="${beadCol}" />
            <circle cx="62" cy="64.8" r="2" fill="${beadCol}" />
          `;
        }
        
        accessoriesHTML += `
          <g class="${bodyClasses}">
            <!-- Base strap -->
            <path d="M 33,63 Q 50,68 67,63" stroke="${pColor}" stroke-width="4.2" fill="none" stroke-linecap="round" />
            <!-- Beads -->
            ${beadsHTML}
            <!-- Gold charm -->
            <circle cx="50" cy="68" r="5" fill="#ffd54f" stroke="#e65100" stroke-width="0.8" />
            <!-- Charm Text -->
            <text x="50" y="70" font-size="6.5" font-family="sans-serif" font-weight="900" text-anchor="middle" fill="#5d4037">${charmText}</text>
          </g>
        `;
      } else if (acc.neckwear.style === 'scarf') {
        accessoriesHTML += `
          <g class="${bodyClasses}">
            <path d="M 33,62 Q 50,69 67,62" stroke="${pColor}" stroke-width="6.5" fill="none" stroke-linecap="round" />
            <path d="M 58,64 Q 65,73 61,82" stroke="${pColor}" stroke-width="5" fill="none" stroke-linecap="round" />
            <path d="M 59,69 L 63,70" stroke="${aColor}" stroke-width="2.5" />
          </g>
        `;
      }
    }

    // 3. Hat (render last for top overlay)
    if (acc.hat && acc.hat.style !== 'none') {
      const pColor = acc.hat.primaryColor || '#512da8';
      const aColor = acc.hat.accentColor || '#ffb300';
      
      if (acc.hat.style === 'wizard') {
        accessoriesHTML += `
          <g class="${faceClasses}">
            <path d="M 28,26 Q 50,22 72,26 Q 50,28 28,26 Z" fill="${pColor}" />
            <polygon points="34,25 50,1 66,25" fill="${pColor}" />
            <polygon points="48,12 50,8 52,12 48,10 52,10" fill="${aColor}" />
          </g>
        `;
      } else if (acc.hat.style === 'cowboy') {
        accessoriesHTML += `
          <g class="${faceClasses}">
            <path d="M 24,26 C 34,22 66,22 76,26 C 72,29 28,29 24,26 Z" fill="${pColor}" />
            <path d="M 37,25 C 37,13 41,15 50,15 C 59,15 63,13 63,25 Z" fill="${pColor}" />
            <path d="M 37,24 Q 50,22 63,24" stroke="${aColor}" stroke-width="1.8" fill="none" />
          </g>
        `;
      } else if (acc.hat.style === 'party') {
        accessoriesHTML += `
          <g class="${faceClasses}">
            <polygon points="37,26 50,3 63,26" fill="${pColor}" />
            <circle cx="50" cy="3" r="3.5" fill="${aColor}" />
            <path d="M 41,18 Q 48,15 50,21" stroke="${aColor}" stroke-width="2" fill="none" />
          </g>
        `;
      } else if (acc.hat.style === 'detective') {
        accessoriesHTML += `
          <g class="${faceClasses}">
            <path d="M 33,26 C 33,14 67,14 67,26 Z" fill="${pColor}" />
            <path d="M 30,26 Q 50,22 70,26 Q 50,29 30,26 Z" fill="${pColor}" />
            <rect x="36" y="23" width="28" height="2.5" fill="${aColor}" />
          </g>
        `;
      }
    }
  }

  // Build the complete inline SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
      <g>
        <!-- TAIL -->
        ${tailHTML}

        <!-- HIND LEGS & BODY SHAPE -->
        <ellipse cx="50" cy="74" rx="22" ry="18" fill="${genes.baseColor}" class="${bodyClasses}" />
        
        <!-- GENETIC PATTERN ON BODY -->
        <g class="${bodyClasses}">
          ${patternGraphicsHTML}
        </g>

        <!-- FRONT FEET -->
        <ellipse cx="40" cy="90" rx="6" ry="4" fill="${leftPawColor}" class="${bodyClasses}" />
        <ellipse cx="60" cy="90" rx="6" ry="4" fill="${rightPawColor}" class="${bodyClasses}" />

        <!-- EARS -->
        <polygon points="30,38 20,20 40,28" fill="${earColorLeft}" class="${faceClasses}" />
        <polygon points="30,35 23,23 37,29" fill="${innerEarLeftColor}" class="${faceClasses}" />
        
        <polygon points="70,38 80,20 60,28" fill="${earColorRight}" class="${faceClasses}" />
        <polygon points="70,35 77,23 63,29" fill="${innerEarLeftColor}" class="${faceClasses}" />

        <!-- HEAD BASE -->
        <circle cx="50" cy="45" r="20" fill="${genes.baseColor}" class="${faceClasses}" />

        <!-- ACCENT PATTERNS FACE OVERLAY -->
        <g class="${faceClasses}">
          ${genes.pattern === 'tabby' ? `
            <path d="M 46 27 L 48 33 M 50 26 L 50 33 M 54 27 L 52 33" stroke="${genes.accentColor}" stroke-width="1.8" />
            <path d="M 33 42 L 38 43 M 32 46 L 37 46" stroke="${genes.accentColor}" stroke-width="1.8" />
            <path d="M 67 42 L 62 43 M 68 46 L 63 46" stroke="${genes.accentColor}" stroke-width="1.8" />
          ` : ''}
          ${genes.pattern === 'tuxedo' ? `
            <path d="M 42 50 L 50 44 L 58 50 L 50 56 Z" fill="#ffffff" />
          ` : ''}
          ${genes.pattern === 'pointed' ? `
            <path d="M 40 37 C 33 40 33 48 40 52 C 44 54 56 54 60 52 C 67 48 67 40 60 37 Z" fill="${genes.accentColor}" opacity="0.85" />
          ` : ''}
        </g>

        <!-- EYES -->
        <g class="${faceClasses}">
          ${eyesHTML}
        </g>

        <!-- NOSE / CHEEKS -->
        <g class="${faceClasses}">
          <polygon points="48,49 52,49 50,51" fill="#ff8a80" />
          ${mouthHTML}
        </g>

        <!-- WHISKERS -->
        <g class="${faceClasses}">
          <path d="M 33 50 L 18 49 M 33 52 L 16 53 M 33 54 L 18 57" stroke="#8d6e63" stroke-width="1" opacity="0.75" />
          <path d="M 67 50 L 82 49 M 67 52 L 84 53 M 67 54 L 82 57" stroke="#8d6e63" stroke-width="1" opacity="0.75" />
        </g>

        <!-- ACCESSORIES OVERLAYS -->
        ${accessoriesHTML}
      </g>
    </svg>
  `;
  return svg;
}

// --- STATE MANAGEMENT ---
class GameState {
  constructor() {
    this.profiles = JSON.parse(localStorage.getItem('cat_game_profiles')) || [];
    this.activeProfile = localStorage.getItem('cat_game_active_profile') || null;
    
    // Core game state variables loaded upon profile activation
    this.data = {
      coins: 50,
      trustLevel: 1,
      activeCats: [],
      retiredCats: [],
      familyTree: [],
      currentGeneration: 0,
      shopItems: [],
      calendarDay: 1,
      calendarMonth: 1,
      calendarYear: 1,
      customEvents: {},
      roomDander: 0,
      doorOpen: false,
      photos: [],
      phoneWallpaper: 'blue',
      bankSavings: 0,
      tvChannel: 0,
      furniture: { bed: 'royal', rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' }
    };
  }

  saveProfiles() {
    localStorage.setItem('cat_game_profiles', JSON.stringify(this.profiles));
    if (this.activeProfile) {
      localStorage.setItem('cat_game_active_profile', this.activeProfile);
      localStorage.setItem(`cat_game_profile_${this.activeProfile}_state`, JSON.stringify(this.data));
    }
  }

  loadProfile(name) {
    this.activeProfile = name;
    const raw = localStorage.getItem(`cat_game_profile_${name}_state`);
    if (raw) {
      this.data = JSON.parse(raw);
      // Backwards compatibility fixes
      if (!this.data.shopItems) this.data.shopItems = [];
      if (!this.data.retiredCats) this.data.retiredCats = [];
      if (!this.data.familyTree) this.data.familyTree = [];
      if (!this.data.calendarDay) this.data.calendarDay = 1;
      if (this.data.calendarMonth === undefined) this.data.calendarMonth = 1;
      if (!this.data.calendarYear) this.data.calendarYear = 1;
      if (!this.data.customEvents) this.data.customEvents = {};
      if (this.data.roomDander === undefined) this.data.roomDander = 0;
      if (this.data.doorOpen === undefined) this.data.doorOpen = false;
      if (!this.data.photos) this.data.photos = [];
      if (!this.data.phoneWallpaper) this.data.phoneWallpaper = 'blue';
      if (this.data.bankSavings === undefined) this.data.bankSavings = 0;
      if (this.data.tvChannel === undefined) this.data.tvChannel = 0;
      if (!this.data.furniture) {
        this.data.furniture = { bed: 'royal', rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' };
      } else {
        if (!this.data.furniture.lights) this.data.furniture.lights = 'warm';
        if (!this.data.furniture.shelf) this.data.furniture.shelf = 'salmon';
        if (!this.data.furniture.wallpaper) this.data.furniture.wallpaper = 'plain';
        if (!this.data.furniture.window) this.data.furniture.window = 'sunny';
      }
      
      if (!this.data.roomFurniture) {
        this.data.roomFurniture = {
          'phone-room': Object.assign({}, this.data.furniture),
          'living-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
          'back-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
          'bath-area': { rug: 'cozy', lights: 'warm', wallpaper: 'plain', window: 'sunny' }
        };
      } else {
        const defaultF = { bed: 'royal', rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' };
        ['phone-room', 'living-room', 'back-room', 'bath-area'].forEach(rm => {
          if (!this.data.roomFurniture[rm]) {
            this.data.roomFurniture[rm] = Object.assign({}, defaultF);
          }
        });
      }
      
      if (!this.data.vacationQuest) {
        this.data.vacationQuest = {
          type: 'groom',
          name: 'Groom cats 5 times',
          target: 5,
          current: 0,
          completed: false,
          unlocked: false,
          scheduledDay: null
        };
      }
      
      // Calculate offline progress
      this.calculateOfflineProgress();
    } else {
      // Default initial state
      this.data = {
        coins: 50,
        trustLevel: 1,
        activeCats: [],
        retiredCats: [],
        familyTree: [],
        currentGeneration: 0,
        shopItems: [],
        calendarDay: 1,
        calendarMonth: 1,
        calendarYear: 1,
        customEvents: {},
        roomDander: 0,
        doorOpen: false,
        photos: [],
        phoneWallpaper: 'blue',
        bankSavings: 0,
        tvChannel: 0,
        furniture: { bed: 'royal', rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' }
      };
    }
    this.saveProfiles();
  }

  createProfile(name) {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, msg: 'Name cannot be empty' };
    if (this.profiles.includes(trimmed)) return { success: false, msg: 'Profile already exists' };
    
    this.profiles.push(trimmed);
    this.loadProfile(trimmed);
    this.saveProfiles();
    return { success: true };
  }

  deleteProfile(name) {
    this.profiles = this.profiles.filter(p => p !== name);
    localStorage.removeItem(`cat_game_profile_${name}_state`);
    if (this.activeProfile === name) {
      this.activeProfile = this.profiles[0] || null;
      if (this.activeProfile) {
        this.loadProfile(this.activeProfile);
      } else {
        this.data = null;
      }
    }
    this.saveProfiles();
  }

  calculateOfflineProgress() {
    if (!this.data.activeCats || this.data.activeCats.length === 0) return;
    
    const now = Date.now();
    let oldestTick = now;
    
    this.data.activeCats.forEach(cat => {
      if (cat.lastTick && cat.lastTick < oldestTick) {
        oldestTick = cat.lastTick;
      }
    });

    const secondsPassed = Math.floor((now - oldestTick) / 1000);
    if (secondsPassed < 30) return; // skip small delays

    // Caps decay to prevent immediate running away or starving after long absence
    const maxTicksToProcess = Math.min(secondsPassed, 14400); // Max 4 hours of stat decay
    
    let reportText = [];
    this.data.activeCats.forEach(cat => {
      const pConfig = PERSONALITIES[cat.personality];
      
      // Hunger decay rate: 0.05 / sec
      // Thirst decay rate: 0.07 / sec
      // Affection decay rate: 0.04 / sec
      // Cleanliness decay rate: 0.03 / sec
      // Energy decay rate: 0.02 / sec
      let hungerDecay = 0.05 * pConfig.hungerMult;
      let thirstDecay = 0.07 * pConfig.thirstMult;
      let affectionDecay = 0.04 * pConfig.affectionMult;
      let cleanlinessDecay = 0.03 * pConfig.cleanMult;
      
      // Passives
      if (this.data.shopItems.includes('auto_feeder')) hungerDecay *= 0.5;
      if (this.data.shopItems.includes('litter_robot')) cleanlinessDecay *= 0.5;

      cat.hunger = Math.max(0, Math.floor(cat.hunger - (hungerDecay * maxTicksToProcess)));
      cat.thirst = Math.max(0, Math.floor(cat.thirst - (thirstDecay * maxTicksToProcess)));
      cat.affection = Math.max(0, Math.floor(cat.affection - (affectionDecay * maxTicksToProcess)));
      cat.cleanliness = Math.max(0, Math.floor(cat.cleanliness - (cleanlinessDecay * maxTicksToProcess)));
      
      // Sleep recovery or normal decay
      if (cat.status === 'sleeping') {
        let sleepSpeed = 0.8;
        if (cat.personality === 'lazy') sleepSpeed *= 1.5;
        if (this.data.shopItems.includes('deluxe_bed')) sleepSpeed *= 2;
        cat.energy = Math.min(100, Math.floor(cat.energy + (sleepSpeed * maxTicksToProcess)));
      } else if (cat.status === 'studying') {
        cat.energy = Math.max(0, Math.floor(cat.energy - (0.08 * pConfig.energyMult * maxTicksToProcess)));
      }

      cat.lastTick = now;
      reportText.push(`${cat.name} was lonely but survived!`);
    });

    setTimeout(() => {
      showToast(`Welcome Back! ${reportText.join(' ')}`);
    }, 1500);
  }
}

const state = new GameState();

// --- CONTROLLER / VIEW ENGINE ---
const Views = {
  activeView: 'profile-screen',
  
  switch(viewId) {
    document.querySelectorAll('.view').forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });
    const target = document.getElementById(viewId);
    target.style.display = 'flex';
    // Force reflow
    target.offsetHeight;
    target.classList.add('active');
    this.activeView = viewId;
    
    // Trigger specific view renders
    if (viewId === 'profile-screen') {
      renderProfileList();
    } else if (viewId === 'breeding-screen') {
      initBreedingLab();
    } else if (viewId === 'game-screen') {
      initGameScreen();
    }
  }
};

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 50);
  
  // Destroy after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Float floating numbers above cats
function triggerFloater(x, y, text, type = 'love') {
  const container = document.getElementById('floaters-layer');
  const floater = document.createElement('div');
  floater.className = `floater ${type}`;
  floater.textContent = text;
  
  // Random horizontal variance
  const offset = Math.floor(Math.random() * 40) - 20;
  floater.style.left = `${x + offset}px`;
  floater.style.top = `${y}px`;
  
  container.appendChild(floater);
  setTimeout(() => floater.remove(), 1200);
}

// --- PROFILE VIEW LOGIC ---
function renderProfileList() {
  const list = document.getElementById('profile-list');
  list.innerHTML = '';
  
  state.profiles.forEach(p => {
    const card = document.createElement('div');
    card.className = 'profile-card';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = '🐱';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'profile-name';
    nameSpan.textContent = p;

    const delBtn = document.createElement('button');
    delBtn.className = 'btn text-btn';
    delBtn.style.color = '#c62828';
    delBtn.style.padding = '2px';
    delBtn.style.marginTop = '6px';
    delBtn.style.fontSize = '0.75rem';
    delBtn.textContent = 'Delete';
    
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Are you sure you want to delete profile "${p}"? All progress will be lost.`)) {
        state.deleteProfile(p);
        renderProfileList();
      }
    });

    card.appendChild(avatar);
    card.appendChild(nameSpan);
    card.appendChild(delBtn);
    
    card.addEventListener('click', () => {
      state.loadProfile(p);
      if (state.data.activeCats.length === 0) {
        Views.switch('breeding-screen');
      } else {
        Views.switch('game-screen');
      }
    });
    
    list.appendChild(card);
  });
}

document.getElementById('create-profile-btn').addEventListener('click', () => {
  const input = document.getElementById('new-profile-name');
  const res = state.createProfile(input.value);
  if (res.success) {
    showToast(`Welcome, ${input.value}!`);
    input.value = '';
    Views.switch('breeding-screen');
  } else {
    alert(res.msg);
  }
});

// Switch profile button inside header
document.querySelectorAll('.switch-profile-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (confirm('Go back to profile select? Progress is auto-saved.')) {
      state.saveProfiles();
      Views.switch('profile-screen');
    }
  });
});

// Back to profiles buttons
document.querySelectorAll('.back-to-profiles-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    Views.switch('profile-screen');
  });
});


// --- BREEDING / PET STORE VIEW LOGIC ---
let motherSetup = {
  name: 'Luna',
  baseColor: BASE_COLORS[0].hex,
  pattern: 'solid',
  accentColor: ACCENT_COLORS[0].hex,
  eyeColor: EYE_COLORS[0].hex,
  tailStyle: 'long',
  personality: 'playful'
};

let fatherSetup = {
  name: 'Leo',
  baseColor: BASE_COLORS[2].hex,
  pattern: 'solid',
  accentColor: ACCENT_COLORS[1].hex,
  eyeColor: EYE_COLORS[1].hex,
  tailStyle: 'long',
  personality: 'lazy'
};

function initBreedingLab() {
  document.getElementById('litter-reveal-section').classList.remove('active');
  const adoptBtn = document.getElementById('adopt-kittens-btn');
  adoptBtn.classList.add('disabled');
  adoptBtn.disabled = true;

  // Setup options for Mother and Father
  setupParentCustomizer('mother', motherSetup);
  setupParentCustomizer('father', fatherSetup);
}

function setupParentCustomizer(gender, currentObject) {
  const prefix = gender;
  
  // Render live preview SVG
  const previewBox = document.getElementById(`${prefix}-preview`);
  const updatePreview = () => {
    previewBox.innerHTML = renderCatSVG({ genes: currentObject, growth: 100 });
  };
  updatePreview();

  // Name listener
  const nameInput = document.getElementById(`${prefix}-name`);
  nameInput.value = currentObject.name;
  nameInput.oninput = () => {
    currentObject.name = nameInput.value;
  };

  // Base colors
  const basePalette = document.getElementById(`${prefix}-base-colors`);
  basePalette.innerHTML = '';
  BASE_COLORS.forEach(c => {
    const dot = document.createElement('div');
    dot.className = `color-option ${currentObject.baseColor === c.hex ? 'active' : ''}`;
    dot.style.backgroundColor = c.hex;
    dot.title = c.name;
    dot.onclick = () => {
      currentObject.baseColor = c.hex;
      basePalette.querySelectorAll('.color-option').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      updatePreview();
    };
    basePalette.appendChild(dot);
  });

  // Accents
  const accentPalette = document.getElementById(`${prefix}-accent-colors`);
  accentPalette.innerHTML = '';
  ACCENT_COLORS.forEach(c => {
    const dot = document.createElement('div');
    dot.className = `color-option ${currentObject.accentColor === c.hex ? 'active' : ''}`;
    dot.style.backgroundColor = c.hex;
    dot.title = c.name;
    dot.onclick = () => {
      currentObject.accentColor = c.hex;
      accentPalette.querySelectorAll('.color-option').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      updatePreview();
    };
    accentPalette.appendChild(dot);
  });

  // Eyes
  const eyePalette = document.getElementById(`${prefix}-eye-colors`);
  eyePalette.innerHTML = '';
  EYE_COLORS.forEach(c => {
    const dot = document.createElement('div');
    dot.className = `color-option ${currentObject.eyeColor === c.hex ? 'active' : ''}`;
    dot.style.backgroundColor = c.hex;
    dot.title = c.name;
    dot.onclick = () => {
      currentObject.eyeColor = c.hex;
      eyePalette.querySelectorAll('.color-option').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      updatePreview();
    };
    eyePalette.appendChild(dot);
  });

  // Pattern buttons
  const patternContainer = document.getElementById(`${prefix}-patterns`);
  patternContainer.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pattern === currentObject.pattern);
    btn.onclick = () => {
      currentObject.pattern = btn.dataset.pattern;
      patternContainer.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updatePreview();
    };
  });

  // Tail buttons
  const tailContainer = document.getElementById(`${prefix}-tails`);
  tailContainer.querySelectorAll('.tail-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tail === currentObject.tailStyle);
    btn.onclick = () => {
      currentObject.tailStyle = btn.dataset.tail;
      tailContainer.querySelectorAll('.tail-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updatePreview();
    };
  });

  // Personalities
  const personalityContainer = document.getElementById(`${prefix}-personalities`);
  personalityContainer.innerHTML = '';
  Object.keys(PERSONALITIES).forEach(key => {
    const p = PERSONALITIES[key];
    const btn = document.createElement('button');
    btn.className = `personality-btn ${currentObject.personality === key ? 'active' : ''}`;
    btn.textContent = p.name;
    btn.title = p.desc;
    btn.onclick = () => {
      currentObject.personality = key;
      personalityContainer.querySelectorAll('.personality-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    personalityContainer.appendChild(btn);
  });
}

// BREED GENERATOR ENGINE
let generatedLitter = [];
let selectedLitterIndices = [];

document.getElementById('breed-trigger-btn').addEventListener('click', () => {
  audio.playPurr();
  audio.playMeow(1.2);
  
  // Heart splash animation effect
  const station = document.querySelector('.breeding-station');
  station.classList.add('happy-purring');
  setTimeout(() => station.classList.remove('happy-purring'), 1500);

  // Generate 3 kittens with genetic crossover
  generatedLitter = [];
  selectedLitterIndices = [];

  for (let i = 0; i < 3; i++) {
    const kitten = generateKitten(motherSetup, fatherSetup, i + 1);
    generatedLitter.push(kitten);
  }

  // Display Litter modal overlay
  renderLitterReveal();
});

// Mixes color hexes
function blendColors(c1, c2) {
  // Convert hex to rgb, average them, convert back to hex
  const r1 = parseInt(c1.substring(1,3), 16);
  const g1 = parseInt(c1.substring(3,5), 16);
  const b1 = parseInt(c1.substring(5,7), 16);

  const r2 = parseInt(c2.substring(1,3), 16);
  const g2 = parseInt(c2.substring(3,5), 16);
  const b2 = parseInt(c2.substring(5,7), 16);

  const r = Math.round((r1 + r2) / 2).toString(16).padStart(2, '0');
  const g = Math.round((g1 + g2) / 2).toString(16).padStart(2, '0');
  const b = Math.round((b1 + b2) / 2).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

function generateKitten(mother, father, index) {
  const rand = Math.random();
  let baseColor;
  if (rand < 0.45) {
    baseColor = mother.baseColor;
  } else if (rand < 0.90) {
    baseColor = father.baseColor;
  } else {
    // 10% Mutation / Blended Color
    baseColor = blendColors(mother.baseColor, father.baseColor);
  }

  const pattern = Math.random() < 0.5 ? mother.pattern : father.pattern;
  const accentColor = Math.random() < 0.5 ? mother.accentColor : father.accentColor;
  const eyeColor = Math.random() < 0.5 ? mother.eyeColor : father.eyeColor;
  const tailStyle = Math.random() < 0.5 ? mother.tailStyle : father.tailStyle;
  
  // Inherit personality or hybrid
  const personality = Math.random() < 0.5 ? mother.personality : father.personality;
  
  const defaultNames = ['Coco', 'Milo', 'Simba', 'Bella', 'Nala', 'Oliver', 'Toby', 'Mochi'];
  const name = defaultNames[Math.floor(Math.random() * defaultNames.length)] + ` Jr.`;

  return {
    id: 'kit_' + Date.now() + '_' + index,
    name: name,
    generation: state.data.currentGeneration + 1,
    genes: {
      baseColor,
      pattern,
      accentColor,
      eyeColor,
      tailStyle
    },
    personality,
    hunger: 100,
    thirst: 100,
    affection: 50,
    energy: 100,
    cleanliness: 100,
    growth: 0, // start as 0% kitten
    status: 'idle',
    lastTick: Date.now()
  };
}

function renderLitterReveal() {
  const container = document.getElementById('kitten-cards-list');
  container.innerHTML = '';
  
  const overlay = document.getElementById('litter-reveal-section');
  overlay.classList.add('active');

  generatedLitter.forEach((kitten, idx) => {
    const card = document.createElement('div');
    card.className = 'kitten-card';
    card.id = `kitten-card-${idx}`;

    const preview = document.createElement('div');
    preview.className = 'kitten-card-preview';
    preview.innerHTML = renderCatSVG(kitten, true);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'kitten-name-input';
    nameInput.value = kitten.name;
    nameInput.maxLength = 12;
    nameInput.onclick = (e) => e.stopPropagation();
    nameInput.oninput = () => { kitten.name = nameInput.value; };

    const pBadge = document.createElement('span');
    pBadge.className = 'badge personality-badge';
    pBadge.textContent = PERSONALITIES[kitten.personality].name;
    pBadge.style.alignSelf = 'center';

    const statsGrid = document.createElement('div');
    statsGrid.className = 'kitten-card-stats';
    statsGrid.innerHTML = `
      <div class="stat-row"><span>Tail:</span> <strong>${kitten.genes.tailStyle}</strong></div>
      <div class="stat-row"><span>Pattern:</span> <strong>${kitten.genes.pattern}</strong></div>
    `;

    card.appendChild(preview);
    card.appendChild(nameInput);
    card.appendChild(pBadge);
    card.appendChild(statsGrid);

    card.onclick = () => {
      if (selectedLitterIndices.includes(idx)) {
        selectedLitterIndices = selectedLitterIndices.filter(i => i !== idx);
        card.classList.remove('selected');
      } else {
        if (selectedLitterIndices.length >= 2) {
          // Remove first selected to limit to 2
          const first = selectedLitterIndices.shift();
          document.getElementById(`kitten-card-${first}`).classList.remove('selected');
        }
        selectedLitterIndices.push(idx);
        card.classList.add('selected');
      }
      
      const adoptBtn = document.getElementById('adopt-kittens-btn');
      const count = selectedLitterIndices.length;
      if (count > 0) {
        adoptBtn.classList.remove('disabled');
        adoptBtn.disabled = false;
        adoptBtn.textContent = `Adopt Selected (${count} chosen)`;
      } else {
        adoptBtn.classList.add('disabled');
        adoptBtn.disabled = true;
        adoptBtn.textContent = `Adopt Selected (0 chosen)`;
      }
    };

    container.appendChild(card);
  });
}

document.getElementById('adopt-kittens-btn').addEventListener('click', () => {
  if (selectedLitterIndices.length === 0) return;

  const adopted = selectedLitterIndices.map(idx => generatedLitter[idx]);

  // Handle retirement of current generation
  if (state.data.activeCats.length > 0) {
    // Current active cats move to retired parents (Gen N-1)
    state.data.retiredCats = [...state.data.activeCats];
    state.data.retiredCats.forEach(c => {
      c.status = 'sleeping'; // Retired sleep on cushions
    });
    
    // Clear grandparents (Gen N-2) automatically by rewriting retired
  } else {
    // First generation (Gen 0 parents are customized Mother & Father)
    const motherCopy = {
      id: 'parent_mom_' + Date.now(),
      name: motherSetup.name,
      generation: state.data.currentGeneration,
      genes: { ...motherSetup },
      personality: motherSetup.personality,
      growth: 100,
      status: 'sleeping'
    };
    const fatherCopy = {
      id: 'parent_dad_' + Date.now(),
      name: fatherSetup.name,
      generation: state.data.currentGeneration,
      genes: { ...fatherSetup },
      personality: fatherSetup.personality,
      growth: 100,
      status: 'sleeping'
    };
    state.data.retiredCats = [motherCopy, fatherCopy];
    
    // Log grandparents to history
    state.data.familyTree.push(motherCopy);
    state.data.familyTree.push(fatherCopy);
  }

  // Push new active cats to family tree history database
  adopted.forEach(kitten => {
    state.data.familyTree.push(kitten);
  });

  // Stage new kittens to pending state for driving transition
  pendingAdoptionState = {
    adopted: adopted,
    currentGeneration: state.data.currentGeneration + 1,
    trustLevel: state.data.trustLevel + 1,
    coinsGift: 20
  };

  showToast(`Got the keys! Time to drive and pick up ${adopted.map(k=>k.name).join(' & ')}!`);
  document.getElementById('litter-reveal-section').classList.remove('active');
  startDrivingTransition();
});

// --- MAIN GAME VIEW LOGIC ---
let focusCatIndex = 0;
let currentRoom = 'living-room';
let gameInterval = null;
let gameSpeed = 2; // Default 2x speed
let calendarTickCount = 0;

function updateGameSpeed() {
  const select = document.getElementById('game-speed-select');
  if (select) {
    gameSpeed = parseFloat(select.value) || 2;
  }
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoopTick, 1000 / gameSpeed);
}

function initGameScreen() {
  focusCatIndex = 0;
  currentRoom = 'living-room';
  
  // Set header metrics
  document.getElementById('header-profile-name').textContent = state.activeProfile;
  updateHeaderStats();

  // Render cat selectors
  renderCatSelectorTabs();

  // Load room scene
  switchRoom(currentRoom);

  // Restart tick timer
  updateGameSpeed();

  // Add event listener for speed change
  const select = document.getElementById('game-speed-select');
  if (select && !select.dataset.listenerActive) {
    select.dataset.listenerActive = "true";
    select.addEventListener('change', () => {
      updateGameSpeed();
      showToast(`Game speed set to ${gameSpeed}x`);
    });
  }
}

let lastKnownCoins = null;
function updateHeaderStats() {
  if (state.data) {
    if (lastKnownCoins !== null && state.data.coins > lastKnownCoins) {
      const diff = state.data.coins - lastKnownCoins;
      updateVacationQuestProgress('earn_coins', diff);
    }
    lastKnownCoins = state.data.coins;
  }
  document.getElementById('header-coins').textContent = state.data.coins;
  document.getElementById('shop-coins-count').textContent = state.data.coins;
  document.getElementById('header-trust').textContent = state.data.trustLevel;
  
  const display = document.getElementById('header-date-display');
  if (display && state.data) {
    const year = state.data.calendarYear || 1;
    const month = CALENDAR_MONTHS[state.data.calendarMonth] || "Meow-rch";
    const day = state.data.calendarDay || 1;
    display.textContent = `Yr ${year}, ${month} ${day}`;
  }
}

function renderCatSelectorTabs() {
  const container = document.getElementById('active-cat-selectors');
  container.innerHTML = '';

  if (state.data.activeCats.length <= 1) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';

  state.data.activeCats.forEach((cat, idx) => {
    const btn = document.createElement('button');
    btn.className = `cat-tab-btn ${idx === focusCatIndex ? 'active' : ''}`;
    btn.textContent = `🐱 ${cat.name}`;
    btn.onclick = () => {
      focusCatIndex = idx;
      container.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFocusCatDetails();
    };
    container.appendChild(btn);
  });
}

function renderFocusCatDetails() {
  const cat = state.data.activeCats[focusCatIndex];
  if (!cat) return;

  const degreeSuffix = (cat.degrees && cat.degrees.length > 0) ? ` (${cat.degrees.join(', ')})` : '';
  document.getElementById('focus-cat-name').textContent = cat.name + degreeSuffix;
  
  const personalityBadge = document.getElementById('focus-cat-personality');
  personalityBadge.textContent = PERSONALITIES[cat.personality].name;
  personalityBadge.title = PERSONALITIES[cat.personality].desc;
  
  document.getElementById('focus-cat-gen').textContent = `Gen ${cat.generation}`;
  
  // Age/Growth
  const ageLabel = cat.growth >= 100 ? 'Adult Cat (100%)' : `Kitten (${cat.growth}%)`;
  document.getElementById('focus-cat-age').textContent = ageLabel;
  document.getElementById('focus-cat-growth-bar').style.width = `${cat.growth}%`;

  // Stats bars
  document.getElementById('stat-hunger-bar').style.width = `${cat.hunger}%`;
  document.getElementById('stat-hunger-val').textContent = `${cat.hunger}/100`;

  document.getElementById('stat-thirst-bar').style.width = `${cat.thirst}%`;
  document.getElementById('stat-thirst-val').textContent = `${cat.thirst}/100`;

  document.getElementById('stat-affection-bar').style.width = `${cat.affection}%`;
  document.getElementById('stat-affection-val').textContent = `${cat.affection}/100`;

  document.getElementById('stat-energy-bar').style.width = `${cat.energy}%`;
  document.getElementById('stat-energy-val').textContent = `${cat.energy}/100`;

  document.getElementById('stat-cleanliness-bar').style.width = `${cat.cleanliness}%`;
  document.getElementById('stat-cleanliness-val').textContent = `${cat.cleanliness}/100`;

  // Display find mate button if adult
  const breedBtn = document.getElementById('breed-next-generation-btn');
  const allAdults = state.data.activeCats.every(c => c.growth >= 100);
  if (allAdults) {
    breedBtn.classList.remove('hidden');
  } else {
    breedBtn.classList.add('hidden');
  }
}

let bubbleInterval = null;

function startBubbleSpawner() {
  if (bubbleInterval) clearInterval(bubbleInterval);
  bubbleInterval = setInterval(() => {
    if (currentRoom !== 'bath-area') {
      clearInterval(bubbleInterval);
      return;
    }
    spawnBathBubble();
  }, 350);
}

function spawnBathBubble() {
  const container = document.getElementById('play-space-container');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'bath-bubble';
  
  const size = Math.floor(Math.random() * 14) + 8;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  const containerWidth = container.clientWidth;
  const tubLeft = containerWidth / 2 - 125;
  const rx = tubLeft + Math.floor(Math.random() * 230) + 10;
  const ry = container.clientHeight - 40 - Math.floor(Math.random() * 30);
  
  bubble.style.left = `${rx}px`;
  bubble.style.top = `${ry}px`;
  
  const vx = Math.floor(Math.random() * 50) - 25;
  bubble.style.setProperty('--vx', `${vx}px`);
  
  container.appendChild(bubble);
  setTimeout(() => bubble.remove(), 2500);
}

function renderRoomScene() {
  const catsArea = document.getElementById('cats-render-area');
  catsArea.innerHTML = '';

  if (currentRoom === 'living-room') {
    state.data.activeCats.forEach((cat, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = `cat-avatar-wrapper`;
      wrapper.style.left = state.data.activeCats.length === 2 ? `${25 + idx * 35}%` : `40%`;
      wrapper.innerHTML = renderCatSVG(cat);
      
      wrapper.onclick = (e) => {
        triggerInteraction('pet', idx, e.clientX, e.clientY);
      };
      
      catsArea.appendChild(wrapper);
    });
  } else if (currentRoom === 'bath-area') {
    state.data.activeCats.forEach((cat, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = `cat-avatar-wrapper in-bath`;
      wrapper.style.left = state.data.activeCats.length === 2 ? `${28 + idx * 28}%` : `40%`;
      wrapper.innerHTML = renderCatSVG(cat);
      
      wrapper.onclick = (e) => {
        triggerInteraction('pet', idx, e.clientX, e.clientY);
      };
      
      catsArea.appendChild(wrapper);
    });
  } else if (currentRoom === 'school') {
    state.data.activeCats.forEach((cat, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = `cat-avatar-wrapper`;
      if (cat.status === 'studying') {
        wrapper.classList.add('studying-cat-nod');
      }
      wrapper.style.left = state.data.activeCats.length === 2 ? `${28 + idx * 28}%` : `40%`;
      wrapper.style.bottom = '35px'; // sit slightly higher behind the desk
      wrapper.innerHTML = renderCatSVG(cat);
      
      wrapper.onclick = () => {
        audio.playMeow(1.0);
        if (cat.status === 'studying') {
          showToast(`${cat.name} is studying hard!`);
        } else {
          showToast(`${cat.name} is ready for class. Select a course below to enroll them.`);
        }
      };
      
      catsArea.appendChild(wrapper);
    });
  } else if (currentRoom === 'back-room') {
    state.data.retiredCats.forEach((cat, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = `cat-avatar-wrapper retired-parent`;
      wrapper.style.left = state.data.retiredCats.length === 2 ? `${25 + idx * 35}%` : `40%`;
      wrapper.innerHTML = renderCatSVG(cat);
      
      wrapper.onclick = () => {
        openParentInteractionModal(cat);
      };
      
      catsArea.appendChild(wrapper);
    });
  } else if (currentRoom === 'phone-room') {
    if (state.data.doorOpen) {
      state.data.activeCats.forEach((cat, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = `cat-avatar-wrapper`;
        wrapper.style.left = state.data.activeCats.length === 2 ? `${45 + idx * 22}%` : `55%`;
        wrapper.innerHTML = renderCatSVG(cat);
        
        wrapper.onclick = (e) => {
          triggerInteraction('pet', idx, e.clientX, e.clientY);
        };
        
        catsArea.appendChild(wrapper);
      });
    }
  }

  const camView = document.getElementById('phone-view-cam');
  if (camView && camView.style.display === 'flex') {
    updateCameraViewfinder();
  }
}

function switchRoom(roomName) {
  currentRoom = roomName;
  const playContainer = document.getElementById('play-space-container');
  
  document.querySelectorAll('.room-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.room === roomName);
  });

  if (bubbleInterval) {
    clearInterval(bubbleInterval);
    bubbleInterval = null;
  }
  document.querySelectorAll('.bath-bubble').forEach(b => b.remove());

  const careCard = document.getElementById('care-actions-card');
  const schoolCard = document.getElementById('school-actions-card');

  if (roomName === 'school') {
    playContainer.className = 'play-space school-style';
    if (careCard) careCard.style.display = 'none';
    if (schoolCard) schoolCard.style.display = 'block';
    renderSchoolDashboard();
  } else {
    if (careCard) careCard.style.display = 'block';
    if (schoolCard) schoolCard.style.display = 'none';

    if (roomName === 'living-room') {
      playContainer.className = 'play-space living-room-style';
      document.querySelectorAll('.care-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled');
      });
      const bathBtn = document.getElementById('give-bath-btn');
      if (bathBtn) {
        bathBtn.disabled = true;
        bathBtn.classList.add('disabled');
      }
    } else if (roomName === 'bath-area') {
      playContainer.className = 'play-space bath-area-style';
      document.querySelectorAll('.care-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled');
      });
      const bathBtn = document.getElementById('give-bath-btn');
      if (bathBtn) {
        bathBtn.disabled = false;
        bathBtn.classList.remove('disabled');
      }
      startBubbleSpawner();
    } else if (roomName === 'phone-room') {
      playContainer.className = 'play-space phone-room-style';
      updatePhoneRoomButtons();
      updateDoorVisuals();
      updateBedroomFurnitureUI();
    } else {
      playContainer.className = 'play-space back-room-style';
      document.querySelectorAll('.care-btn').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
      });
    }
  }

  adjustRoomFurnitureVisibility(roomName);

  const farmSign = document.getElementById('backroom-farm-sign');
  if (farmSign) {
    farmSign.style.display = (roomName === 'back-room') ? 'block' : 'none';
  }

  const activeEv = getActiveEventToday();
  if (activeEv && activeEv.type === 'vacation') {
    playContainer.classList.add('vacation-style');
  } else {
    playContainer.classList.remove('vacation-style');
  }

  updateBedroomFurnitureUI();
  renderRoomScene();
}

function updatePhoneRoomButtons() {
  const isPhoneRoom = (currentRoom === 'phone-room');
  const doorOpen = state.data.doorOpen;
  const cleanBtn = document.getElementById('clean-room-btn');
  
  const danderHaze = document.getElementById('dander-haze');
  if (danderHaze) {
    danderHaze.style.display = isPhoneRoom ? 'block' : 'none';
    danderHaze.style.backgroundColor = `rgba(229,57,53, ${state.data.roomDander * 0.002})`;
    if (state.data.roomDander >= 80) {
      danderHaze.classList.add('allergy-pulse');
    } else {
      danderHaze.classList.remove('allergy-pulse');
    }
  }

  const meter = document.getElementById('allergy-meter-card');
  if (meter) {
    meter.style.display = isPhoneRoom ? 'flex' : 'none';
  }
  
  const allergyVal = document.getElementById('allergy-value');
  const allergyProgress = document.getElementById('allergy-progress-bar');
  if (allergyVal && allergyProgress) {
    allergyVal.textContent = `${Math.floor(state.data.roomDander)}%`;
    allergyProgress.style.width = `${state.data.roomDander}%`;
  }

  if (isPhoneRoom) {
    document.getElementById('room-interactive-items').style.display = 'block';
    
    document.querySelectorAll('.care-btn').forEach(btn => {
      const action = btn.dataset.action;
      if (action === 'clean-room') {
        btn.disabled = doorOpen;
        btn.classList.toggle('disabled', doorOpen);
      } else {
        btn.disabled = !doorOpen;
        btn.classList.toggle('disabled', !doorOpen);
      }
    });
    
    const bathBtn = document.getElementById('give-bath-btn');
    if (bathBtn) {
      bathBtn.disabled = true;
      bathBtn.classList.add('disabled');
    }
  } else {
    document.getElementById('room-interactive-items').style.display = 'none';
    if (cleanBtn) {
      cleanBtn.disabled = true;
      cleanBtn.classList.add('disabled');
    }
  }
}

function updateDoorVisuals() {
  const doorEl = document.getElementById('interactive-door');
  const badge = document.getElementById('door-status-badge');
  if (doorEl && badge) {
    if (state.data.doorOpen) {
      doorEl.classList.add('open');
      doorEl.classList.remove('closed');
      badge.textContent = 'OPEN';
      badge.style.background = '#2e7d32';
    } else {
      doorEl.classList.add('closed');
      doorEl.classList.remove('open');
      badge.textContent = 'CLOSED';
      badge.style.background = '#e53935';
    }
  }
}

// Room tabs listeners
document.querySelectorAll('.room-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    switchRoom(btn.dataset.room);
  });
});

// --- CORE GAME TICK (Stat decay, growth, idle actions) ---
function gameLoopTick() {
  if (Views.activeView !== 'game-screen') return;

  const now = Date.now();
  let stateModified = false;

  // Calendar day progression tick (1 day = 60 ticks)
  calendarTickCount++;
  if (calendarTickCount >= 60) {
    calendarTickCount = 0;
    state.data.calendarDay = (state.data.calendarDay || 1) + 1;
    if (state.data.calendarDay > 28) {
      state.data.calendarDay = 1;
      state.data.calendarMonth = (state.data.calendarMonth !== undefined ? state.data.calendarMonth : 1) + 1;
      if (state.data.calendarMonth > 11) {
        state.data.calendarMonth = 0;
        state.data.calendarYear = (state.data.calendarYear || 1) + 1;
      }
      generateMonthlyVacationQuest();
    }
    
    // Cat-Bank Daily 5% Interest Compounder
    if (state.data.bankSavings && state.data.bankSavings > 0) {
      const interest = Math.floor(state.data.bankSavings * 0.05);
      if (interest > 0) {
        state.data.bankSavings += interest;
        setTimeout(() => {
          showToast(`💵 Bank Interest: You earned 🪙 ${interest} Cat Coins in interest!`);
        }, 2200);
      }
    }
    
    const curMonthName = CALENDAR_MONTHS[state.data.calendarMonth];
    showToast(`☀️ Day ${state.data.calendarDay} of ${curMonthName} has begun!`);
    audio.playMeow(1.1);

    const ev = getActiveEventToday();
    if (ev) {
      setTimeout(() => {
        showToast(`🌟 Today's Event: ${ev.name}!`);
      }, 1200);
      if (ev.type === 'vacation') {
        state.data.coins += 50;
        state.saveProfiles();
        updateHeaderStats();
        setTimeout(() => {
          showToast(`🌴 Vacation Bonus: Earned 🪙 50 Cat Coins allowance! 🌊`);
        }, 3200);
      }
    }

    stateModified = true;
    updateHeaderStats();
  }

  state.data.activeCats.forEach((cat, idx) => {
    // Check school study progress
    if (cat.status === 'studying') {
      cat.studyTimeLeft = (cat.studyTimeLeft || 10) - 1;
      if (cat.studyTimeLeft <= 0) {
        cat.status = 'idle';
        const course = cat.studyCourse;
        delete cat.studyCourse;
        delete cat.studyTimeLeft;

        if (!cat.degrees) cat.degrees = [];
        if (!cat.traits) cat.traits = [];

        let degreeName = "";
        let traitId = "";

        if (course === 'cat-culus') {
          degreeName = "BS in Cat-culus";
          traitId = "growthBoost";
        } else if (course === 'nap-ology') {
          degreeName = "PhD in Nap-ology";
          traitId = "napBoost";
        } else if (course === 'meow-sic') {
          degreeName = "MA in Meow-sic";
          traitId = "meowBoost";
        } else if (course === 'hunting-101') {
          degreeName = "Cert. Hunter";
          traitId = "huntBoost";
        } else if (course === 'self-grooming') {
          degreeName = "Dipl. Grooming";
          traitId = "groomDecayBoost";
        }

        if (degreeName && !cat.degrees.includes(degreeName)) {
          cat.degrees.push(degreeName);
        }
        if (traitId && !cat.traits.includes(traitId)) {
          cat.traits.push(traitId);
        }

        showToast(`🎓 Congratulations! ${cat.name} earned a "${degreeName}" degree!`);
        audio.playMeow(1.2);
        
        // Play retro chime sound
        audio.playScoop();
        setTimeout(() => audio.playPurr(), 150);

        if (currentRoom === 'school') {
          renderSchoolDashboard();
        }
      }
      if (currentRoom === 'school' && idx === focusCatIndex) {
        renderSchoolDashboard();
      }
    }

    const pConfig = PERSONALITIES[cat.personality];
    
    // Hunger decay rate: 0.05 / sec
    // Thirst decay rate: 0.07 / sec
    // Affection decay rate: 0.04 / sec
    // Cleanliness decay rate: 0.03 / sec
    // Energy decay rate: 0.02 / sec
    const activeEvent = getActiveEventToday();
    const isVacationToday = activeEvent && activeEvent.type === 'vacation';

    let hungerDecay = 0.05 * pConfig.hungerMult;
    let thirstDecay = 0.07 * pConfig.thirstMult;
    let affectionDecay = isVacationToday ? 0 : 0.04 * pConfig.affectionMult;
    let cleanlinessDecay = 0.03 * pConfig.cleanMult;

    if (isVacationToday) {
      hungerDecay *= 0.5;
      thirstDecay *= 0.5;
      cleanlinessDecay *= 0.5;
    }

    // Passive reduction items
    if (state.data.shopItems.includes('auto_feeder')) hungerDecay *= 0.5;
    if (state.data.shopItems.includes('litter_robot')) cleanlinessDecay *= 0.5;

    // Academic trait modifier: Self-Grooming Dipl. (-30% cleanliness decay)
    if (cat.traits && cat.traits.includes('groomDecayBoost')) cleanlinessDecay *= 0.7;

    // Apply ticks
    cat.hunger = Math.max(0, Math.floor(cat.hunger - hungerDecay));
    cat.thirst = Math.max(0, Math.floor(cat.thirst - thirstDecay));
    cat.affection = Math.max(0, Math.floor(cat.affection - affectionDecay));
    cat.cleanliness = Math.max(0, Math.floor(cat.cleanliness - cleanlinessDecay));

    // Energy handlers
    if (cat.status === 'sleeping') {
      let sleepSpeed = 0.8;
      if (cat.personality === 'lazy') sleepSpeed *= 1.5;
      if (state.data.shopItems.includes('deluxe_bed')) sleepSpeed *= 2;
      // Academic trait modifier: Nap-ology PhD (+25% sleep recovery rate)
      if (cat.traits && cat.traits.includes('napBoost')) sleepSpeed *= 1.25;
      cat.energy = Math.min(100, Math.floor(cat.energy + sleepSpeed));

      if (cat.energy >= 100) {
        cat.status = 'idle';
        showToast(`${cat.name} woke up!`);
      }
    } else if (cat.status === 'studying') {
      const studyEnergyCost = isVacationToday ? 0 : (0.08 * pConfig.energyMult);
      cat.energy = Math.max(0, Math.floor(cat.energy - studyEnergyCost));
      if (cat.energy <= 5) {
        cat.status = 'idle';
        delete cat.studyCourse;
        delete cat.studyTimeLeft;
        showToast(`${cat.name} got too exhausted to study and fell asleep at their desk!`);
        if (currentRoom === 'school') renderSchoolDashboard();
      }
    }

    // Auto wake up/restless state if critical hunger
    if (cat.hunger < 15 && cat.status === 'sleeping') {
      cat.status = 'idle';
      showToast(`${cat.name} woke up because they are starving!`);
    }

    // Ticks Growth when happy/healthy
    if (cat.growth < 100) {
      if (cat.hunger > 45 && cat.thirst > 45 && cat.cleanliness > 45 && cat.affection > 45) {
        let growthSpeed = 0.1; // 0.1% per second
        if (state.data.shopItems.includes('catnip_mouse')) growthSpeed = 0.15;
        // Academic trait modifier: Cat-culus (+20% growth rate)
        if (cat.traits && cat.traits.includes('growthBoost')) growthSpeed *= 1.2;
        cat.growth = Math.min(100, parseFloat((cat.growth + growthSpeed).toFixed(1)));
        
        if (cat.growth >= 100) {
          showToast(`🎉 Congratulations! ${cat.name} has grown into a healthy adult cat!`);
          audio.playMeow(0.9);
        }
      }
    }

    // Random meows/movement trigger
    if (Math.random() < 0.02 && cat.status === 'idle') {
      if (idx === focusCatIndex) {
        audio.playMeow(cat.growth < 100 ? 1.3 : 1.0);
      }
    }

    cat.lastTick = now;
    stateModified = true;
  });

  if (currentRoom === 'phone-room') {
    let danderIncrease = 0;
    if (state.data.doorOpen) {
      state.data.activeCats.forEach(cat => {
        if (cat.cleanliness < 75) {
          danderIncrease += (75 - cat.cleanliness) * 0.008;
        }
      });
    }
    
    if (danderIncrease > 0) {
      state.data.roomDander = Math.min(100, (state.data.roomDander || 0) + danderIncrease);
      stateModified = true;
    }

    if (state.data.roomDander >= 100) {
      if (Math.random() < 0.1) {
        audio.playSneeze();
        showToast("🤧 ACHOO! The room dander is causing severe allergies! Close the door and vacuum the room!");
        
        const arena = document.getElementById('play-space-container');
        if (arena) {
          arena.style.animation = 'shake 0.35s ease-in-out';
          setTimeout(() => { arena.style.animation = ''; }, 350);
        }
      }
    }
    
    updatePhoneRoomButtons();
    updateBedroomTVUI();
  }

  if (stateModified) {
    state.saveProfiles();
    renderFocusCatDetails();
    renderRoomScene();
  }
}

const CALENDAR_MONTHS = ["Purr-uary", "Fur-bruary", "Meow-rch", "Fur-ril", "May-ow", "June-nip", "Jew-claw", "Aug-cat", "Sept-whisk", "Oct-claw", "Novem-tail", "Decem-purr"];

function getActiveEventToday() {
  if (!state.data) return null;
  const day = state.data.calendarDay || 1;
  const month = state.data.calendarMonth || 1;
  
  const customKey = `${month}_${day}`;
  if (state.data.customEvents && state.data.customEvents[customKey]) {
    return { name: state.data.customEvents[customKey].title, type: state.data.customEvents[customKey].type, isCustom: true };
  }

  if (day % 7 === 5) {
    return { name: "Friday Fish Feast", type: "fish_feast" };
  }
  if (day % 7 === 0) {
    return { name: "Sunday Spa Day", type: "spa_day" };
  }

  return null;
}

// --- INTERACTION & CARE HANDLERS ---
function triggerInteraction(action, catIndex = focusCatIndex, clientX = null, clientY = null) {
  const cat = state.data.activeCats[catIndex];
  if (!cat) return;
  if (currentRoom !== 'living-room' && currentRoom !== 'bath-area' && currentRoom !== 'phone-room') return;
  if (currentRoom === 'phone-room' && !state.data.doorOpen) return;

  // Sleeping cats ignore most actions unless woke up
  if (cat.status === 'sleeping' && action !== 'sleep') {
    showToast(`${cat.name} is sleeping. Let them rest!`);
    return;
  }

  // Position coordinates for floating numbers
  const container = document.getElementById('cats-render-area');
  const catElement = container.children[catIndex];
  let fx = 150, fy = 150;
  if (catElement) {
    const rect = catElement.getBoundingClientRect();
    const playRect = document.getElementById('play-space-container').getBoundingClientRect();
    fx = rect.left - playRect.left + rect.width / 2;
    fy = rect.top - playRect.top + 30;
  }
  if (clientX && clientY) {
    const playRect = document.getElementById('play-space-container').getBoundingClientRect();
    fx = clientX - playRect.left;
    fy = clientY - playRect.top;
  }

  const activeEvent = getActiveEventToday();
  const isVacationToday = activeEvent && activeEvent.type === 'vacation';

  switch(action) {
    case 'feed':
      audio.playCrunch();
      
      let hungerAmt = 30;
      if (activeEvent && activeEvent.type === 'fish_feast') {
        hungerAmt = 45;
        showToast("🐟 Event active: Friday Fish Feast (+15 extra Hunger full!)");
      }

      cat.hunger = Math.min(100, cat.hunger + hungerAmt);
      cat.cleanliness = Math.max(0, cat.cleanliness - 5);
      cat.status = 'eating';
      triggerFloater(fx, fy, `+${hungerAmt} Hunger`, 'love');
      
      // Glutton bonus coins
      if (cat.personality === 'glutton') {
        state.data.coins += 15;
        triggerFloater(fx, fy - 20, '+15 Coins', 'coins');
        updateHeaderStats();
      }

      setTimeout(() => {
        if (cat.status === 'eating') cat.status = 'idle';
      }, 2000);
      break;

    case 'water':
      audio.playCrunch();
      cat.thirst = Math.min(100, cat.thirst + 35);
      triggerFloater(fx, fy, '+35 Thirst', 'love');
      break;

    case 'play':
      if (cat.energy < 20) {
        showToast(`${cat.name} is too tired to play!`);
        return;
      }
      audio.playSqueak();
      cat.status = 'playing';
      
      // Stats adjustments
      let affectionGain = 20;
      let energyCost = 15;

      if (cat.personality === 'playful') {
        affectionGain = 30;
        energyCost = 10;
      }

      if (activeEvent && activeEvent.type === 'play_party') {
        affectionGain *= 2;
        showToast("🧸 Event active: Play Party (Double Affection from play!)");
      }

      if (cat.traits && cat.traits.includes('meowBoost')) {
        affectionGain = Math.floor(affectionGain * 1.35);
      }

      if (isVacationToday) {
        affectionGain *= 2;
        energyCost = Math.floor(energyCost * 0.5);
      }

      cat.affection = Math.min(100, cat.affection + affectionGain);
      cat.energy = Math.max(0, cat.energy - energyCost);
      cat.cleanliness = Math.max(0, cat.cleanliness - 10);
      
      triggerFloater(fx, fy, `+${affectionGain} Affection`, 'love');
      triggerFloater(fx, fy - 20, `-${energyCost} Energy`, 'annoyed');

      // Earn minor coins for playing
      const earned = Math.floor(Math.random() * 5) + 3;
      state.data.coins += earned;
      updateHeaderStats();
      triggerFloater(fx, fy - 40, `+${earned} Coins`, 'coins');

      setTimeout(() => {
        if (cat.status === 'playing') cat.status = 'idle';
      }, 1500);
      break;

    case 'pet':
      // Sassy reaction if tired
      if (cat.personality === 'sassy' && cat.energy < 30) {
        audio.playMeow(0.65); // low hiss
        cat.affection = Math.max(0, cat.affection - 15);
        triggerFloater(fx, fy, `-15 Affection`, 'annoyed');
        showToast(`${cat.name} hissed! They don't want to be petted when tired.`);
        return;
      }

      audio.playPurr();
      cat.status = 'petting';
      
      let petGain = 10;
      if (cat.personality === 'needy') petGain = 20;

      if (cat.traits && cat.traits.includes('meowBoost')) {
        petGain = Math.floor(petGain * 1.35);
      }

      if (isVacationToday) {
        petGain *= 2;
      }

      cat.affection = Math.min(100, cat.affection + petGain);
      triggerFloater(fx, fy, `+${petGain} Love`, 'love');

      setTimeout(() => {
        if (cat.status === 'petting') cat.status = 'idle';
      }, 1500);
      break;

    case 'groom':
      audio.playPurr();
      cat.cleanliness = Math.min(100, cat.cleanliness + 30);
      let groomAff = 10;
      if (isVacationToday) groomAff *= 2;
      cat.affection = Math.min(100, cat.affection + groomAff);
      triggerFloater(fx, fy, `+30 Cleanliness`, 'love');
      updateVacationQuestProgress('groom');
      break;

    case 'bath':
      if (currentRoom !== 'bath-area') {
        showToast('You can only wash cats in the Bath Area!');
        return;
      }
      audio.playScoop(); // Sloshing water
      audio.playPurr();
      cat.cleanliness = 100;
      
      let bathAff = 20;
      if (activeEvent && activeEvent.type === 'spa_day') {
        bathAff = 40;
        state.data.coins += 10;
        updateHeaderStats();
        triggerFloater(fx, fy - 20, '+10 Coins (Spa Bonus!)', 'coins');
        showToast("🫧 Event active: Sunday Spa Day (Double Affection + 10 Coins!)");
      }
      if (isVacationToday) {
        bathAff *= 2;
      }
      cat.affection = Math.min(100, cat.affection + bathAff);
      triggerFloater(fx, fy, '100% Clean! 🫧', 'love');
      triggerFloater(fx, fy - 40, `+${bathAff} Affection`, 'love');
      updateVacationQuestProgress('groom');
      break;

    case 'sleep':
      if (cat.status === 'sleeping') {
        // Toggle wakeup
        cat.status = 'idle';
        showToast(`${cat.name} woke up.`);
      } else {
        cat.status = 'sleeping';
        showToast(`${cat.name} went to sleep... Zzz`);
      }
      break;

    case 'clean':
      audio.playScoop();
      state.data.activeCats.forEach(c => {
        c.cleanliness = Math.min(100, c.cleanliness + 25);
      });
      showToast('Scooped the litter box! Cleanliness increased for all active cats.');
      break;
  }

  state.saveProfiles();
  renderFocusCatDetails();
  renderRoomScene();
}

// Attach listeners to care center buttons
document.querySelectorAll('.care-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    triggerInteraction(btn.dataset.action);
  });
});

// Trigger Breeding next generation
document.getElementById('breed-next-generation-btn').addEventListener('click', () => {
  if (confirm('Are you ready to find a partner, breed, and adopt the next generation of kittens? The current parents will retire to the Back Room.')) {
    Views.switch('breeding-screen');
  }
});


// --- COZY PET SHOP VIEW LOGIC ---
const shopModal = document.getElementById('shop-modal');

document.getElementById('open-shop-btn').addEventListener('click', () => {
  renderShopItems();
  shopModal.classList.add('active');
});

function renderShopItems() {
  const container = document.getElementById('shop-items-grid');
  container.innerHTML = '';

  SHOP_ITEMS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-item-card';

    const title = document.createElement('h4');
    title.className = 'shop-item-title';
    title.innerHTML = `<span>${item.icon}</span> ${item.name}`;

    const desc = document.createElement('p');
    desc.className = 'shop-item-desc';
    desc.textContent = item.desc;

    const purchaseRow = document.createElement('div');
    purchaseRow.className = 'shop-item-purchase';
    
    const price = document.createElement('span');
    price.className = 'shop-item-price';
    price.textContent = `🪙 ${item.cost}`;

    const buyBtn = document.createElement('button');
    buyBtn.className = 'btn primary-btn';
    buyBtn.style.padding = '6px 12px';
    buyBtn.style.fontSize = '0.85rem';

    // Verify ownership for passive upgrades
    const alreadyOwn = item.isPassive && state.data.shopItems.includes(item.id);
    if (alreadyOwn) {
      buyBtn.textContent = 'Owned';
      buyBtn.disabled = true;
      buyBtn.classList.add('disabled');
    } else {
      buyBtn.textContent = 'Buy';
      buyBtn.onclick = () => buyShopItem(item);
    }

    purchaseRow.appendChild(price);
    purchaseRow.appendChild(buyBtn);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(purchaseRow);

    container.appendChild(card);
  });
}

function buyShopItem(item) {
  if (state.data.coins < item.cost) {
    showToast('Not enough coins!');
    return;
  }

  state.data.coins -= item.cost;
  audio.playPurr();

  if (item.isPassive) {
    state.data.shopItems.push(item.id);
    showToast(`Purchased passive upgrade: ${item.name}!`);
  } else {
    // Immediate usage items
    state.data.activeCats.forEach((cat, idx) => {
      if (item.id === 'salmon_treats') {
        cat.hunger = Math.min(100, cat.hunger + 45);
        cat.affection = Math.min(100, cat.affection + 15);
      } else if (item.id === 'spring_water') {
        cat.thirst = Math.min(100, cat.thirst + 50);
        cat.energy = Math.min(100, cat.energy + 5);
      }
    });
    
    showToast(`Fed & watered all active cats with ${item.name}!`);
  }

  state.saveProfiles();
  updateHeaderStats();
  renderShopItems();
  renderFocusCatDetails();
  renderRoomScene();
}


// --- MINI-GAME LOGIC (Catch the Mouse) ---
const minigameModal = document.getElementById('minigame-modal');
const mouseSprite = document.getElementById('minigame-mouse');
const minigameStartBtn = document.getElementById('minigame-start-btn');

let minigameActive = false;
let minigameHits = 0;
let minigameTimeLeft = 20;
let minigameTimerInterval = null;
let minigameMouseTimeout = null;
let minigameSpeed = 1000; // ms per jump

document.getElementById('open-minigame-btn').addEventListener('click', () => {
  minigameModal.classList.add('active');
  resetMinigameUI();
});

function resetMinigameUI() {
  minigameActive = false;
  minigameHits = 0;
  minigameTimeLeft = 20;
  minigameSpeed = 1000;
  
  document.getElementById('minigame-hits').textContent = '0';
  document.getElementById('minigame-timer').textContent = '20s';
  document.getElementById('minigame-coins').textContent = '0';
  
  mouseSprite.style.display = 'none';
  minigameStartBtn.style.display = 'inline-block';
  
  if (minigameTimerInterval) clearInterval(minigameTimerInterval);
  if (minigameMouseTimeout) clearTimeout(minigameMouseTimeout);
}

minigameStartBtn.addEventListener('click', () => {
  minigameActive = true;
  minigameHits = 0;
  minigameTimeLeft = 20;
  minigameSpeed = 1000;
  
  minigameStartBtn.style.display = 'none';
  mouseSprite.style.display = 'block';
  audio.playMeow(1.2);

  moveMouse();
  
  minigameTimerInterval = setInterval(() => {
    minigameTimeLeft--;
    document.getElementById('minigame-timer').textContent = `${minigameTimeLeft}s`;
    
    if (minigameTimeLeft <= 0) {
      endMinigame();
    }
  }, 1000);
});

function moveMouse() {
  if (!minigameActive) return;

  const arena = document.getElementById('minigame-arena');
  const arenaWidth = arena.clientWidth - 50;
  const arenaHeight = arena.clientHeight - 50;

  const rx = Math.floor(Math.random() * arenaWidth);
  const ry = Math.floor(Math.random() * arenaHeight);

  mouseSprite.style.left = `${rx}px`;
  mouseSprite.style.top = `${ry}px`;

  // Jump speed increases scaling with hits
  const nextInterval = Math.max(380, minigameSpeed - (minigameHits * 35));

  minigameMouseTimeout = setTimeout(moveMouse, nextInterval);
}

function onMouseCatch(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (!minigameActive) return;
  audio.playSqueak();
  minigameHits++;
  updateVacationQuestProgress('minigame');
  
  document.getElementById('minigame-hits').textContent = minigameHits;
  
  const cat = state.data.activeCats ? state.data.activeCats[focusCatIndex] : null;
  const coinPerHit = (cat && cat.traits && cat.traits.includes('huntBoost')) ? 4 : 3;
  const rewards = minigameHits * coinPerHit;
  document.getElementById('minigame-coins').textContent = rewards;

  clearTimeout(minigameMouseTimeout);
  moveMouse();
}

mouseSprite.addEventListener('mousedown', onMouseCatch);
mouseSprite.addEventListener('touchstart', onMouseCatch);

function endMinigame() {
  minigameActive = false;
  mouseSprite.style.display = 'none';
  
  clearInterval(minigameTimerInterval);
  clearTimeout(minigameMouseTimeout);
  
  const cat = state.data.activeCats[focusCatIndex];
  const coinPerHit = (cat && cat.traits && cat.traits.includes('huntBoost')) ? 4 : 3;
  const finalCoins = minigameHits * coinPerHit;
  
  state.data.coins += finalCoins;
  state.saveProfiles();
  
  updateHeaderStats();
  alert(`Time is up! You caught the mouse ${minigameHits} times and earned 🪙 ${finalCoins} Cat Coins!`);
  resetMinigameUI();
}


// --- FAMILY TREE LINEAGE SYSTEM ---
const familyModal = document.getElementById('family-tree-modal');

document.getElementById('open-family-tree-btn').addEventListener('click', () => {
  renderFamilyTree();
  familyModal.classList.add('active');
});

function renderFamilyTree() {
  const container = document.getElementById('family-tree-scroller');
  container.innerHTML = '';

  const database = state.data.familyTree || [];
  if (database.length === 0) {
    container.innerHTML = `<p style="padding:40px; color:var(--text-muted);">Breed kittens to start building your family tree legacy!</p>`;
    return;
  }

  // Group by generation
  const generations = {};
  database.forEach(cat => {
    if (!generations[cat.generation]) {
      generations[cat.generation] = [];
    }
    generations[cat.generation].push(cat);
  });

  const sortedGens = Object.keys(generations).sort((a,b) => a - b);

  sortedGens.forEach(genNum => {
    const col = document.createElement('div');
    col.className = 'generation-column';

    const title = document.createElement('h3');
    title.textContent = genNum == 0 ? 'Founders' : `Gen ${genNum}`;
    col.appendChild(title);

    const nodesBox = document.createElement('div');
    nodesBox.className = 'generation-tree-nodes';

    generations[genNum].forEach(cat => {
      const node = document.createElement('div');
      node.className = 'family-tree-node';

      const avatar = document.createElement('div');
      avatar.className = 'family-tree-node-avatar';
      avatar.innerHTML = renderCatSVG(cat, true);

      const info = document.createElement('div');
      info.className = 'family-tree-node-info';
      
      const pName = PERSONALITIES[cat.personality]?.name || 'Unknown';
      info.innerHTML = `
        <h5>${cat.name}</h5>
        <p>${pName} • ${cat.genes.tailStyle} tail</p>
      `;

      node.appendChild(avatar);
      node.appendChild(info);

      // Render partner metadata if parent bred
      const childGen = parseInt(genNum) + 1;
      const childGenList = generations[childGen] || [];
      if (childGenList.length > 0) {
        // Did this cat breed to produce the next gen?
        const partnerBlock = document.createElement('div');
        partnerBlock.className = 'partner-box';
        partnerBlock.innerHTML = `
          <div class="partner-box-label">Partner</div>
          <div class="partner-details">
            <span class="partner-name">Custom Mate</span>
          </div>
        `;
        node.appendChild(partnerBlock);
      }

      nodesBox.appendChild(node);
    });

    col.appendChild(nodesBox);
    container.appendChild(col);
  });
}

// --- COZY CALENDAR SYSTEM ---
const calendarModal = document.getElementById('calendar-modal');
let selectedCalendarDay = null;
let selectedCalendarMonth = null;

function openCalendar() {
  if (!state.data) return;
  selectedCalendarDay = state.data.calendarDay || 1;
  selectedCalendarMonth = state.data.calendarMonth !== undefined ? state.data.calendarMonth : 1;
  
  document.getElementById('scheduler-date-input').value = `Day ${selectedCalendarDay} of ${CALENDAR_MONTHS[selectedCalendarMonth]}`;
  document.getElementById('scheduler-name-input').value = '';
  
  renderCalendar();
  renderVacationPanel();
  calendarModal.classList.add('active');
}

document.getElementById('open-calendar-btn').addEventListener('click', openCalendar);
const headerDateBadge = document.getElementById('header-date-badge');
if (headerDateBadge) {
  headerDateBadge.addEventListener('click', openCalendar);
}

function renderCalendar() {
  const container = document.getElementById('calendar-days-container');
  if (!container) return;
  container.innerHTML = '';

  const today = state.data.calendarDay || 1;
  const currentMonth = state.data.calendarMonth !== undefined ? state.data.calendarMonth : 1;
  const currentYear = state.data.calendarYear || 1;

  document.getElementById('calendar-current-date').textContent = `Year ${currentYear} • Month of ${CALENDAR_MONTHS[currentMonth]}`;

  const todayEvent = getActiveEventToday();
  const descDisplay = document.getElementById('today-event-desc');
  const cardDisplay = document.getElementById('calendar-active-event-display');
  
  if (todayEvent) {
    let effectText = "";
    if (todayEvent.type === 'spa_day') effectText = "Baths grant +10 Coins & Double Affection today!";
    if (todayEvent.type === 'fish_feast') effectText = "Friday Fish Feast! Feeding active cats fills +15 extra Hunger.";
    if (todayEvent.type === 'play_party') effectText = "Play Party! Toy play actions grant double Affection.";
    if (todayEvent.type === 'vacation') effectText = "🌴 Vacation Day! Zero energy loss, double affection gains, half stats decay, and +50🪙 bonus!";
    
    descDisplay.innerHTML = `<strong>${todayEvent.name}</strong><br><span style="font-size:0.82rem; color:#00acc1;">${effectText}</span>`;
    cardDisplay.classList.add('has-active');
  } else {
    descDisplay.textContent = "No active events today. Spend time with your cats or schedule a special day!";
    cardDisplay.classList.remove('has-active');
  }

  for (let d = 1; d <= 28; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    
    if (d === today) cell.classList.add('today');
    if (d === selectedCalendarDay) cell.classList.add('selected-day');

    const num = document.createElement('span');
    num.className = 'day-num';
    num.textContent = d;
    cell.appendChild(num);

    const dotsBox = document.createElement('div');
    dotsBox.className = 'day-indicator-dots';

    if (d % 7 === 5) {
      const dot = document.createElement('div');
      dot.className = 'dot dot-fish_feast';
      dot.style.backgroundColor = 'var(--color-hunger)';
      dot.title = 'Fish Feast Friday';
      dotsBox.appendChild(dot);
    }
    if (d % 7 === 0) {
      const dot = document.createElement('div');
      dot.className = 'dot dot-spa_day';
      dot.style.backgroundColor = 'var(--color-thirst)';
      dot.title = 'Sunday Spa Day';
      dotsBox.appendChild(dot);
    }

    const customKey = `${currentMonth}_${d}`;
    if (state.data.customEvents && state.data.customEvents[customKey]) {
      const dot = document.createElement('div');
      dot.className = 'dot dot-custom';
      
      const type = state.data.customEvents[customKey].type;
      if (type === 'spa_day') dot.style.backgroundColor = 'var(--color-thirst)';
      else if (type === 'fish_feast') dot.style.backgroundColor = 'var(--color-hunger)';
      else if (type === 'play_party') dot.style.backgroundColor = 'var(--color-energy)';
      else if (type === 'vacation') dot.style.backgroundColor = 'var(--accent-teal)';
      else dot.style.backgroundColor = 'var(--color-cleanliness)';
      
      dot.title = state.data.customEvents[customKey].title;
      dotsBox.appendChild(dot);
    }

    cell.appendChild(dotsBox);

    cell.onclick = () => {
      selectedCalendarDay = d;
      selectedCalendarMonth = currentMonth;
      
      document.getElementById('scheduler-date-input').value = `Day ${d} of ${CALENDAR_MONTHS[currentMonth]}`;
      
      const existing = state.data.customEvents[customKey];
      document.getElementById('scheduler-name-input').value = existing ? existing.title : '';
      if (existing) {
        document.getElementById('scheduler-type-input').value = existing.type;
      }

      renderCalendar();
    };

    container.appendChild(cell);
  }
}

document.getElementById('scheduler-save-btn').addEventListener('click', () => {
  if (!selectedCalendarDay || selectedCalendarMonth === null) {
    alert("Please select a day on the grid first.");
    return;
  }

  const nameInput = document.getElementById('scheduler-name-input');
  const typeSelect = document.getElementById('scheduler-type-input');
  const title = nameInput.value.trim();
  const type = typeSelect.value;
  const key = `${selectedCalendarMonth}_${selectedCalendarDay}`;

  if (!state.data.customEvents) state.data.customEvents = {};

  if (!title) {
    if (state.data.customEvents[key]) {
      delete state.data.customEvents[key];
      state.saveProfiles();
      showToast("Cleared event for selected day.");
    }
  } else {
    state.data.customEvents[key] = { title, type };
    state.saveProfiles();
    showToast(`Event "${title}" scheduled successfully!`);
  }

  renderCalendar();
  updateHeaderStats();
});

// --- WARDROBE / DRESS-UP STUDIO LOGIC ---
const wardrobeModal = document.getElementById('wardrobe-modal');
let dressingCatIndex = 0;
let selectedAccessoryCategory = 'hat';
let currentAccessorySelections = {};

const ACCESSORIES_OPTIONS = {
  hat: [
    { id: 'none', name: 'None' },
    { id: 'wizard', name: 'Wizard Hat 🎩' },
    { id: 'cowboy', name: 'Cowboy Hat 🤠' },
    { id: 'party', name: 'Party Cone 🥳' },
    { id: 'detective', name: 'Detective Cap 🕵️' }
  ],
  glasses: [
    { id: 'none', name: 'None' },
    { id: 'sunglasses', name: 'Sunglasses 🕶️' },
    { id: 'smart_glasses', name: 'Smart Glasses 🤓' },
    { id: 'monocle', name: 'Monocle 🧐' }
  ],
  neckwear: [
    { id: 'none', name: 'None' },
    { id: 'bowtie', name: 'Red Bowtie 🎀' },
    { id: 'bell_collar', name: 'Bell Collar 🔔' },
    { id: 'scarf', name: 'Cozy Scarf 🧣' }
  ]
};

function openWardrobe() {
  if (!state.data || state.data.activeCats.length === 0) return;
  
  dressingCatIndex = 0;
  selectedAccessoryCategory = 'hat';
  
  const select = document.getElementById('wardrobe-cat-select');
  select.innerHTML = '';
  state.data.activeCats.forEach((cat, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
  
  select.value = 0;
  select.onchange = () => {
    dressingCatIndex = parseInt(select.value);
    loadCatAccessories();
  };

  loadCatAccessories();
  
  document.querySelectorAll('.accessory-tab-btn').forEach(btn => {
    if (!btn.dataset.listenerActive) {
      btn.dataset.listenerActive = "true";
      btn.addEventListener('click', () => {
        document.querySelectorAll('.accessory-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedAccessoryCategory = btn.dataset.category;
        renderAccessoryStyles();
        renderAccessoryColors();
      });
    }
  });

  wardrobeModal.classList.add('active');
}

function loadCatAccessories() {
  const cat = state.data.activeCats[dressingCatIndex];
  if (!cat) return;

  if (!cat.accessories) {
    cat.accessories = {
      hat: { style: 'none', primaryColor: '#512da8', accentColor: '#ffb300' },
      glasses: { style: 'none', primaryColor: '#212121', accentColor: '#ffca28' },
      neckwear: { style: 'none', primaryColor: '#c62828', accentColor: '#ffca28' }
    };
  }

  currentAccessorySelections = JSON.parse(JSON.stringify(cat.accessories));
  document.getElementById('wardrobe-cat-title').textContent = `Dressing ${cat.name}`;
  
  renderWardrobePreview();
  renderAccessoryStyles();
  renderAccessoryColors();
}

function renderWardrobePreview() {
  const previewBox = document.getElementById('wardrobe-cat-preview');
  if (!previewBox) return;
  
  const cat = state.data.activeCats[dressingCatIndex];
  if (!cat) return;

  const tempCat = JSON.parse(JSON.stringify(cat));
  tempCat.accessories = currentAccessorySelections;
  tempCat.status = 'happy';
  
  previewBox.innerHTML = renderCatSVG(tempCat, false);
}

function renderAccessoryStyles() {
  const container = document.getElementById('accessory-style-list');
  container.innerHTML = '';

  const options = ACCESSORIES_OPTIONS[selectedAccessoryCategory];
  const activeStyle = currentAccessorySelections[selectedAccessoryCategory]?.style || 'none';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `${opt.id === activeStyle ? 'active' : ''}`;
    btn.textContent = opt.name;
    
    btn.onclick = () => {
      if (!currentAccessorySelections[selectedAccessoryCategory]) {
        currentAccessorySelections[selectedAccessoryCategory] = { style: 'none', primaryColor: '#ffffff', accentColor: '#ffffff' };
      }
      currentAccessorySelections[selectedAccessoryCategory].style = opt.id;
      
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      renderWardrobePreview();
      renderAccessoryColors(); // refresh color section visibility
    };
    
    container.appendChild(btn);
  });
}

function renderAccessoryColors() {
  const pContainer = document.getElementById('accessory-primary-colors');
  const aContainer = document.getElementById('accessory-accent-colors');
  const colorControlSection = document.getElementById('accessory-color-controls');
  
  const activeStyle = currentAccessorySelections[selectedAccessoryCategory]?.style || 'none';
  if (activeStyle === 'none') {
    colorControlSection.style.display = 'none';
    return;
  }
  colorControlSection.style.display = 'flex';

  pContainer.innerHTML = '';
  aContainer.innerHTML = '';

  const currentPrimary = currentAccessorySelections[selectedAccessoryCategory]?.primaryColor || '#ffffff';
  const currentAccent = currentAccessorySelections[selectedAccessoryCategory]?.accentColor || '#ffffff';

  const DRESS_COLORS = [
    { name: 'Red', hex: '#d32f2f' },
    { name: 'Pink', hex: '#f06292' },
    { name: 'Purple', hex: '#673ab7' },
    { name: 'Royal Blue', hex: '#1976d2' },
    { name: 'Aqua', hex: '#00bcd4' },
    { name: 'Gold', hex: '#ffc107' },
    { name: 'Green', hex: '#4caf50' },
    { name: 'Black', hex: '#212121' },
    { name: 'White', hex: '#ffffff' }
  ];

  DRESS_COLORS.forEach(c => {
    const pDot = document.createElement('div');
    pDot.className = `color-option ${c.hex === currentPrimary ? 'active' : ''}`;
    pDot.style.backgroundColor = c.hex;
    pDot.title = c.name;
    pDot.onclick = () => {
      currentAccessorySelections[selectedAccessoryCategory].primaryColor = c.hex;
      pContainer.querySelectorAll('.color-option').forEach(d => d.classList.remove('active'));
      pDot.classList.add('active');
      renderWardrobePreview();
    };
    pContainer.appendChild(pDot);

    const aDot = document.createElement('div');
    aDot.className = `color-option ${c.hex === currentAccent ? 'active' : ''}`;
    aDot.style.backgroundColor = c.hex;
    aDot.title = c.name;
    aDot.onclick = () => {
      currentAccessorySelections[selectedAccessoryCategory].accentColor = c.hex;
      aContainer.querySelectorAll('.color-option').forEach(d => d.classList.remove('active'));
      aDot.classList.add('active');
      renderWardrobePreview();
    };
    aContainer.appendChild(aDot);
  });
}

document.getElementById('open-wardrobe-btn').addEventListener('click', openWardrobe);

document.getElementById('accessory-remove-btn').addEventListener('click', () => {
  if (currentAccessorySelections[selectedAccessoryCategory]) {
    currentAccessorySelections[selectedAccessoryCategory].style = 'none';
    renderWardrobePreview();
    renderAccessoryStyles();
    renderAccessoryColors();
    showToast(`Removed accessory in category: ${selectedAccessoryCategory}`);
  }
});

document.getElementById('accessory-equip-btn').addEventListener('click', () => {
  const cat = state.data.activeCats[dressingCatIndex];
  if (!cat) return;

  cat.accessories = JSON.parse(JSON.stringify(currentAccessorySelections));
  state.saveProfiles();
  audio.playPurr();
  showToast(`${cat.name} is looking fabulous! Equipped outfits.`);
  
  document.getElementById('wardrobe-modal').classList.remove('active');
  renderRoomScene();
});

// --- SCHOOL ACADEMY LOGIC ---
const COURSES_INFO = {
  'cat-culus': { name: 'Cat-culus', cost: 25, duration: 15, trait: 'growthBoost', degree: 'BS in Cat-culus' },
  'nap-ology': { name: 'Nap-ology', cost: 20, duration: 10, trait: 'napBoost', degree: 'PhD in Nap-ology' },
  'meow-sic': { name: 'Meow-sic', cost: 30, duration: 20, trait: 'meowBoost', degree: 'MA in Meow-sic' },
  'hunting-101': { name: 'Hunting 101', cost: 40, duration: 25, trait: 'huntBoost', degree: 'Cert. Hunter' },
  'self-grooming': { name: 'Self-Grooming', cost: 25, duration: 15, trait: 'groomDecayBoost', degree: 'Dipl. Grooming' }
};

function renderSchoolDashboard() {
  const cat = state.data.activeCats[focusCatIndex];
  if (!cat) return;

  const schoolGrid = document.querySelector('.school-actions-grid');
  const progressContainer = document.getElementById('study-progress-container');
  
  if (cat.status === 'studying') {
    if (schoolGrid) schoolGrid.style.pointerEvents = 'none';
    if (progressContainer) {
      progressContainer.style.display = 'block';
      const label = document.getElementById('study-progress-label');
      const timeVal = document.getElementById('study-progress-time');
      const fillBar = document.getElementById('study-progress-bar');
      
      const course = COURSES_INFO[cat.studyCourse];
      if (course) {
        label.textContent = `Studying ${course.name}...`;
        timeVal.textContent = `${cat.studyTimeLeft}s left`;
        
        const percent = ((course.duration - cat.studyTimeLeft) / course.duration) * 100;
        fillBar.style.width = `${percent}%`;
      }
    }
  } else {
    if (schoolGrid) schoolGrid.style.pointerEvents = 'auto';
    if (progressContainer) progressContainer.style.display = 'none';
  }

  document.querySelectorAll('.school-btn').forEach(btn => {
    const courseId = btn.dataset.course;
    const info = COURSES_INFO[courseId];
    const hasDegree = cat.degrees && cat.degrees.includes(info.degree);

    if (hasDegree) {
      btn.disabled = true;
      btn.classList.add('disabled');
      btn.style.opacity = '0.5';
      const badge = btn.querySelector('strong');
      if (badge) badge.textContent = "Graduated! 🎓";
    } else {
      btn.disabled = cat.status === 'studying';
      btn.classList.toggle('disabled', cat.status === 'studying');
      btn.style.opacity = '1';
      const badge = btn.querySelector('strong');
      if (badge) badge.textContent = `${info.cost} Coins`;
    }
  });
}

function enrollInCourse(courseId) {
  const cat = state.data.activeCats[focusCatIndex];
  if (!cat) return;

  if (cat.status === 'studying') {
    showToast("This cat is already in class!");
    return;
  }

  const course = COURSES_INFO[courseId];
  if (!course) return;

  const hasDegree = cat.degrees && cat.degrees.includes(course.degree);
  if (hasDegree) {
    showToast(`${cat.name} already has a degree in ${course.name}!`);
    return;
  }

  if (state.data.coins < course.cost) {
    showToast("Not enough Cat Coins! Play Catch the Mouse to earn more.");
    return;
  }

  state.data.coins -= course.cost;
  cat.status = 'studying';
  cat.studyCourse = courseId;
  cat.studyTimeLeft = course.duration;

  state.saveProfiles();
  updateHeaderStats();
  
  audio.playPurr();
  setTimeout(() => audio.playMeow(1.2), 100);

  showToast(`${cat.name} enrolled in ${course.name}! 📚`);
  updateVacationQuestProgress('study');

  renderSchoolDashboard();
  renderRoomScene();
}

document.querySelectorAll('.school-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    enrollInCourse(btn.dataset.course);
  });
});

// --- DRIVING MINIGAME TRANSITION SYSTEM ---
let pendingAdoptionState = null;
let drivingJoyrideTarget = null;
let drivingGameActive = false;
let drivingDistance = 0;
let drivingSpeed = 60;
let playerCarOffset = 0;
let drivingLoopInterval = null;
let drivingSpawnTimer = 0;

function startDrivingTransition(joyrideDest = null) {
  drivingGameActive = true;
  drivingDistance = 0;
  drivingSpeed = 60;
  playerCarOffset = 0;
  drivingSpawnTimer = 0;
  
  drivingJoyrideTarget = joyrideDest;

  const title = document.getElementById('driving-screen-title');
  const distLabel = document.getElementById('driving-distance-label');
  const successMsg = document.getElementById('driving-success-msg');
  const finishBtn = document.getElementById('driving-finish-btn');
  
  if (joyrideDest) {
    if (title) title.textContent = `🚗 Traveling to ${joyrideDest}`;
    if (distLabel) distLabel.textContent = "Progress:";
    if (successMsg) successMsg.textContent = `📍 Arrived at ${joyrideDest}!`;
    if (finishBtn) finishBtn.textContent = `Complete Trip & Earn Coins 🪙`;
  } else {
    if (title) title.textContent = "🚗 Driving Home";
    if (distLabel) distLabel.textContent = "Distance to Home:";
    if (successMsg) successMsg.textContent = "🏠 Arrived Home Safely!";
    if (finishBtn) finishBtn.textContent = "Welcome Kittens Inside 🏠";
  }

  document.getElementById('driving-progress-bar').style.width = '0%';
  document.getElementById('driving-distance-val').textContent = '0%';
  document.getElementById('driving-speed-val').textContent = '60 mph';
  document.getElementById('driving-player-car').style.left = `calc(50% - 18px)`;
  document.getElementById('driving-objects-layer').innerHTML = '';
  document.getElementById('driving-success-panel').style.display = 'none';
  document.querySelector('.driving-controls').style.display = 'flex';

  Views.switch('driving-screen');

  if (drivingLoopInterval) clearInterval(drivingLoopInterval);
  drivingLoopInterval = setInterval(drivingGameTick, 35);
}

function moveCar(dir) {
  if (!drivingGameActive) return;
  if (dir === 'left') {
    playerCarOffset = Math.max(-80, playerCarOffset - 25);
  } else {
    playerCarOffset = Math.min(80, playerCarOffset + 25);
  }
  document.getElementById('driving-player-car').style.left = `calc(50% - 18px + ${playerCarOffset}px)`;
}

document.getElementById('drive-left-btn').addEventListener('click', () => moveCar('left'));
document.getElementById('drive-right-btn').addEventListener('click', () => moveCar('right'));

window.addEventListener('keydown', (e) => {
  if (Views.activeView !== 'driving-screen') return;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    moveCar('left');
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    moveCar('right');
  }
});

function drivingGameTick() {
  if (!drivingGameActive) return;

  drivingDistance += (drivingSpeed * 0.0035);
  if (drivingDistance >= 100) {
    drivingDistance = 100;
    finishDrivingGame();
  }

  document.getElementById('driving-progress-bar').style.width = `${drivingDistance.toFixed(1)}%`;
  document.getElementById('driving-distance-val').textContent = `${Math.floor(drivingDistance)}%`;
  document.getElementById('driving-speed-val').textContent = `${Math.floor(drivingSpeed)} mph`;

  if (drivingSpeed < 60) {
    drivingSpeed += 0.5;
  }

  // Animate road lines for scrolling effect
  const linesContainer = document.getElementById('road-lines-container');
  if (linesContainer) {
    let topOffset = (parseFloat(linesContainer.dataset.topOffset) || 0) + (drivingSpeed * 0.25);
    if (topOffset >= 48) topOffset = 0;
    linesContainer.dataset.topOffset = topOffset;
    linesContainer.innerHTML = '';
    
    // Fill vertical line dividers
    for (let y = -48; y < 350; y += 48) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.left = '50%';
      line.style.transform = 'translateX(-50%)';
      line.style.top = `${y + topOffset}px`;
      line.style.width = '6px';
      line.style.height = '24px';
      line.style.background = '#ffd54f';
      linesContainer.appendChild(line);
    }
  }

  const layer = document.getElementById('driving-objects-layer');
  const items = layer.querySelectorAll('.road-object');
  
  items.forEach(item => {
    let top = parseFloat(item.dataset.top) || 0;
    top += (drivingSpeed * 0.12);
    item.dataset.top = top;
    item.style.top = `${top}px`;

    if (top > 320) {
      item.remove();
      return;
    }

    const itemLeftOffset = parseFloat(item.dataset.offset) || 0;
    const verticalOverlap = (top > 215 && top < 275);
    const horizontalOverlap = Math.abs(playerCarOffset - itemLeftOffset) < 28;

    if (verticalOverlap && horizontalOverlap) {
      handleDrivingCollision(item);
    }
  });

  drivingSpawnTimer++;
  if (drivingSpawnTimer > 25) {
    drivingSpawnTimer = 0;
    if (Math.random() < 0.7) {
      spawnRoadObject();
    }
  }
}

function spawnRoadObject() {
  const layer = document.getElementById('driving-objects-layer');
  if (!layer) return;
  
  const isKitten = Math.random() < 0.35;
  const item = document.createElement('div');
  item.className = 'road-object';
  
  const lanes = [-65, 0, 65];
  const offset = lanes[Math.floor(Math.random() * lanes.length)];
  
  item.dataset.top = 0;
  item.dataset.offset = offset;
  item.dataset.type = isKitten ? 'kitten' : 'obstacle';

  item.style.position = 'absolute';
  item.style.top = '0px';
  item.style.left = `calc(50% - 15px + ${offset}px)`;
  item.style.width = '30px';
  item.style.height = '30px';
  item.style.fontSize = '1.5rem';
  item.style.display = 'flex';
  item.style.alignItems = 'center';
  item.style.justifyContent = 'center';
  item.style.zIndex = '3';
  
  if (isKitten) {
    item.textContent = '🐱';
    item.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
  } else {
    item.textContent = Math.random() < 0.5 ? '🚧' : '🕳️';
  }

  layer.appendChild(item);
}

function handleDrivingCollision(item) {
  const type = item.dataset.type;
  item.remove();

  if (type === 'obstacle') {
    drivingSpeed = 20;
    audio.playScoop();
    
    const arena = document.getElementById('driving-arena');
    if (arena) {
      arena.style.animation = 'shake 0.3s ease-in-out';
      setTimeout(() => { arena.style.animation = ''; }, 300);
    }
    
    showToast("Ouch! Steer away from cones and holes!");
  } else {
    drivingSpeed = 85;
    state.data.coins += 5;
    updateHeaderStats();
    
    audio.playPurr();
    audio.playMeow(1.3);
    
    showToast("Picked up kitten carrier! Speed Boost & +5 Coins!");
  }
}

function finishDrivingGame() {
  drivingGameActive = false;
  clearInterval(drivingLoopInterval);

  document.querySelector('.driving-controls').style.display = 'none';
  document.getElementById('driving-success-panel').style.display = 'flex';
  
  audio.playPurr();
}

document.getElementById('driving-finish-btn').addEventListener('click', () => {
  if (drivingJoyrideTarget) {
    const isFarm = drivingJoyrideTarget.includes("Farm") || drivingJoyrideTarget.includes("Grandparents");
    state.data.coins += 15;
    state.saveProfiles();
    updateHeaderStats();
    
    showToast(`📍 Joyride complete! Earned 🪙 15 Cat Coins for driving to ${drivingJoyrideTarget}!`);
    drivingJoyrideTarget = null;
    
    Views.switch('game-screen');
    if (isFarm) {
      setTimeout(() => {
        openGrandparentsFarmModal();
      }, 500);
    }
    return;
  }

  if (!pendingAdoptionState) return;

  state.data.activeCats = pendingAdoptionState.adopted;
  state.data.currentGeneration = pendingAdoptionState.currentGeneration;
  state.data.trustLevel = pendingAdoptionState.trustLevel;
  state.data.coins += pendingAdoptionState.coinsGift;

  state.saveProfiles();
  updateHeaderStats();
  
  showToast(`Successfully brought home your new kittens!`);
  pendingAdoptionState = null;

  Views.switch('game-screen');
});

// --- STUDY & PHONE ROOM INTERACTION LISTENERS ---
document.getElementById('interactive-door').addEventListener('click', () => {
  state.data.doorOpen = !state.data.doorOpen;
  state.saveProfiles();
  
  updateDoorVisuals();
  updatePhoneRoomButtons();
  renderRoomScene();
  
  audio.playScoop();
  setTimeout(() => audio.playPurr(), 150);

  showToast(state.data.doorOpen ? "Door Opened! Cats entered the room 🚪🐾" : "Door Closed! Cats left the room.");
});

document.getElementById('interactive-phone').addEventListener('click', () => {
  const modal = document.getElementById('phone-modal');
  modal.classList.add('active');
  
  audio.playPhoneTone(350, 440, 0.12);
  
  initPhoneKids();
  switchPhoneView('lockscreen');
});

document.querySelectorAll('.phone-dial-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.val;
    const numField = document.getElementById('phone-number-field');
    if (numField.textContent === '-') {
      numField.textContent = val;
    } else {
      numField.textContent += val;
    }
    
    let f1 = 697, f2 = 1209;
    if (val === '1') { f1 = 697; f2 = 1209; }
    else if (val === '2') { f1 = 697; f2 = 1336; }
    else if (val === '3') { f1 = 697; f2 = 1477; }
    else if (val === '4') { f1 = 770; f2 = 1209; }
    else if (val === '5') { f1 = 770; f2 = 1336; }
    else if (val === '6') { f1 = 770; f2 = 1477; }
    else if (val === '7') { f1 = 852; f2 = 1209; }
    else if (val === '8') { f1 = 852; f2 = 1336; }
    else if (val === '9') { f1 = 852; f2 = 1477; }
    else if (val === '0') { f1 = 941; f2 = 1336; }
    else if (val === '*') { f1 = 941; f2 = 1209; }
    else if (val === '#') { f1 = 941; f2 = 1477; }
    
    audio.playPhoneTone(f1, f2, 0.12);
  });
});

document.getElementById('phone-clear-btn').addEventListener('click', () => {
  document.getElementById('phone-number-field').textContent = '-';
  audio.playPhoneTone(440, 480, 0.08);
});

document.getElementById('phone-call-btn').addEventListener('click', () => {
  const number = document.getElementById('phone-number-field').textContent;
  if (number === '-') return;

  const msgDisplay = document.getElementById('phone-message');
  msgDisplay.textContent = 'Calling number...';
  
  audio.playPhoneRing();
  
  setTimeout(() => {
    if (number === '911') {
      msgDisplay.textContent = 'Emergency Line: "All active staff are occupied treating cat allergies. Please clean the room and groom your kittens!"';
    } else if (number === '6369' || number === '228') {
      msgDisplay.textContent = 'Secret Council: "Meow! You dialed the Cat Council. The secrets of the universe lay in grooming your cats regularly. Cleanliness prevents allergy sneezes!"';
    } else {
      const responseOptions = [
        'Voice Recording: "All lines are currently busy. Please leave a meow after the tone..."',
        'Operator: "Connecting you to the nearest cardboard box factory... Connection lost."',
        'Ringtone: "Busy signal. If you are experiencing allergies, hang up and clean the study room immediately."',
        'Voicemail: "Leo and Luna are out catching mice. Call back after breeding another generation."'
      ];
      msgDisplay.textContent = responseOptions[Math.floor(Math.random() * responseOptions.length)];
    }
    audio.playPhoneTone(400, 450, 0.15);
  }, 1200);
});

document.getElementById('clean-room-btn').addEventListener('click', () => {
  if (state.data.doorOpen) {
    showToast("Can't clean room! The cats are inside and they are terrified of the vacuum cleaner!");
    return;
  }
  
  audio.playVacuum();
  
  const btn = document.getElementById('clean-room-btn');
  btn.disabled = true;
  btn.classList.add('disabled');
  btn.textContent = "🔌 Vacuuming...";
  
  setTimeout(() => {
    state.data.roomDander = 0;
    state.saveProfiles();
    
    updatePhoneRoomButtons();
    showToast("🧹 Room vacuumed! Dander and hair completely cleared!");
    
    btn.textContent = "🔌 Vacuum Room";
    btn.disabled = false;
    btn.classList.remove('disabled');
  }, 1500);
});

// --- SMARTPHONE APP CONTROLLERS ---
let phoneChatHistories = {};

function populateChatContacts() {
  const select = document.getElementById('phone-chat-contact-select');
  if (!select || !state.data || !state.data.activeCats) return;
  
  const curVal = select.value;
  select.innerHTML = '';
  
  // Add Vet Option
  const vetOpt = document.createElement('option');
  vetOpt.value = 'vet';
  vetOpt.textContent = '🩺 Dr. Whisker (Vet)';
  select.appendChild(vetOpt);
  
  if (!phoneChatHistories['vet']) {
    phoneChatHistories['vet'] = [
      { sender: 'them', text: 'Dr. Whisker: "Hello! I am Dr. Whisker (Vet). Ask me medical advice or tips about cleanliness, allergies, study room doors, or academy degrees!"' }
    ];
  }
  
  // Add Active House Cats Option
  state.data.activeCats.forEach((cat) => {
    const key = cat.id;
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `🐱 ${cat.name}`;
    select.appendChild(opt);
    
    if (!phoneChatHistories[key]) {
      phoneChatHistories[key] = [
        { sender: 'them', text: `${cat.name}: "Purr... Hello hooman! I am so happy to be your cat! Send me a message! 🐾"` }
      ];
    }
  });

  if (curVal && select.querySelector(`option[value="${curVal}"]`)) {
    select.value = curVal;
  }
}

function initPhoneKids() {
  populateChatContacts();
  renderPhoneHomeScreen();
}

function switchPhoneView(viewId) {
  if (viewId !== 'cattube' && typeof cattubeVideoInterval !== 'undefined' && cattubeVideoInterval) {
    clearInterval(cattubeVideoInterval);
    cattubeVideoInterval = null;
  }
  if (viewId !== 'securitycam' && typeof securityCamTickInterval !== 'undefined' && securityCamTickInterval) {
    clearInterval(securityCamTickInterval);
    securityCamTickInterval = null;
  }
  if (viewId === 'securitycam') {
    if (typeof securityCamTickInterval !== 'undefined' && securityCamTickInterval) clearInterval(securityCamTickInterval);
    securityCamTickInterval = setInterval(drawSecurityCamFeed, 1000);
  }
  document.querySelectorAll('.phone-view').forEach(view => {
    view.style.display = 'none';
  });
  const activeView = document.getElementById(`phone-view-${viewId}`);
  if (activeView) {
    activeView.style.display = 'flex';
  }

  if (viewId === 'lockscreen') {
    updateLockScreenUI();
  }

  if (viewId === 'home') {
    renderPhoneHomeScreen();
    const homeView = document.getElementById('phone-view-home');
    const wall = state.data.phoneWallpaper || 'blue';
    if (homeView) {
      if (wall === 'blue') {
        homeView.style.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
      } else if (wall === 'pink') {
        homeView.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
      } else if (wall === 'green') {
        homeView.style.background = 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)';
      } else if (wall === 'dark') {
        homeView.style.background = 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)';
      }
    }
  }

  if (viewId === 'meowzon') {
    document.getElementById('phone-meowzon-coins').textContent = state.data.coins;
  } else if (viewId === 'chat') {
    populateChatContacts();
    renderPhoneChatHistory();
  } else if (viewId === 'cathrome') {
    loadBrowserUrl('www.meowgle.com');
  } else if (viewId === 'dialer') {
    document.getElementById('phone-number-field').textContent = '-';
    document.getElementById('phone-message').textContent = 'Ready to dial. Enter a number to call...';
  } else if (viewId === 'cam') {
    const rLabel = document.getElementById('phone-cam-room');
    const cLabel = document.getElementById('phone-cam-cats');
    if (rLabel) {
      if (currentRoom === 'back-room') {
        rLabel.textContent = 'COZY RETIREMENT CUSHION ZONE';
      } else if (currentRoom === 'phone-room') {
        rLabel.textContent = 'BEDROOM';
      } else {
        rLabel.textContent = currentRoom.replace('-', ' ').toUpperCase();
      }
    }
    if (cLabel) {
      const list = (currentRoom === 'back-room') ? state.data.retiredCats.map(c => c.name) : (state.data.doorOpen || currentRoom !== 'phone-room' ? state.data.activeCats.map(c => c.name) : []);
      cLabel.textContent = list.length > 0 ? list.join(' & ') : 'NO CATS IN ROOM';
    }
    updateCameraViewfinder();
  } else if (viewId === 'gallery') {
    renderPhoneGallery();
  } else if (viewId === 'bank') {
    updatePhoneBankUI();
  } else if (viewId === 'maps') {
    initPhoneMapsUI();
  } else if (viewId === 'furnish') {
    updateFurnishAppUI();
  } else if (viewId === 'collarmaker') {
    initCollarMakerUI();
  } else if (viewId === 'videocall') {
    // Handled dynamically
  } else if (viewId === 'incomingcall' || viewId === 'activecall') {
    // Handled dynamically
  } else if (viewId === 'play') {
    updateMeowglePlayUI();
  } else if (viewId === 'cattube') {
    initCatTubeUI();
  } else if (viewId === 'meowtify') {
    initMeowtifyUI();
  } else if (viewId === 'catfit') {
    initCatFitUI();
  } else if (viewId === 'cattitude') {
    initCattitudeUI();
  } else if (viewId === 'securitycam') {
    initSecurityCamUI();
  }
}

// Bind App Navigation Buttons
document.querySelectorAll('.phone-app-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    audio.playPhoneTone(440, 480, 0.08);
    switchPhoneView(btn.dataset.target);
  });
});

function handlePhoneHomeAction() {
  audio.playPhoneTone(440, 480, 0.08);
  const homeView = document.getElementById('phone-view-home');
  if (homeView && homeView.style.display === 'flex') {
    document.getElementById('phone-modal').classList.remove('active');
    if (typeof cattubeVideoInterval !== 'undefined' && cattubeVideoInterval) {
      clearInterval(cattubeVideoInterval);
      cattubeVideoInterval = null;
    }
    if (typeof meowtifyAudioInterval !== 'undefined' && meowtifyAudioInterval) {
      clearInterval(meowtifyAudioInterval);
      meowtifyAudioInterval = null;
      meowtifyActiveTrack = null;
    }
    if (typeof securityCamTickInterval !== 'undefined' && securityCamTickInterval) {
      clearInterval(securityCamTickInterval);
      securityCamTickInterval = null;
    }
    stopPhoneRingingSound();
  } else {
    switchPhoneView('home');
  }
}

document.getElementById('phone-app-home-btn').addEventListener('click', handlePhoneHomeAction);
document.getElementById('phone-virtual-nav-bar').addEventListener('click', handlePhoneHomeAction);

// --- MESSAGES CHAT APP LOGIC ---
const chatContactSelect = document.getElementById('phone-chat-contact-select');
const chatDisplay = document.getElementById('phone-chat-display');
const chatInput = document.getElementById('phone-chat-input');
const chatSendBtn = document.getElementById('phone-chat-send-btn');

chatContactSelect.addEventListener('change', () => {
  audio.playPhoneTone(440, 480, 0.05);
  renderPhoneChatHistory();
});

function renderPhoneChatHistory() {
  const contact = chatContactSelect.value;
  const history = phoneChatHistories[contact] || [];
  chatDisplay.innerHTML = '';

  history.forEach(msg => {
    const bubble = document.createElement('div');
    bubble.style.maxWidth = '75%';
    bubble.style.padding = '6px 10px';
    bubble.style.borderRadius = '12px';
    bubble.style.margin = '4px 0';
    bubble.style.wordWrap = 'break-word';
    
    if (msg.sender === 'me') {
      bubble.style.alignSelf = 'flex-end';
      bubble.style.background = '#2196f3';
      bubble.style.color = 'white';
      bubble.style.borderRadius = '12px 12px 0 12px';
    } else {
      bubble.style.alignSelf = 'flex-start';
      bubble.style.background = '#e0e0e0';
      bubble.style.color = '#212121';
      bubble.style.borderRadius = '12px 12px 12px 0';
    }
    bubble.textContent = msg.text;
    chatDisplay.appendChild(bubble);
  });
  
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function sendPhoneChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const contact = chatContactSelect.value;
  if (!phoneChatHistories[contact]) phoneChatHistories[contact] = [];
  
  phoneChatHistories[contact].push({ sender: 'me', text: text });
  chatInput.value = '';
  renderPhoneChatHistory();
  
  audio.playPhoneTone(697, 1209, 0.08);

  const typingBubble = document.createElement('div');
  typingBubble.style.alignSelf = 'flex-start';
  typingBubble.style.background = '#e0e0e0';
  typingBubble.style.color = '#757575';
  typingBubble.style.padding = '6px 10px';
  typingBubble.style.borderRadius = '12px 12px 12px 0';
  typingBubble.textContent = 'Typing...';
  chatDisplay.appendChild(typingBubble);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;

  setTimeout(() => {
    typingBubble.remove();
    let reply = '';
    const norm = text.toLowerCase();
    
    if (contact === 'vet') {
      if (norm.includes('dirty') || norm.includes('clean') || norm.includes('bath') || norm.includes('wash')) {
        reply = 'Dr. Whisker: "Keep your cats clean! Give them a warm soapy bath in the Bath Area to restore 100% cleanliness."';
      } else if (norm.includes('allergy') || norm.includes('dander') || norm.includes('sneeze') || norm.includes('dust')) {
        reply = 'Dr. Whisker: "To prevent allergies, close the Study Room door (cats out) and use the Vacuum Room button to clear dander!"';
      } else if (norm.includes('tired') || norm.includes('sleep') || norm.includes('energy')) {
        reply = 'Dr. Whisker: "Make sure cats rest in The Back Room when their energy gets low. Sleeping on cushions restores energy!"';
      } else if (norm.includes('study') || norm.includes('class') || norm.includes('school') || norm.includes('degree')) {
        reply = 'Dr. Whisker: "Enrolling your cats in courses at the School Academy grants permanent degree buffs and speeds up their actions!"';
      } else {
        reply = 'Dr. Whisker: "Be sure to feed and play with your kittens. Regular grooming also keeps shedding dander low!"';
      }
    } else {
      const cat = (state.data && state.data.activeCats) ? state.data.activeCats.find(c => c.id === contact) : null;
      if (cat) {
        const SUPPORTIVE_CAT_REPLIES = [
          "Mew! I love you so much, hooman! You are doing an amazing job taking care of us! ❤️",
          "Purr... I feel so safe and happy when you are around. Thank you for being the best owner ever!",
          "Don't stress, hooman! You are doing great. Take a deep breath and give me a pet later! 🥰",
          "Meow! I was just thinking about how lucky I am to have you as my companion. Keep going! 🌟",
          "Purrr... *headbutts your hand* You've got this today! I believe in you!",
          "Mew! Just checking in to make sure you are drinking water and taking care of yourself too! 🐾",
          "Meow! Your kindness makes my heart warm. Thank you for the delicious food and playtime! 🐟",
          "Purr... *curls up next to you virtually* Whenever you feel tired, I am right here to support you! 💤",
          "Mew! Remember that you are wonderful and doing your best. I am proud to be your kitten! 🎀",
          "Meow! Sending you a big virtual headbutt and lots of purrs! You're making this house a true home! 🏡",
          "Purrr... Did you know you're my favorite human in the whole wide world? Mew! 💖",
          "Meow! You bring so much joy to my life. I hope I bring you joy too! 🎈"
        ];
        
        let comment = '';
        if (norm.includes('love')) {
          comment = "Mew! I love you more than tuna treats! *purrs loudly* ❤️";
        } else if (norm.includes('tired') || norm.includes('sad') || norm.includes('exhausted') || norm.includes('sick')) {
          comment = "Oh no, hooman! *nudges you* Rest up! You are working so hard and doing a wonderful job. I'll watch the play space! 💤";
        } else if (norm.includes('feed') || norm.includes('fish') || norm.includes('food')) {
          comment = "Meow! Feed me delicious fishies anytime, but most of all I just love spending time with you! 🐟";
        } else {
          comment = SUPPORTIVE_CAT_REPLIES[Math.floor(Math.random() * SUPPORTIVE_CAT_REPLIES.length)];
        }
        reply = `${cat.name}: "${comment}"`;
      } else {
        reply = `System: "This cat has graduated or left the house."`;
      }
    }
    
    phoneChatHistories[contact].push({ sender: 'them', text: reply });
    renderPhoneChatHistory();
    audio.playPhoneTone(770, 1477, 0.08);
  }, 1000);
}

chatSendBtn.addEventListener('click', sendPhoneChatMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendPhoneChatMessage();
});

// --- MEOW-ZON ORDERING SHOP APP ---
document.querySelectorAll('.meowzon-buy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cost = parseInt(btn.dataset.cost);
    const item = btn.dataset.item;
    
    if (state.data.coins < cost) {
      audio.playPhoneTone(400, 440, 0.25);
      showToast("Not enough Cat Coins! Play Catch the Mouse to earn more.");
      return;
    }
    
    const cat = state.data.activeCats[focusCatIndex];
    if (!cat) {
      showToast("No active cat selected to receive this item!");
      return;
    }
    
    state.data.coins -= cost;
    state.saveProfiles();
    
    document.getElementById('phone-meowzon-coins').textContent = state.data.coins;
    updateHeaderStats();
    
    audio.playPurr();
    audio.playPhoneTone(941, 1477, 0.15);
    
    if (item === 'food') {
      cat.hunger = Math.min(100, cat.hunger + 40);
      showToast(`Ordered Premium Salmon Delivery! ${cat.name}'s Hunger restored +40.`);
    } else if (item === 'water') {
      cat.thirst = Math.min(100, cat.thirst + 40);
      showToast(`Ordered Sparkling Spring Water! ${cat.name}'s Thirst restored +40.`);
    } else if (item === 'toy') {
      cat.affection = Math.min(100, cat.affection + 30);
      showToast(`Ordered Catnip Play Ball! ${cat.name}'s Affection restored +30.`);
    } else if (item === 'shampoo') {
      cat.cleanliness = Math.min(100, cat.cleanliness + 40);
      showToast(`Ordered Luxury Dry-shampoo! ${cat.name}'s Cleanliness restored +40.`);
    }
    
    renderFocusCatDetails();
    renderRoomScene();
  });
});

// --- CATHROME WEB BROWSER APP ---
const browserContent = document.getElementById('phone-browser-content');
const browserUrlField = document.getElementById('phone-browser-url-input');

function loadBrowserUrl(url) {
  browserUrlField.value = url;
  browserContent.innerHTML = '';
  
  if (url === 'www.meowgle.com') {
    browserContent.innerHTML = `
      <div style="text-align: center; margin-top: 15px;">
        <h2 style="font-family: var(--display-font); color: #4285f4; font-size: 1.6rem; margin-bottom: 12px; font-weight:800;">
          <span style="color:#4285f4;">M</span><span style="color:#ea4335;">e</span><span style="color:#fbbc05;">o</span><span style="color:#4285f4;">w</span><span style="color:#34a853;">g</span><span style="color:#ea4335;">l</span><span style="color:#4285f4;">e</span>
        </h2>
        <div style="display:flex; border:1px solid #dadce0; border-radius:18px; padding: 4px 10px; margin-bottom: 12px; background:white; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <input type="text" id="meowgle-search-input" placeholder="Search the cat internet..." style="flex:1; border:none; outline:none; font-size:0.65rem;">
          <button id="meowgle-search-go" style="background:none; border:none; cursor:pointer; font-size:0.75rem;">🔍</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; text-align:left; padding: 5px;">
          <strong style="font-size:0.6rem; color:#70757a; text-transform:uppercase;">Trending Websites:</strong>
          <a href="#" class="browser-link" data-url="www.meowpedia.org/cardboard" style="color:#1a0dab; text-decoration:none; font-weight:bold;">📦 Meowpedia: Box Physics</a>
          <a href="#" class="browser-link" data-url="www.cattube.com/birds" style="color:#1a0dab; text-decoration:none; font-weight:bold;">📺 Cat-Tube: Live Birds</a>
          <a href="#" class="browser-link" data-url="www.clawnews.net/rodents" style="color:#1a0dab; text-decoration:none; font-weight:bold;">📰 Claw-News: Garden Mouse Alert</a>
          <a href="#" class="browser-link" data-url="www.scratchwiki.org/doors" style="color:#1a0dab; text-decoration:none; font-weight:bold;">🚪 Scratch-Wiki: Door Opening</a>
        </div>
      </div>
    `;
    
    document.getElementById('meowgle-search-go').onclick = () => {
      const q = document.getElementById('meowgle-search-input').value.trim();
      if (q) performMeowgleSearch(q);
    };
    document.getElementById('meowgle-search-input').onkeydown = (e) => {
      if (e.key === 'Enter') {
        const q = document.getElementById('meowgle-search-input').value.trim();
        if (q) performMeowgleSearch(q);
      }
    };
  } else if (url === 'www.meowpedia.org/cardboard') {
    browserContent.innerHTML = `
      <div style="text-align:left;">
        <h3 style="color:#000; border-bottom:1px solid #a2a9b1; padding-bottom:3px; margin:0 0 6px 0; font-family:serif;">Cardboard Boxes</h3>
        <p style="margin: 0 0 8px 0;"><strong>Cardboard boxes</strong> are mathematically proven to be the coziest structures in the universe. If a box exists, any nearby cat will attempt to occupy it ("If I fits, I sits").</p>
        <p style="margin: 0 0 8px 0; background:#f8f9fa; border-left:3px solid #36c; padding:4px;"><em>"Cozy index of a cardboard box is roughly 100x higher than a deluxe cat bed." - Cat Science Quarterly</em></p>
        <a href="#" class="browser-link" data-url="www.meowgle.com" style="color:#36c; text-decoration:none; font-weight:bold;">← Back to Meowgle</a>
      </div>
    `;
  } else if (url === 'www.cattube.com/birds') {
    browserContent.innerHTML = `
      <div style="text-align:center;">
        <h3 style="color:#ff0000; font-family:var(--display-font); margin:0 0 5px 0;">📺 Cat-Tube</h3>
        <div style="background:#000; border-radius:8px; padding:15px; color:#4caf50; font-family:monospace; font-size:0.8rem; height:80px; display:flex; flex-direction:column; justify-content:center; align-items:center; margin-bottom:8px;">
          <div>[o>  🐦  <o]</div>
          <div style="font-size:0.5rem; color:#fff; margin-top:5px;">LIVE: 24/7 Garden Bird Feed Stream</div>
        </div>
        <p style="text-align:left; font-size:0.55rem; color:#606060; margin:0 0 8px 0;">1.2M cats watching. Chat: "meow meow", "chirp chirp", "chattering jaws".</p>
        <a href="#" class="browser-link" data-url="www.meowgle.com" style="color:#065fd4; text-decoration:none; font-weight:bold;">← Back to Meowgle</a>
      </div>
    `;
  } else if (url === 'www.clawnews.net/rodents') {
    browserContent.innerHTML = `
      <div style="text-align:left;">
        <h3 style="color:#b30000; text-transform:uppercase; border-bottom:2px solid #b30000; margin:0 0 6px 0; font-weight:800;">📰 Claw-News Alert</h3>
        <strong style="font-size:0.7rem; display:block; margin-bottom:4px;">GARDEN MOUSE SIGHTED NEAR PATIO</strong>
        <p style="margin: 0 0 6px 0;">A brown garden mouse has been reported moving at extreme speeds near the pet store coordinates. Residents are advised to warm up their paws and load the mouse catcher mini-game.</p>
        <p style="margin: 0 0 8px 0; color:#555;">"I chased it but it vanished behind the water bowl," says local adult cat Leo.</p>
        <a href="#" class="browser-link" data-url="www.meowgle.com" style="color:#b30000; text-decoration:none; font-weight:bold;">← Back to Meowgle</a>
      </div>
    `;
  } else if (url === 'www.scratchwiki.org/doors') {
    browserContent.innerHTML = `
      <div style="text-align:left;">
        <h3 style="color:#333; border-bottom:1px solid #ccc; margin:0 0 6px 0;">🚪 Scratch-Wiki: Doors</h3>
        <p style="margin:0 0 6px 0;">Opening closed doors is the ultimate challenge. If a human closes a door, here is how to open it:</p>
        <ol style="margin:0 0 8px 12px; padding:0;">
          <li>Scratch the frame persistently.</li>
          <li>Meow loudly in a high-pitch tone, preferably at 3:00 AM.</li>
          <li>Once the human opens the door, stand in the threshold and refuse to go inside for at least 1 minute.</li>
        </ol>
        <a href="#" class="browser-link" data-url="www.meowgle.com" style="color:#0066cc; text-decoration:none; font-weight:bold;">← Back to Meowgle</a>
      </div>
    `;
  } else {
    browserContent.innerHTML = `
      <div style="text-align:left;">
        <h3 style="margin-top:0;">Search Results</h3>
        <p>No matches found for <strong>"${url}"</strong>. Meowgle suggests searching for: 'box', 'bird', 'mouse', or 'doors'.</p>
        <a href="#" class="browser-link" data-url="www.meowgle.com" style="color:#1a0dab; text-decoration:none; font-weight:bold;">← Back to Meowgle</a>
      </div>
    `;
  }
  
  browserContent.querySelectorAll('.browser-link').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      audio.playPhoneTone(440, 480, 0.05);
      loadBrowserUrl(link.dataset.url);
    };
  });
}

function performMeowgleSearch(query) {
  const norm = query.toLowerCase();
  let targetUrl = 'search_results';
  if (norm.includes('box') || norm.includes('cardboard') || norm.includes('physics')) {
    targetUrl = 'www.meowpedia.org/cardboard';
  } else if (norm.includes('bird') || norm.includes('video') || norm.includes('tube')) {
    targetUrl = 'www.cattube.com/birds';
  } else if (norm.includes('mouse') || norm.includes('rodent') || norm.includes('news')) {
    targetUrl = 'www.clawnews.net/rodents';
  } else if (norm.includes('door') || norm.includes('open') || norm.includes('wiki')) {
    targetUrl = 'www.scratchwiki.org/doors';
  }
  loadBrowserUrl(targetUrl);
}
// --- CAMERA & GALLERY & SETTINGS APP IMPLEMENTATION ---

function updateCameraViewfinder() {
  const container = document.getElementById('phone-cam-preview-box');
  if (!container) return;
  container.innerHTML = '';
  
  const playSpace = document.getElementById('play-space-container');
  if (!playSpace) return;
  
  const clone = playSpace.cloneNode(true);
  
  // Clean up unwanted absolute elements/overlays
  const allergy = clone.querySelector('#allergy-meter-card');
  if (allergy) allergy.remove();
  const farmSign = clone.querySelector('#backroom-farm-sign');
  if (farmSign) farmSign.remove();
  
  // Style scaled container wrapper
  clone.style.position = 'absolute';
  clone.style.width = '580px';
  clone.style.height = '340px';
  clone.style.transform = 'scale(0.42)';
  clone.style.transformOrigin = 'center center';
  clone.style.pointerEvents = 'none';
  clone.style.borderRadius = '8px';
  clone.style.overflow = 'hidden';
  clone.style.boxShadow = 'none';
  
  container.appendChild(clone);
}

// Camera Shutter click handler
document.getElementById('phone-cam-shutter').addEventListener('click', () => {
  const flash = document.getElementById('phone-cam-flash');
  if (flash) {
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 150);
  }

  audio.playCameraClick();

  if (!state.data.photos) state.data.photos = [];
  let roomFriendly = currentRoom.replace('-', ' ').toUpperCase();
  if (currentRoom === 'back-room') {
    roomFriendly = 'COZY RETIREMENT CUSHION ZONE';
  } else if (currentRoom === 'phone-room') {
    roomFriendly = 'BEDROOM';
  }
  const catList = (currentRoom === 'back-room') ? state.data.retiredCats.map(c => c.name) : (state.data.doorOpen || currentRoom !== 'phone-room' ? state.data.activeCats.map(c => c.name) : []);
  
  const previewBox = document.getElementById('phone-cam-preview-box');
  const previewHtml = previewBox ? previewBox.innerHTML : '';

  const photo = {
    id: 'photo_' + Date.now(),
    date: `Yr ${state.data.calendarYear}, Day ${state.data.calendarDay} of ${CALENDAR_MONTHS[state.data.calendarMonth]}`,
    room: roomFriendly,
    cats: catList.length > 0 ? catList.join(' & ') : 'Empty room',
    previewHtml: previewHtml,
    description: `A lovely memory snapped in the ${roomFriendly.toLowerCase()}!`
  };
  
  state.data.photos.push(photo);
  state.saveProfiles();
  
  showToast("Snapshot saved to Gallery! 📸🖼️");
});

// Render Gallery function
function renderPhoneGallery() {
  const container = document.getElementById('phone-gallery-list');
  if (!container) return;
  container.innerHTML = '';

  const photos = state.data.photos || [];
  if (photos.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 2; text-align: center; color: #757575; font-size: 0.65rem; padding: 25px 10px;">
        📸 No photos taken yet.<br>Open the Camera app to snap a memory!
      </div>
    `;
    return;
  }

  photos.forEach(photo => {
    const card = document.createElement('div');
    card.style.background = '#fff';
    card.style.border = '1px solid #cfd8dc';
    card.style.borderRadius = '8px';
    card.style.padding = '5px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '3px';
    card.style.fontSize = '0.55rem';
    card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
    card.style.position = 'relative';

    const polaroid = document.createElement('div');
    polaroid.style.height = '60px';
    polaroid.style.background = '#e0f2f1';
    polaroid.style.borderRadius = '6px';
    polaroid.style.display = 'flex';
    polaroid.style.alignItems = 'center';
    polaroid.style.justifyContent = 'center';
    polaroid.style.overflow = 'hidden';
    polaroid.style.position = 'relative';

    if (photo.previewHtml) {
      const thumbWrapper = document.createElement('div');
      thumbWrapper.style.cssText = "position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; pointer-events: none;";
      thumbWrapper.innerHTML = photo.previewHtml;
      const innerChild = thumbWrapper.firstElementChild;
      if (innerChild) {
        innerChild.style.transform = "scale(0.19)";
        innerChild.style.transformOrigin = "center center";
      }
      polaroid.appendChild(thumbWrapper);
    } else {
      polaroid.style.fontSize = '1.3rem';
      let emoji = '🏠';
      if (photo.room.includes('BATH')) emoji = '🛁';
      else if (photo.room.includes('SCHOOL')) emoji = '🏫';
      else if (photo.room.includes('STUDY')) emoji = '🚪';
      else if (photo.room.includes('BACK')) emoji = '🛋️';
      polaroid.textContent = emoji;
    }
    
    card.appendChild(polaroid);

    const desc = document.createElement('div');
    desc.style.fontWeight = 'bold';
    desc.style.color = '#37474f';
    desc.style.whiteSpace = 'nowrap';
    desc.style.overflow = 'hidden';
    desc.style.textOverflow = 'ellipsis';
    desc.textContent = photo.cats;
    card.appendChild(desc);

    const dateStr = document.createElement('div');
    dateStr.style.color = '#78909c';
    dateStr.style.fontSize = '0.5rem';
    dateStr.textContent = photo.date;
    card.appendChild(dateStr);

    const del = document.createElement('button');
    del.style.position = 'absolute';
    del.style.top = '3px';
    del.style.right = '3px';
    del.style.background = 'rgba(229,57,53,0.85)';
    del.style.color = 'white';
    del.style.border = 'none';
    del.style.borderRadius = '50%';
    del.style.width = '14px';
    del.style.height = '14px';
    del.style.fontSize = '0.5rem';
    del.style.cursor = 'pointer';
    del.style.display = 'flex';
    del.style.alignItems = 'center';
    del.style.justifyContent = 'center';
    del.textContent = '×';
    
    del.onclick = (e) => {
      e.stopPropagation();
      audio.playPhoneTone(400, 440, 0.1);
      state.data.photos = state.data.photos.filter(p => p.id !== photo.id);
      state.saveProfiles();
      renderPhoneGallery();
      showToast("Photo deleted!");
    };
    
    card.appendChild(del);
    
    card.onclick = () => {
      audio.playPhoneTone(440, 480, 0.05);
      
      const lightbox = document.getElementById('photo-lightbox-modal');
      const renderBox = document.getElementById('lightbox-photo-render');
      const catsEl = document.getElementById('lightbox-photo-cats');
      const roomEl = document.getElementById('lightbox-photo-room');
      const dateEl = document.getElementById('lightbox-photo-date');
      const descEl = document.getElementById('lightbox-photo-desc');

      if (lightbox && renderBox && catsEl && roomEl && dateEl && descEl) {
        catsEl.textContent = photo.cats;
        roomEl.textContent = `📍 ${photo.room}`;
        dateEl.textContent = photo.date;
        descEl.textContent = `"${photo.description}"`;
        
        if (photo.previewHtml) {
          renderBox.innerHTML = photo.previewHtml;
          const child = renderBox.firstElementChild;
          if (child) {
            child.style.transform = 'scale(0.68)';
            child.style.transformOrigin = 'center center';
          }
        } else {
          renderBox.innerHTML = `
            <div style="font-size: 3rem;">🏠</div>
            <div style="font-size: 0.65rem; color: #757575; margin-top: 8px;">No image capture available</div>
          `;
        }
        
        lightbox.classList.add('active');
      }
    };

    container.appendChild(card);
  });
}

// Wallpaper Settings buttons binder
document.querySelectorAll('.wallpaper-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const wall = btn.dataset.wallpaper;
    state.data.phoneWallpaper = wall;
    state.saveProfiles();
    
    const homeView = document.getElementById('phone-view-home');
    if (homeView) {
      if (wall === 'blue') {
        homeView.style.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
      } else if (wall === 'pink') {
        homeView.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
      } else if (wall === 'green') {
        homeView.style.background = 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)';
      } else if (wall === 'dark') {
        homeView.style.background = 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)';
      }
    }
    
    audio.playPhoneTone(852, 1477, 0.15);
    showToast(`Wallpaper updated to ${wall.toUpperCase()}! 🌅`);
  });
});

// Ringtone Settings buttons binder
document.querySelectorAll('.ringtone-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const ring = btn.dataset.ringtone;
    state.data.phoneRingtone = ring;
    state.saveProfiles();
    
    audio.playPhoneRing();
    showToast(`Ringtone updated to ${ring.toUpperCase()}! 🔔`);
  });
});

// --- CAT-BANK APP LOGIC ---

function updatePhoneBankUI() {
  const walletVal = document.getElementById('phone-bank-wallet-coins');
  const savingsVal = document.getElementById('phone-bank-savings-coins');
  if (walletVal) walletVal.textContent = state.data.coins;
  if (savingsVal) savingsVal.textContent = state.data.bankSavings || 0;
}

document.getElementById('phone-bank-deposit-10').addEventListener('click', () => {
  if (state.data.coins < 10) {
    audio.playPhoneTone(400, 440, 0.2);
    showToast("Not enough Cat Coins in your wallet to deposit!");
    return;
  }
  
  state.data.coins -= 10;
  state.data.bankSavings = (state.data.bankSavings || 0) + 10;
  state.saveProfiles();
  
  audio.playPhoneTone(941, 1477, 0.1);
  updatePhoneBankUI();
  updateHeaderStats();
  showToast("Deposited 10 Cat Coins into savings! 💰");
});

document.getElementById('phone-bank-deposit-all').addEventListener('click', () => {
  const amount = state.data.coins;
  if (amount <= 0) {
    audio.playPhoneTone(400, 440, 0.2);
    showToast("No Cat Coins in your wallet to deposit!");
    return;
  }
  
  state.data.coins = 0;
  state.data.bankSavings = (state.data.bankSavings || 0) + amount;
  state.saveProfiles();
  
  audio.playPhoneTone(941, 1477, 0.15);
  updatePhoneBankUI();
  updateHeaderStats();
  showToast(`Deposited all 🪙 ${amount} Cat Coins into savings! 💰`);
});

document.getElementById('phone-bank-withdraw-10').addEventListener('click', () => {
  const savings = state.data.bankSavings || 0;
  if (savings < 10) {
    audio.playPhoneTone(400, 440, 0.2);
    showToast("Not enough savings to withdraw 10 Cat Coins!");
    return;
  }
  
  state.data.bankSavings -= 10;
  state.data.coins += 10;
  state.saveProfiles();
  
  audio.playPhoneTone(770, 1477, 0.1);
  updatePhoneBankUI();
  updateHeaderStats();
  showToast("Withdrew 10 Cat Coins to your wallet! 💸");
});

document.getElementById('phone-bank-withdraw-all').addEventListener('click', () => {
  const savings = state.data.bankSavings || 0;
  if (savings <= 0) {
    audio.playPhoneTone(400, 440, 0.2);
    showToast("No savings balance to withdraw!");
    return;
  }
  
  state.data.bankSavings = 0;
  state.data.coins += savings;
  state.saveProfiles();
  
  audio.playPhoneTone(770, 1477, 0.15);
  updatePhoneBankUI();
  updateHeaderStats();
  showToast(`Withdrew all 🪙 ${savings} Cat Coins to your wallet! 💸`);
});

// --- CAT-MAPS APP LOGIC ---

const MAPS_LOCATIONS = {
  home: {
    name: '🏠 Sweet Home Playroom',
    desc: 'Your active kittens playroom. Cozy temperature, soft sleeping cushions, full food and water bowls.',
    traffic: 'Very Light (Cat-traffic only)'
  },
  bath: {
    name: '🛁 Bath & Spa Center',
    desc: 'Bubble bath grooming area. Clean water, fragrant soaps, and active bubble spawners are ready.',
    traffic: 'Light'
  },
  school: {
    name: '🏫 Cat School Academy',
    desc: 'Classrooms for higher learning. Enroll your cats to PhD degrees in Nap-ology, Cat-culus, or Meow-sic.',
    traffic: 'Moderate (School hours)'
  },
  garden: {
    name: '🌿 Catnip Garden & Patio',
    desc: 'Local garden filled with butterflies. Squeaky mouse sighted near patio coordinates 20 mins ago.',
    traffic: 'None'
  },
  market: {
    name: '🐟 Central Fish Market & Store',
    desc: 'Market to spend Cat Coins on Glacier Water, soft slicker brushes, automatic robotic vacuum clean devices.',
    traffic: 'Busy (Salmon price stable)'
  },
  farm: {
    name: "🏡 Grandparents' Country Farm",
    desc: "A wide grass field and cozy red farmhouse. Your ancestors, grandparents, and old generations rest here happily, baking cookies.",
    traffic: "Isolated Country Roads (Open Skies)"
  }
};

let currentMapsSelectedLoc = null;

function initPhoneMapsUI() {
  currentMapsSelectedLoc = null;
  const nameEl = document.getElementById('phone-maps-name');
  const descEl = document.getElementById('phone-maps-desc');
  const driveBtn = document.getElementById('phone-maps-drive-btn');
  
  if (nameEl) nameEl.textContent = "🗺️ Select a landmark";
  if (descEl) descEl.textContent = "Tap a point of interest on the map to find route info, coordinates, traffic reports, and take a joyride!";
  if (driveBtn) driveBtn.style.display = 'none';

  document.querySelectorAll('.map-node').forEach(node => {
    if (!node.dataset.listenerActive) {
      node.dataset.listenerActive = "true";
      node.addEventListener('click', () => {
        const locId = node.dataset.loc;
        const loc = MAPS_LOCATIONS[locId];
        if (!loc) return;

        currentMapsSelectedLoc = locId;
        audio.playPhoneTone(440, 480, 0.05);

        if (nameEl) nameEl.textContent = loc.name;
        if (descEl) descEl.innerHTML = `${loc.desc}<br><br><strong style="color:#00acc1;">TRAFFIC:</strong> ${loc.traffic}`;
        
        if (driveBtn) {
          if (locId === 'home') {
            driveBtn.style.display = 'none';
          } else {
            driveBtn.style.display = 'block';
            driveBtn.textContent = `🚗 Joyride to ${locId.toUpperCase()} (+15 Coins Bonus!)`;
          }
        }
      });
    }
  });
}

const driveJoyrideBtn = document.getElementById('phone-maps-drive-btn');
if (driveJoyrideBtn) {
  driveJoyrideBtn.addEventListener('click', () => {
    if (!currentMapsSelectedLoc) return;
    
    audio.playPhoneTone(697, 1477, 0.2);
    setTimeout(() => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      const locInfo = MAPS_LOCATIONS[currentMapsSelectedLoc];
      startDrivingTransition(locInfo ? locInfo.name : currentMapsSelectedLoc.toUpperCase());
    }, 300);
  });
}

// Bind Browser URL Bar navigation
const searchGoBtn = document.getElementById('phone-browser-search-btn');
const searchInputBar = document.getElementById('phone-browser-url-input');

function navigateBrowser(val) {
  let target = val.trim().toLowerCase();
  if (!target) return;
  if (!target.startsWith('www.')) {
    if (target.includes('meowgle')) target = 'www.meowgle.com';
    else if (target.includes('cattube')) target = 'www.cattube.com/birds';
    else if (target.includes('meowpedia')) target = 'www.meowpedia.org/cardboard';
    else if (target.includes('clawnews') || target.includes('claw-news')) target = 'www.clawnews.net/rodents';
    else if (target.includes('scratchwiki') || target.includes('wiki')) target = 'www.scratchwiki.org/doors';
    else target = 'www.' + target;
  }
  audio.playPhoneTone(440, 480, 0.05);
  loadBrowserUrl(target);
}

if (searchGoBtn && searchInputBar) {
  searchGoBtn.addEventListener('click', () => {
    navigateBrowser(searchInputBar.value);
  });
  searchInputBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigateBrowser(searchInputBar.value);
    }
  });
}

function adjustRoomFurnitureVisibility(roomName) {
  const container = document.getElementById('room-interactive-items');
  const danderHaze = document.getElementById('dander-haze');
  const allergyMeter = document.getElementById('allergy-meter-card');
  
  if (!container) return;

  if (roomName === 'school') {
    container.style.display = 'none';
    if (danderHaze) danderHaze.style.display = 'none';
    if (allergyMeter) allergyMeter.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  // Toggle specific furniture elements
  const door = document.getElementById('interactive-door');
  const clock = document.getElementById('bedroom-furniture-clock');
  const tv = document.getElementById('bedroom-furniture-tv');
  const lights = document.getElementById('bedroom-furniture-lights');
  const shelf = document.getElementById('bedroom-furniture-shelf');
  const window = document.getElementById('bedroom-furniture-window');
  const rug = document.getElementById('bedroom-furniture-rug');
  const bed = document.getElementById('bedroom-furniture-bed');
  const nightstand = document.getElementById('bedroom-nightstand');
  const lamp = document.getElementById('bedroom-furniture-lamp');
  const phone = document.getElementById('interactive-phone');

  // Helper to show/hide element safely
  const setVisible = (el, yes) => {
    if (el) el.style.display = yes ? 'block' : 'none';
  };

  if (roomName === 'phone-room') {
    setVisible(door, true);
    setVisible(clock, true);
    setVisible(tv, true);
    setVisible(lights, true);
    setVisible(shelf, true);
    setVisible(window, true);
    setVisible(rug, true);
    setVisible(bed, true);
    setVisible(nightstand, true);
    setVisible(lamp, true);
    setVisible(phone, true);
    if (danderHaze) danderHaze.style.display = 'block';
    if (allergyMeter) allergyMeter.style.display = 'flex';
  } else if (roomName === 'living-room') {
    setVisible(door, false);
    setVisible(clock, true);
    setVisible(tv, true);
    setVisible(lights, true);
    setVisible(shelf, true);
    setVisible(window, true);
    setVisible(rug, true);
    setVisible(bed, false);
    setVisible(nightstand, false);
    setVisible(lamp, true);
    setVisible(phone, false);
    if (danderHaze) danderHaze.style.display = 'none';
    if (allergyMeter) allergyMeter.style.display = 'none';
  } else if (roomName === 'back-room') {
    setVisible(door, false);
    setVisible(clock, false);
    setVisible(tv, false);
    setVisible(lights, true);
    setVisible(shelf, true);
    setVisible(window, true);
    setVisible(rug, true);
    setVisible(bed, false);
    setVisible(nightstand, false);
    setVisible(lamp, true);
    setVisible(phone, false);
    if (danderHaze) danderHaze.style.display = 'none';
    if (allergyMeter) allergyMeter.style.display = 'none';
  } else if (roomName === 'bath-area') {
    setVisible(door, false);
    setVisible(clock, false);
    setVisible(tv, false);
    setVisible(lights, true);
    setVisible(shelf, false);
    setVisible(window, true);
    setVisible(rug, true); // bath mat!
    setVisible(bed, false);
    setVisible(nightstand, false);
    setVisible(lamp, false);
    setVisible(phone, false);
    if (danderHaze) danderHaze.style.display = 'none';
    if (allergyMeter) allergyMeter.style.display = 'none';
  }
}

// --- BEDROOM CUSTOM FURNITURE DECORATION SYSTEM ---
function updateBedroomFurnitureUI() {
  if (!state.data) return;
  
  if (!state.data.roomFurniture) {
    state.data.roomFurniture = {
      'phone-room': state.data.furniture || { bed: 'royal', rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
      'living-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
      'back-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
      'bath-area': { rug: 'cozy', lights: 'warm', wallpaper: 'plain', window: 'sunny' }
    };
  }

  const roomKey = (['phone-room', 'living-room', 'back-room', 'bath-area'].includes(currentRoom)) ? currentRoom : 'phone-room';
  const f = state.data.roomFurniture[roomKey];
  if (!f) return;

  // 1. Update Bed sheets, pillow, headboard fills
  const bedSheets = document.getElementById('bed-sheets');
  const bedPillow = document.getElementById('bed-pillow');
  const bedHead = document.getElementById('bed-headboard');
  const bedFoot = document.getElementById('bed-footboard');
  
  if (bedSheets && bedPillow) {
    if (f.bed === 'royal') {
      bedSheets.setAttribute('fill', '#1565c0');
      bedPillow.setAttribute('fill', '#90caf9');
      if (bedHead) bedHead.setAttribute('fill', '#8d6e63');
      if (bedFoot) bedFoot.setAttribute('fill', '#8d6e63');
    } else if (f.bed === 'sakura') {
      bedSheets.setAttribute('fill', '#f48fb1');
      bedPillow.setAttribute('fill', '#fce4ec');
      if (bedHead) bedHead.setAttribute('fill', '#f06292');
      if (bedFoot) bedFoot.setAttribute('fill', '#f06292');
    } else if (f.bed === 'galaxy') {
      bedSheets.setAttribute('fill', '#1a237e');
      bedPillow.setAttribute('fill', '#b3e5fc');
      if (bedHead) bedHead.setAttribute('fill', '#263238');
      if (bedFoot) bedFoot.setAttribute('fill', '#263238');
    } else if (f.bed === 'mint') {
      bedSheets.setAttribute('fill', '#80cbc4');
      bedPillow.setAttribute('fill', '#ffffff');
      if (bedHead) bedHead.setAttribute('fill', '#a1887f');
      if (bedFoot) bedFoot.setAttribute('fill', '#a1887f');
    }
  }

  // 2. Update Rug Shape
  const rugShape = document.getElementById('rug-shape');
  const rugStar = document.getElementById('rug-star-path');
  const rugPaw = document.getElementById('rug-paw-group');

  if (rugShape && rugStar && rugPaw) {
    rugShape.style.display = 'block';
    rugStar.style.display = 'none';
    rugPaw.style.display = 'none';

    if (f.rug === 'cozy') {
      rugShape.setAttribute('fill', '#efebe9');
      rugShape.setAttribute('stroke', '#d7ccc8');
    } else if (f.rug === 'star') {
      rugShape.style.display = 'none';
      rugStar.style.display = 'block';
    } else if (f.rug === 'paw') {
      rugShape.style.display = 'none';
      rugPaw.style.display = 'block';
    } else if (f.rug === 'stripe') {
      rugShape.setAttribute('fill', '#ffe082');
      rugShape.setAttribute('stroke', '#ff7043');
    }
  }

  // 3. Update Lamp Shade, Ears, and Glow Light beam
  const lampShade = document.getElementById('lamp-shade');
  const lampEarL = document.getElementById('lamp-ear-l');
  const lampEarR = document.getElementById('lamp-ear-r');
  const lampGlow = document.getElementById('lamp-glow');

  if (lampShade && lampEarL && lampEarR && lampGlow) {
    lampEarL.style.display = 'none';
    lampEarR.style.display = 'none';
    lampGlow.style.display = 'block';

    if (f.lamp === 'cute') {
      lampShade.setAttribute('fill', '#ffcc80');
      lampEarL.style.display = 'block';
      lampEarR.style.display = 'block';
      lampGlow.setAttribute('fill', 'rgba(255,224,130,0.3)');
    } else if (f.lamp === 'lava') {
      lampShade.setAttribute('fill', '#ba68c8');
      lampGlow.setAttribute('fill', 'rgba(186,104,200,0.35)');
    } else if (f.lamp === 'neon') {
      lampShade.setAttribute('fill', '#f06292');
      lampGlow.setAttribute('fill', 'rgba(244,143,177,0.4)');
    } else if (f.lamp === 'classic') {
      lampShade.setAttribute('fill', '#4caf50');
      lampGlow.setAttribute('fill', 'rgba(129,199,132,0.25)');
    }
  }

  // 4. Update Dazzling Lights (String Lights)
  const bulbs = document.querySelectorAll('.decor-light-bulb');
  bulbs.forEach(b => {
    b.className.baseVal = 'decor-light-bulb';
    b.removeAttribute('style');
    if (f.lights === 'warm') {
      b.setAttribute('fill', '#ffb300');
      b.style.filter = 'drop-shadow(0 0 3px #ffd54f)';
    } else if (f.lights === 'blue') {
      b.setAttribute('fill', '#00b0ff');
      b.style.filter = 'drop-shadow(0 0 3px #40c4ff)';
    } else if (f.lights === 'rainbow') {
      b.classList.add('decor-light-rainbow');
    } else {
      b.setAttribute('fill', 'rgba(255,255,255,0.2)');
      b.style.filter = 'none';
    }
  });

  // 5. Update Wall Shelf decoration items
  const shelfSalmon = document.getElementById('shelf-items-salmon');
  const shelfTrophy = document.getElementById('shelf-items-trophy');
  const shelfToy = document.getElementById('shelf-items-toy');
  const shelfPlant = document.getElementById('shelf-items-plant');

  if (shelfSalmon && shelfTrophy && shelfToy && shelfPlant) {
    shelfSalmon.style.display = 'none';
    shelfTrophy.style.display = 'none';
    shelfToy.style.display = 'none';
    shelfPlant.style.display = 'none';

    if (f.shelf === 'salmon') shelfSalmon.style.display = 'block';
    else if (f.shelf === 'trophy') shelfTrophy.style.display = 'block';
    else if (f.shelf === 'toy') shelfToy.style.display = 'block';
    else if (f.shelf === 'plant') shelfPlant.style.display = 'block';
  }

  // 6. Update Wallpaper class of the Bedroom container
  const playContainer = document.getElementById('play-space-container');
  if (playContainer) {
    playContainer.classList.remove('wp-plain', 'wp-stars', 'wp-stripes', 'wp-paws');
    playContainer.classList.add('wp-' + (f.wallpaper || 'plain'));
  }

  // 7. Update Window View
  const windowSky = document.getElementById('window-sky');
  if (windowSky) {
    windowSky.innerHTML = '';
    if (f.window === 'sunny') {
      windowSky.style.background = '#81d4fa';
      windowSky.innerHTML = `
        <circle cx="15" cy="15" r="5" fill="#ffd54f" />
        <path d="M 35,35 Q 40,25 45,35 Q 50,30 52,35 Z" fill="#fff" opacity="0.8" />
      `;
    } else if (f.window === 'starry') {
      windowSky.style.background = 'linear-gradient(180deg, #1a237e 0%, #000000 100%)';
      windowSky.innerHTML = `
        <circle cx="45" cy="15" r="4" fill="#fffde7" />
        <circle cx="15" cy="12" r="0.75" fill="#fff" />
        <circle cx="28" cy="22" r="0.5" fill="#fff" />
        <circle cx="10" cy="30" r="0.6" fill="#fff" />
        <circle cx="35" cy="8" r="0.8" fill="#fff" />
      `;
    } else if (f.window === 'rainy') {
      windowSky.style.background = '#90a4ae';
      windowSky.innerHTML = `
        <rect x="0" y="0" width="60" height="20" fill="#78909c" opacity="0.9" />
        <line x1="10" y1="20" x2="6" y2="45" stroke="#e0f7fa" stroke-width="0.8" opacity="0.6" />
        <line x1="25" y1="22" x2="21" y2="47" stroke="#e0f7fa" stroke-width="0.8" opacity="0.6" />
        <line x1="40" y1="18" x2="36" y2="43" stroke="#e0f7fa" stroke-width="0.8" opacity="0.6" />
        <line x1="55" y1="25" x2="51" y2="50" stroke="#e0f7fa" stroke-width="0.8" opacity="0.6" />
      `;
    } else if (f.window === 'snowy') {
      windowSky.style.background = '#e0f7fa';
      windowSky.innerHTML = `
        <circle cx="12" cy="12" r="1.5" fill="#fff" />
        <circle cx="28" cy="25" r="1.2" fill="#fff" />
        <circle cx="48" cy="10" r="1.8" fill="#fff" />
        <circle cx="38" cy="38" r="1.0" fill="#fff" />
        <circle cx="18" cy="42" r="1.4" fill="#fff" />
      `;
    }
  }
  updateBedroomTVUI();
}

function updateWallClock() {
  const now = new Date();
  const hourHand = document.getElementById('clock-hour-hand');
  const minuteHand = document.getElementById('clock-minute-hand');
  const secondHand = document.getElementById('clock-second-hand');
  
  if (hourHand && minuteHand && secondHand) {
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();
    
    const secDeg = sec * 6;
    const minDeg = min * 6 + sec * 0.1;
    const hrDeg = (hr % 12) * 30 + min * 0.5;
    
    secondHand.style.transform = `rotate(${secDeg}deg)`;
    minuteHand.style.transform = `rotate(${minDeg}deg)`;
    hourHand.style.transform = `rotate(${hrDeg}deg)`;
  }
}

function updateBedroomTVUI() {
  const screen = document.getElementById('tv-screen-content');
  if (!screen) return;
  if (!state.data) return;
  if (state.data.tvChannel === undefined) state.data.tvChannel = 0;
  const ch = state.data.tvChannel;

  screen.innerHTML = '';
  if (ch === 0) {
    screen.style.background = '#1a237e'; // dark blue Meow-OS background
    screen.innerHTML = `
      <div style="font-size:0.5rem; text-align:center; font-weight:bold; color:#80deb5; width:100%; display:flex; flex-direction:column; gap:2px; height:100%; justify-content:center; align-items:center;">
        <span style="font-weight:bold; letter-spacing:0.5px;">🐾 MEOW-OS v2.0</span>
        <div style="font-size:0.42rem; color:#fff; background:rgba(255,255,255,0.15); padding:1px 4px; border-radius:3px; border:0.5px solid rgba(255,255,255,0.25);">
          🪙 WALLET: ${state.data.coins}
        </div>
        <div style="font-size:0.4rem; color:#ffe082; text-shadow:0 1px 1px rgba(0,0,0,0.5);">
          📅 Y${state.data.calendarYear || 1} D${state.data.calendarDay || 1}
        </div>
      </div>
    `;
  } else if (ch === 1) {
    screen.style.background = '#1b5e20'; // green field
    screen.innerHTML = `
      <div style="font-size:0.45rem; text-align:center; color:#fff; width:100%; font-weight:bold; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <span>📺 CAT-TUBE</span>
        <div style="font-size:0.85rem; margin:1px 0; animation: bounce-phone-label 0.8s infinite alternate;">🐦</div>
        <div style="font-size:0.35rem; color:#a5d6a7;">Live Feed</div>
      </div>
    `;
  } else if (ch === 2) {
    screen.style.background = '#b71c1c'; // news red
    screen.innerHTML = `
      <div style="font-size:0.45rem; text-align:center; color:#fff; width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; align-items:center;">
        <span style="font-size:0.45rem; background:#ffe082; color:#b71c1c; padding:1px 3px; border-radius:2px; font-weight:bold; width:90%; margin-top:2px;">📰 CLAW-NEWS</span>
        <marquee scrollamount="2.5" style="font-size:0.42rem; color:#fff; width:100%; margin-bottom:2px;">!!! MOUSE SIGHTED IN GARDEN !!! SAVINGS GAINING 5% INTEREST DIURNALLY !!!</marquee>
      </div>
    `;
  } else if (ch === 3) {
    screen.style.background = '#006064'; // cyber teal
    const activeCat = state.data.activeCats && state.data.activeCats[focusCatIndex];
    const name = activeCat ? activeCat.name.toUpperCase() : 'NO CAT';
    screen.innerHTML = `
      <div style="font-size:0.45rem; text-align:center; color:#80deea; width:100%; font-weight:bold; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <span>📷 CAT-CAM</span>
        <div style="font-size:0.85rem; margin:1px 0;">🐱</div>
        <div style="font-size:0.35rem; color:#e0f7fa; text-shadow:0 1px 2px rgba(0,0,0,0.5);">${name}</div>
      </div>
    `;
  }
}

function updateFurnishAppUI() {
  if (!state.data) return;

  const select = document.getElementById('phone-furnish-room-select');
  const targetRoom = select ? select.value : 'phone-room';
  
  if (!state.data.roomFurniture) {
    state.data.roomFurniture = {
      'phone-room': state.data.furniture || { bed: 'royal', rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
      'living-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
      'back-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
      'bath-area': { rug: 'cozy', lights: 'warm', wallpaper: 'plain', window: 'sunny' }
    };
  }

  const f = state.data.roomFurniture[targetRoom] || {};

  document.querySelectorAll('.furnish-btn').forEach(btn => {
    const type = btn.dataset.type;
    const val = btn.dataset.val;
    const active = (f[type] === val);
    
    btn.style.background = active ? '#e91e63' : '#fff';
    btn.style.color = active ? '#fff' : '#2c3e50';
    btn.style.borderColor = active ? '#ad1457' : '#dadce0';
  });

  // Toggle panel displays depending on room selection
  document.querySelectorAll('.furnish-btn').forEach(btn => {
    const parentCard = btn.closest('div[style*="border: 1.5px solid"]');
    if (!parentCard) return;
    
    const text = parentCard.textContent;
    if (text.includes('Bed Style:')) {
      parentCard.style.display = (targetRoom === 'phone-room') ? 'flex' : 'none';
    } else if (text.includes('Shelf Decoration:')) {
      parentCard.style.display = (targetRoom !== 'bath-area') ? 'flex' : 'none';
    } else if (text.includes('Light / Lamp:')) {
      parentCard.style.display = (targetRoom !== 'bath-area') ? 'flex' : 'none';
    }
  });
}

// Dropdown Change listener to automatically switch room
document.getElementById('phone-furnish-room-select').addEventListener('change', (e) => {
  const selectedRoom = e.target.value;
  switchRoom(selectedRoom);
  updateFurnishAppUI();
});

// Bind Phone Furnish buttons click handler
document.querySelectorAll('.furnish-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    const val = btn.dataset.val;
    
    const select = document.getElementById('phone-furnish-room-select');
    const targetRoom = select ? select.value : 'phone-room';

    if (!state.data.roomFurniture) {
      state.data.roomFurniture = {
        'phone-room': state.data.furniture || { bed: 'royal', rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
        'living-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
        'back-room': { rug: 'cozy', lamp: 'cute', lights: 'warm', shelf: 'salmon', wallpaper: 'plain', window: 'sunny' },
        'bath-area': { rug: 'cozy', lights: 'warm', wallpaper: 'plain', window: 'sunny' }
      };
    }

    state.data.roomFurniture[targetRoom][type] = val;
    if (targetRoom === 'phone-room') {
      state.data.furniture[type] = val;
    }
    state.saveProfiles();

    audio.playPhoneTone(523, 659, 0.1);
    updateFurnishAppUI();
    updateBedroomFurnitureUI();
    
    const roomNameMap = {
      'phone-room': 'Bedroom 🛌',
      'living-room': 'Living Room 🛋️',
      'bath-area': 'Bath Area 🛁',
      'back-room': 'Back Room 🧸'
    };
    showToast(`${roomNameMap[targetRoom]} decoration updated: ${type} set to ${val}! ✨`);
  });
});

// Helper to open decorator
function openBedroomDecorator() {
  const modal = document.getElementById('phone-modal');
  modal.classList.add('active');
  audio.playPhoneTone(350, 440, 0.12);
  initPhoneKids();
  
  // Sync selected dropdown item with current active room
  const select = document.getElementById('phone-furnish-room-select');
  if (select && ['phone-room', 'living-room', 'bath-area', 'back-room'].includes(currentRoom)) {
    select.value = currentRoom;
  }
  
  switchPhoneView('furnish');
  updateFurnishAppUI();
}

// Bind Bedroom interactive elements to open Decorator directly
const bedFurnitureNode = document.getElementById('bedroom-furniture-bed');
const rugFurnitureNode = document.getElementById('bedroom-furniture-rug');
const lampFurnitureNode = document.getElementById('bedroom-furniture-lamp');
const lightsFurnitureNode = document.getElementById('bedroom-furniture-lights');
const shelfFurnitureNode = document.getElementById('bedroom-furniture-shelf');
const windowFurnitureNode = document.getElementById('bedroom-furniture-window');

if (bedFurnitureNode) bedFurnitureNode.addEventListener('click', openBedroomDecorator);
if (rugFurnitureNode) rugFurnitureNode.addEventListener('click', openBedroomDecorator);
if (lampFurnitureNode) lampFurnitureNode.addEventListener('click', openBedroomDecorator);
if (lightsFurnitureNode) lightsFurnitureNode.addEventListener('click', openBedroomDecorator);
if (shelfFurnitureNode) shelfFurnitureNode.addEventListener('click', openBedroomDecorator);
if (windowFurnitureNode) windowFurnitureNode.addEventListener('click', openBedroomDecorator);

const tvFurnitureNode = document.getElementById('bedroom-furniture-tv');
if (tvFurnitureNode) {
  tvFurnitureNode.addEventListener('click', () => {
    if (state.data.tvChannel === undefined) state.data.tvChannel = 0;
    state.data.tvChannel = (state.data.tvChannel + 1) % 4;
    state.saveProfiles();
    
    audio.playPhoneTone(659, 784, 0.08); // retro click
    updateBedroomTVUI();
    showToast(`TV Channel Switched! 📺`);
  });
}

// --- PARENT & GRANDPARENT INTERACTIONS ---

const PARENT_DIALOGUES = [
  "Back in my day, we only had 50 Cat Coins to start with!",
  "Have you graduated from Cat School yet? I got my BS in Cat-culus!",
  "Don't forget to deposit your savings in the Cat-Bank, interest compounds daily!",
  "I'm proud of how you're running the playroom, my kitten!",
  "Make sure to vacuum the bedroom, the dander gets dusty!",
  "Always follow your dreams, little one. And get plenty of sleep!",
  "Salmon is my favorite. If you ever have extra coins, you know what to do!",
  "Keep grooming your fur, it keeps the static electricity away!"
];

let selectedParentCat = null;

function openParentInteractionModal(cat) {
  selectedParentCat = cat;
  
  const modal = document.getElementById('parent-interaction-modal');
  const avatarBox = document.getElementById('parent-modal-avatar-box');
  const nameEl = document.getElementById('parent-modal-name');
  const genEl = document.getElementById('parent-modal-generation');
  const degreesBox = document.getElementById('parent-modal-degrees');
  const dialogueEl = document.getElementById('parent-modal-dialogue');
  
  if (avatarBox) avatarBox.innerHTML = renderCatSVG(cat);
  if (nameEl) nameEl.textContent = cat.name;
  if (genEl) genEl.textContent = `Generation ${cat.generation || 1}`;
  
  if (degreesBox) {
    degreesBox.innerHTML = '';
    const degree = cat.degree || (cat.status === 'studying' ? 'Enrolled' : 'None');
    if (degree && degree !== 'None') {
      const badge = document.createElement('span');
      badge.style.cssText = "background:#e8f5e9; color:#2e7d32; border:1px solid #c8e6c9; border-radius:6px; font-size:0.6rem; padding:2px 6px; font-weight:800;";
      badge.textContent = `🎓 ${degree}`;
      degreesBox.appendChild(badge);
    }
    if (cat.trait) {
      const traitBadge = document.createElement('span');
      traitBadge.style.cssText = "background:#f3e5f5; color:#6a1b9a; border:1px solid #e1bee7; border-radius:6px; font-size:0.6rem; padding:2px 6px; font-weight:800;";
      traitBadge.textContent = `🌟 ${cat.trait}`;
      degreesBox.appendChild(traitBadge);
    }
  }
  
  if (dialogueEl) {
    const randomDialogue = PARENT_DIALOGUES[Math.floor(Math.random() * PARENT_DIALOGUES.length)];
    dialogueEl.textContent = `"${randomDialogue}"`;
  }
  
  modal.classList.add('active');
}

// Bind Parent Buttons
document.getElementById('parent-talk-btn').addEventListener('click', (event) => {
  if (!selectedParentCat) return;
  audio.playMeow(1.0);
  const dialogueEl = document.getElementById('parent-modal-dialogue');
  if (dialogueEl) {
    const randomDialogue = PARENT_DIALOGUES[Math.floor(Math.random() * PARENT_DIALOGUES.length)];
    dialogueEl.textContent = `"${randomDialogue}"`;
  }
  createFloater(event.clientX || window.innerWidth/2, event.clientY || window.innerHeight/2, "❤️");
});

document.getElementById('parent-treat-btn').addEventListener('click', (event) => {
  if (!selectedParentCat) return;
  if (state.data.coins < 5) {
    showToast("Not enough coins to buy a treat!");
    return;
  }
  
  state.data.coins -= 5;
  state.data.trustLevel = (state.data.trustLevel || 1) + 2;
  state.saveProfiles();
  updateHeaderStats();
  
  audio.playPurr();
  const dialogueEl = document.getElementById('parent-modal-dialogue');
  if (dialogueEl) {
    dialogueEl.textContent = `"Oh, delicious salmon! Thank you, my child! I feel so loved."`;
  }
  showToast("Fed parent a treat! Trust Level boosted! +2 XP");
  createFloater(event.clientX || window.innerWidth/2, event.clientY || window.innerHeight/2, "✨🐟✨");
});

document.getElementById('parent-groom-btn').addEventListener('click', (event) => {
  if (!selectedParentCat) return;
  audio.playPurr();
  const dialogueEl = document.getElementById('parent-modal-dialogue');
  if (dialogueEl) {
    dialogueEl.textContent = `"Ah, that brush feels amazing. Brushing out static electricity..."`;
  }
  createFloater(event.clientX || window.innerWidth/2, event.clientY || window.innerHeight/2, "🪮💕");
});

// --- GRANDPARENTS FARMHOUSE LOGIC ---

const GRANDPA_DIALOGUES = [
  "Welcome to the farm, youngster! Grab a seat on the porch.",
  "In my time, we didn't have smart TVs. We watched real birds outside!",
  "A healthy mind starts with a healthy catnap. Don't rush through life.",
  "I'm so proud of your parents, and I'm proud of you too!",
  "Always keep some coins saved up, you never know when you'll need cardboard!"
];

const GRANDMA_DIALOGUES = [
  "Oh look at my sweet kitten! Let me pinch those cheeks!",
  "Make sure you're eating enough, dear. I just baked a batch of catnip cookies!",
  "Family is the greatest treasure in the world. Stick together!",
  "Grandpa is napping, but I'm here to give you all the hugs!",
  "Groom your coat daily to keep the dust bunnies away."
];

function openGrandparentsFarmModal() {
  const modal = document.getElementById('grandparents-farm-modal');
  const catsContainer = document.getElementById('farm-cats-container');
  if (!catsContainer) return;
  
  catsContainer.innerHTML = '';
  
  const currentGen = state.data.currentGeneration || 1;
  const ancestorCats = (state.data.familyTree || []).filter(c => {
    const gen = c.generation !== undefined ? c.generation : 1;
    return gen < (currentGen - 1);
  });
  
  let catsToRender = [];
  if (ancestorCats.length > 0) {
    catsToRender = ancestorCats;
  } else {
    catsToRender = [
      {
        name: "Grandpa Whiskers",
        gender: "male",
        color: "grey",
        pattern: "tabby",
        eyeColor: "green",
        accessory: "glasses",
        generation: 0,
        dialogues: GRANDPA_DIALOGUES
      },
      {
        name: "Grandma Cookie",
        gender: "female",
        color: "orange",
        pattern: "calico",
        eyeColor: "blue",
        accessory: "scarf",
        generation: 0,
        dialogues: GRANDMA_DIALOGUES
      }
    ];
  }
  
  catsToRender.forEach((cat, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'cat-avatar-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.left = `${20 + idx * 28}%`;
    wrapper.style.bottom = `${15 + (idx % 2) * 15}px`;
    wrapper.style.cursor = 'pointer';
    wrapper.style.zIndex = '10';
    wrapper.innerHTML = renderCatSVG(cat);
    
    wrapper.onclick = (event) => {
      audio.playMeow(0.9);
      const dialogues = cat.dialogues || [
        `"Welcome to the farmhouse! Generation ${cat.generation} rules!"`,
        `"It's so wonderful of you to make a trip to visit us elders!"`,
        `"Keep up the good work in the playroom!"`
      ];
      const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
      showToast(`${cat.name}: "${randomDialogue}"`);
      createFloater(event.clientX, event.clientY, "💬👵");
    };
    
    catsContainer.appendChild(wrapper);
  });
  
  modal.classList.add('active');
}

// Bind Signpost click
document.getElementById('backroom-farm-sign').addEventListener('click', () => {
  audio.playPhoneTone(440, 480, 0.05);
  openGrandparentsFarmModal();
});

// Grandma Cookies Bake Button
document.getElementById('collect-cookies-btn').addEventListener('click', (event) => {
  const todayKey = `${state.data.calendarYear || 1}_${state.data.calendarMonth || 0}_${state.data.calendarDay || 1}`;
  if (state.data.lastCookieCollectedDay === todayKey) {
    showToast("Grandma Cookie: 'I'm baking more cookies for tomorrow, dear! Come back then!' 🍪");
    return;
  }
  
  state.data.lastCookieCollectedDay = todayKey;
  
  state.data.activeCats.forEach(cat => {
    cat.affection = 100;
    cat.energy = 100;
  });
  
  state.saveProfiles();
  updateHeaderStats();
  renderFocusCatDetails();
  renderRoomScene();
  
  audio.playPurr();
  showToast("Collected Grandma Cookie's fresh Catnip Cookies! All active cats' Energy & Affection restored to 100%!");
  createFloater(event.clientX, event.clientY, "🍪💖✨");
});


// --- 🌴 MONTHLY VACATION PLANNER SYSTEM ---

const VACATION_QUEST_TYPES = [
  { type: 'groom', name: 'Groom cats 5 times', target: 5 },
  { type: 'minigame', name: 'Hit the mouse 15 times', target: 15 },
  { type: 'earn_coins', name: 'Earn 60 Cat Coins', target: 60 },
  { type: 'study', name: 'Enroll cats in school 2 times', target: 2 }
];

function generateMonthlyVacationQuest() {
  const quest = VACATION_QUEST_TYPES[Math.floor(Math.random() * VACATION_QUEST_TYPES.length)];
  state.data.vacationQuest = {
    type: quest.type,
    name: quest.name,
    target: quest.target,
    current: 0,
    completed: false,
    unlocked: false,
    scheduledDay: null
  };
  state.saveProfiles();
  renderVacationPanel();
}

function updateVacationQuestProgress(type, amount = 1) {
  if (!state.data || !state.data.vacationQuest) return;
  const q = state.data.vacationQuest;
  if (q.type !== type || q.completed) return;

  q.current = Math.min(q.target, q.current + amount);
  if (q.current >= q.target) {
    q.completed = true;
    q.unlocked = true;
    showToast("🌴 Vacation Day Quest Complete! Go to the Calendar to schedule your holiday!");
    audio.playPurr();
    setTimeout(() => audio.playMeow(1.1), 100);
  }
  
  state.saveProfiles();
  renderVacationPanel();
}

function renderVacationPanel() {
  if (!state.data || !state.data.vacationQuest) return;
  const q = state.data.vacationQuest;

  const titleEl = document.getElementById('vacation-quest-title');
  const fillEl = document.getElementById('vacation-quest-fill');
  const ratioEl = document.getElementById('vacation-quest-ratio');
  const statusEl = document.getElementById('vacation-quest-status');
  const bookBtn = document.getElementById('book-vacation-coins-btn');
  const scheduleBtn = document.getElementById('schedule-vacation-btn');

  if (titleEl) titleEl.textContent = `Quest: ${q.name}`;
  if (ratioEl) ratioEl.textContent = `${q.current}/${q.target}`;
  if (fillEl) {
    const pct = Math.floor((q.current / q.target) * 100);
    fillEl.style.width = `${pct}%`;
  }

  if (q.scheduledDay) {
    if (statusEl) statusEl.innerHTML = `☀️ Scheduled for Day ${q.scheduledDay}! 🌴`;
    if (bookBtn) {
      bookBtn.disabled = true;
      bookBtn.classList.add('disabled');
      bookBtn.textContent = 'Scheduled';
    }
    if (scheduleBtn) {
      scheduleBtn.disabled = true;
      scheduleBtn.classList.add('disabled');
      scheduleBtn.textContent = 'Scheduled';
    }
  } else if (q.unlocked) {
    if (statusEl) statusEl.innerHTML = `✨ Ready to schedule!`;
    if (bookBtn) {
      bookBtn.disabled = true;
      bookBtn.classList.add('disabled');
      bookBtn.textContent = 'Unlocked';
    }
    if (scheduleBtn) {
      scheduleBtn.disabled = false;
      scheduleBtn.classList.remove('disabled');
      scheduleBtn.textContent = 'Schedule 🌴';
    }
  } else {
    if (statusEl) statusEl.innerHTML = `🔒 Quest Incomplete`;
    if (bookBtn) {
      bookBtn.disabled = false;
      bookBtn.classList.remove('disabled');
      bookBtn.textContent = 'Pay 50 🪙';
    }
    if (scheduleBtn) {
      scheduleBtn.disabled = true;
      scheduleBtn.classList.add('disabled');
      scheduleBtn.textContent = 'Schedule 🌴';
    }
  }
}

function bookVacationWithCoins() {
  if (!state.data || !state.data.vacationQuest) return;
  const q = state.data.vacationQuest;

  if (q.unlocked || q.scheduledDay) {
    showToast("Vacation is already unlocked for this month!");
    return;
  }

  if (state.data.coins < 50) {
    showToast("Not enough Cat Coins! Play minigames to earn more.");
    return;
  }

  state.data.coins -= 50;
  q.completed = true;
  q.unlocked = true;
  state.saveProfiles();
  updateHeaderStats();
  renderVacationPanel();
  
  audio.playPurr();
  showToast("🌴 Vacation Day booked! Click a day on the calendar and tap Schedule.");
}

function scheduleVacationDay() {
  if (!state.data || !state.data.vacationQuest) return;
  const q = state.data.vacationQuest;

  if (!selectedCalendarDay || selectedCalendarMonth === null) {
    alert("Please click a day on the calendar grid first!");
    return;
  }

  if (!q.unlocked || q.scheduledDay) {
    showToast("You must unlock the vacation day first!");
    return;
  }

  // Register Custom Event
  const key = `${selectedCalendarMonth}_${selectedCalendarDay}`;
  if (!state.data.customEvents) state.data.customEvents = {};
  state.data.customEvents[key] = {
    type: 'vacation',
    title: '🌴 Tropical Beach Vacation!'
  };

  q.scheduledDay = selectedCalendarDay;
  state.saveProfiles();

  renderCalendar();
  renderVacationPanel();
  
  audio.playPurr();
  setTimeout(() => audio.playMeow(1.1), 100);
  showToast(`🌴 Beach Vacation scheduled for Day ${selectedCalendarDay}!`);
}

// Bind Button Listeners
document.getElementById('book-vacation-coins-btn').addEventListener('click', bookVacationWithCoins);
document.getElementById('schedule-vacation-btn').addEventListener('click', scheduleVacationDay);

// --- 📹 SMARTPHONE VIDEO CALL SYSTEM (SILENT TEXT SUBTITLES) ---

const VIDEO_CALL_CAT_SUBTITLES = [
  "*blinks slowly* (Subtitles: \"Hey hooman! Look at me, I am on the video screen! You look so lovely today!\")",
  "*purrs silently* (Subtitles: \"I can see you! Sending you a big warm virtual headbutt to brighten your day!\")",
  "*wags ears* (Subtitles: \"Mew! I love seeing your face. You are doing a wonderful job taking care of us, keep going!\")",
  "*blinks slowly* (Subtitles: \"I am so happy and cozy here. Remember to take a break and rest just like I do!\")",
  "*yawns silently* (Subtitles: \"Mew... You make my heart feel so happy. Thanks for being the best owner!\")",
  "*gives a soft meow* (Subtitles: \"Hooman! You've got this today! I am sending all my positive kitty energy your way!\")"
];

const VIDEO_CALL_VET_SUBTITLES = [
  "(Subtitles: \"Hello! Dr. Whisker here. Just checking in to make sure all kittens are healthy and happy!\")",
  "(Subtitles: \"Remember to scoop the litter boxes and wash the cats in the Bath Area regularly!\")",
  "(Subtitles: \"To prevent sneezing and allergies, keep the Study room door closed and vacuum often!\")",
  "(Subtitles: \"Cat Academy courses are great! They boost your cat's growth and stats permanently!\")",
  "(Subtitles: \"Keep up the great work! Your cats are lucky to have such a dedicated caretaker!\")"
];

let activeVideoCallSubtitles = [];
let activeVideoCallIndex = 0;

function getCatFaceSVG(cat) {
  const headColor = cat.color || '#ffb74d';
  const earColor = '#ffa726';
  const innerEarColor = '#ff8a80';
  
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <style>
        @keyframes headBob {
          0% { transform: translateY(0); }
          100% { transform: translateY(2px); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          5% { transform: scaleY(0.1); }
        }
        .head-g { animation: headBob 2s infinite alternate ease-in-out; transform-origin: center bottom; }
        .eye-g { animation: blink 4s infinite; transform-origin: center center; }
      </style>
      <polygon points="15,40 10,10 40,30" fill="${earColor}" />
      <polygon points="18,38 14,15 37,29" fill="${innerEarColor}" />
      <polygon points="85,40 90,10 60,30" fill="${earColor}" />
      <polygon points="82,38 86,15 63,29" fill="${innerEarColor}" />
      <g class="head-g">
        <circle cx="50" cy="55" r="35" fill="${headColor}" />
        <ellipse class="eye-g" cx="38" cy="50" rx="4" ry="6" fill="#000" />
        <ellipse class="eye-g" cx="62" cy="50" rx="4" ry="6" fill="#000" />
        <circle class="eye-g" cx="37" cy="48" r="1.5" fill="#fff" />
        <circle class="eye-g" cx="61" cy="48" r="1.5" fill="#fff" />
        <polygon points="50,58 47,55 53,55" fill="#ff8a80" />
        <path d="M 47,62 Q 50,65 50,62 Q 50,65 53,62" stroke="#000" stroke-width="1.5" fill="none" />
        <circle cx="30" cy="58" r="3" fill="#ff8a80" opacity="0.5" />
        <circle cx="70" cy="58" r="3" fill="#ff8a80" opacity="0.5" />
        <line x1="25" y1="58" x2="5" y2="56" stroke="#555" stroke-width="1" />
        <line x1="25" y1="61" x2="5" y2="62" stroke="#555" stroke-width="1" />
        <line x1="75" y1="58" x2="95" y2="56" stroke="#555" stroke-width="1" />
        <line x1="75" y1="61" x2="95" y2="62" stroke="#555" stroke-width="1" />
      </g>
    </svg>
  `;
}

function getVetFaceSVG() {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <style>
        @keyframes headBob {
          0% { transform: translateY(0); }
          100% { transform: translateY(2px); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          5% { transform: scaleY(0.1); }
        }
        .head-g { animation: headBob 2.5s infinite alternate ease-in-out; transform-origin: center bottom; }
        .eye-g { animation: blink 3.5s infinite; transform-origin: center center; }
      </style>
      <polygon points="15,40 10,10 40,30" fill="#78909c" />
      <polygon points="18,38 14,15 37,29" fill="#ff8a80" />
      <polygon points="85,40 90,10 60,30" fill="#78909c" />
      <polygon points="82,38 86,15 63,29" fill="#ff8a80" />
      <g class="head-g">
        <circle cx="50" cy="55" r="35" fill="#eceff1" />
        <circle cx="36" cy="48" r="8" stroke="#37474f" stroke-width="2.5" fill="none" />
        <circle cx="64" cy="48" r="8" stroke="#37474f" stroke-width="2.5" fill="none" />
        <line x1="44" y1="48" x2="56" y2="48" stroke="#37474f" stroke-width="2.5" />
        <ellipse class="eye-g" cx="36" cy="48" rx="3" ry="5" fill="#000" />
        <ellipse class="eye-g" cx="64" cy="48" rx="3" ry="5" fill="#000" />
        <path d="M 30,85 L 50,70 L 70,85" fill="#ffffff" stroke="#37474f" stroke-width="1.5" />
        <path d="M 45,78 L 45,90 M 55,78 L 55,90" stroke="#78909c" stroke-width="2" />
        <circle cx="50" cy="85" r="5" fill="#90a4ae" />
        <polygon points="50,58 47,55 53,55" fill="#ff8a80" />
        <path d="M 47,62 Q 50,65 50,62 Q 50,65 53,62" stroke="#000" stroke-width="1.5" fill="none" />
        <path d="M 35,62 Q 25,65 15,62 M 35,66 Q 23,71 13,70" stroke="#90a4ae" stroke-width="1.5" fill="none" />
        <path d="M 65,62 Q 75,65 85,62 M 65,66 Q 77,71 87,70" stroke="#90a4ae" stroke-width="1.5" fill="none" />
      </g>
    </svg>
  `;
}

function startPhoneVideoCall() {
  const contact = document.getElementById('phone-chat-contact-select').value;
  audio.playPhoneTone(697, 1209, 0.2); // Dialing chirp
  
  const nameLabel = document.getElementById('phone-videocall-contact-name');
  const faceBox = document.getElementById('phone-videocall-face-box');
  const subtitlesEl = document.getElementById('phone-videocall-subtitles');
  
  if (contact === 'vet') {
    if (nameLabel) nameLabel.textContent = '🩺 Dr. Whisker (Vet)';
    if (faceBox) faceBox.innerHTML = getVetFaceSVG();
    activeVideoCallSubtitles = VIDEO_CALL_VET_SUBTITLES;
  } else {
    const cat = state.data.activeCats.find(c => c.id === contact);
    if (cat) {
      if (nameLabel) nameLabel.textContent = `🐱 ${cat.name}`;
      if (faceBox) faceBox.innerHTML = getCatFaceSVG(cat);
      activeVideoCallSubtitles = VIDEO_CALL_CAT_SUBTITLES;
    } else {
      showToast("Cannot connect video feed. Cat not available!");
      return;
    }
  }

  activeVideoCallIndex = 0;
  if (subtitlesEl) {
    subtitlesEl.textContent = activeVideoCallSubtitles[0];
  }
  
  switchPhoneView('videocall');
}

function nextPhoneVideoCallSubtitle() {
  if (activeVideoCallSubtitles.length === 0) return;
  activeVideoCallIndex = (activeVideoCallIndex + 1) % activeVideoCallSubtitles.length;
  
  const subtitlesEl = document.getElementById('phone-videocall-subtitles');
  if (subtitlesEl) {
    subtitlesEl.textContent = activeVideoCallSubtitles[activeVideoCallIndex];
  }
  audio.playPhoneTone(852, 1209, 0.05); // click beep
}

function hangUpPhoneVideoCall() {
  audio.playPhoneTone(440, 480, 0.15); // Disconnect chime
  switchPhoneView('chat');
}

// Bind listeners
document.getElementById('phone-chat-videocall-btn').addEventListener('click', startPhoneVideoCall);
document.getElementById('phone-videocall-next-btn').addEventListener('click', nextPhoneVideoCallSubtitle);
document.getElementById('phone-videocall-hangup-btn').addEventListener('click', hangUpPhoneVideoCall);


// --- 📿 SMARTPHONE COLLAR CRAFT SYSTEM ---

let selectedCollarStrapColor = '#e53935'; // Red default
let selectedCollarBeadColor = '#ffd54f';  // Yellow default

function initCollarMakerUI() {
  const select = document.getElementById('collar-cat-select');
  if (!select || !state.data || !state.data.activeCats) return;
  
  select.innerHTML = '';
  state.data.activeCats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = `🐱 ${cat.name}`;
    select.appendChild(opt);
  });

  // Select initial presets
  highlightCollarStrapColor('#e53935');
  highlightCollarBeadColor('#ffd54f');
  
  const checkbox = document.getElementById('collar-beads-checkbox');
  if (checkbox) checkbox.checked = false;
  
  const input = document.getElementById('collar-charm-input');
  if (input) input.value = 'K';

  drawCollarMakerPreview();
}

function highlightCollarStrapColor(color) {
  selectedCollarStrapColor = color;
  document.querySelectorAll('.collar-strap-btn').forEach(btn => {
    const btnCol = btn.dataset.color;
    btn.style.borderColor = (btnCol === color) ? '#3e2723' : '#ccc';
    btn.style.transform = (btnCol === color) ? 'scale(1.15)' : 'scale(1)';
  });
}

function highlightCollarBeadColor(color) {
  selectedCollarBeadColor = color;
  document.querySelectorAll('.collar-bead-btn').forEach(btn => {
    const btnCol = btn.dataset.color;
    btn.style.borderColor = (btnCol === color) ? '#3e2723' : '#ccc';
    btn.style.transform = (btnCol === color) ? 'scale(1.15)' : 'scale(1)';
  });
}

function drawCollarMakerPreview() {
  const previewBox = document.getElementById('collar-live-preview-box');
  if (!previewBox) return;

  const checkbox = document.getElementById('collar-beads-checkbox');
  const hasBeads = checkbox ? checkbox.checked : false;

  const input = document.getElementById('collar-charm-input');
  let charm = input ? input.value.trim().toUpperCase() : 'K';
  
  // Clean: only A-Z, 1-9 characters
  charm = charm.replace(/[^A-Z1-9]/i, '');
  if (charm.length > 1) charm = charm.charAt(0);
  if (charm === '') charm = '?';
  if (input && input.value !== charm) {
    input.value = charm;
  }

  let beadsHTML = '';
  if (hasBeads) {
    beadsHTML = `
      <circle cx="38" cy="24.8" r="2" fill="${selectedCollarBeadColor}" />
      <circle cx="44" cy="26.2" r="2" fill="${selectedCollarBeadColor}" />
      <circle cx="56" cy="26.2" r="2" fill="${selectedCollarBeadColor}" />
      <circle cx="62" cy="24.8" r="2" fill="${selectedCollarBeadColor}" />
    `;
  }

  previewBox.innerHTML = `
    <svg viewBox="0 0 100 50" width="100%" height="100%">
      <!-- Collar Strap -->
      <path d="M 30,23 Q 50,28 70,23" stroke="${selectedCollarStrapColor}" stroke-width="4.2" fill="none" stroke-linecap="round" />
      <!-- Beads -->
      ${beadsHTML}
      <!-- Gold Charm Tag -->
      <circle cx="50" cy="28" r="5.2" fill="#ffd54f" stroke="#e65100" stroke-width="0.8" />
      <text x="50" y="32" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle" fill="#5d4037">${charm}</text>
    </svg>
  `;
}

function craftCustomCollar() {
  if (!state.data) return;

  if (state.data.coins < 15) {
    showToast("Not enough Cat Coins! Play minigames to earn more.");
    return;
  }

  const select = document.getElementById('collar-cat-select');
  const catId = select ? select.value : '';
  if (!catId) {
    showToast("Please select a cat first!");
    return;
  }

  const cat = state.data.activeCats.find(c => c.id === catId);
  if (!cat) {
    showToast("Selected cat not found!");
    return;
  }

  const checkbox = document.getElementById('collar-beads-checkbox');
  const hasBeads = checkbox ? checkbox.checked : false;

  const input = document.getElementById('collar-charm-input');
  let charm = input ? input.value.trim().toUpperCase() : 'K';
  charm = charm.replace(/[^A-Z1-9]/i, '');
  if (charm.length > 1) charm = charm.charAt(0);
  if (charm === '') charm = 'K';

  // Deduct coins
  state.data.coins -= 15;
  
  if (!cat.accessories) {
    cat.accessories = { hat: null, body: null, neckwear: null };
  }

  cat.accessories.neckwear = {
    style: 'custom_collar',
    primaryColor: selectedCollarStrapColor,
    accentColor: selectedCollarBeadColor,
    beads: hasBeads,
    charmText: charm
  };

  state.saveProfiles();

  // Play success sound
  audio.playPhoneTone(880, 1109, 0.25);
  showToast(`📿 Custom collar crafted for ${cat.name}! (-15 Coins)`);

  drawCollarMakerPreview();
  renderRoomScene();
}

// Bind Strap palettes
document.querySelectorAll('.collar-strap-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    highlightCollarStrapColor(btn.dataset.color);
    drawCollarMakerPreview();
    audio.playPhoneTone(700, 850, 0.05);
  });
});

// Bind Bead palettes
document.querySelectorAll('.collar-bead-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    highlightCollarBeadColor(btn.dataset.color);
    drawCollarMakerPreview();
    audio.playPhoneTone(700, 850, 0.05);
  });
});

// Bind other preview triggers
document.getElementById('collar-beads-checkbox').addEventListener('change', drawCollarMakerPreview);
document.getElementById('collar-charm-input').addEventListener('input', drawCollarMakerPreview);

// Submit Craft button
document.getElementById('collar-craft-submit-btn').addEventListener('click', craftCustomCollar);


// --- 📞 RANDOM INCOMING CALL SYSTEM ---

const RANDOM_CALLERS = [
  { name: "🐟 Fish Merchant", avatar: "🐟", dialogue: "Ahoy! I got a surplus of fresh salmon today! I have transferred 15 Cat Coins to your account as a friendly gift! Have a purrfect day!", rewardCoins: 15 },
  { name: "🎓 Academy Dean", avatar: "🎓", dialogue: "Hello! Just calling to congratulate you on your cat's study progress. They are show-stopping students! Keep up the enrollment!", rewardCoins: 0 },
  { name: "🐱 Luna's Grandma", avatar: "👵", dialogue: "Hello dear! Luna's grandmother here. I knitted a tiny mouse toy for the kittens! Make sure they sleep well and stay warm. Sending you 10 Cat Coins!", rewardCoins: 10 },
  { name: "👑 Wealthy Sponsor", avatar: "👑", dialogue: "Greetings! I sponsor modern cat homes worldwide. Your cat care is stellar! Here is a micro-grant of 25 Cat Coins to decorate your rooms!", rewardCoins: 25 },
  { name: "🐈 Stray Cat Bob", avatar: "🐱", dialogue: "Mew... I am a local stray cat looking for friends. Your home looks so beautiful and welcoming! *purrs softly*", rewardCoins: 0 },
  { name: "🛸 Alien Cat", avatar: "🛸", dialogue: "Meow-zorp! Hello human of Earth. We are monitoring your cat's cuteness levels. They have exceeded the galaxy threshold! Zorp!", rewardCoins: 0 }
];

let activeIncomingCaller = null;
let incomingRingInterval = null;
let activeCallTimerInterval = null;
let activeCallSeconds = 0;

function startPhoneRingingSound() {
  stopPhoneRingingSound();
  if (audio.muted) return;
  audio.playPhoneRing();
  incomingRingInterval = setInterval(() => {
    if (!audio.muted) audio.playPhoneRing();
  }, 2500);
}

function stopPhoneRingingSound() {
  if (incomingRingInterval) {
    clearInterval(incomingRingInterval);
    incomingRingInterval = null;
  }
}

function triggerRandomIncomingCall() {
  if (minigameActive) return;
  
  const caller = RANDOM_CALLERS[Math.floor(Math.random() * RANDOM_CALLERS.length)];
  activeIncomingCaller = caller;
  
  startPhoneRingingSound();
  showIncomingCallNotification(caller);
}

function showIncomingCallNotification(caller) {
  const existing = document.getElementById('phone-ringing-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'phone-ringing-banner';
  banner.style.cssText = "position:absolute; top:12px; left:50%; transform:translateX(-50%); background:#512da8; color:#fff; padding:10px 16px; border-radius:12px; border:2px solid #80deea; box-shadow:0 6px 15px rgba(0,0,0,0.3); font-size:0.75rem; font-weight:800; cursor:pointer; z-index:9999; display:flex; align-items:center; gap:8px;";
  banner.innerHTML = `<span>🔔 Incoming: ${caller.avatar} ${caller.name}</span> <span style="font-size:0.6rem; background:#fff; color:#512da8; padding:2px 8px; border-radius:8px; font-weight:bold;">ANSWER</span>`;
  
  banner.onclick = () => {
    banner.remove();
    const modal = document.getElementById('phone-modal');
    if (modal) modal.classList.add('active');
    initPhoneKids();
    showIncomingCallScreen(caller);
  };
  
  const container = document.getElementById('play-space-container');
  if (container) container.appendChild(banner);
  
  setTimeout(() => {
    const activeBanner = document.getElementById('phone-ringing-banner');
    if (activeBanner) {
      activeBanner.remove();
      declineIncomingCall();
    }
  }, 15000);
}

function showIncomingCallScreen(caller) {
  const nameLabel = document.getElementById('phone-incomingcall-caller-name');
  const avatarLabel = document.getElementById('phone-incomingcall-avatar');
  
  if (nameLabel) nameLabel.textContent = caller.name;
  if (avatarLabel) avatarLabel.textContent = caller.avatar;
  
  switchPhoneView('incomingcall');
}

function acceptIncomingCall() {
  stopPhoneRingingSound();
  
  const banner = document.getElementById('phone-ringing-banner');
  if (banner) banner.remove();
  
  const caller = activeIncomingCaller;
  if (!caller) return;

  const nameLabel = document.getElementById('phone-activecall-caller-name');
  const avatarLabel = document.getElementById('phone-activecall-avatar');
  const subtitlesEl = document.getElementById('phone-activecall-subtitles');
  
  if (nameLabel) nameLabel.textContent = caller.name;
  if (avatarLabel) avatarLabel.textContent = caller.avatar;
  if (subtitlesEl) subtitlesEl.textContent = caller.dialogue;

  if (caller.rewardCoins > 0 && state.data) {
    state.data.coins += caller.rewardCoins;
    state.saveProfiles();
    audio.playPhoneTone(523, 659, 0.1);
    showToast(`Received ${caller.rewardCoins} Cat Coins! 🪙`);
  }

  startActiveCallTimer();
  switchPhoneView('activecall');
}

function declineIncomingCall() {
  stopPhoneRingingSound();
  
  const banner = document.getElementById('phone-ringing-banner');
  if (banner) banner.remove();
  
  activeIncomingCaller = null;
  audio.playPhoneTone(440, 480, 0.15);
  
  switchPhoneView('home');
}

function hangUpActiveCall() {
  stopActiveCallTimer();
  activeIncomingCaller = null;
  audio.playPhoneTone(440, 480, 0.15);
  
  switchPhoneView('home');
}

function startActiveCallTimer() {
  stopActiveCallTimer();
  activeCallSeconds = 0;
  
  const timerEl = document.getElementById('phone-activecall-timer');
  if (timerEl) timerEl.textContent = '00:00';
  
  activeCallTimerInterval = setInterval(() => {
    activeCallSeconds++;
    const mins = Math.floor(activeCallSeconds / 60).toString().padStart(2, '0');
    const secs = (activeCallSeconds % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopActiveCallTimer() {
  if (activeCallTimerInterval) {
    clearInterval(activeCallTimerInterval);
    activeCallTimerInterval = null;
  }
}

// Bind incoming/active call action listeners
document.getElementById('phone-incomingcall-accept-btn').addEventListener('click', acceptIncomingCall);
document.getElementById('phone-incomingcall-decline-btn').addEventListener('click', declineIncomingCall);
document.getElementById('phone-activecall-hangup-btn').addEventListener('click', hangUpActiveCall);

// Trigger check loop
setInterval(triggerRandomIncomingCall, 100000);


// --- 🤖 APPS CONFIGURATION & DESKTOP SYSTEM ---

const APPS_CONFIG = {
  'dialer': { name: 'Dialer', icon: '📞', bg: '#4caf50' },
  'chat': { name: 'Chat', icon: '💬', bg: '#2196f3' },
  'cam': { name: 'Camera', icon: '📷', bg: '#9c27b0' },
  'cathrome': { name: 'Browser', icon: '🌐', bg: '#e91e63' },
  'meowzon': { name: 'Meow-zon', icon: '🛒', bg: '#ff9800' },
  'gallery': { name: 'Gallery', icon: '🖼️', bg: '#009688' },
  'bank': { name: 'Cat-Bank', icon: '💵', bg: '#3f51b5' },
  'maps': { name: 'Cat-Maps', icon: '🌍', bg: '#00bcd4' },
  'furnish': { name: 'Bed-Craft', icon: '🛋️', bg: '#e91e63' },
  'collarmaker': { name: 'Collar Craft', icon: '📿', bg: '#673ab7' },
  'play': { name: 'Meowgle Play', icon: '🤖', bg: '#607d8b' },
  'cattube': { name: 'CatTube', icon: '📺', bg: '#f44336' },
  'meowtify': { name: 'Meowtify', icon: '🎵', bg: '#1db954' },
  'cattitude': { name: 'Cattitude', icon: '📸', bg: '#e91e63' },
  'securitycam': { name: 'Meowgle Cam', icon: '📹', bg: '#607d8b' }
};

const DOWNLOADABLE_APPS = [
  { id: 'cattube', name: 'CatTube', desc: 'Watch squeaky mice and chirping bird videos made for kittens!', icon: '📺', bg: '#f44336' },
  { id: 'meowtify', name: 'Meowtify', desc: 'Listen to soothing ambient tracks: deep purrs, rain, and chirping forest birds!', icon: '🎵', bg: '#1db954' },
  { id: 'catfit', name: 'CatFit', desc: 'Track your kittens daily steps, calories burned, and active times!', icon: '🏃', bg: '#ff5722' },
  { id: 'cattitude', name: 'Cattitude', desc: 'Explore the cats-only social media feed! Like and read neighborhood posts!', icon: '📸', bg: '#e91e63' },
  { id: 'securitycam', name: 'Meowgle Cam', desc: 'Secure your house with live CCTV camera feeds of all rooms!', icon: '📹', bg: '#607d8b' }
];

function renderPhoneHomeScreen() {
  const grid = document.getElementById('phone-home-grid');
  if (!grid || !state.data) return;
  
  if (!state.data.installedApps) {
    state.data.installedApps = ['dialer', 'chat', 'cam', 'cathrome', 'meowzon', 'gallery', 'bank', 'maps', 'furnish', 'collarmaker', 'play'];
  }
  
  grid.innerHTML = '';
  state.data.installedApps.forEach(appId => {
    const config = APPS_CONFIG[appId];
    if (!config) return;
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = "display: flex; flex-direction: column; align-items: center; text-align: center; width: 60px; height: 60px;";
    
    const btn = document.createElement('button');
    btn.className = 'phone-app-btn';
    btn.style.cssText = `background: ${config.bg}; color: white; border: none; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.18); transition: transform 0.15s ease; padding:0; margin:0;`;
    btn.textContent = config.icon;
    
    btn.addEventListener('click', () => {
      audio.playPhoneTone(659, 784, 0.08);
      switchPhoneView(appId);
    });
    
    const span = document.createElement('span');
    span.style.cssText = "font-size: 0.52rem; font-weight: 700; color: #fff; margin-top: 3px; text-shadow: 0 1px 2px rgba(0,0,0,0.6); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%;";
    span.textContent = config.name;
    
    wrapper.appendChild(btn);
    wrapper.appendChild(span);
    grid.appendChild(wrapper);
  });
}

// --- 🤖 MEOWGLE PLAY APP STORE SYSTEM ---

function updateMeowglePlayUI() {
  const container = document.getElementById('meowgle-play-app-list');
  if (!container || !state.data) return;
  
  if (!state.data.installedApps) {
    state.data.installedApps = ['dialer', 'chat', 'cam', 'cathrome', 'meowzon', 'gallery', 'bank', 'maps', 'furnish', 'collarmaker', 'play'];
  }

  container.innerHTML = '';
  DOWNLOADABLE_APPS.forEach(app => {
    const installed = state.data.installedApps.includes(app.id);
    
    const card = document.createElement('div');
    card.style.cssText = "background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; justify-content: space-between; box-shadow: 0 1.5px 3px rgba(0,0,0,0.05);";
    
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; flex:1;">
        <div style="width:36px; height:36px; border-radius:50%; background:${app.bg}; color:white; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">${app.icon}</div>
        <div style="display:flex; flex-direction:column; gap:2px; max-width:140px;">
          <strong style="font-size:0.7rem; color:#2c3e50;">${app.name}</strong>
          <span style="font-size:0.52rem; color:#7f8c8d; line-height:1.25;">${app.desc}</span>
        </div>
      </div>
      <button class="btn install-action-btn" style="padding:4px 8px; font-size:0.55rem; font-weight:bold; border-radius:8px; border:none; color:white; cursor:pointer; min-width:65px; background:${installed ? '#e53935' : '#0288d1'};">
        ${installed ? 'Uninstall' : 'Install'}
      </button>
    `;
    
    const actionBtn = card.querySelector('.install-action-btn');
    actionBtn.onclick = () => {
      if (installed) {
        state.data.installedApps = state.data.installedApps.filter(id => id !== app.id);
        showToast(`Uninstalled ${app.name} ❌`);
      } else {
        state.data.installedApps.push(app.id);
        showToast(`Installed ${app.name} successfully! 📦✨`);
      }
      state.saveProfiles();
      audio.playPhoneTone(880, 988, 0.15);
      updateMeowglePlayUI();
    };
    
    container.appendChild(card);
  });
}

// --- 📺 CATTUBE VIDEO STREAMING SYSTEM ---

const CATTUBE_VIDEOS = [
  { id: 'mice', title: '🐭 10 Hours of Squeaky Mice Running', length: '10:00:00' },
  { id: 'fish', title: '🐟 Satisfying Fish Tank Relax Loop', length: '04:15:30' },
  { id: 'birds', title: '🐦 Backyard Bird Watching Live Feed', length: 'LIVE' },
  { id: 'grooming', title: '🐈 Grooming Masterclass by Prof. Whisker', length: '12:45' }
];

let cattubeVideoInterval = null;
let cattubeFrame = 0;

function initCatTubeUI() {
  const list = document.getElementById('cattube-video-list');
  if (!list) return;

  list.innerHTML = '';
  CATTUBE_VIDEOS.forEach(vid => {
    const card = document.createElement('div');
    card.style.cssText = "background: white; border: 1px solid #eee; border-radius: 8px; padding: 6px; display: flex; gap: 8px; cursor: pointer; transition: background 0.2s;";
    card.innerHTML = `
      <div style="width: 55px; height: 35px; background: #000; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; color:#fff; position: relative;">
        📺
        <span style="position: absolute; bottom: 2px; right: 2px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.4rem; padding: 0.5px 3px; border-radius: 2px; font-weight: bold;">${vid.length}</span>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: center; gap: 2px; flex: 1;">
        <span style="font-size: 0.58rem; font-weight: bold; color: #2c3e50; line-height: 1.2;">${vid.title}</span>
        <span style="font-size: 0.45rem; color: #95a5a6;">128k views • 2 days ago</span>
      </div>
    `;
    
    card.onclick = () => {
      playCatTubeVideo(vid.id);
    };
    
    list.appendChild(card);
  });
}

function playCatTubeVideo(vidId) {
  if (cattubeVideoInterval) clearInterval(cattubeVideoInterval);
  cattubeFrame = 0;
  
  const player = document.getElementById('cattube-player-box');
  if (!player) return;
  
  if (state.data && state.data.activeCats && state.data.activeCats[focusCatIndex]) {
    const cat = state.data.activeCats[focusCatIndex];
    cat.happy = Math.min(100, cat.happy + 8);
    audio.playPhoneTone(523, 659, 0.1);
    showToast(`${cat.name} is thoroughly entertained! (+8 Happiness)`);
    renderRoomScene();
    updateFocusCatDetailsUI();
  }

  cattubeVideoInterval = setInterval(() => {
    cattubeFrame++;
    let visualHTML = '';
    
    if (vidId === 'mice') {
      const x = 15 + Math.sin(cattubeFrame * 0.4) * 35 + 35;
      visualHTML = `
        <svg viewBox="0 0 100 50" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="50" fill="#1b5e20" opacity="0.3" />
          <ellipse cx="${x}" cy="25" rx="5" ry="3.2" fill="#9e9e9e" />
          <path d="M ${x + 5},25 Q ${x + 10},23 ${x + 12},27" fill="none" stroke="#757575" stroke-width="0.8" />
          <circle cx="${x - 4}" cy="23" r="1.5" fill="#e91e63" />
        </svg>
      `;
    } else if (vidId === 'fish') {
      const y = 25 + Math.sin(cattubeFrame * 0.3) * 10;
      const x = 10 + (cattubeFrame * 2) % 80;
      visualHTML = `
        <svg viewBox="0 0 100 50" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="50" fill="#006064" opacity="0.4" />
          <path d="M ${x},${y} Q ${x - 6},${y - 4} ${x - 10},${y} Q ${x - 6},${y + 4} ${x},${y} Z" fill="#ff7043" />
          <polygon points="${x - 10},${y} ${x - 14},${y - 3} ${x - 14},${y + 3}" fill="#ff7043" />
          <circle cx="${x - 2}" cy="${y - 1}" r="0.6" fill="#000" />
        </svg>
      `;
    } else if (vidId === 'birds') {
      const y = 35 + (cattubeFrame % 2 === 0 ? -4 : 0);
      visualHTML = `
        <svg viewBox="0 0 100 50" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="50" fill="#e8f5e9" opacity="0.5" />
          <circle cx="50" cy="${y}" r="6" fill="#0288d1" />
          <polygon points="56,${y} 62,${y - 2} 56,${y + 2}" fill="#ffca28" />
          <path d="M 47,${y} Q 40,${y - 6} 45,${y - 8} Z" fill="#03a9f4" />
        </svg>
      `;
    } else if (vidId === 'grooming') {
      const tongueY = 28 + (cattubeFrame % 3 === 0 ? 2 : 0);
      visualHTML = `
        <svg viewBox="0 0 100 50" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="50" fill="#efebe9" opacity="0.6" />
          <circle cx="50" cy="22" r="10" fill="#90a4ae" />
          <polygon points="42,14 38,5 45,10" fill="#90a4ae" />
          <polygon points="58,14 62,5 55,10" fill="#90a4ae" />
          <ellipse cx="50" cy="${tongueY}" rx="3.5" ry="2" fill="#ff8a80" />
        </svg>
      `;
    }
    
    player.innerHTML = visualHTML;
  }, 150);
}

// --- 🎵 MEOWTIFY SOUND TRACK SYSTEM ---

const MEOWTIFY_TRACKS = [
  { id: 'purr', title: '💤 Deep Purr Hum', desc: 'Low frequency comforting vibration' },
  { id: 'rain', title: '🌧️ Window Rain Drops', desc: 'White noise rain sound' },
  { id: 'birds', title: '🐦 Forest Warblers', desc: 'Calming bird tweets' },
  { id: 'laser', title: '⚡ Electro-Laser Beat', desc: 'Playful retro laser chirps' }
];

let meowtifyActiveTrack = null;
let meowtifyAudioInterval = null;

function initMeowtifyUI() {
  const container = document.getElementById('meowtify-tracks-container');
  if (!container) return;

  container.innerHTML = '';
  MEOWTIFY_TRACKS.forEach(track => {
    const active = meowtifyActiveTrack === track.id;
    
    const card = document.createElement('div');
    card.style.cssText = `background: ${active ? '#282828' : '#181818'}; border: 1px solid ${active ? '#1db954' : '#282828'}; border-radius: 8px; padding: 8px 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;`;
    
    card.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="font-size:0.65rem; font-weight:bold; color:${active ? '#1db954' : '#fff'};">${track.title}</span>
        <span style="font-size:0.5rem; color:#b3b3b3;">${track.desc}</span>
      </div>
      <span style="font-size:0.8rem; color:${active ? '#1db954' : '#b3b3b3'};">${active ? '🔊' : '▶️'}</span>
    `;
    
    card.onclick = () => {
      playMeowtifyTrack(track.id);
    };
    
    container.appendChild(card);
  });
}

function playMeowtifyTrack(trackId) {
  if (meowtifyAudioInterval) clearInterval(meowtifyAudioInterval);
  
  if (meowtifyActiveTrack === trackId) {
    meowtifyActiveTrack = null;
    document.getElementById('meowtify-now-playing-title').textContent = 'No Track Playing';
    document.getElementById('meowtify-play-pause-btn').textContent = '▶️';
    initMeowtifyUI();
    return;
  }

  meowtifyActiveTrack = trackId;
  const track = MEOWTIFY_TRACKS.find(t => t.id === trackId);
  document.getElementById('meowtify-now-playing-title').textContent = track.title;
  document.getElementById('meowtify-play-pause-btn').textContent = '⏸️';
  
  initMeowtifyUI();

  meowtifyAudioInterval = setInterval(() => {
    if (audio.muted || meowtifyActiveTrack !== trackId) return;
    
    if (trackId === 'purr') {
      audio.playPhoneTone(180, 182, 0.25);
    } else if (trackId === 'rain') {
      audio.playPhoneTone(1500, 2000, 0.02);
    } else if (trackId === 'birds') {
      const f = 2000 + Math.random() * 800;
      audio.playPhoneTone(f, f + 10, 0.06);
    } else if (trackId === 'laser') {
      audio.playPhoneTone(659, 1209, 0.04);
    }
  }, 400);
}

document.getElementById('meowtify-play-pause-btn').onclick = () => {
  if (meowtifyActiveTrack) {
    playMeowtifyTrack(meowtifyActiveTrack);
  }
};

// --- 🏃 CATFIT HEALTH & FITNESS SYSTEM ---

function initCatFitUI() {
  const activeCat = (state.data && state.data.activeCats) ? state.data.activeCats[focusCatIndex] : null;
  const nameLabel = document.getElementById('catfit-focus-name');
  if (nameLabel) nameLabel.textContent = activeCat ? activeCat.name : 'Luna';

  if (state.data) {
    if (state.data.catSteps === undefined) state.data.catSteps = 1040;
    state.data.catSteps += Math.floor(Math.random() * 45 + 10);
    state.saveProfiles();

    const stepsVal = document.getElementById('catfit-steps-val');
    const caloriesVal = document.getElementById('catfit-calories-val');
    const activeVal = document.getElementById('catfit-active-val');
    const activeBar = document.getElementById('catfit-graph-bar-active');

    if (stepsVal) stepsVal.textContent = state.data.catSteps.toLocaleString();
    if (caloriesVal) caloriesVal.textContent = `${(state.data.catSteps * 0.035).toFixed(1)} kcal`;
    if (activeVal) activeVal.textContent = `${(state.data.catSteps * 0.003).toFixed(1)} mins`;
    
    if (activeBar) {
      const h = Math.min(48, 15 + (state.data.catSteps % 30));
      activeBar.style.height = `${h}px`;
    }
  }
}

// --- 📸 CATTITUDE SOCIAL MEDIA SYSTEM ---

const CATTITUDE_POSTS = [
  { handle: "@cool_cat_luna", text: "Felt cute, might scratch the brand new sofa later. IDK. 🐾💅", likes: 84, liked: false },
  { handle: "@prof_whisker", text: "Protip: clean ears and groom static electricity. Cleanliness must always be maintained! 🩺✨", likes: 142, liked: false },
  { handle: "@parent_grandpa", text: "Back in my day we didn't have screens. We just sat and stared at the empty wall for 6 hours straight. Good times.", likes: 98, liked: false },
  { handle: "@stray_bob", text: "A Fish Merchant called me up and sent 15 coins gift. Easiest fish ever! 🐟🐟", likes: 210, liked: false },
  { handle: "@kitty_cupcake", text: "Breeding was a success! I have a baby orange sibling who likes headbutts. 🍼🐾", likes: 119, liked: false }
];

function initCattitudeUI() {
  const container = document.getElementById('cattitude-feed-container');
  if (!container) return;

  container.innerHTML = '';
  CATTITUDE_POSTS.forEach((post, idx) => {
    const card = document.createElement('div');
    card.style.cssText = "background: white; border: 1.5px solid #f8bbd0; border-radius: 12px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 1.5px 3px rgba(0,0,0,0.05); margin-bottom: 8px;";
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size:0.65rem; color:#ad1457;">${post.handle}</strong>
        <span style="font-size:0.5rem; color:#777;">Active Now</span>
      </div>
      <p style="margin: 3px 0; font-size:0.6rem; color:#2c3e50; line-height:1.35;">${post.text}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #fce4ec; padding-top:4px; margin-top:2px;">
        <span style="font-size:0.55rem; color:#ad1457; font-weight:bold;">❤️ <span class="likes-count">${post.likes}</span> likes</span>
        <button class="btn like-action-btn" style="background:${post.liked ? '#ad1457' : '#e91e63'}; color:#fff; border:none; border-radius:6px; font-size:0.5rem; padding:2px 6px; font-weight:bold; cursor:pointer; outline:none;">
          ${post.liked ? 'Liked' : 'Like'}
        </button>
      </div>
    `;
    
    const likeBtn = card.querySelector('.like-action-btn');
    likeBtn.onclick = () => {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      card.querySelector('.likes-count').textContent = post.likes;
      likeBtn.textContent = post.liked ? 'Liked' : 'Like';
      likeBtn.style.background = post.liked ? '#ad1457' : '#e91e63';
      audio.playPhoneTone(880, 1109, 0.05);
    };
    
    container.appendChild(card);
  });
}


// --- 📹 MEOWGLE CAM (SECURITY CAM) SYSTEM ---

const SECURITY_CHANNELS = [
  { id: 'bedroom', name: 'CAM 1 - BEDROOM', label: 'CAM 1 - BEDROOM', room: 'phone-room' },
  { id: 'living', name: 'CAM 2 - LIVING', label: 'CAM 2 - LIVING', room: 'living-room' },
  { id: 'bath', name: 'CAM 3 - BATH', label: 'CAM 3 - BATH AREA', room: 'bath-area' },
  { id: 'backroom', name: 'CAM 4 - RETIREMENT', label: 'CAM 4 - BACK ROOM', room: 'back-room' },
  { id: 'school', name: 'CAM 5 - ACADEMY', label: 'CAM 5 - SCHOOL', room: 'school' }
];

let activeSecurityChannel = 'living';
let securityCamTickInterval = null;

function initSecurityCamUI() {
  const grid = document.getElementById('securitycam-channels-grid');
  if (!grid) return;

  grid.innerHTML = '';
  SECURITY_CHANNELS.forEach(channel => {
    const active = activeSecurityChannel === channel.id;
    
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.cssText = `padding: 6px 4px; font-size: 0.55rem; font-weight: bold; border-radius: 6px; border: 1.5px solid ${active ? '#2ecc71' : '#566573'}; background: ${active ? '#1e824c' : '#2c3e50'}; color: white; cursor: pointer; text-align: center;`;
    btn.textContent = channel.name;
    
    btn.onclick = () => {
      activeSecurityChannel = channel.id;
      audio.playPhoneTone(700, 850, 0.05);
      initSecurityCamUI();
    };
    
    grid.appendChild(btn);
  });

  drawSecurityCamFeed();
}

function drawSecurityCamFeed() {
  const container = document.getElementById('securitycam-feed-container');
  if (!container || !state.data) return;
  
  const channel = SECURITY_CHANNELS.find(c => c.id === activeSecurityChannel);
  if (!channel) return;
  
  const labelEl = document.getElementById('securitycam-label');
  const timeEl = document.getElementById('securitycam-time');
  
  if (labelEl) labelEl.textContent = channel.label;
  if (timeEl) {
    const y = state.data.year || 1;
    const m = state.data.month || 1;
    const d = state.data.day || 1;
    const pad = (n) => n.toString().padStart(2, '0');
    timeEl.textContent = `Y${y} M${m} D${pad(d)}  ${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  }
  
  const catsFound = [];
  
  if (channel.id === 'backroom') {
    if (state.data.retiredCats) {
      state.data.retiredCats.forEach(cat => {
        catsFound.push({ name: cat.name, status: 'Resting' });
      });
    }
  } else {
    if (state.data.activeCats) {
      state.data.activeCats.forEach(cat => {
        let catRoom = 'living-room';
        if (currentRoom === 'school') {
          catRoom = 'school';
        } else if (currentRoom === 'bath-area') {
          catRoom = 'bath-area';
        } else if (currentRoom === 'phone-room') {
          catRoom = state.data.doorOpen ? 'phone-room' : 'living-room';
        }
        
        if (channel.room === catRoom) {
          let status = 'Idling';
          if (catRoom === 'school' && cat.status === 'studying') status = 'Studying';
          else if (catRoom === 'bath-area') status = 'Bathing';
          else if (cat.happy < 40) status = 'Bored';
          else if (cat.energy < 30) status = 'Tired';
          
          catsFound.push({ name: cat.name, status: status });
        }
      });
    }
  }

  let blueprintSVG = '';
  
  if (channel.id === 'bedroom') {
    blueprintSVG = `
      <rect x="15" y="8" width="22" height="34" fill="none" stroke="#2ecc71" stroke-width="1" stroke-dasharray="2,2" />
      <rect x="15" y="8" width="22" height="8" fill="none" stroke="#2ecc71" stroke-width="1" />
      <rect x="65" y="10" width="20" height="15" fill="none" stroke="#2ecc71" stroke-width="1" />
      <line x1="10" y1="42" x2="90" y2="42" stroke="#2ecc71" stroke-width="0.8" stroke-dasharray="1,3" />
    `;
  } else if (channel.id === 'living') {
    blueprintSVG = `
      <rect x="20" y="28" width="60" height="14" rx="3" fill="none" stroke="#2ecc71" stroke-width="1" />
      <rect x="35" y="5" width="30" height="6" fill="none" stroke="#2ecc71" stroke-width="1" />
      <circle cx="50" cy="20" r="10" fill="none" stroke="#2ecc71" stroke-width="0.8" stroke-dasharray="2,2" />
    `;
  } else if (channel.id === 'bath') {
    blueprintSVG = `
      <rect x="15" y="10" width="32" height="18" rx="8" fill="none" stroke="#2ecc71" stroke-width="1" />
      <circle cx="75" cy="18" r="6" fill="none" stroke="#2ecc71" stroke-width="1" />
      <line x1="5" y1="36" x2="95" y2="36" stroke="#2ecc71" stroke-width="0.5" opacity="0.5" />
      <line x1="30" y1="30" x2="30" y2="42" stroke="#2ecc71" stroke-width="0.5" opacity="0.5" />
      <line x1="60" y1="30" x2="60" y2="42" stroke="#2ecc71" stroke-width="0.5" opacity="0.5" />
    `;
  } else if (channel.id === 'backroom') {
    blueprintSVG = `
      <circle cx="30" cy="20" r="8" fill="none" stroke="#2ecc71" stroke-width="1" />
      <circle cx="30" cy="20" r="4" fill="none" stroke="#2ecc71" stroke-width="0.5" stroke-dasharray="2,1" />
      <rect x="60" y="15" width="22" height="20" rx="4" fill="none" stroke="#2ecc71" stroke-width="1" />
    `;
  } else if (channel.id === 'school') {
    blueprintSVG = `
      <rect x="15" y="15" width="26" height="16" fill="none" stroke="#2ecc71" stroke-width="1" />
      <rect x="58" y="15" width="26" height="16" fill="none" stroke="#2ecc71" stroke-width="1" />
      <circle cx="28" cy="8" r="3" fill="none" stroke="#2ecc71" stroke-width="0.8" />
      <circle cx="71" cy="8" r="3" fill="none" stroke="#2ecc71" stroke-width="0.8" />
    `;
  }

  let catsSVG = '';
  if (catsFound.length === 0) {
    catsSVG = `
      <text x="50" y="27" fill="#2ecc71" font-size="5" text-anchor="middle" font-family="monospace" opacity="0.7">
        NO ACTIVITY DETECTED
      </text>
    `;
  } else {
    catsFound.forEach((cat, idx) => {
      const cx = catsFound.length === 1 ? 50 : (28 + idx * 44);
      const cy = 25;
      
      catsSVG += `
        <g transform="translate(${cx}, ${cy})">
          <circle cx="0" cy="0" r="8" fill="none" stroke="#2ecc71" stroke-width="0.6" opacity="0.4">
            <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="3" fill="#2ecc71" />
          <rect x="-24" y="6" width="48" height="10" rx="2" fill="#000" stroke="#2ecc71" stroke-width="0.8" />
          <text x="0" y="11.5" fill="#2ecc71" font-size="3.8" font-weight="bold" font-family="monospace" text-anchor="middle">
            ${cat.name}
          </text>
          <text x="0" y="14.5" fill="#2ecc71" font-size="2.6" font-family="monospace" text-anchor="middle" opacity="0.8">
            [${cat.status.toUpperCase()}]
          </text>
        </g>
      `;
    });
  }

  const finalSVG = `
    <svg viewBox="0 0 100 50" width="100%" height="100%">
      ${blueprintSVG}
      ${catsSVG}
    </svg>
  `;
  
  container.innerHTML = finalSVG;
}

// --- GENERAL UI MODAL CLOSE EVENTS ---
document.querySelectorAll('.close-modal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    
    // Stop minigame if closing
    if (minigameActive) endMinigame();

    // Clear background loops from apps
    if (typeof cattubeVideoInterval !== 'undefined' && cattubeVideoInterval) {
      clearInterval(cattubeVideoInterval);
      cattubeVideoInterval = null;
    }
    if (typeof meowtifyAudioInterval !== 'undefined' && meowtifyAudioInterval) {
      clearInterval(meowtifyAudioInterval);
      meowtifyAudioInterval = null;
      meowtifyActiveTrack = null;
    }
    if (typeof securityCamTickInterval !== 'undefined' && securityCamTickInterval) {
      clearInterval(securityCamTickInterval);
      securityCamTickInterval = null;
    }
    stopPhoneRingingSound();
  });
});

// Sound controls
document.getElementById('audio-toggle-btn').addEventListener('click', () => {
  const isMuted = audio.toggle();
  const btn = document.getElementById('audio-toggle-btn');
  btn.textContent = isMuted ? '🔇' : '🔊';
  showToast(isMuted ? 'Muted sound' : 'Enabled sound');
});


// --- 🔓 LOCK SCREEN SYSTEM ---

function updateLockScreenUI() {
  const timeEl = document.getElementById('phone-lockscreen-time');
  const dateEl = document.getElementById('phone-lockscreen-date');
  const notifContainer = document.getElementById('phone-lockscreen-notifications');
  
  if (timeEl) {
    timeEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  }
  
  if (dateEl && state.data) {
    const y = state.data.year || 1;
    const m = state.data.month || 1;
    const d = state.data.day || 1;
    const months = ['Meow-rch', 'Purr-il', 'May-ow', 'June-ip', 'July-cat', 'Aug-hiss', 'Sept-claw', 'Oct-tail', 'Nov-ear', 'Dec-paw', 'Jan-mew', 'Feb-purr'];
    const monthName = months[(m - 1) % 12];
    dateEl.textContent = `Year ${y} • ${monthName} • Day ${d}`;
  }

  if (notifContainer && state.data) {
    notifContainer.innerHTML = '';
    
    const notifs = [
      { app: '💬 Messages', icon: '🐱', content: `Luna: "I'd love some fresh salmon! 🐾"` },
      { app: '🏃 CatFit', icon: '👟', content: `Daily Total: ${(state.data.catSteps || 1040).toLocaleString()} steps tracked!` }
    ];
    
    if (state.data.coins < 15) {
      notifs.push({ app: '🛒 Meow-zon', icon: '🪙', content: 'Bank alert: low coin balance! Play minigames to earn!' });
    } else {
      notifs.push({ app: '📿 Collar Maker', icon: '💎', content: 'Design collars for your cats in the Craft Studio!' });
    }
    
    notifs.forEach(notif => {
      const card = document.createElement('div');
      card.style.cssText = "background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); border-radius: 12px; padding: 6px 10px; display: flex; flex-direction: column; gap: 2px; border: 1px solid rgba(255, 255, 255, 0.1); box-sizing: border-box;";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.5rem; font-weight:800; color:#e0f7fa; text-transform:uppercase;">
          <span>${notif.app}</span>
          <span>Just Now</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
          <span style="font-size:0.8rem;">${notif.icon}</span>
          <span style="font-size:0.55rem; color:#fff; line-height:1.2;">${notif.content}</span>
        </div>
      `;
      notifContainer.appendChild(card);
    });
  }
}

document.getElementById('phone-lockscreen-unlock-btn').addEventListener('click', () => {
  audio.playPhoneTone(523, 659, 0.08);
  setTimeout(() => {
    if (!audio.muted) audio.playPhoneTone(784, 1047, 0.08);
  }, 80);
  switchPhoneView('home');
});


// --- INITIALIZATION ON LAUNCH ---
window.onload = () => {
  // If active profile matches list, proceed, else load profiles screen
  if (state.activeProfile && state.profiles.includes(state.activeProfile)) {
    state.loadProfile(state.activeProfile);
    updateBedroomFurnitureUI();
    adjustRoomFurnitureVisibility(currentRoom);
    updateWallClock();
    setInterval(updateWallClock, 1000);
    if (state.data.activeCats.length === 0) {
      Views.switch('breeding-screen');
    } else {
      Views.switch('game-screen');
      setTimeout(triggerRandomIncomingCall, 25000);
    }
  } else {
    Views.switch('profile-screen');
  }
};
