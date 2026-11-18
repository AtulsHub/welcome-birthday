'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ✏️ EDIT THIS: make the site yours */
const CONFIG = {
  myName: 'Atul Sharma',
  message: 'Your wish made my day brighter. Truly, I’m grateful to have you in my life, and I hope I get to celebrate with you too!',
  memories: ['🎈', '🎂', '🎁', '🥳', '🎉', '📬'], // swap for <img> tags if you like
  prizes: [
    'A virtual high-five (valid anywhere, no contact needed) 🙌',
    'One free ‘I remembered your birthday’ certificate 📜, Of course if you wished 😁😁',
    'A virtual cake slice (calories: 0) 🍰',
    'Priority seating at my next birthday (back row, I’m not fancy) 🪑',
    'A free pass to eat my share of cake 🎂',
    'A gold star for being in the tiny group who wished me ⭐, If you wished 😁',
    'Lifetime membership to my ‘Thank You’ club (no meetings) 🎟️',
    'My inbox says thank you. It was very lonely. 📭',
    'One free ‘I owe you a treat’ coupon (terms and conditions apply) 🍕',
    'A standing ovation from my notification sound 🔔',
  ],
  boxTaps: 3,
};

const COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f1c'];
const clean = (s) => (s || '').replace(/[<>]/g, '').trim().slice(0, 30);

const registerVisitor = async (name, action) => {
  try {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitorId', visitorId);
    }
    const response = await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, visitorId, action }),
    });
    if (!response.ok) throw new Error(`Visitor tracking failed with status ${response.status}`);
  } catch (error) {
    console.error('Could not track visitor activity:', error);
  }
};

const burst = (o = {}) => confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, ...o });

/* Name comes from ?name=Rahul, then localStorage, then a prompt */
function useVisitorName() {
  const params = useSearchParams();
  const [name, setName] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let n = clean(params.get('name'));
    if (!n) { try { n = clean(localStorage.getItem('visitorName')); } catch {} }
    setName(n || null);
    setReady(true);
    if (n) registerVisitor(n);
  }, [params]);
  const save = (v) => {
    const n = clean(v) || 'Friend';
    try { localStorage.setItem('visitorName', n); } catch {}
    setName(n);
    registerVisitor(n);
  };
  return { name, ready, save };
}

function NamePrompt({ onSave }) {
  const [v, setV] = useState('');
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form
        initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5 }}
        onSubmit={(e) => { e.preventDefault(); onSave(v); }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: '4rem' }}>👋</div>
        <h2>Hey, who’s this?</h2>
        <input autoFocus placeholder="Your name (or royal title)" value={v} onChange={(e) => setV(e.target.value)} />
        <div className="prompt-actions">
          <button className="btn" type="submit">Let’s go 🎉</button>
          <button className="text-btn" type="button" onClick={() => onSave('Friend')}>Skip for now</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function Balloons() {
  const [b, setB] = useState([]);
  useEffect(() => {
    setB(Array.from({ length: 8 }, (_, i) => ({
      left: Math.random() * 95, s: 40 + Math.random() * 50, c: COLORS[i % COLORS.length],
      d: 14 + Math.random() * 14, dl: -Math.random() * 20,
    })));
  }, []);
  return b.map((x, i) => (
    <span key={i} className="balloon" style={{ left: `${x.left}%`, '--s': `${x.s}px`, '--c': x.c, '--d': `${x.d}s`, '--dl': `${x.dl}s` }} />
  ));
}

function SparkleTrail() {
  useEffect(() => {
    const on = (e) => {
      if (e.pointerType !== 'mouse' || Math.random() > 0.35) return;
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = ['✨', '⭐', '🎉'][Math.floor(Math.random() * 3)];
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    };
    window.addEventListener('pointermove', on);
    return () => window.removeEventListener('pointermove', on);
  }, []);
  return null;
}

const Letters = ({ text, className }) =>
  [...text].map((c, i) => (
    <motion.span
      key={i} className={className} style={{ display: 'inline-block', whiteSpace: 'pre' }}
      initial={{ y: 80, opacity: 0, rotate: -25 }} animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 220, damping: 11 }}
    >{c}</motion.span>
  ));

function Hero({ name }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 140]);
  const o = useTransform(scrollY, [0, 500], [1, 0]);
  return (
    <section>
      <motion.div style={{ y, opacity: o }}>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          Official birthday-wish appreciation department
        </motion.p>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ delay: 0.1, duration: 1 }} style={{ fontSize: '5rem' }}>🎂</motion.div>
        <h1><Letters text="Thank you, " /><Letters text={`${name}!`} className="name" /></h1>
        <motion.p className="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          Your birthday wish made my day. My cake has also asked me to say thanks. ✨
        </motion.p>
        <button className="btn hero-cta" onClick={() => document.getElementById('gift')?.scrollIntoView({ behavior: 'smooth' })}>
          Skip to the highly important gift ↓
        </button>
      </motion.div>
      <div className="arrow">👇</div>
    </section>
  );
}

function Message({ name }) {
  return (
    <section>
      <motion.div className="card" initial={{ opacity: 0, y: 80, rotate: -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ type: 'spring', bounce: 0.35, duration: 1 }}>
        <h2>Dear <b>{name}</b> 🎉</h2>
        <p>{CONFIG.message}</p>
        <p style={{ marginTop: 20 }}>— {CONFIG.myName}</p>
      </motion.div>
    </section>
  );
}

function Memories() {
  const [caption, setCaption] = useState('Tap a tile. Make a tiny bit of confetti chaos.');
  const captions = [
    'A balloon! Much less expensive than therapy.',
    'Cake: the real reason birthdays exist.',
    'A gift! I promise I did not wrap leftovers.',
    'Certified party legend detected.',
    'That is the sound of my neighbors judging the noise.',
    'A heartfelt message. No glitter in the envelope, probably.',
  ];

  return (
    <section>
      <p className="eyebrow">A very serious collection</p>
      <h2>Little moments 📸</h2>
      <div className="grid">
        {CONFIG.memories.map((m, i) => (
          <motion.button key={i} type="button" className="tile" aria-label={`Celebrate memory ${i + 1}: ${m}`}
            initial={{ opacity: 0, scale: 0.4, rotate: i % 2 ? 15 : -15 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.12, rotate: i % 2 ? -6 : 6 }} whileTap={{ scale: 0.9 }}
            onClick={() => {
              setCaption(captions[i % captions.length]);
              const shape = confetti.shapeFromText({ text: m, scalar: 3 });
              confetti({ shapes: [shape], scalar: 3, particleCount: 40, spread: 60 });
            }}
          >{m}</motion.button>
        ))}
      </div>
      <motion.p key={caption} className="memory-caption" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
        {caption}
      </motion.p>
    </section>
  );
}

function GiftBox({ taps, opening, reducedMotion, onTap }) {
  const bubbles = [
    'Hehe, nice try 🙃',
    'Okay okay, almost 👀',
    'I hope I remembered to put something in here 😅',
  ];
  const shake = reducedMotion
    ? { x: 0, rotate: 0 }
    : opening
      ? { x: [0, -8, 9, -7, 0], rotate: [0, -3, 3, -2, 0] }
      : taps === 1
        ? { x: [0, -4, 4, -3, 0], rotate: [0, -1.5, 1.5, 0] }
        : taps === 2
          ? { x: [0, -10, 11, -8, 7, 0], rotate: [0, -4, 4, -3, 2, 0] }
          : { x: 0, rotate: 0 };
  const remaining = Math.max(CONFIG.boxTaps - taps, 0);

  return (
    <div className="gift-box-stage">
      <AnimatePresence mode="wait">
        {taps > 0 && (
          <motion.p key={taps} className="gift-speech"
            initial={{ opacity: 0, y: 12, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
          >{bubbles[taps - 1]}</motion.p>
        )}
      </AnimatePresence>
      <motion.button type="button" className={`gift-box-button${opening ? ' is-opening' : ''}`}
        aria-label={`Tap the stubborn gift box, ${remaining} taps remaining`}
        disabled={opening}
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0, ...shake }}
        transition={reducedMotion ? { duration: 0 } : { duration: opening ? 0.65 : 0.42, type: opening ? 'spring' : 'tween', stiffness: 150, damping: 9 }}
        whileHover={!reducedMotion ? { scale: 1.04 } : undefined}
        whileTap={!reducedMotion ? { scale: 0.96 } : undefined}
        onClick={onTap}
      >
        <svg className="gift-box-svg" viewBox="0 0 240 200" role="presentation">
          <ellipse cx="120" cy="183" rx="91" ry="10" fill="rgba(74,24,76,.18)" />
          <rect x="30" y="77" width="180" height="105" rx="10" fill="#d92e68" />
          <path d="M40 89h160v82H40z" fill="#ee477e" opacity=".55" />
          <motion.g className="gift-box-ribbon"
            initial={{ opacity: 1, scaleY: 1 }}
            animate={opening ? { opacity: 0, scaleY: 0.2 } : { opacity: 1, scaleY: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.38 }}
            style={{ transformOrigin: 'center' }}
          >
            <rect x="105" y="76" width="30" height="106" fill="#ffe17b" />
            <rect x="30" y="116" width="180" height="22" fill="#ffe17b" />
            <path d="M106 78h28v102h-28z" fill="#fff0b0" opacity=".5" />
          </motion.g>
          <motion.g className="gift-box-lid"
            initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
            style={{ transformOrigin: '120px 68px' }}
            animate={opening ? (reducedMotion ? { opacity: 0 } : { y: -115, x: 18, rotate: 25, opacity: 0 }) : { y: 0, x: 0, rotate: 0, opacity: 1 }}
            transition={opening && !reducedMotion ? { type: 'spring', stiffness: 120, damping: 8, duration: 0.7 } : { duration: 0.2 }}
          >
            <rect x="20" y="54" width="200" height="32" rx="8" fill="#ff5c8d" />
            <rect x="105" y="54" width="30" height="32" fill="#ffe17b" />
            <motion.g className="gift-box-bow"
              style={{ transformOrigin: '120px 58px' }}
              animate={opening ? { rotate: -30, y: -8 } : taps >= 2 ? { rotate: 18, x: 3, scale: 0.88 } : { rotate: 0, x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 10 }}
            >
              <path d="M120 59C91 21 68 45 108 68 78 73 94 94 120 72 146 94 162 73 132 68 172 45 149 21 120 59Z" fill="#ffe89a" stroke="#e2aa32" strokeWidth="3" />
              <circle cx="120" cy="68" r="8" fill="#fff4c4" />
            </motion.g>
          </motion.g>
        </svg>
      </motion.button>
      <p className="gift-progress" aria-live="polite">
        {opening ? 'Opening… please stand back from my questionable engineering.' : `${remaining} more tap${remaining === 1 ? '' : 's'}`}
      </p>
    </div>
  );
}

function ScratchPrize({ prize, onReveal }) {
  const canvasRef = useRef(null);
  const lastPointRef = useRef(null);
  const drawingRef = useRef(false);
  const checkFrameRef = useRef(null);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context) return undefined;

    const paintSurface = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f4cf67');
      gradient.addColorStop(0.5, '#d6a53c');
      gradient.addColorStop(1, '#f8df91');
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'rgba(86, 54, 18, .8)';
      context.font = '700 14px sans-serif';
      context.textAlign = 'center';
      context.fillText('SCRATCH TO REVEAL ✨', width / 2, height / 2 + 5);
    };

    paintSurface();
    window.addEventListener('resize', paintSurface);
    return () => {
      window.removeEventListener('resize', paintSurface);
      if (checkFrameRef.current !== null) window.cancelAnimationFrame(checkFrameRef.current);
    };
  }, [prize]);

  const reveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    setRevealed(true);
    onReveal();
  };

  const checkScratchCoverage = () => {
    if (checkFrameRef.current !== null || revealedRef.current) return;
    checkFrameRef.current = window.requestAnimationFrame(() => {
      checkFrameRef.current = null;
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      let samples = 0;
      for (let index = 3; index < pixels.length; index += 32) {
        samples += 1;
        if (pixels[index] < 64) transparent += 1;
      }
      if (samples > 0 && transparent / samples >= 0.6) reveal();
    });
  };

  const scratch = (event) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || revealedRef.current) return;
    const bounds = canvas.getBoundingClientRect();
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 30;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    if (lastPointRef.current) {
      context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      context.lineTo(point.x, point.y);
    } else {
      context.arc(point.x, point.y, 15, 0, Math.PI * 2);
    }
    context.stroke();
    lastPointRef.current = point;
    checkScratchCoverage();
  };

  return (
    <div className={`gift-scratch-area${revealed ? ' is-revealed' : ''}`}>
      <p className="gift-prize-text">{prize}</p>
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="gift-scratch-canvas"
          aria-label="Scratch to reveal your prize"
          onPointerDown={(event) => {
            drawingRef.current = true;
            lastPointRef.current = null;
            event.currentTarget.setPointerCapture(event.pointerId);
            scratch(event);
          }}
          onPointerMove={(event) => {
            if (drawingRef.current) scratch(event);
          }}
          onPointerUp={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
            checkScratchCoverage();
          }}
          onPointerCancel={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
          }}
        />
      )}
      {!revealed && <button className="gift-scratch-skip" type="button" onClick={reveal}>Too impatient? Reveal it</button>}
    </div>
  );
}

function GoldenTicket({ name, prize, ticketNumber, reducedMotion, onScratch }) {
  return (
    <div className="gift-reveal-stage">
      {!reducedMotion && (
        <motion.div className="gift-rays" aria-hidden="true"
          initial={{ opacity: 0, rotate: -20, scale: 0.65 }}
          animate={{ opacity: [0, 0.85, 0.55], rotate: 35, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      )}
      <motion.article className="golden-ticket" aria-label="Your golden thank-you ticket"
        initial={reducedMotion ? false : { opacity: 0, y: 110, scale: 0.7, rotate: 8, rotateY: 95 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, rotateY: 0 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 14, delay: 0.15 }}
      >
        <div className="gift-ticket-heading">
          <span>GOLDEN THANK-YOU PASS</span>
          <span>#{ticketNumber}</span>
        </div>
        <p className="gift-ticket-name">{name}</p>
        <p className="gift-ticket-label">Your extremely official prize:</p>
        <ScratchPrize prize={prize} onReveal={onScratch} />
        <p className="gift-ticket-valid">Valid for: one lifetime of gratitude. No refunds.</p>
      </motion.article>
    </div>
  );
}

function Gift({ name }) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState('box');
  const [taps, setTaps] = useState(0);
  const [prizeIndex, setPrizeIndex] = useState(null);
  const [ticketNumber, setTicketNumber] = useState('0000');
  const [giftsOpened, setGiftsOpened] = useState(0);
  const [prizeRevealed, setPrizeRevealed] = useState(false);

  useEffect(() => {
    if (stage !== 'opening') return undefined;
    const timer = setTimeout(() => {
      setStage('ticket');
      setGiftsOpened((count) => count + 1);
      registerVisitor(name, 'gift-opened');
    }, reducedMotion ? 0 : 850);
    return () => clearTimeout(timer);
  }, [stage, reducedMotion, name]);

  useEffect(() => {
    if (stage === 'ticket' && !reducedMotion) burst({ particleCount: 90, spread: 110, origin: { y: 0.65 } });
  }, [stage, reducedMotion]);

  const choosePrize = (previousIndex) => {
    const choices = CONFIG.prizes.map((_, index) => index).filter((index) => index !== previousIndex);
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const tapBox = () => {
    const nextTap = taps + 1;
    setTaps(nextTap);
    if (nextTap === CONFIG.boxTaps) {
      setPrizeIndex(choosePrize(prizeIndex));
      setTicketNumber(String(Math.floor(Math.random() * 10000)).padStart(4, '0'));
      setPrizeRevealed(false);
      setStage('opening');
    }
  };

  const replay = () => {
    setTaps(0);
    setPrizeRevealed(false);
    setStage('box');
  };

  const finishScratch = () => {
    setPrizeRevealed(true);
    if (!reducedMotion) burst({ particleCount: 45, spread: 75, origin: { y: 0.72 } });
  };

  return (
    <section id="gift" className="gift-section">
      <p className="eyebrow">I definitely planned this gift. Definitely.</p>
      <h2>One more thing… 🎁</h2>
      <AnimatePresence mode="wait" initial={false}>
        {stage !== 'ticket' ? (
          <motion.div key="box-stage" className="gift-stage-panel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
            <GiftBox taps={taps} opening={stage === 'opening'} reducedMotion={reducedMotion} onTap={tapBox} />
          </motion.div>
        ) : (
          <motion.div key="ticket-stage" className="gift-stage-panel" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
            <GoldenTicket
              name={name}
              prize={CONFIG.prizes[prizeIndex]}
              ticketNumber={ticketNumber}
              reducedMotion={reducedMotion}
              onScratch={finishScratch}
            />
            <div className="gift-replay">
              <button type="button" className="btn gift-replay-button" onClick={replay}>Open another gift 🎁</button>
              <p>Gifts opened: {giftsOpened}{prizeRevealed ? ' · Prize revealed!' : ''}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Footer({ name }) {
  const [cheered, setCheered] = useState(false);
  const cheer = () => {
    const cake = confetti.shapeFromText({ text: '🍰', scalar: 3 });
    const party = confetti.shapeFromText({ text: '🎉', scalar: 3 });
    confetti({ shapes: [cake, party], scalar: 3, particleCount: 40, spread: 120, startVelocity: 35, origin: { y: 0.7 } });
    setCheered(true);
    registerVisitor(name, 'cheer-sent');
  };
  return (
    <section style={{ minHeight: '70vh' }}>
      <motion.h2 initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
        Thanks again, {name}! 🎉
      </motion.h2>
      <button className="btn" onClick={cheer}>Send a virtual cake slice 🍰</button>
      <AnimatePresence>
        {cheered && (
          <motion.p className="cheer-reaction" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            Cake slice launched. My kitchen remains untouched. 🍰
          </motion.p>
        )}
      </AnimatePresence>
      <p className="sub">With thanks, {CONFIG.myName}</p>
    </section>
  );
}

export default function Site() {
  const { name, ready, save } = useVisitorName();
  const welcomed = useRef(false);
  useEffect(() => {
    if (name && !welcomed.current) { welcomed.current = true; setTimeout(() => burst(), 500); }
  }, [name]);
  return (
    <>
      <Balloons />
      <SparkleTrail />
      <AnimatePresence>{ready && !name && <NamePrompt onSave={save} />}</AnimatePresence>
      {name && (
        <main>
          <Hero name={name} />
          <Message name={name} />
          <Memories />
          <Gift name={name} />
          <Footer name={name} />
        </main>
      )}
    </>
  );
}
