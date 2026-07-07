import React, { useState, useMemo, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, ArrowRight, Check, Instagram } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Dados                                                              */
/* ------------------------------------------------------------------ */

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

const PRODUCTS = [
  { id: "p1", name: "Anel Aurora", brand: "Studio Vero", category: "Anéis", price: 389, tone: "bronze", featured: true,
    img: asset("anel-aurora.png") },
  { id: "p2", name: "Colar Riacho", brand: "Terra Alta", category: "Colares", price: 459, tone: "patina",
    img: asset("colar-riacho.png") },
  { id: "p3", name: "Anel Duna", brand: "Atelier Lume", category: "Anéis", price: 349, tone: "patina",
    img: asset("anel-duna.png") },
  { id: "p4", name: "Colar Coroa", brand: "Cindra Joias", category: "Colares", price: 529, tone: "bronze",
    img: asset("colar-coroa.png") },
  { id: "p5", name: "Anel Oliva", brand: "Anta Studio", category: "Anéis", price: 419, tone: "bronze",
    img: asset("anel-oliva.png") },
  { id: "p6", name: "Colar Petra", brand: "Alma Rara", category: "Colares", price: 379, tone: "patina",
    img: asset("colar-petra.png") },
  { id: "p7", name: "Anel Talismã", brand: "Atelier Lume", category: "Anéis", price: 459, tone: "patina",
    img: asset("anel-talisma.png") },
];

const BRANDS = ["Studio Vero", "Atelier Lume", "Terra Alta", "Cindra Joias", "Anta Studio", "Alma Rara"];
const CATEGORIES = ["Todos", ...new Set(PRODUCTS.map((product) => product.category))];
const CATEGORY_COUNTS = CATEGORIES.reduce((counts, category) => {
  counts[category] = category === "Todos"
    ? PRODUCTS.length
    : PRODUCTS.filter((product) => product.category === category).length;
  return counts;
}, {});

const currency = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ------------------------------------------------------------------ */
/*  Ilustrações (SVG próprio — não depende de imagens externas)        */
/* ------------------------------------------------------------------ */

const RingIcon = ({ stroke }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="60" r="27" stroke={stroke} strokeWidth="2.5" />
    <path d="M38 33 L50 13 L62 33 L55 41 L45 41 Z" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

const NecklaceIcon = ({ stroke }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18 C16 54 84 54 84 18" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 54 C41 54 35 61 35 70 C35 80 42 87 50 93 C58 87 65 80 65 70 C65 61 59 54 50 54 Z" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

const ICONS = { Anéis: RingIcon, Colares: NecklaceIcon };

function ArtPanel({ tone = "bronze", className = "", children }) {
  return <div className={`auri-art auri-art-${tone} ${className}`}>{children}</div>;
}

function ProductMedia({ src, tone, category, alt, className = "", eager = false }) {
  const [failed, setFailed] = useState(false);
  const Icon = ICONS[category] || RingIcon;
  const categoryClass = category === "Colares" ? "auri-photo-colares" : "auri-photo-aneis";
  if (failed || !src) {
    return (
      <ArtPanel tone={tone} className={className}>
        <Icon stroke="#221F1B" />
      </ArtPanel>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`auri-photo ${categoryClass} ${className}`}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Estilos globais                                                    */
/* ------------------------------------------------------------------ */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

    html { scroll-behavior: smooth; }
    body { margin: 0; background: #171411; }
    #root { min-height: 100%; }

    .auri {
      --paper: #EFE9DD;
      --paper-2: #F8F5EE;
      --ink: #221F1B;
      --ink-soft: #514B42;
      --bronze: #A9754A;
      --bronze-dark: #8A5D38;
      --patina: #4C5C46;
      --patina-light: #6B7D64;
      --line: rgba(34,31,27,0.14);
      --gold: #C9A961;

      background: var(--paper);
      color: var(--ink);
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .auri * { box-sizing: border-box; }

    .auri h1, .auri h2, .auri h3, .auri .disp {
      font-family: 'Italiana', serif;
      font-weight: 400;
      letter-spacing: 0.02em;
      line-height: 1.08;
      margin: 0;
    }

    .auri .eyebrow {
      font-family: 'Jost', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      font-size: 11px;
      font-weight: 500;
      color: var(--bronze-dark);
    }

    .auri a { color: inherit; text-decoration: none; }
    .auri button { font-family: inherit; cursor: pointer; }

    .auri-wrap { max-width: 1240px; margin: 0 auto; padding: 0 28px; }

    /* ---------- nav ---------- */
    .auri-nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(239,233,221,0.92);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--line);
    }
    .auri-nav-inner {
      max-width: 1240px; margin: 0 auto; padding: 18px 28px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .auri-logo { font-family: 'Italiana', serif; font-size: 26px; letter-spacing: 0.14em; }
    .auri-nav-links { display: flex; gap: 34px; font-size: 13px; letter-spacing: 0.04em; }
    .auri-nav-links a { position: relative; padding-bottom: 3px; }
    .auri-nav-links a::after {
      content: ''; position: absolute; left: 0; bottom: 0; height: 1px; width: 0%;
      background: var(--bronze); transition: width 0.25s ease;
    }
    .auri-nav-links a:hover::after { width: 100%; }
    .auri-cart-btn {
      position: relative; display: flex; align-items: center; gap: 8px;
      background: var(--ink); color: var(--paper-2); border: none;
      padding: 10px 16px; border-radius: 2px; font-size: 12px; letter-spacing: 0.08em;
      text-transform: uppercase; transition: background 0.2s ease;
    }
    .auri-cart-btn:hover { background: var(--bronze-dark); }
    .auri-cart-badge {
      position: absolute; top: -7px; right: -7px; background: var(--patina);
      color: #fff; font-size: 10px; width: 18px; height: 18px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-family: 'Jost';
    }

    /* ---------- hero ---------- */
    .auri-hero {
      display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: stretch;
      min-height: 88vh;
    }
    .auri-hero-copy {
      display: flex; flex-direction: column; justify-content: center;
      padding: 60px 64px; gap: 22px;
    }
    .auri-hero-copy h1 { font-size: clamp(42px, 5.4vw, 74px); }
    .auri-hero-copy h1 em { font-style: normal; color: var(--bronze-dark); }
    .auri-hero-sub { max-width: 420px; color: var(--ink-soft); font-size: 16px; }
    .auri .auri-hero-cta {
      display: inline-flex; align-items: center; gap: 10px; width: fit-content;
      background: var(--patina); color: var(--paper); padding: 14px 26px;
      font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
      border-radius: 2px; border: none; transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
    }
    .auri .auri-hero-cta:hover { background: var(--ink); color: var(--paper); transform: translateX(3px); }
    .auri .auri-hero-cta svg { color: inherit; stroke: currentColor; }
    .auri-hero-stats { display: flex; gap: 36px; margin-top: 18px; }
    .auri-hero-stats div strong { display: block; font-family: 'Italiana'; font-size: 22px; color: var(--bronze-dark); }
    .auri-hero-stats div span { font-size: 11px; letter-spacing: 0.06em; color: var(--ink-soft); text-transform: uppercase; }

    .auri-hero-media { position: relative; overflow: hidden; }
    .auri-hero-media .auri-art { width: 100%; height: 100%; }
    .auri-hero-tag {
      position: absolute; left: 24px; bottom: 24px; background: rgba(248,245,238,0.92);
      padding: 10px 16px; font-size: 12px; letter-spacing: 0.03em; z-index: 2;
      border-left: 2px solid var(--bronze);
    }

    /* ---------- marquee ---------- */
    .auri-marquee-band {
      border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
      background: var(--paper-2); overflow: hidden; padding: 16px 0;
    }
    .auri-marquee-track {
      display: flex; width: max-content;
      animation: auri-scroll 34s linear infinite; will-change: transform;
    }
    .auri-marquee-track span {
      font-family: 'Italiana'; font-size: clamp(16px, 1.6vw, 20px);
      padding: 0 clamp(24px, 3vw, 40px); white-space: nowrap;
      color: var(--ink-soft); display: flex; align-items: center; gap: clamp(24px, 3vw, 40px);
    }
    .auri-marquee-track span::after { content: '·'; color: var(--bronze); font-size: 20px; }
    @keyframes auri-scroll { from { transform: translateX(0); } to { transform: translateX(-16.6667%); } }
    @media (prefers-reduced-motion: reduce) { .auri-marquee-track { animation-duration: 72s; } }

    /* ---------- section heads ---------- */
    .auri-section { padding: 96px 0; }
    .auri-section-head {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 44px; gap: 24px; flex-wrap: wrap;
    }
    .auri-section-head h2 { font-size: clamp(30px, 3.4vw, 44px); }
    .auri-section-head p { color: var(--ink-soft); max-width: 360px; font-size: 14.5px; }

    .auri-filter {
      display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px;
    }
    .auri-filter button {
      border: 1px solid var(--line); background: transparent; color: var(--ink-soft);
      padding: 9px 13px; border-radius: 4px; font-size: 12px; letter-spacing: 0.05em;
      text-transform: uppercase; display: inline-flex; align-items: center; gap: 7px;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }
    .auri-filter button span {
      color: var(--bronze-dark); font-size: 11px;
    }
    .auri-filter button:hover,
    .auri-filter button.active {
      background: var(--ink); border-color: var(--ink); color: var(--paper-2);
    }
    .auri-filter button:hover span,
    .auri-filter button.active span {
      color: var(--gold);
    }
    .auri-filter button:focus-visible,
    .auri-quick-add:focus-visible,
    .auri-cart-btn:focus-visible,
    .auri-checkout-submit:focus-visible {
      outline: 2px solid var(--gold); outline-offset: 3px;
    }

    /* ---------- product grid ---------- */
    .auri-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px;
    }
    .auri-card { display: flex; flex-direction: column; gap: 12px; }
    .auri-card.featured { grid-column: span 2; grid-row: span 2; }
    .auri-card-media {
      position: relative; overflow: hidden; background: var(--paper-2);
      aspect-ratio: 1 / 1;
    }
    .auri-card.featured .auri-card-media { aspect-ratio: 1 / 1; }
    .auri-card:hover .auri-card-media .auri-art,
    .auri-card:hover .auri-card-media .auri-photo { transform: scale(1.06); }

    /* painéis de arte (substituem fotos externas) */
    .auri-art {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; transition: transform 0.7s cubic-bezier(.2,.7,.2,1);
    }
    .auri-art::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at 28% 20%, rgba(255,255,255,0.35), transparent 60%);
    }
    .auri-art-bronze { background: linear-gradient(155deg, #EBDCC6 0%, #CC9F6C 58%, #A9754A 100%); }
    .auri-art-patina { background: linear-gradient(155deg, #E1E7DA 0%, #93A68A 58%, #4C5C46 100%); }
    .auri-art-ink { background: linear-gradient(155deg, #524C41 0%, #2C2822 58%, #1B1915 100%); }
    .auri-art svg { position: relative; z-index: 1; width: 42%; height: 42%; }
    .auri-art-ink svg { width: 58%; height: 58%; }
    .auri-cart-item-art svg { width: 48%; height: 48%; }

    .auri-photo {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transition: transform 0.7s cubic-bezier(.2,.7,.2,1);
    }
    .auri-quick-add {
      position: absolute; right: 10px; bottom: 10px; width: 38px; height: 38px;
      border-radius: 50%; background: var(--paper-2); border: 1px solid var(--line);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateY(6px); transition: all 0.25s ease;
    }
    .auri-card:hover .auri-quick-add { opacity: 1; transform: translateY(0); }
    .auri-quick-add:hover { background: var(--ink); color: var(--paper-2); border-color: var(--ink); }
    @media (hover: none) {
      .auri-quick-add { opacity: 1; transform: none; }
    }
    .auri-card-info .brand { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bronze-dark); }
    .auri-card-info .name { font-family: 'Italiana'; font-size: 19px; margin: 3px 0; }
    .auri-card-info .price { font-size: 14px; color: var(--ink-soft); }

    /* ---------- checkout showcase (signature) ---------- */
    .auri-checkout-section { background: var(--ink); color: var(--paper-2); }
    .auri-checkout-section .eyebrow { color: var(--gold); }
    .auri-checkout-section h2 { color: var(--paper-2); }
    .auri-checkout-section p.lead { color: rgba(248,245,238,0.72); }
    .auri-checkout-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
    }
    .auri-checkout-list { display: flex; flex-direction: column; gap: 26px; margin-top: 34px; }
    .auri-checkout-list li { display: flex; gap: 16px; align-items: flex-start; }
    .auri-checkout-list .n {
      font-family: 'Italiana'; font-size: 15px; color: var(--gold);
      border: 1px solid rgba(201,169,97,0.5); border-radius: 50%;
      width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .auri-checkout-list h3 { font-family: 'Jost'; font-weight: 500; font-size: 15px; margin-bottom: 4px; }
    .auri-checkout-list p { font-size: 13.5px; color: rgba(248,245,238,0.62); margin: 0; }

    .auri-mock {
      background: var(--paper-2); color: var(--ink); border-radius: 4px;
      padding: 26px; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.5);
    }
    .auri-mock-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .auri-mock-head span.badge {
      font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase;
      background: var(--patina); color: #fff; padding: 4px 9px; border-radius: 20px;
    }
    .auri-mock-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--line); font-size: 13.5px; }
    .auri-mock-total { display: flex; justify-content: space-between; padding-top: 14px; font-family: 'Italiana'; font-size: 19px; }
    .auri-mock-btn {
      width: 100%; margin-top: 16px; background: var(--bronze); color: var(--paper-2); border: none;
      padding: 13px; font-size: 12.5px; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px;
      transition: background 0.2s ease, color 0.2s ease;
    }
    .auri-mock-btn:hover { background: var(--ink); color: var(--paper-2); }

    /* ---------- about split ---------- */
    .auri-about { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 60px; align-items: center; }
    .auri-about-media { overflow: hidden; aspect-ratio: 4/5; }
    .auri-about-media .auri-art { width: 100%; height: 100%; }
    .auri-about-copy p { color: var(--ink-soft); font-size: 15.5px; max-width: 480px; margin-top: 18px; }
    .auri-about-copy p + p { margin-top: 12px; }

    /* ---------- newsletter / footer ---------- */
    .auri-newsletter { background: var(--patina); color: var(--paper-2); padding: 70px 0; }
    .auri-newsletter-inner { display: flex; justify-content: space-between; align-items: center; gap: 30px; flex-wrap: wrap; }
    .auri-newsletter h2 { color: var(--paper-2); font-size: clamp(26px,3vw,36px); max-width: 420px; }
    .auri-news-form { display: flex; gap: 0; border-bottom: 1px solid rgba(248,245,238,0.5); min-width: 320px; }
    .auri-news-form input {
      background: transparent; border: none; color: var(--paper-2); padding: 10px 4px;
      font-family: 'Jost'; font-size: 14px; flex: 1; outline: none;
    }
    .auri-news-form input::placeholder { color: rgba(248,245,238,0.55); }
    .auri-news-form button { background: none; border: none; color: var(--paper-2); padding: 10px; }
    .auri-news-status { font-size: 12px; color: rgba(248,245,238,0.76); margin-top: 10px; }

    .auri-footer { padding: 56px 0 36px; }
    .auri-footer-top { display: flex; justify-content: space-between; gap: 40px; flex-wrap: wrap; margin-bottom: 40px; }
    .auri-footer-col h4 { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bronze-dark); margin-bottom: 14px; }
    .auri-footer-col a, .auri-footer-col p, .auri-footer-static { display: block; font-size: 13.5px; color: var(--ink-soft); margin-bottom: 8px; }
    .auri-footer-col a { width: fit-content; transition: color 0.2s ease; }
    .auri-footer-col a:hover { color: var(--patina); text-decoration: underline; }
    .auri-footer-bottom {
      border-top: 1px solid var(--line); padding-top: 22px; display: flex;
      justify-content: space-between; align-items: center; font-size: 12px; color: var(--ink-soft); flex-wrap: wrap; gap: 12px;
    }

    /* ---------- cart drawer ---------- */
    .auri-overlay {
      position: fixed; inset: 0; background: rgba(34,31,27,0.5); z-index: 90;
      opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    .auri-overlay.open { opacity: 1; pointer-events: auto; }
    .auri-drawer {
      position: fixed; top: 0; right: 0; height: 100%; width: 420px; max-width: 92vw;
      background: var(--paper-2); z-index: 95; display: flex; flex-direction: column;
      transform: translateX(100%); transition: transform 0.35s cubic-bezier(.2,.8,.2,1);
      box-shadow: -20px 0 60px rgba(0,0,0,0.2);
    }
    .auri-drawer.open { transform: translateX(0); }
    .auri-drawer-head { padding: 22px 24px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
    .auri-drawer-head h3 { font-family: 'Italiana'; font-size: 21px; }
    .auri-drawer-head button { background: none; border: none; }
    .auri-drawer-badge {
      display: inline-flex; align-items: center; gap: 6px; margin-top: 4px;
      font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--patina);
    }
    .auri-drawer-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
    .auri-drawer-empty { color: var(--ink-soft); font-size: 14px; text-align: center; padding: 60px 10px; }

    .auri-cart-item { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); }
    .auri-cart-item-art { width: 68px; height: 68px; flex-shrink: 0; }
    .auri-cart-item .meta { flex: 1; }
    .auri-cart-item .meta .brand { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--bronze-dark); }
    .auri-cart-item .meta .name { font-family: 'Italiana'; font-size: 16px; margin: 2px 0 8px; }
    .auri-stepper { display: flex; align-items: center; gap: 10px; }
    .auri-stepper button { width: 24px; height: 24px; border: 1px solid var(--line); background: none; display: flex; align-items: center; justify-content: center; }
    .auri-cart-item .price { font-size: 13.5px; color: var(--ink-soft); white-space: nowrap; }

    .auri-drawer-section-title {
      font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bronze-dark);
      margin: 22px 0 12px;
    }
    .auri-field { margin-bottom: 12px; }
    .auri-field label { display: block; font-size: 12px; color: var(--ink-soft); margin-bottom: 5px; }
    .auri-field input {
      width: 100%; border: 1px solid var(--line); background: var(--paper); padding: 10px 12px;
      font-family: 'Jost'; font-size: 13.5px; outline: none; border-radius: 2px;
    }
    .auri-field input:focus { border-color: var(--bronze); }
    .auri-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    .auri-pay-options { display: flex; gap: 10px; }
    .auri-pay-options label {
      flex: 1; border: 1px solid var(--line); padding: 10px; text-align: center;
      font-size: 12.5px; border-radius: 2px; cursor: pointer;
    }
    .auri-pay-options input { display: none; }
    .auri-pay-options input:checked + span { color: var(--bronze-dark); font-weight: 500; }
    .auri-pay-options label:has(input:checked) { border-color: var(--bronze); background: var(--paper); }

    .auri-drawer-foot { border-top: 1px solid var(--line); padding: 18px 24px 24px; }
    .auri-drawer-fees { display: grid; gap: 7px; margin-bottom: 13px; }
    .auri-drawer-fees div {
      display: flex; justify-content: space-between; color: var(--ink-soft); font-size: 12.5px;
    }
    .auri-drawer-total { display: flex; justify-content: space-between; font-family: 'Italiana'; font-size: 20px; margin-bottom: 14px; }
    .auri-checkout-submit {
      width: 100%; background: var(--ink); color: var(--paper-2); border: none; padding: 15px;
      font-size: 12.5px; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background 0.2s ease;
    }
    .auri-checkout-submit:hover { background: var(--patina); }
    .auri-drawer-note { font-size: 11px; color: var(--ink-soft); text-align: center; margin-top: 10px; }

    .auri-success { text-align: center; padding: 60px 20px; }
    .auri-success .icon {
      width: 56px; height: 56px; border-radius: 50%; background: var(--patina); color: #fff;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
    }
    .auri-success h3 { font-family: 'Italiana'; font-size: 24px; margin-bottom: 8px; }
    .auri-success p { font-size: 13.5px; color: var(--ink-soft); }

    /* ---------- responsive ---------- */
    @media (max-width: 980px) {
      .auri-hero { grid-template-columns: 1fr; min-height: auto; }
      .auri-hero-media { height: 60vh; }
      .auri-hero-copy { padding: 48px 24px; }
      .auri-grid { grid-template-columns: repeat(2, 1fr); }
      .auri-card.featured { grid-column: span 2; grid-row: span 1; }
      .auri-checkout-grid { grid-template-columns: 1fr; }
      .auri-about { grid-template-columns: 1fr; }
      .auri-nav-inner { flex-wrap: wrap; row-gap: 14px; }
      .auri-nav-links {
        order: 3; width: 100%; display: flex; gap: 22px; overflow-x: auto;
        padding-bottom: 2px; scrollbar-width: none;
      }
      .auri-nav-links::-webkit-scrollbar { display: none; }
    }
    @media (max-width: 560px) {
      .auri-wrap { padding: 0 20px; }
      .auri-nav-inner { padding: 16px 20px; }
      .auri-logo { font-size: 24px; }
      .auri-cart-btn { padding: 9px 12px; }
      .auri-nav-links { gap: 18px; font-size: 12px; }
      .auri-marquee-band { padding: 13px 0; }
      .auri-marquee-track { animation-duration: 24s; }
      .auri-marquee-track span { padding: 0 24px; gap: 24px; }
      .auri-grid { grid-template-columns: 1fr; }
      .auri-card.featured { grid-column: span 1; }
      .auri-drawer { width: 100%; }
      .auri-row2 { grid-template-columns: 1fr; }
      .auri-pay-options { flex-direction: column; }
      .auri-news-form { min-width: 0; width: 100%; }
    }

    /* ---------- editorial refresh inspired by Mosaicist's rhythm ---------- */
    .auri {
      --paper: #E7DDD0;
      --paper-2: #F7F0E6;
      --ink: #171411;
      --ink-soft: #746B60;
      --bronze: #B98254;
      --bronze-dark: #91613F;
      --patina: #51624F;
      --patina-light: #72846E;
      --line: rgba(247,240,230,0.18);
      --dark-line: rgba(23,20,17,0.16);
      --gold: #D1B36D;
      background: var(--ink);
    }

    .auri h1, .auri h2, .auri h3, .auri .disp { letter-spacing: 0; }
    .auri-wrap { max-width: 1480px; padding: 0 46px; }

    @keyframes auri-rise {
      from { opacity: 0; transform: translateY(22px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes auri-hero-drift {
      from { transform: scale(1.04) translate3d(0, -4%, 0); }
      to { transform: scale(1.11) translate3d(-1.5%, -8%, 0); }
    }
    @keyframes auri-hero-necklace-drift {
      from { transform: scale(1.16) translate3d(0, -12%, 0); }
      to { transform: scale(1.24) translate3d(-1.2%, -18%, 0); }
    }
    @keyframes auri-hero-riacho-drift {
      from { transform: scale(1.08) translate3d(0, 2%, 0); }
      to { transform: scale(1.14) translate3d(-1%, -4%, 0); }
    }
    @keyframes auri-shimmer-line {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }

    .auri-nav {
      position: fixed; left: 0; right: 0; top: 0;
      background: linear-gradient(180deg, rgba(23,20,17,0.82), rgba(23,20,17,0.2));
      color: var(--paper-2); border-bottom: 1px solid rgba(247,240,230,0.1);
      backdrop-filter: blur(12px);
    }
    .auri-nav-inner { max-width: 1480px; padding: 24px 46px; }
    .auri-logo { color: var(--paper-2); }
    .auri-nav-links a { color: rgba(247,240,230,0.82); }
    .auri-nav-links a::after { background: var(--gold); }
    .auri-cart-btn {
      background: rgba(247,240,230,0.12); color: var(--paper-2);
      border: 1px solid rgba(247,240,230,0.22);
    }
    .auri-cart-btn:hover { background: var(--paper-2); color: var(--ink); }

    .auri-hero {
      position: relative; display: block; min-height: 92svh; overflow: hidden;
      isolation: isolate; background: var(--ink); color: var(--paper-2);
    }
    .auri-hero::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 34%;
      height: 1px; background: rgba(247,240,230,0.18); z-index: 1;
    }
    .auri-hero-media {
      position: absolute; inset: 0; z-index: -2; overflow: hidden;
    }
    .auri-hero-media::after {
      content: ""; position: absolute; inset: 0; z-index: 1;
      background:
        linear-gradient(90deg, rgba(23,20,17,0.94) 0%, rgba(23,20,17,0.54) 45%, rgba(23,20,17,0.25) 100%),
        linear-gradient(0deg, rgba(23,20,17,0.84) 0%, rgba(23,20,17,0.12) 46%, rgba(23,20,17,0.42) 100%);
    }
    .auri-hero-media .auri-photo {
      width: 100%; height: 100%; object-fit: cover; object-position: center 46%;
      filter: saturate(0.9) contrast(1.08);
    }
    .auri-hero-media .auri-photo-aneis { object-position: center 34%; }
    .auri-hero-media .auri-photo-colares { object-position: center 100%; }
    .auri-hero-media .auri-photo-riacho { object-position: center 88%; }
    .auri-hero-slide {
      position: absolute; inset: 0; opacity: 0; transform: scale(1.01);
      transition: opacity 1.1s ease, transform 1.1s ease;
    }
    .auri-hero-slide.active { opacity: 1; transform: scale(1); z-index: 1; }
    .auri-hero-slide.active .auri-photo { animation: auri-hero-drift 5.2s ease-in-out both; }
    .auri-hero-slide.active .auri-photo-colares { animation-name: auri-hero-necklace-drift; }
    .auri-hero-slide.active .auri-photo-riacho { animation-name: auri-hero-riacho-drift; }
    .auri-hero-reel {
      position: absolute; left: 46px; right: 46px; bottom: 24px; z-index: 4;
      display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 9px;
    }
    .auri-hero-reel-card {
      position: relative; min-width: 0; height: 108px; padding: 6px;
      border: 1px solid rgba(247,240,230,0.18); background: rgba(23,20,17,0.32);
      color: rgba(247,240,230,0.78); text-align: left; overflow: hidden;
      backdrop-filter: blur(10px); transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
    }
    .auri-hero-reel-card::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
      background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease;
    }
    .auri-hero-reel-card.active {
      border-color: rgba(209,179,109,0.9); background: rgba(247,240,230,0.1);
      transform: translateY(-3px);
    }
    .auri-hero-reel-card.active::after {
      transform: scaleX(1); animation: auri-reel-progress 5.2s linear both;
    }
    .auri-reel-media {
      display: block; height: 58px; margin-bottom: 7px; overflow: hidden; background: rgba(247,240,230,0.1);
    }
    .auri-reel-media .auri-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
    .auri-reel-media .auri-photo-colares { object-position: center 82%; }
    .auri-reel-media .auri-photo-riacho { object-position: center 74%; }
    .auri-reel-kicker {
      display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,240,230,0.52);
    }
    .auri-reel-name {
      display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      font-family: 'Italiana', serif; font-size: 17px; line-height: 1.05; color: var(--paper-2);
    }
    @keyframes auri-reel-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    .auri-hero-copy {
      min-height: 92svh; display: grid; grid-template-columns: minmax(0, 1fr) 340px;
      align-content: end; align-items: end; gap: 20px 64px;
      padding: 132px 46px 168px; color: var(--paper-2); position: relative; z-index: 2;
    }
    .auri-hero-copy .eyebrow {
      grid-column: 1 / 2; align-self: start; color: rgba(247,240,230,0.72);
      animation: auri-rise 0.7s ease both;
    }
    .auri-hero-copy h1 {
      grid-column: 1 / 2; max-width: 980px;
      font-family: 'Jost', sans-serif; font-size: 112px; line-height: 0.88;
      font-weight: 300; color: var(--paper-2); animation: auri-rise 0.8s 0.08s ease both;
    }
    .auri-hero-copy h1 em {
      display: inline-block; font-family: 'Italiana', serif; font-style: italic;
      color: var(--paper-2);
    }
    .auri-hero-sub {
      grid-column: 2 / 3; max-width: 320px; color: rgba(247,240,230,0.78);
      font-size: 15px; animation: auri-rise 0.8s 0.16s ease both;
    }
    .auri .auri-hero-cta {
      grid-column: 2 / 3; background: var(--paper-2); color: var(--ink);
      padding: 14px 22px; border: 1px solid rgba(247,240,230,0.2);
      animation: auri-rise 0.8s 0.22s ease both;
    }
    .auri .auri-hero-cta:hover { background: var(--gold); color: var(--ink); transform: translateX(4px); }
    .auri-hero-stats {
      position: absolute; right: 46px; top: 182px; z-index: 2;
      flex-direction: column; gap: 18px; color: var(--paper-2);
    }
    .auri-hero-stats div strong { color: var(--gold); }
    .auri-hero-stats div span { color: rgba(247,240,230,0.7); }
    .auri-hero-tag {
      left: auto; right: 46px; top: 124px; bottom: auto; background: rgba(23,20,17,0.28);
      color: rgba(247,240,230,0.82); border-left: 1px solid var(--gold);
      backdrop-filter: blur(10px);
    }

    .auri-marquee-band {
      background: var(--ink); border-color: rgba(247,240,230,0.18);
      color: var(--paper-2); padding: 18px 0;
    }
    .auri-marquee-track span { color: rgba(247,240,230,0.72); }

    .auri-section {
      background: var(--paper); color: var(--ink); padding: 118px 0;
    }
    .auri-section-head {
      display: grid; grid-template-columns: minmax(0, 1fr) 360px; align-items: end;
      border-bottom: 1px solid var(--dark-line); padding-bottom: 34px; margin-bottom: 46px;
    }
    .auri-section-head h2 {
      font-family: 'Jost', sans-serif; font-size: 74px; line-height: 0.98; font-weight: 300;
    }
    .auri-section-head p { color: var(--ink-soft); }
    .auri-section .eyebrow { color: var(--bronze-dark); }

    .auri-filter { margin-bottom: 34px; }
    .auri-filter button {
      border-color: var(--dark-line); border-radius: 2px; background: rgba(247,240,230,0.35);
    }

    .auri-grid { grid-template-columns: repeat(12, 1fr); gap: 20px 24px; align-items: start; }
    .auri-card { grid-column: span 3; gap: 14px; }
    .auri-card.featured { grid-column: span 6; grid-row: span 2; }
    .auri-card:nth-child(3) { margin-top: 54px; }
    .auri-card:nth-child(6),
    .auri-card:nth-child(7) { margin-top: clamp(-260px, -18vw, -150px); }
    .auri-card-media {
      background: #D8CCBA; border: 1px solid var(--dark-line);
      aspect-ratio: 3 / 4; border-radius: 3px;
    }
    .auri-card.featured .auri-card-media { aspect-ratio: 1 / 1.02; }
    .auri-card-info {
      display: grid; grid-template-columns: 1fr auto; gap: 2px 16px;
      border-top: 1px solid var(--dark-line); padding-top: 12px;
    }
    .auri-card-info .brand { grid-column: 1 / 3; }
    .auri-card-info .name { font-size: 22px; margin: 0; }
    .auri-card-info .price { align-self: center; }
    .auri-quick-add { background: var(--paper-2); border-color: rgba(23,20,17,0.22); }

    .auri-checkout-section {
      position: relative; min-height: 88svh; overflow: hidden;
      background: var(--ink); color: var(--paper-2); display: flex; align-items: center;
    }
    .auri-checkout-section::after {
      content: ""; position: absolute; inset: 0; z-index: 1;
      background:
        linear-gradient(90deg, rgba(23,20,17,0.92) 0%, rgba(23,20,17,0.66) 48%, rgba(23,20,17,0.28) 100%),
        linear-gradient(0deg, rgba(23,20,17,0.82) 0%, rgba(23,20,17,0.05) 55%, rgba(23,20,17,0.68) 100%);
    }
    .auri-checkout-bg {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      opacity: 0.55; filter: saturate(0.82) contrast(1.08);
      animation: auri-hero-drift 22s ease-in-out infinite alternate;
    }
    .auri-checkout-section .auri-wrap { position: relative; z-index: 2; width: 100%; }
    .auri-checkout-grid { grid-template-columns: minmax(0, 1fr) 410px; gap: 72px; }
    .auri-checkout-section h2 {
      font-family: 'Jost', sans-serif; font-size: 72px; line-height: 0.98; font-weight: 300;
      max-width: 780px;
    }
    .auri-checkout-section p.lead { max-width: 420px; margin-top: 18px; }
    .auri-checkout-list {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
      border-top: 1px solid rgba(247,240,230,0.24); padding-top: 24px;
    }
    .auri-checkout-list li { display: block; }
    .auri-checkout-list .n { margin-bottom: 12px; }
    .auri-mock {
      border-radius: 4px; background: rgba(247,240,230,0.92);
      border: 1px solid rgba(247,240,230,0.36); backdrop-filter: blur(14px);
    }

    .auri-about {
      grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.8fr); gap: 72px;
    }
    .auri-about-media {
      order: 2; border-radius: 3px; border: 1px solid var(--dark-line);
    }
    .auri-about-copy { order: 1; }
    .auri-about-copy h2 {
      font-family: 'Jost', sans-serif; font-size: 68px; line-height: 1; font-weight: 300;
      max-width: 760px;
    }
    .auri-about-copy p { font-size: 17px; max-width: 620px; }

    .auri-newsletter {
      background: var(--paper-2); color: var(--ink); border-top: 1px solid var(--dark-line);
    }
    .auri-newsletter h2 {
      color: var(--ink); font-family: 'Jost', sans-serif; font-size: 44px; line-height: 1.05; font-weight: 300;
      max-width: 620px;
    }
    .auri-news-form { border-bottom-color: rgba(23,20,17,0.3); }
    .auri-news-form input { color: var(--ink); }
    .auri-news-form input::placeholder { color: rgba(23,20,17,0.45); }
    .auri-news-form button { color: var(--ink); }
    .auri-news-status { color: var(--ink-soft); }

    .auri-footer {
      background: var(--ink); color: var(--paper-2); padding-top: 70px;
    }
    .auri-footer-col h4 { color: var(--gold); }
    .auri-footer-col a, .auri-footer-col p, .auri-footer-static { color: rgba(247,240,230,0.72); }
    .auri-footer-bottom { border-top-color: rgba(247,240,230,0.14); color: rgba(247,240,230,0.62); }

    @media (min-width: 1440px) {
      .auri-hero-copy h1 { font-size: 138px; }
      .auri-section-head h2,
      .auri-checkout-section h2 { font-size: 88px; }
    }
    @media (max-width: 980px) {
      .auri-wrap { padding: 0 26px; }
      .auri-nav-inner { padding: 18px 26px; }
      .auri-hero { min-height: 90svh; }
      .auri-hero::after { bottom: 38%; }
      .auri-hero-copy {
        min-height: 90svh; grid-template-columns: 1fr; padding: 116px 26px 150px;
        gap: 16px;
      }
      .auri-hero-copy h1 { grid-column: 1; font-size: 82px; }
      .auri-hero-sub,
      .auri .auri-hero-cta { grid-column: 1; }
      .auri-hero-stats { position: static; flex-direction: row; margin-top: 8px; }
      .auri-hero-tag { top: 112px; left: 26px; right: auto; }
      .auri-hero-reel { left: 26px; right: 26px; bottom: 20px; gap: 7px; }
      .auri-hero-reel-card { height: 88px; padding: 4px; }
      .auri-reel-media { height: 78px; margin-bottom: 0; }
      .auri-reel-kicker,
      .auri-reel-name { display: none; }
      .auri-section-head,
      .auri-checkout-grid,
      .auri-about { grid-template-columns: 1fr; }
      .auri-section-head h2,
      .auri-checkout-section h2,
      .auri-about-copy h2 { font-size: 56px; }
      .auri-grid { grid-template-columns: repeat(2, 1fr); }
      .auri-card,
      .auri-card.featured { grid-column: span 1; }
      .auri-card:nth-child(3),
      .auri-card:nth-child(6),
      .auri-card:nth-child(7) { margin-top: 0; }
      .auri-checkout-list { grid-template-columns: 1fr; }
      .auri-about-media { order: 1; }
      .auri-about-copy { order: 2; }
    }
    @media (max-width: 560px) {
      .auri-wrap { padding: 0 20px; }
      .auri-nav-inner { padding: 16px 20px; }
      .auri-hero { min-height: 88svh; }
      .auri-hero-copy { min-height: 88svh; padding: 106px 20px 120px; }
      .auri-hero-copy h1 { font-size: 54px; line-height: 0.94; }
      .auri-hero-sub { font-size: 14px; }
      .auri-hero-stats { display: none; }
      .auri-hero-tag { left: 20px; right: auto; top: 118px; }
      .auri-hero-reel { left: 16px; right: 16px; bottom: 12px; gap: 5px; }
      .auri-hero-reel-card { height: 74px; padding: 2px; }
      .auri-reel-media { height: 68px; }
      .auri-section { padding: 78px 0; }
      .auri-section-head { padding-bottom: 24px; margin-bottom: 30px; }
      .auri-section-head h2,
      .auri-checkout-section h2,
      .auri-about-copy h2,
      .auri-newsletter h2 { font-size: 38px; }
      .auri-grid { grid-template-columns: 1fr; gap: 34px; }
      .auri-card-media,
      .auri-card.featured .auri-card-media { aspect-ratio: 4 / 5; }
      .auri-checkout-section { min-height: auto; padding: 78px 0; }
      .auri-mock { padding: 20px; }
      .auri-newsletter-inner { display: block; }
      .auri-news-form { margin-top: 24px; }
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [cart, setCart] = useState({}); // { id: qty }
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroIndex((index) => (index + 1) % PRODUCTS.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setDrawerOpen(true);
  };
  const changeQty = (id, delta) => {
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const cartItems = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty })),
    [cart]
  );
  const visibleProducts = useMemo(
    () => selectedCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === selectedCategory),
    [selectedCategory]
  );
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const activeHeroProduct = PRODUCTS[activeHeroIndex];
  const whatsappHref = useMemo(() => {
    if (cartItems.length === 0) return "https://wa.me/";

    const itemLines = cartItems.map(
      (item) => `- ${item.qty}x ${item.name} (${item.brand}) - ${currency(item.price * item.qty)}`
    );
    const message = [
      "Olá, quero finalizar minha compra na Auri.",
      "",
      "Minha sacola:",
      ...itemLines,
      "",
      `Subtotal: ${currency(subtotal)}`,
      "",
      "Quero combinar entrega e pagamento pelo WhatsApp.",
    ].join("\n");

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [cartItems, subtotal]);

  return (
    <div className="auri">
      <GlobalStyle />

      {/* NAV */}
      <header className="auri-nav">
        <div className="auri-nav-inner">
          <a href="#top" className="auri-logo">AURI</a>
          <nav className="auri-nav-links">
            <a href="#colecao">Coleção</a>
            <a href="#marcas">Marcas</a>
            <a href="#checkout">Checkout</a>
            <a href="#sobre">Sobre</a>
          </nav>
          <button type="button" className="auri-cart-btn" onClick={() => setDrawerOpen(true)}>
            <ShoppingBag size={16} />
            Sacola
            {cartCount > 0 && <span className="auri-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="auri-hero" id="top">
        <div className="auri-hero-copy">
          <span className="eyebrow">Marketplace de joias autorais</span>
          <h1>Peças raras,<br /><em>como você merece.</em></h1>
          <p className="auri-hero-sub">
            A Auri reúne ateliês independentes de todo o Brasil em uma única loja,
            que cabe numa tela só.
          </p>
          <a href="#colecao" className="auri-hero-cta">Ver coleção <ArrowRight size={15} /></a>
          <div className="auri-hero-stats">
            <div><strong>32</strong><span>Ateliês</span></div>
            <div><strong>100%</strong><span>Peças autorais</span></div>
          </div>
          <div className="auri-hero-reel" aria-label="Joias em destaque no hero">
            {PRODUCTS.map((product, index) => (
              <button
                type="button"
                className={`auri-hero-reel-card ${index === activeHeroIndex ? "active" : ""}`}
                key={product.id}
                onClick={() => setActiveHeroIndex(index)}
                aria-label={`Destacar ${product.name}`}
              >
                <span className="auri-reel-media">
                  <ProductMedia
                    src={product.img}
                    tone={product.tone}
                    category={product.category}
                    alt=""
                    className={product.id === "p2" ? "auri-photo-riacho" : ""}
                    eager
                  />
                </span>
                <span className="auri-reel-kicker">{product.brand}</span>
                <span className="auri-reel-name">{product.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="auri-hero-media">
          {PRODUCTS.map((product, index) => (
            <div
              className={`auri-hero-slide ${index === activeHeroIndex ? "active" : ""}`}
              key={product.id}
              aria-hidden={index !== activeHeroIndex}
            >
              <ProductMedia
                src={product.img}
                tone={product.tone}
                category={product.category}
                alt={index === activeHeroIndex ? `${product.name} em fotografia editorial` : ""}
                className={product.id === "p2" ? "auri-photo-riacho" : ""}
                eager
              />
            </div>
          ))}
          <div className="auri-hero-tag">{activeHeroProduct.name} — {activeHeroProduct.brand}</div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="auri-marquee-band" id="marcas" aria-label={`Marcas parceiras: ${BRANDS.join(", ")}`}>
        <div className="auri-marquee-track" aria-hidden="true">
          {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="auri-section" id="colecao">
        <div className="auri-wrap">
          <div className="auri-section-head">
            <div>
              <span className="eyebrow">Coleção atual</span>
              <h2>Peças em destaque</h2>
            </div>
            <p>Cada foto é feita pelo próprio ateliê — é assim que compradores confiam no que estão levando.</p>
          </div>

          <div className="auri-filter" aria-label="Filtrar peças por categoria">
            {CATEGORIES.map((category) => (
              <button
                type="button"
                className={selectedCategory === category ? "active" : ""}
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
              >
                {category}
                <span>{CATEGORY_COUNTS[category]}</span>
              </button>
            ))}
          </div>

          <div className="auri-grid">
            {visibleProducts.map((p) => (
              <div className={`auri-card ${p.featured ? "featured" : ""}`} key={p.id}>
                <div className="auri-card-media">
                  <ProductMedia src={p.img} tone={p.tone} category={p.category} alt={`${p.name} — ${p.brand}`} />
                  <button type="button" className="auri-quick-add" onClick={() => addToCart(p.id)} aria-label={`Adicionar ${p.name} à sacola`}>
                    <Plus size={16} />
                  </button>
                </div>
                <div className="auri-card-info">
                  <div className="brand">{p.brand}</div>
                  <div className="name">{p.name}</div>
                  <div className="price">{currency(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKOUT SHOWCASE — signature element */}
      <section className="auri-section auri-checkout-section" id="checkout">
        <ProductMedia
          src={asset("colar-riacho.png")}
          tone="patina"
          category="Colares"
          alt=""
          className="auri-checkout-bg"
        />
        <div className="auri-wrap">
          <div className="auri-checkout-grid">
            <div>
              <span className="eyebrow">Como funciona</span>
              <h2>Pagamento em uma tela, do jeito que deveria ser.</h2>
              <p className="lead">Sem etapas escondidas, sem redirecionar para outro site.</p>
              <ul className="auri-checkout-list">
                <li>
                  <span className="n">1</span>
                  <div><h3>Sacola clara</h3><p>Quantidade e preço de cada peça, editáveis ali mesmo.</p></div>
                </li>
                <li>
                  <span className="n">2</span>
                  <div><h3>Entrega e pagamento juntos</h3><p>Um único formulário, sem trocar de página.</p></div>
                </li>
                <li>
                  <span className="n">3</span>
                  <div><h3>Confirmação imediata</h3><p>A pessoa sabe na hora que o pedido foi feito.</p></div>
                </li>
              </ul>
            </div>

            <div className="auri-mock">
              <div className="auri-mock-head">
                <strong style={{ fontFamily: "Italiana", fontSize: 18 }}>Sua sacola</strong>
                <span className="badge">1 tela</span>
              </div>
              <div className="auri-mock-row"><span>Anel Aurora · Studio Vero</span><span>{currency(389)}</span></div>
              <div className="auri-mock-row"><span>Colar Riacho · Terra Alta</span><span>{currency(459)}</span></div>
              <div className="auri-mock-row"><span>Entrega — Correios</span><span>{currency(24)}</span></div>
              <div className="auri-mock-total"><span>Total</span><span>{currency(872)}</span></div>
              <button type="button" className="auri-mock-btn" onClick={() => setDrawerOpen(true)}>Experimentar o checkout</button>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="auri-section" id="sobre">
        <div className="auri-wrap">
          <div className="auri-about">
            <div className="auri-about-media">
              <ProductMedia
                src={asset("anel-talisma.png")}
                tone="patina"
                category="Anéis"
                alt="Anel Talismã em fotografia editorial"
              />
            </div>
            <div className="auri-about-copy">
              <span className="eyebrow">Sobre a Auri</span>
              <h2>Uma vitrine para quem faz joia com as próprias mãos.</h2>
              <p>Cada marca na Auri é um ateliê pequeno — sem estoque de fábrica, sem coleção genérica. A gente cuida da parte que elas não têm tempo de cuidar: fotografia de produto, catálogo e formas de pagamento que não afasta quem já decidiu comprar.</p>
              <p>O resultado é uma loja onde cada peça é fotografada com a mesma atenção que teve para ser feita.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="auri-newsletter">
        <div className="auri-wrap auri-newsletter-inner">
          <h2>Novas peças, direto no seu e-mail — sem spam de promoção.</h2>
          <form className="auri-news-form" onSubmit={(e) => { e.preventDefault(); setNewsletterSent(true); }}>
            <input type="email" name="newsletter-email" placeholder="seu@email.com" aria-label="E-mail para newsletter" required />
            <button type="submit" aria-label="Assinar"><ArrowRight size={18} /></button>
          </form>
          {newsletterSent && <div className="auri-news-status" role="status">Você está na lista.</div>}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="auri-footer">
        <div className="auri-wrap">
          <div className="auri-footer-top">
            <div className="auri-footer-col" style={{ maxWidth: 260 }}>
              <div className="auri-logo" style={{ marginBottom: 12 }}>AURI</div>
              <p>Loja online para marcas de joias autorais, com foco em fotografia de produto e checkout simplificado.</p>
            </div>
            <div className="auri-footer-col">
              <h4>Loja</h4>
              <a href="#colecao">Coleção</a>
              <a href="#marcas">Marcas parceiras</a>
              <a href="#checkout">Como comprar</a>
            </div>
            <div className="auri-footer-col">
              <h4>Ateliês</h4>
              <a href="mailto:contato@auri.com.br?subject=Quero%20vender%20na%20Auri">Vender na Auri</a>
              <a href="mailto:contato@auri.com.br?subject=Fotografia%20de%20produto">Fotografia de produto</a>
              <a href="mailto:contato@auri.com.br?subject=Central%20de%20ajuda">Central de ajuda</a>
            </div>
            <div className="auri-footer-col">
              <h4>Contato</h4>
              <span className="auri-footer-static"><Instagram size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />@auri.joias</span>
              <a href="mailto:contato@auri.com.br">contato@auri.com.br</a>
            </div>
          </div>
          <div className="auri-footer-bottom">
            <span>© {new Date().getFullYear()} Auri. Todas as peças pertencem aos ateliês parceiros.</span>
            <span>Feito para quem faz joia de verdade.</span>
          </div>
        </div>
      </footer>

      {/* CART / CHECKOUT DRAWER */}
      <div className={`auri-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`auri-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="auri-drawer-head">
          <div>
            <h3>Sua sacola</h3>
            <span className="auri-drawer-badge"><Check size={12} /> Finalização no WhatsApp</span>
          </div>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Fechar"><X size={20} /></button>
        </div>

        <div className="auri-drawer-body">
          {cartItems.length === 0 ? (
            <div className="auri-drawer-empty">
              Sua sacola está vazia.<br />Escolha uma peça na coleção para começar.
            </div>
          ) : (
            <>
              {cartItems.map((item) => {
                return (
                <div className="auri-cart-item" key={item.id}>
                  <ProductMedia
                    src={item.img}
                    tone={item.tone}
                    category={item.category}
                    alt={item.name}
                    className="auri-cart-item-art"
                  />
                  <div className="meta">
                    <div className="brand">{item.brand}</div>
                    <div className="name">{item.name}</div>
                    <div className="auri-stepper">
                      <button type="button" onClick={() => changeQty(item.id, -1)}><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => changeQty(item.id, 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                  <div className="price">{currency(item.price * item.qty)}</div>
                </div>
                );
              })}

              <div style={{ height: 90 }} />
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="auri-drawer-foot">
            <a className="auri-checkout-submit" href={whatsappHref} target="_blank" rel="noreferrer">
              Finalizar no WhatsApp <ArrowRight size={15} />
            </a>
            <div className="auri-drawer-note">A mensagem do pedido abre pronta no WhatsApp.</div>
          </div>
        )}
      </aside>
    </div>
  );
}
