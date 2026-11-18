'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ✏️ EDIT THIS: make the site yours */
const CONFIG = {
  myName: 'Your Name',
  message: 'Your wish made my day brighter. Truly, I’m grateful to have you in my life, and I hope I get to celebrate with you too!',
  secret: 'Surprise! Treat’s on me next time we meet. 🍰',
  memories: ['🎈', '🎂', '🎁', '🥳', '🎉', '💌'], // swap for <img> tags if you like
  counters: [
    { label: 'Wishes received', to: 100, suffix: '+' },
    { label: 'Cake slices eaten', to: 3 },
    { label: 'Smiles', to: 999, suffix: '+' },
  ],
};

const COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f1c'];
const clean = (s) => (s || '').replace(/[<>]/g, '').trim().slice(0, 30);

const burst = (o = {}) => confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, ...o });
const rain = () => {
  const end = Date.now() + 2200;
  (function f() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(f);
  })();
};

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
  }, [params]);
  const save = (v) => {
    const n = clean(v) || 'Friend';
    try { localStorage.setItem('visitorName', n); } catch {}
    setName(n);
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
        <input autoFocus placeholder="Type your name" value={v} onChange={(e) => setV(e.target.value)} />
        <button className="btn" type="submit">Let’s go 🎉</button>
      </motion.form>
    </motion.div>
  );
}

function Balloons() {
  const [b, setB] = useState([]);
  useEffect(() => {
    setB(Array.from({ length: 14 }, (_, i) => ({
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
      s.textContent = ['✨', '⭐', '💖'][Math.floor(Math.random() * 3)];
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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ delay: 0.1, duration: 1 }} style={{ fontSize: '5rem' }}>🎂</motion.div>
        <h1><Letters text="Thank you, " /><Letters text={`${name}!`} className="name" /></h1>
        <motion.p className="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          Your birthday wish made my day. ✨
        </motion.p>
      </motion.div>
      <div className="arrow">👇</div>
    </section>
  );
}

function Message({ name }) {
  return (
    <section>
      <motion.div className="card" initial={{ opacity: 0, y: 80, rotate: -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ type: 'spring', bounce: 0.35, duration: 1 }}>
        <h2>Dear <b>{name}</b> 💌</h2>
        <p>{CONFIG.message}</p>
        <p style={{ marginTop: 20 }}>— {CONFIG.myName}</p>
      </motion.div>
    </section>
  );
}

function Memories() {
  return (
    <section>
      <h2>Little moments 📸</h2>
      <div className="grid">
        {CONFIG.memories.map((m, i) => (
          <motion.div key={i} className="tile"
            initial={{ opacity: 0, scale: 0.4, rotate: i % 2 ? 15 : -15 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.12, rotate: i % 2 ? -6 : 6 }} whileTap={{ scale: 0.9 }}
            onClick={() => burst({ particleCount: 40, spread: 60 })}
          >{m}</motion.div>
        ))}
      </div>
    </section>
  );
}

function Counter({ to, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <div ref={ref}>
      <div className="num">{v}{suffix}</div>
      <div className="sub" style={{ marginTop: 0 }}>{label}</div>
    </div>
  );
}

const Counters = () => (
  <section>
    <h2>Birthday by the numbers 🔢</h2>
    <div className="counters">{CONFIG.counters.map((c) => <Counter key={c.label} {...c} />)}</div>
  </section>
);

function Gift() {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <h2>One more thing… 🎁</h2>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button key="c" className="gift" aria-label="Open the gift"
            animate={{ rotate: [0, -8, 8, -8, 8, 0], y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 1.2, repeatDelay: 1.5 }}
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} exit={{ scale: 2, opacity: 0 }}
            onClick={() => { setOpen(true); rain(); }}
          >🎁</motion.button>
        ) : (
          <motion.div key="o" className="card" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <div style={{ fontSize: '4rem' }}>💝</div>
            <p>{CONFIG.secret}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {!open && <p className="sub">Tap to open</p>}
    </section>
  );
}

function PopGame() {
  const [score, setScore] = useState(0);
  const [bals, setBals] = useState([]);
  const mk = (id) => ({ id, x: 3 + Math.random() * 88, y: 5 + Math.random() * 70, c: COLORS[Math.floor(Math.random() * COLORS.length)], d: Math.random() * 2 });
  useEffect(() => { setBals(Array.from({ length: 10 }, (_, i) => mk(i))); }, []);
  const pop = (b, e) => {
    const r = e.currentTarget.getBoundingClientRect();
    confetti({ particleCount: 30, spread: 70, startVelocity: 22, colors: [b.c], origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight } });
    setScore((s) => { if ((s + 1) % 15 === 0) rain(); return s + 1; });
    setBals((a) => a.filter((x) => x.id !== b.id).concat(mk(Date.now() + Math.random())));
  };
  return (
    <section>
      <h2>Pop the balloons! 🎈</h2>
      <div className="play">
        <AnimatePresence>
          {bals.map((b) => (
            <motion.button key={b.id} className="pop" aria-label="Pop balloon" style={{ left: `${b.x}%`, top: `${b.y}%`, background: b.c }}
              initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -16, 0] }}
              transition={{ scale: { type: 'spring' }, y: { repeat: Infinity, duration: 2 + b.d, ease: 'easeInOut' } }}
              exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.15 } }}
              whileHover={{ scale: 1.15 }} onClick={(e) => pop(b, e)}
            />
          ))}
        </AnimatePresence>
      </div>
      <p className="score">Popped: {score} {score >= 15 ? '🏆 Legend!' : score >= 5 ? '🔥 Nice!' : ''}</p>
    </section>
  );
}

function Footer({ name }) {
  const hug = () => {
    const heart = confetti.shapeFromText({ text: '💖', scalar: 3 });
    confetti({ shapes: [heart], scalar: 3, particleCount: 40, spread: 120, startVelocity: 35, origin: { y: 0.7 } });
  };
  return (
    <section style={{ minHeight: '70vh' }}>
      <motion.h2 initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
        Thanks again, {name}! <span className="heart">❤️</span>
      </motion.h2>
      <button className="btn" onClick={hug}>Send a virtual hug 🤗</button>
      <p className="sub">With love, {CONFIG.myName}</p>
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
          <Counters />
          <Gift />
          <PopGame />
          <Footer name={name} />
        </main>
      )}
    </>
  );
}
