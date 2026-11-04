import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ==================================================================
   The Clow Card Portfolio
   1 · The Cover      — layered parallax hero
   2 · The Collection — four cards floating in a sky
   3 · The Capture    — flip a card, collect it, read it
   4 · The Contents   — each modal specialized to its project
   ------------------------------------------------------------------
   SLIDE IMAGES
   Montana Arts Council slide images are served from /public/images.
   Any slide whose image is missing falls back to a drawn plate.
   ================================================================== */

const IMG = {
  "epatt-01": "/images/opt/epatt-01.webp",
  "epatt-02": "/images/opt/epatt-02.webp",
  "epatt-03": "/images/opt/epatt-03.webp",
  "epatt-04": "/images/opt/epatt-04.webp",
  "epatt-05": "/images/opt/epatt-05.webp",
  "epatt-06": "/images/opt/epatt-06.webp",
  "epatt-07": "/images/opt/epatt-07.webp",
  "epatt-08": "/images/opt/epatt-08.webp",
  "epatt-09": "/images/opt/epatt-09.webp",
  "epatt-10": "/images/opt/epatt-10.webp",
  "epatt-11": "/images/opt/epatt-11.webp",
  "epatt-12": "/images/opt/epatt-12.webp",
  "epatt-13": "/images/opt/epatt-13.webp",
  "epatt-14": "/images/opt/epatt-14.webp",
  "epatt-15": "/images/opt/epatt-15.webp",
  "epatt-16": "/images/opt/epatt-16.webp",
  "epatt-17": "/images/opt/epatt-17.webp",
  "mac-01": "/images/opt/mac-01.webp",
  "mac-02": "/images/opt/mac-02.webp",
  "mac-03": "/images/opt/mac-03.webp",
  "mac-04": "/images/opt/mac-04.webp",
  "mac-05": "/images/opt/mac-05.webp",
  "mac-06": "/images/opt/mac-06.webp",
  "mac-07": "/images/opt/mac-07.webp",
  "mac-08": "/images/opt/mac-08.webp",
  "mac-09": "/images/opt/mac-09.webp",
  "mac-10": "/images/opt/mac-10.webp",
  "mac-11": "/images/opt/mac-11.webp",
  "mac-12": "/images/opt/mac-12.webp",
  "mac-13": "/images/opt/mac-13.webp",
  "sap-01": "/images/opt/sap-01.webp",
  "sap-02": "/images/opt/sap-02.webp",
  "sap-03": "/images/opt/sap-03.webp",
  "silver-01": "/images/opt/silver-01.webp",
  "silver-02": "/images/opt/silver-02.webp",
  "silver-03": "/images/opt/silver-03.webp",
  "silver-04": "/images/opt/silver-04.webp",
  "silver-05": "/images/opt/silver-05.webp",
};

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------- card face glyphs ----------------------- */

function ArtMap() {
  return (
    <svg viewBox="0 0 100 100" className="cc-art-svg" aria-hidden="true">
      <path d="M12 74 L34 30 L50 56 L64 38 L88 74 Z" />
      <path d="M12 74 Q30 68 50 74 T88 74" />
      <circle cx="50" cy="34" r="6.5" />
      <path d="M50 40.5 L50 52" />
      <circle cx="50" cy="34" r="2" className="cc-art-fill" />
      <path d="M22 20 L24 24 L28 26 L24 28 L22 32 L20 28 L16 26 L20 24 Z" className="cc-art-fill" />
      <path d="M78 46 L79.4 49 L82.5 50.4 L79.4 51.8 L78 55 L76.6 51.8 L73.5 50.4 L76.6 49 Z" className="cc-art-fill" />
    </svg>
  );
}
function ArtTennis() {
  return (
    <svg viewBox="0 0 100 100" className="cc-art-svg" aria-hidden="true">
      <circle cx="30" cy="30" r="9" />
      <path d="M22.5 25 Q30 30 22.5 35" />
      <path d="M37.5 25 Q30 30 37.5 35" />
      <path d="M39 34 Q58 44 62 74" />
      <path d="M44 32 Q66 42 72 70" />
      <path d="M14 78 Q34 62 50 78" />
      <path d="M20 80 Q38 68 52 80" />
      <path d="M50 20 L51.2 23 L54 24.2 L51.2 25.4 L50 28.5 L48.8 25.4 L46 24.2 L48.8 23 Z" className="cc-art-fill" />
    </svg>
  );
}
function ArtSprout() {
  return (
    <svg viewBox="0 0 100 100" className="cc-art-svg" aria-hidden="true">
      <rect x="18" y="14" width="64" height="60" rx="3" />
      <path d="M50 14 L50 74 M18 44 L82 44" />
      <path d="M22 62 Q34 50 46 58 T78 56" />
      <path d="M60 74 L64 90 L76 90 L80 74 Z" />
      <path d="M70 74 L70 64" />
      <path d="M70 66 Q62 62 64 55 Q71 55 70 66" />
      <path d="M70 66 Q78 62 76 55 Q69 55 70 66" />
      <path d="M32 26 L33.2 29 L36 30.2 L33.2 31.4 L32 34.5 L30.8 31.4 L28 30.2 L30.8 29 Z" className="cc-art-fill" />
    </svg>
  );
}
function ArtSilver() {
  return (
    <svg viewBox="0 0 100 100" className="cc-art-svg" aria-hidden="true">
      <path d="M14 20 Q50 40 86 20" />
      <path d="M50 33 L50 44" />
      <path d="M50 44 L58 58 L50 74 L42 58 Z" />
      <path d="M50 52 L54 58 L50 65 L46 58 Z" className="cc-art-fill" />
      <ellipse cx="24" cy="76" rx="10" ry="11" />
      <ellipse cx="24" cy="76" rx="6" ry="7" />
      <ellipse cx="78" cy="76" rx="9" ry="10" />
      <ellipse cx="78" cy="76" rx="5.5" ry="6.5" />
      <path d="M24 65 L25 67.4 L27.4 68.4 L25 69.4 L24 71.8 L23 69.4 L20.6 68.4 L23 67.4 Z" className="cc-art-fill" />
    </svg>
  );
}

/* --------------------- fallback slide plates ---------------------- */

const P = (children) => (
  <svg viewBox="0 0 160 120" className="cc-schema" aria-hidden="true">
    {children}
  </svg>
);

const PlateTitle = () =>
  P(
    <>
      <rect x="14" y="12" width="132" height="96" rx="6" />
      <rect x="30" y="34" width="46" height="34" rx="2" />
      <circle cx="53" cy="51" r="11" className="cc-art-fill" />
      <path d="M90 40 L136 40 M90 50 L128 50 M90 60 L134 60" />
      <path d="M30 88 L60 88 M70 88 L100 88 M110 88 L140 88" />
      <path d="M30 96 L52 96 M70 96 L94 96 M110 96 L136 96" />
    </>
  );

const PlateDoc = () =>
  P(
    <>
      <rect x="12" y="12" width="90" height="96" rx="5" />
      <path d="M24 30 L60 30" />
      <path d="M24 44 L88 44 M24 52 L88 52 M24 60 L80 60 M24 68 L86 68 M24 76 L66 76" />
      <path d="M24 92 L56 92" />
      <rect x="110" y="12" width="38" height="26" rx="5" />
      <rect x="110" y="46" width="38" height="62" rx="5" />
      <path d="M116 96 L124 78 L132 90 L140 70 L142 96 Z" className="cc-art-fill" />
    </>
  );

const PlateState = () =>
  P(
    <>
      <path d="M28 26 L132 26 L132 58 L108 58 L108 94 L28 94 Z" />
      <path d="M40 44 L52 44 M40 56 L64 56 M40 68 L56 68" />
      <circle cx="86" cy="42" r="3.4" className="cc-art-fill" />
      <circle cx="100" cy="70" r="3.4" className="cc-art-fill" />
      <circle cx="70" cy="78" r="3.4" className="cc-art-fill" />
      <path d="M14 106 L146 106" />
    </>
  );

const PlateTicket = () =>
  P(
    <>
      <rect x="58" y="8" width="44" height="18" rx="6" />
      <path d="M70 17 L74 17 M78 13 L80 21 L82 13 M86 13 L88 21 L90 13" />
      <path d="M22 42 Q30 42 30 50 Q30 58 22 58 Q30 58 30 66 Q30 74 22 74 Q30 74 30 82 Q30 90 22 90 L138 90 Q130 90 130 82 Q130 74 138 74 Q130 74 130 66 Q130 58 138 58 Q130 58 130 50 Q130 42 138 42 Z" />
      <path d="M56 44 L56 88" strokeDasharray="4 5" />
      <path d="M68 58 L120 58 M68 68 L112 68 M68 78 L102 78" />
    </>
  );

const PlateTable = () =>
  P(
    <>
      <rect x="12" y="14" width="60" height="92" rx="5" />
      <circle cx="26" cy="32" r="5" />
      <path d="M38 32 L64 32" />
      <circle cx="26" cy="56" r="5" />
      <path d="M38 56 L64 56" />
      <circle cx="26" cy="80" r="5" />
      <path d="M38 80 L64 80" />
      <rect x="84" y="14" width="64" height="92" rx="5" />
      <path d="M84 32 L148 32 M84 50 L148 50 M84 68 L148 68 M84 86 L148 86" />
      <path d="M106 14 L106 106" />
      <rect x="90" y="38" width="10" height="6" rx="3" className="cc-art-fill" />
      <rect x="90" y="56" width="10" height="6" rx="3" className="cc-art-fill" />
      <rect x="90" y="74" width="10" height="6" rx="3" className="cc-art-fill" />
    </>
  );

const PlateCards = () =>
  P(
    <>
      {[12, 58, 104].map((x) => (
        <g key={x}>
          <rect x={x} y="16" width="44" height="88" rx="5" />
          <circle cx={x + 22} cy="40" r="11" />
          <path d={`M${x + 8} 62 L${x + 36} 62 M${x + 8} 72 L${x + 30} 72 M${x + 8} 82 L${x + 34} 82 M${x + 8} 92 L${x + 26} 92`} />
        </g>
      ))}
    </>
  );

const PlateSketch = () =>
  P(
    <>
      <rect x="10" y="46" width="46" height="36" rx="3" />
      <path d="M18 58 L40 58 M18 66 L34 66" />
      <rect x="22" y="70" width="12" height="7" rx="1" />
      <rect x="62" y="12" width="52" height="38" rx="3" />
      <path d="M70 22 L104 22" />
      <rect x="70" y="30" width="36" height="6" rx="3" />
      <rect x="70" y="40" width="10" height="6" rx="1" />
      <rect x="84" y="40" width="10" height="6" rx="1" />
      <rect x="62" y="66" width="52" height="40" rx="3" />
      <path d="M78 66 L78 106" />
      <circle cx="96" cy="82" r="2.6" className="cc-art-fill" />
      <circle cx="104" cy="94" r="2.6" className="cc-art-fill" />
      <rect x="122" y="30" width="30" height="44" rx="3" />
      <circle cx="131" cy="42" r="5" />
      <path d="M140 40 L148 40 M124 56 L150 56 M124 64 L144 64" />
    </>
  );

const PlateFriction = () =>
  P(
    <>
      {[16, 46, 76].map((y) => (
        <g key={y}>
          <rect x="10" y={y} width="62" height="24" rx="8" />
          <circle cx="24" cy={y + 12} r="6" />
          <path d={`M36 ${y + 9} L64 ${y + 9} M36 ${y + 16} L56 ${y + 16}`} />
        </g>
      ))}
      <rect x="86" y="16" width="64" height="84" rx="6" />
      <path d="M94 30 L126 30" />
      <rect x="94" y="38" width="48" height="34" rx="3" />
      <circle cx="108" cy="52" r="3" className="cc-art-fill" />
      <circle cx="124" cy="60" r="3" className="cc-art-fill" />
      <path d="M94 82 L142 82 M94 90 L130 90" />
    </>
  );

const PlateTest = () =>
  P(
    <>
      <path d="M18 24 Q18 16 26 16 L52 16 Q60 16 60 24 L60 52 Q60 60 52 60 L40 60 L32 72 L32 60 L26 60 Q18 60 18 52 Z" />
      <path d="M32 32 L32 44 Q32 48 38 48 Q44 48 44 44 L44 32" />
      <rect x="80" y="20" width="30" height="24" rx="2" />
      <path d="M76 44 L114 44" />
      <rect x="118" y="20" width="30" height="24" rx="2" />
      <path d="M114 44 L152 44" />
      <path d="M84 28 L104 28 M84 34 L98 34" />
      <path d="M122 28 L142 28 M122 34 L136 34" />
      <path d="M80 66 L148 66 M80 76 L140 76 M80 86 L146 86 M80 96 L128 96" />
      <circle cx="72" cy="66" r="2.4" className="cc-art-fill" />
      <circle cx="72" cy="76" r="2.4" className="cc-art-fill" />
      <circle cx="72" cy="86" r="2.4" className="cc-art-fill" />
      <circle cx="72" cy="96" r="2.4" className="cc-art-fill" />
    </>
  );

const PlateDirectory = () =>
  P(
    <>
      <rect x="10" y="10" width="140" height="100" rx="5" />
      <path d="M10 26 L150 26" />
      <rect x="18" y="34" width="42" height="8" rx="4" />
      <rect x="18" y="46" width="18" height="7" rx="3.5" className="cc-art-fill" />
      <rect x="40" y="46" width="20" height="7" rx="3.5" />
      <rect x="18" y="58" width="42" height="20" rx="3" />
      <rect x="18" y="82" width="42" height="20" rx="3" />
      <path d="M68 34 L68 102 L142 102 L142 34 Z" />
      <circle cx="88" cy="52" r="3.4" className="cc-art-fill" />
      <circle cx="112" cy="46" r="3.4" className="cc-art-fill" />
      <circle cx="126" cy="66" r="3.4" className="cc-art-fill" />
      <circle cx="96" cy="82" r="3.4" className="cc-art-fill" />
      <circle cx="120" cy="90" r="3.4" className="cc-art-fill" />
    </>
  );

const PlateProfile = () =>
  P(
    <>
      <rect x="12" y="12" width="136" height="96" rx="5" />
      <circle cx="40" cy="40" r="16" />
      <path d="M64 30 L112 30" />
      <rect x="64" y="38" width="34" height="7" rx="3.5" className="cc-art-fill" />
      <rect x="102" y="38" width="22" height="7" rx="3.5" />
      <path d="M64 54 L138 54" />
      <path d="M22 68 L138 68" />
      {[22, 52, 82, 112].map((x) => (
        <rect key={x} x={x} y="76" width="24" height="22" rx="2" />
      ))}
    </>
  );

const PlateBench = () =>
  P(
    <>
      <path d="M14 76 L146 76 M26 76 L26 104 M134 76 L134 104" />
      <path d="M30 66 L54 66 L50 76 L34 76 Z" />
      <path d="M42 66 L42 52" />
      <rect x="36" y="40" width="12" height="12" rx="2" className="cc-art-fill" />
      <path d="M70 76 L70 44 Q70 36 78 36 L86 36" />
      <path d="M70 52 L88 52" strokeDasharray="3 4" />
      <ellipse cx="112" cy="68" rx="14" ry="8" />
      <path d="M98 68 Q112 82 126 68" />
      <circle cx="60" cy="24" r="3" className="cc-art-fill" />
      <circle cx="120" cy="30" r="2.4" className="cc-art-fill" />
    </>
  );

const PlateSheet = () =>
  P(
    <>
      <rect x="20" y="22" width="120" height="76" rx="3" />
      <path d="M52 44 L58 56 L72 58 L62 68 L64 82 L52 75 L40 82 L42 68 L32 58 L46 56 Z" strokeDasharray="4 4" />
      <circle cx="104" cy="52" r="14" strokeDasharray="4 4" />
      <circle cx="104" cy="52" r="7" strokeDasharray="4 4" />
      <path d="M96 82 L124 82" strokeDasharray="4 4" />
      <path d="M28 30 L34 30 M28 90 L34 90" />
    </>
  );

const PlateJewel = () =>
  P(
    <>
      <path d="M30 22 Q80 46 130 22" />
      <path d="M80 38 L80 52" />
      <path d="M80 52 L92 70 L80 92 L68 70 Z" />
      <path d="M80 62 L86 70 L80 80 L74 70 Z" className="cc-art-fill" />
      <ellipse cx="34" cy="88" rx="13" ry="14" />
      <ellipse cx="34" cy="88" rx="8" ry="9" />
      <ellipse cx="126" cy="88" rx="12" ry="13" />
      <ellipse cx="126" cy="88" rx="7" ry="8" />
    </>
  );

const PlateJournal = () =>
  P(
    <>
      <rect x="20" y="14" width="120" height="92" rx="5" />
      <path d="M32 32 L74 32" />
      <path d="M32 46 L128 46 M32 56 L120 56 M32 66 L126 66" />
      <rect x="32" y="78" width="26" height="9" rx="4.5" className="cc-art-fill" />
      <rect x="64" y="78" width="30" height="9" rx="4.5" />
      <path d="M112 96 L112 80" />
      <path d="M112 84 Q102 78 104 68 Q113 68 112 84" />
      <path d="M112 84 Q122 78 120 68 Q111 68 112 84" />
    </>
  );

const PlateGrowth = () =>
  P(
    <>
      <path d="M20 100 L146 100" />
      {[
        [38, 18],
        [72, 34],
        [106, 52],
        [136, 70],
      ].map(([x, h]) => (
        <g key={x}>
          <path d={`M${x - 9} 100 L${x - 7} ${100 - h * 0.34} L${x + 7} ${100 - h * 0.34} L${x + 9} 100 Z`} />
          <path d={`M${x} ${100 - h * 0.34} L${x} ${100 - h}`} />
          <path d={`M${x} ${100 - h * 0.7} Q${x - 11} ${100 - h * 0.82} ${x - 9} ${100 - h}`} />
          <path d={`M${x} ${100 - h * 0.55} Q${x + 11} ${100 - h * 0.68} ${x + 9} ${100 - h * 0.86}`} />
        </g>
      ))}
    </>
  );

const PlateVideo = () =>
  P(
    <>
      <rect x="14" y="14" width="132" height="80" rx="5" />
      <path d="M14 94 L146 94" />
      <circle cx="80" cy="52" r="20" />
      <path d="M73 42 L93 52 L73 62 Z" className="cc-art-fill" />
      <path d="M30 106 L130 106" />
      <circle cx="30" cy="106" r="3" className="cc-art-fill" />
    </>
  );

const PlateStack = () =>
  P(
    <>
      <rect x="14" y="14" width="132" height="20" rx="4" />
      <rect x="14" y="42" width="132" height="20" rx="4" />
      <rect x="14" y="70" width="132" height="20" rx="4" />
      <path d="M26 24 L48 24 M26 52 L44 52 M26 80 L52 80" />
      <rect x="108" y="19" width="26" height="10" rx="5" className="cc-art-fill" />
      <rect x="108" y="47" width="26" height="10" rx="5" />
      <rect x="108" y="75" width="26" height="10" rx="5" />
      <path d="M80 34 L80 42 M80 62 L80 70" />
      <path d="M14 100 L146 100" strokeDasharray="4 5" />
    </>
  );

/* ------------------------------ content --------------------------- */

const CARDS = [
  {
    /* -------------------------- MONTANA ARTS COUNCIL -------------- */
    title: "Montana Arts Council",
    cue: true, /* "Read More Below" under the case-study link */
    epithet: "Case Study",
    note: "An art directory that lets artists across a very large state find each other.",
    meta: "Design Intern · 2026",
    Art: ArtMap,
    float: "cc-float-1",
    lift: "0rem",
    variant: "gallery",
    role: "Product Design Intern · team of four",
    readMore: { label: "View Full Case Study", href: "https://canva.link/lpnreffab0yx1fd" },
    /* shown above the Problem heading instead of in the credits column */
    timeline: "May – August 2026",
    credits: [
      { label: "My role", value: "Owned the map directory from lo-fi wireframes to hi-fi prototypes, conducted four user interviews and usability testing on UserTesting with 6 participants" },
      { label: "Product manager", value: "Bennett Nepomuk" },
      { label: "Designers", value: "Derrick Chen, Thao Vy, Nathan Rodriguez" },
    ],
    summaryLabel: "Problem",
    summary: [
      "**Mapping Montana's emerging art scene.** Montana is the **fourth-largest state** by area, and its population is growing fast. With that growth, an art scene is emerging across the state, often led by small towns. But there's no central place for Montanans to find these artists. The Montana Arts Council wants to bridge this gap between artists, artistic organizations and Montanans.",
      "We framed the challenge as one question: how might we help Montanans **discover** other artists in Montana?",
    ],
    story: [
      { label: "Key decisions", detail: [
        "**Cities, not tourism regions.** Our first design filtered by the state's tourism regions. 5 of 6 testers found them confusing, so I made the case to the team and the client for filtering by city instead. In the next round, testers found an artist in under a minute.",
        "**A map plus a directory.** 6 of 6 testers preferred a map paired with a searchable directory over a directory alone, so the map became the way into the directory.",
        "**Pins on towns, not individual artists.** Pinning each artist would make big cities look crowded and small towns look empty. I pushed for marking towns instead, so every local art scene gets a place on the map.",
      ] },
      { label: "Outcome", detail: "MAC's front-end developers are building the directory from my high-fidelity prototype, using it as their implementation guide." },
    ],
    testimonials: [
      { text: "Geographical distance is super important for life in Montana; it dictates our activities and economy. By displaying these artist hubs, the directory helps bring light into the bustling art scene in smaller towns.", by: "Artistic director, Montana arts organization" },
      { text: "It is so great that I can use the directory to create visibility for art in my town by registering myself!", by: "Montana-based opera performer" },
    ],
    tags: ["UX Research", "User Interviews", "Usability Testing", "Information Architecture", "Wireframing", "Figma"],
    link: null,
    slides: [
      { src: IMG["mac-10"], Plate: PlateDirectory, caption: "The shipped directory: search, filters for artist, organization, city and discipline, and a map of Montana's arts cities." },
      { src: IMG["mac-11"], Plate: PlateDirectory, caption: "Discovery for travellers — a stop in a nearby town becomes a reason to find new art." },
      { src: IMG["mac-12"], Plate: PlateProfile, caption: "Artist profiles: discipline, region, links, biography, and a gallery of work." },
      { src: IMG["mac-13"], Plate: PlateProfile, caption: "Profile management — artists add disciplines and regions and curate their own artwork." },
    ],
  },
  {
    /* ---------------------------- EPATT --------------------------- */
    title: "EPATT",
    cue: true, /* "Read More Below" under the case-study link */
    epithet: "Class Project",
    note: "A productivity tool fueled by AI, giving lesson planners their evenings back.",
    meta: "AI lesson planning · 2026",
    Art: ArtTennis,
    float: "cc-float-2",
    lift: "2.5rem",
    variant: "gallery",
    role: "Product Designer · team of six",
    /* TODO: no url supplied for this one yet — paste the case-study link here. */
    readMore: { label: "View Full Case Study", href: "https://canva.link/8ife551eo5ca010" },
    /* shown above the Problem heading instead of in the credits column */
    timeline: "January – March 2026",
    credits: [
      { label: "My role", value: "Synthesized five user interviews, sketched early concepts, and owned the lesson-planning screen to high fidelity" },
      { label: "Product manager", value: "Asharah Jaman" },
      { label: "Designers", value: "Derrick Chen, Chloe Zhong, Sophia Jiang, Sky Flowers, Annie Lee" },
    ],
    summaryLabel: "Problem",
    summary: [
      "**East Palo Alto Tennis and Tutoring** provides tennis and literacy tutoring to about 100 students in East Palo Alto. Teachers build lesson plans for the volunteer tutors, but the student data they need is split between IXL and i-Ready, so every plan starts with switching between two dashboards.",
      "We asked: how might we help EPATT teachers plan lessons for tutors in **less time**?",
    ],
    story: [
      { label: "What we learned", detail: "Teachers wanted AI to save them time, but they still wanted the final say on what reached tutors. They also wanted to keep access to IXL and i-Ready analytics, and to have student notes on hand while planning." },
      { label: "Key decisions", detail: [
        "**AI drafts, teachers approve.** The AI combines each student's progress from IXL and i-Ready into a summary and a draft plan. On my lesson-planning screen, the teacher reviews and adjusts the plan before sending it, so nothing reaches a tutor without a teacher's sign-off.",
        "**Keep the analytics.** Instead of replacing IXL and i-Ready with AI summaries, I pushed to build their analytics into the platform, so teachers can check the source data without leaving it.",
        "**A student panel beside the plan.** Each student's history stays visible while the teacher plans.",
      ] },
      { label: "Outcome", detail: "We handed off our designs and findings from teachers to the CS52 student development team, who will build the platform." },
    ],
    tags: ["UX Research", "Need-finding", "AI Tooling", "Prototyping", "Product Design", "Figma"],
    link: null,
    slides: [
      { src: IMG["epatt-16"], Plate: PlateDirectory, caption: "Manage all students at ease — progress across every student, with an AI task summarizer for planning." },
      { src: IMG["epatt-17"], Plate: PlateGrowth, caption: "All-in-one lesson planning: generate and assign tutor tasks without leaving the tool." },
    ],
  },
  {
    /* -------------------------- SAP-A-SKILL ----------------------- */
    title: "Sap-a-Skill",
    cue: true, /* "Read More Below" under the case-study link */
    epithet: "Solo Build",
    note: "Teach a sapling what you picked up, and watch it grow as you do.",
    meta: "AI prototype · 2026",
    Art: ArtSprout,
    float: "cc-float-3",
    lift: "0.75rem",
    variant: "build",
    layout: "wide",
    role: "Solo build · designed and coded",
    credits: [
      { label: "Scope", value: "Education" },
    ],
    summary: [
      "Sap-a-Skill is a journaling learning tool designed to help the everyday learner document their learning in a way that provides evidence to their progress. When learners want to learn a skill they adopt a sapling that they can help grow when they start a new skill, hobby, or lecture material. Learners can directly see their learning progress with each session the sapling grows as they retrieve their new findings.",
      "Learners can log into the application at the end of each day, a eureka moment, or after a Duolingo lesson, to map on their progress of any findings they have had. Watch as the sapling grow with each step you take to document your learning journey!",
    ],
    tags: ["Product Requirements", "Product Design", "Ed Tech", "Conversational UI", "Prompt Design", "Solo Build"],
    link: { label: "View on GitHub", href: "#" },
    slides: [
      /* To add a Loom walkthrough, drop this line back in as the first entry
         and paste the embed url (swap /share/ for /embed/ in Loom's link):
         { embed: "https://www.loom.com/embed/VIDEO_ID", Plate: PlateVideo,
           caption: "Walkthrough recording of Sap-a-Skill." },                */
      { src: IMG["sap-01"], Plate: PlateJournal, caption: "The room: a shelf of pots, one per skill, and an empty pot waiting to be named." },
      { src: IMG["sap-02"], Plate: PlateStack, caption: "Teaching the sapling — it asks what you learned, then asks what else." },
      { src: IMG["sap-03"], Plate: PlateGrowth, caption: "The sapling grows a little taller with every session you teach it." },
    ],
    technical: {
      intro:
        "Built as a Claude project: the model plays the sapling, the interface keeps the record.",
      rows: [
        { label: "Interface", detail: "React with Tailwind. Three surfaces only: the room of pots, the teaching conversation, and the single-skill growth view." },
        { label: "The sapling", detail: "Your sapling is prompted to play a curious learner rather than a tutor — it asks what you learned, then asks what else, and never supplies the answer itself." },
        { label: "Why teaching", detail: "The protégé effect. Explaining to someone who doesn't know surfaces the gaps that re-reading hides, so the act of documenting is also the act of testing yourself." },
        { label: "Prompt design", detail: "The system prompt fixes the sapling's persona and forbids it from teaching back, so a session can't collapse into the user asking questions instead of answering them." },
        { label: "Data model", detail: "One record per skill, holding an ordered list of sessions. Growth stage is derived from session count rather than stored, so the transcript stays the single source of truth." },
        { label: "State", detail: "Local-first. Nothing leaves the device except the text of the session being taught." },
        { label: "Open problem", detail: "Nothing yet checks whether an explanation is any good — a confident wrong answer grows the plant exactly as much as a correct one." },
      ],
    },
  },
  {
    /* ------------------------- SILVERSMITHING --------------------- */
    title: "Silversmithing Project",
    epithet: "Class Project",
    note: "Rings and pendants, forged and finished by hand at the bench.",
    meta: "Sterling · 2025",
    Art: ArtSilver,
    float: "cc-float-4",
    lift: "3.25rem",
    variant: "process",
    stage: "portrait",
    role: "Class project · sterling silver",
    credits: [
      { label: "Material", value: "Sterling silver sheet, wire, and carving wax" },
      { label: "Methods", value: "Wax carving, casting, sawing, filing, forming, soldering, finishing" },
    ],
    summary: [
      "From paper designs to metal, I was tasked to create different pieces from the methods taught from piercing, fabrication, and wax carving. I wanted to take this project to create heirlooms inspired by the sky and my grandparents' zodiac signs.",
    ],
    tags: ["Physical Prototyping", "Ideation", "Craftsmanship", "Wax Carving", "Material Study"],
    link: null,
    slides: [
      { src: IMG["silver-01"], Plate: PlateJewel, caption: "Finished work on display: two silver pendant necklaces on a bust and two rings on a pad." },
      { src: IMG["silver-02"], Plate: PlateSheet, caption: "Panning sediment for gold in a wash tub outdoors." },
      { src: IMG["silver-03"], Plate: PlateSheet, caption: "A ring model carved from blue jeweler's wax, held up at the workbench beside a rotary tool." },
      { src: IMG["silver-04"], Plate: PlateBench, caption: "At the bench, sawing a small silver disc over a wooden bench pin." },
      { src: IMG["silver-05"], Plate: PlateBench, caption: "Close view of hands guiding a jeweler's saw blade through sheet silver on the bench pin." },
    ],
    process: [
      { title: "Ideation" },
      { title: "Wax carving" },
      { title: "Casting" },
      { title: "Layout and sawing" },
      { title: "Filing and forming" },
      { title: "Soldering" },
      { title: "Finishing" },
    ],
  },
];

/* Start fetching a case study's first two slides as soon as its card is
   hovered or focused, so they're ready by the time the flip finishes. */
const warmed = new Set();
function warmSlides(card) {
  (card.slides || []).slice(0, 2).forEach((s) => {
    if (!s.src || warmed.has(s.src)) return;
    warmed.add(s.src);
    const im = new Image();
    im.decoding = "async";
    im.src = s.src;
  });
}

/* ------------------------------- page ----------------------------- */

export default function ClowCardPortfolio() {
  const [galleryIn, setGalleryIn] = useState(false);
  const [flipped, setFlipped] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [calm, setCalm] = useState(() => reduced());

  const galleryRef = useRef(null);
  const frame = useRef(0);
  const flipTimer = useRef(null);
  const cardRefs = useRef([]);
  /* scroll-driven layers, updated directly each frame (no React re-render) */
  const dawnRef = useRef(null);
  const starsRef = useRef(null);
  const cloudRefs = useRef([]);
  const dustRef = useRef(null);
  const hazeRef = useRef(null);
  const heroRef = useRef(null);
  const cueRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setCalm(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setGalleryIn(true), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const collect = useCallback(
    (i) => {
      if (openIndex !== null) return;
      setFlipped(i);
      if (flipTimer.current) clearTimeout(flipTimer.current);
      flipTimer.current = setTimeout(() => setOpenIndex(i), reduced() ? 0 : 620);
    },
    [openIndex]
  );

  const release = useCallback(() => {
    const i = openIndex;
    setOpenIndex(null);
    if (flipTimer.current) clearTimeout(flipTimer.current);
    flipTimer.current = setTimeout(() => setFlipped(null), 220);
    if (i !== null && cardRefs.current[i]) cardRefs.current[i].focus();
  }, [openIndex]);

  const stars = useMemo(() => {
    const r = mulberry32(20260805);
    return Array.from({ length: 150 }, () => ({
      left: r() * 100, top: r() * 105, size: 0.7 + r() * 2.1,
      dur: 2.6 + r() * 5.4, delay: r() * 6, base: 0.25 + r() * 0.6, gold: r() > 0.86,
    }));
  }, []);
  const clouds = useMemo(() => {
    const r = mulberry32(778);
    return Array.from({ length: 9 }, (_, i) => ({
      left: -20 + r() * 120, top: 4 + r() * 84, w: 30 + r() * 44,
      blur: 18 + r() * 34, op: 0.16 + r() * 0.3, dur: 46 + r() * 60,
      delay: -r() * 60, near: i % 2 === 0,
    }));
  }, []);
  const dust = useMemo(() => {
    const r = mulberry32(4242);
    return Array.from({ length: 46 }, () => ({
      left: r() * 100, size: 1 + r() * 2.4, dur: 14 + r() * 22,
      delay: -r() * 34, drift: -30 + r() * 60, gold: r() > 0.55,
    }));
  }, []);
  const band = useMemo(() => {
    const r = mulberry32(9111);
    return Array.from({ length: 7 }, () => ({
      left: -14 + r() * 116, top: r() * 92, w: 26 + r() * 40,
      blur: 22 + r() * 30, op: 0.3 + r() * 0.4, dur: 60 + r() * 70, delay: -r() * 70,
    }));
  }, []);

  /* The night-to-dawn scroll. Writes styles straight onto seven elements each
     frame instead of re-rendering ~220 React nodes, which was the main source
     of scroll lag. */
  useEffect(() => {
    const paint = () => {
      frame.current = 0;
      const sy = window.scrollY || 0;
      const vh = window.innerHeight || 900;
      const p = clamp(sy / Math.max(vh * 0.85, 1), 0, 1);
      /* eased copy of p for the sky colour, so dawn starts and ends gently */
      const pSky = p * p * (3 - 2 * p);
      /* reduced motion: keep the colour change, drop the scroll parallax */
      const mv = calm ? 0 : 1;
      const set = (el, css) => { if (el) Object.assign(el.style, css); };
      set(dawnRef.current, { opacity: pSky });
      set(starsRef.current, { transform: `translate3d(0,${-sy * 0.1 * mv}px,0)`, opacity: 1 - pSky * 0.55 });
      clouds.forEach((c, i) => set(cloudRefs.current[i], {
        transform: `translate3d(0,${-sy * (c.near ? 0.42 : 0.24) * mv}px,0)`,
        /* clouds barely brighten at dawn, so they never form a white glow behind the cards */
        opacity: (0.55 + pSky * 0.12) * c.op * (c.near ? 1.15 : 1),
      }));
      set(dustRef.current, { transform: `translate3d(0,${-sy * 0.55 * mv}px,0)` });
      set(hazeRef.current, { opacity: 0.3 + pSky * 0.7 });
      set(heroRef.current, {
        transform: `translate3d(0,${-sy * 0.3 * mv}px,0) scale(${1 - p * 0.07 * mv})`,
        opacity: clamp(1 - p * 1.5, 0, 1),
        /* no filter at rest, so the hero isn't kept on an expensive blur layer */
        filter: p > 0.005 ? `blur(${(p * 5).toFixed(2)}px)` : "none",
        visibility: p >= 0.67 ? "hidden" : "visible",
      });
      set(cueRef.current, { opacity: clamp(1 - p * 2.4, 0, 1) });
    };
    const onScroll = () => { if (!frame.current) frame.current = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
      if (flipTimer.current) clearTimeout(flipTimer.current);
    };
  }, [clouds, calm]);

  return (
    <div className={`relative w-full cc-root ${openIndex !== null ? "cc-modal-open" : ""}`} style={{ background: "#0A192F" }}>
      <style>{CSS}</style>

      <NavBar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 cc-sky-night" />
        <div ref={dawnRef} className="absolute inset-0 cc-sky-dawn" style={{ opacity: 0 }} />

        <div ref={starsRef} className="absolute inset-0 cc-layer">
          {stars.map((s, i) => (
            <span
              key={i}
              className="cc-star"
              style={{
                left: `${s.left}%`, top: `${s.top}%`,
                width: `${s.size}px`, height: `${s.size}px`, opacity: s.base,
                background: s.gold ? "#FFD700" : "#E0F2FF",
                boxShadow: s.gold ? "0 0 6px 1px rgba(255,215,0,.75)" : "0 0 5px 1px rgba(224,242,255,.6)",
                animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        {clouds.map((c, i) => (
          <div
            key={i}
            ref={(el) => (cloudRefs.current[i] = el)}
            className="absolute cc-layer"
            style={{
              left: `${c.left}%`, top: `${c.top}%`,
              width: `${c.w}vw`, height: `${c.w * 0.34}vw`,
              opacity: 0.55 * c.op * (c.near ? 1.15 : 1),
            }}
          >
            {/* blur lives on the drifting element itself, so it is drawn once
                and slid by the compositor instead of re-blurred every frame */}
            <div className="cc-cloud" style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, filter: `blur(${c.blur}px)` }} />
          </div>
        ))}

        <div ref={dustRef} className="absolute inset-0 cc-layer">
          {dust.map((d, i) => (
            <span
              key={i}
              className="cc-dust"
              style={{
                left: `${d.left}%`, width: `${d.size}px`, height: `${d.size}px`,
                background: d.gold ? "rgba(255,215,0,.9)" : "rgba(184,167,255,.9)",
                animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`,
                ["--cc-drift"]: `${d.drift}px`,
              }}
            />
          ))}
        </div>

        <div ref={hazeRef} className="absolute inset-0 cc-haze" style={{ opacity: 0.3 }} />

        {/* Brightness trim for the sky only: 10% darker, set by --cc-dim.
            It lives here, behind every piece of content, so text, cards,
            controls and the modal are never dimmed. */}
        <div className="cc-dim" aria-hidden="true" />
      </div>

      <header className="cc-hero relative flex items-center justify-center px-6" style={{ zIndex: 2 }}>
        <div ref={heroRef} className="text-center" style={{ willChange: "transform, opacity" }}>
          <div className="relative flex items-center justify-center">
            <div className="cc-seal cc-seal-outer" />
            <div className="cc-seal cc-seal-inner" />
            <div className="relative" style={{ zIndex: 1 }}>
              <p className="cc-eyebrow">Stanford HCI · Class 2028</p>
              <h1 className="cc-name">
                Hi, I&rsquo;m<span className="cc-name-break"> </span>Derrick.
              </h1>
              <p className="cc-tagline">I design products that start with people&rsquo;s needs.</p>
            </div>
          </div>
        </div>

        <div ref={cueRef} className="absolute cc-cue">
          <span>Scroll to open the book</span>
          <svg viewBox="0 0 24 14" aria-hidden="true">
            <path d="M2 2 L12 11 L22 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </header>

      <section id="work" ref={galleryRef} className="relative px-6 cc-anchor" style={{ zIndex: 2, paddingTop: "5rem", paddingBottom: "2rem" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none cc-band-fade" style={{ zIndex: 0 }}>
          <div className="absolute inset-0 cc-band-sky" />
          {band.map((c, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${c.left}%`, top: `${c.top}%`,
                width: `${c.w}vw`, height: `${c.w * 0.36}vw`,
                /* softened: these sit directly behind the cards */
                opacity: c.op * 0.45, filter: `blur(${c.blur}px)`,
              }}
            >
              <div className="cc-cloud" style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} />
            </div>
          ))}
        </div>

        <div className="relative w-full mx-auto" style={{ zIndex: 1, maxWidth: "72rem" }}>
          <div className={`cc-intro cc-reveal ${galleryIn ? "cc-in" : ""}`}>
            <p className="cc-eyebrow cc-eyebrow-left">The collection</p>
            <h2 className="cc-h2">Projects</h2>
            <p className="cc-lede">
              Each card holds one project: what it was for, who it was for.
            </p>
          </div>

          <div className="cc-deck">
            {CARDS.map((c, i) => (
              <div
                key={c.title}
                className={`cc-slot cc-reveal ${galleryIn ? "cc-in" : ""}`}
                style={{ transitionDelay: `${160 + i * 130}ms`, ["--cc-lift"]: c.lift }}
              >
                <button
                  type="button"
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={`cc-clow ${c.float}`}
                  onPointerEnter={() => warmSlides(c)}
                  onFocus={(e) => {
                    warmSlides(c);
                    /* keyboard focus: bring the whole card and its focus ring
                       into view, clear of the fixed nav (scroll-padding-top on
                       html, plus the card's scroll-margin for the ring) */
                    if (e.currentTarget.matches(":focus-visible")) e.currentTarget.scrollIntoView({ block: "nearest", behavior: "instant" });
                  }}
                  onTouchStart={() => warmSlides(c)}
                  onClick={() => collect(i)}
                  aria-haspopup="dialog"
                  aria-label={`${c.title} — open case study`}
                  aria-describedby={`cc-note-${i}`}
                >
                  <span className="cc-aura" aria-hidden="true" />
                  <span className={`cc-flipper ${flipped === i ? "cc-flipped" : ""}`}>
                    <span className="cc-clow-face cc-face-front">
                      <Ornaments />
                      <Crest />
                      <span className="cc-clow-art">
                        <c.Art />
                      </span>
                      <span className="cc-clow-epithet">{c.epithet}</span>
                      <span className="cc-clow-banner">
                        <span className="cc-clow-title">{c.title}</span>
                        <span className="cc-clow-meta">{c.meta}</span>
                      </span>
                    </span>
                    <span className="cc-clow-face cc-face-back" aria-hidden="true">
                      <Ornaments />
                      <span className="cc-back-sigil">
                        <svg viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="26" />
                          <circle cx="60" cy="60" r="17" />
                          <circle cx="60" cy="60" r="5" className="cc-art-fill" />
                          <path d="M60 6 L60 26 M60 94 L60 114 M6 60 L26 60 M94 60 L114 60" />
                          <path d="M22 22 L36 36 M84 84 L98 98 M98 22 L84 36 M36 84 L22 98" />
                          <path d="M60 34 Q76 44 76 60 Q76 76 60 86 Q68 70 68 60 Q68 50 60 34 Z" className="cc-art-fill" />
                        </svg>
                      </span>
                      <span className="cc-back-word">View project</span>
                    </span>
                  </span>
                </button>
                <p id={`cc-note-${i}`} className="cc-slot-note">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Connect />

      {openIndex !== null && <CollectedCard card={CARDS[openIndex]} onClose={release} />}
    </div>
  );
}

/* ---------------------------- navigation ----------------------------
   A fixed bar: a miniature tarot card on the left that flips on click
   (front: the contact card's star, back: the project cards' sigil), and
   two anchor links on the right. It sits above page content (z 50) but
   under the case-study modal (z 60). */

/* one place for the resume link: the nav and the About Me buttons both use it */
const RESUME_URL = "https://docs.google.com/document/d/1JpxiE9R8AIgwGpqddn_0uD2h4ZaifvQu3H7LXZgjKeg/edit?usp=sharing";

const NAV_LINKS = [
  { id: "work", label: "Case Studies" },
  { id: "about", label: "About Me" },
];

function NavBar() {
  const [flipped, setFlipped] = useState(false);
  const [active, setActive] = useState(null);

  /* highlight the section the visitor is in */
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const vh = window.innerHeight;
      const about = document.getElementById("about");
      const work = document.getElementById("work");
      let next = null;
      if (about && about.getBoundingClientRect().top < vh * 0.55) next = "about";
      else if (work) {
        const r = work.getBoundingClientRect();
        if (r.top < vh * 0.5 && r.bottom > vh * 0.2) next = "work";
      }
      setActive(next);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* About Me lives in the band that opens at the very bottom of the page,
     so this scrolls all the way down and moves focus into the band, which
     opens it. The href still points at #about for new tabs and no-JS. */
  const goAbout = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
    history.replaceState(null, "", "#about");
    document.getElementById("about-title")?.focus({ preventScroll: true });
  };

  return (
    <nav className="cc-navbar" aria-label="Primary">
      <div className="cc-navbar-in">
        <div className="cc-navleft">
        <button
          type="button"
          className={`cc-navcard ${flipped ? "cc-navcard-flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label="Flip the card"
        >
          <span className="cc-navcard-tilt" aria-hidden="true">
            <span className="cc-navcard-inner">
              <span className="cc-navcard-face cc-navcard-front">
                <Ornaments />
                <svg viewBox="0 0 60 60" className="cc-navcard-glyph">
                  <path className="cc-glyph-fill" d="M30 7 L33.6 22.4 L49 26 L33.6 29.6 L30 45 L26.4 29.6 L11 26 L26.4 22.4 Z" />
                  <path className="cc-glyph-fill" d="M46 36 L47.7 41 L52.7 42.7 L47.7 44.4 L46 49.4 L44.3 44.4 L39.3 42.7 L44.3 41 Z" />
                  <path className="cc-glyph-fill" d="M14.5 38 L15.8 41.8 L19.6 43.1 L15.8 44.4 L14.5 48.2 L13.2 44.4 L9.4 43.1 L13.2 41.8 Z" />
                </svg>
              </span>
              <span className="cc-navcard-face cc-navcard-back">
                <Ornaments />
                <svg viewBox="0 0 120 120" className="cc-navcard-sigil">
                  <circle cx="60" cy="60" r="26" />
                  <circle cx="60" cy="60" r="5" className="cc-art-fill" />
                  <path d="M60 10 L60 28 M60 92 L60 110 M10 60 L28 60 M92 60 L110 60" />
                  <path d="M60 34 Q76 44 76 60 Q76 76 60 86 Q68 70 68 60 Q68 50 60 34 Z" className="cc-art-fill" />
                </svg>
              </span>
            </span>
          </span>
        </button>

        <a className="cc-navlink cc-navlink-ext" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
          Resume
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 8.5 L8.5 3.5 M4.5 3.5 L8.5 3.5 L8.5 7.5" /></svg>
          <span className="cc-sr"> (opens in a new tab)</span>
        </a>
        </div>

        <ul className="cc-navlinks">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`cc-navlink ${active === l.id ? "cc-navlink-on" : ""}`}
                aria-current={active === l.id ? "location" : undefined}
                onClick={l.id === "about" ? goAbout : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ------------------------- let's connect --------------------------
   A tilted card rests below the gallery. Dragging it down — or simply
   tapping it — slides it open into a full-bleed band carrying the
   portrait and the contact links.

   Tap does everything the drag does, deliberately: nothing here is gated
   behind a gesture a visitor has to discover.
   ------------------------------------------------------------------ */

/* Drop a square 1:1 photo here, around 800px. Until it exists the frame
   shows the monogram — the same silent fallback the slides use. */
const PHOTO = { src: "images/opt/derrick.webp", alt: "Derrick Chen", monogram: "DC" };

/* GROUP is the resting card plus its prompt, measured top to bottom:
   card (133) + gap (34) + words and chevron (~92) + top offset (~46).
   PAUSE is how much further you scroll before anything moves. */
const CX = { W: 88, H: 133, ANGLE: 25, GROUP: 320, PAUSE: 50 };

const REACH = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/derrick-chen-0148aa316/",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8" cy="8.6" r="1.1" className="cc-glyph-fill" />
        <path d="M8 11.6 L8 17.5" />
        <path d="M12 17.5 L12 11.6 M12 14.2 Q12 11.6 14.6 11.6 Q16.6 11.6 16.6 14.4 L16.6 17.5" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: RESUME_URL,
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 2.5 L14.5 2.5 L19 7 L19 21.5 L6 21.5 Z" />
        <path d="M14.5 2.5 L14.5 7 L19 7" />
        <path d="M9 11.5 L16 11.5 M9 14.5 L16 14.5 M9 17.5 L13.5 17.5" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:djchen@stanford.edu",
    reveal: "djchen@stanford.edu",
    /* sealed */
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M3.5 6.5 L12 13 L20.5 6.5" />
      </svg>
    ),
    /* opened — flap up, letter showing */
    glyphOpen: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="3" width="10" height="8.5" rx="1" />
        <path d="M9.2 5.6 L14.8 5.6 M9.2 8 L13 8" />
        <path d="M3 10.5 L3 19 Q3 20.2 4.2 20.2 L19.8 20.2 Q21 20.2 21 19 L21 10.5" />
        <path d="M3 10.5 L12 16.4 L21 10.5" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/derrickcpro",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7" cy="6" r="2.4" />
        <circle cx="7" cy="18" r="2.4" />
        <circle cx="17" cy="9.5" r="2.4" />
        <path d="M7 8.4 L7 15.6" />
        <path d="M17 11.9 Q17 15.6 7 15.6" />
      </svg>
    ),
  },
];

function Connect() {
  /* Scroll position is the default driver. `manual` is only set when someone
     drags or taps the card, and it takes over while it isn't null. */
  const [scrollP, setScrollP] = useState(0);
  const [manual, setManual] = useState(null);
  const [box, setBox] = useState({ w: 1200, h: 440, vh: 900 });
  const [imgFailed, setImgFailed] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);

  const stageRef = useRef(null);
  const manualRef = useRef(null);
  const liveRef = useRef(0);
  const raf = useRef(0);
  const tick = useRef(0);
  const drag = useRef({ on: false, y0: 0, base: 0, moved: 0 });

  const setManualBoth = useCallback((v) => {
    manualRef.current = v;
    setManual(v);
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (el) setBox({ w: el.clientWidth, h: el.clientHeight, vh: window.innerHeight });
    };
    /* Two stages, deliberately.

       Stage one is a dead zone: nothing animates until the resting card and its
       prompt are entirely on screen, plus a short pause. You get to look at the
       card sitting still rather than catching it already mid-flight.

       Stage two is the confirmation scroll — carrying on past that point drives
       the expansion, finishing just short of the page bottom so you arrive at a
       band that has already settled. */
    const readScroll = () => {
      tick.current = 0;
      const el = stageRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const beginAt = vh - (CX.GROUP + CX.PAUSE); /* r.top once the card has settled */
      const endAt = vh - r.height + 40;           /* just before max scroll */
      const runway = Math.max(beginAt - endAt, 1);
      setScrollP(clamp((beginAt - r.top) / runway, 0, 1));
    };
    const onScroll = () => {
      if (!tick.current) tick.current = requestAnimationFrame(readScroll);
    };
    measure();
    readScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      measure();
      readScroll();
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (tick.current) cancelAnimationFrame(tick.current);
    };
  }, []);

  const animateTo = useCallback(
    (target, ms) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (reduced()) {
        setManualBoth(target === 0 ? null : target);
        return;
      }
      const from = liveRef.current;
      const t0 = performance.now();
      const step = (now) => {
        const k = clamp((now - t0) / ms, 0, 1);
        setManualBoth(lerp(from, target, ease(k)));
        if (k < 1) raf.current = requestAnimationFrame(step);
        else if (target === 0) setManualBoth(null); /* hand control back to scroll */
      };
      raf.current = requestAnimationFrame(step);
    },
    [setManualBoth]
  );

  /* ---- one number drives every value below ---- */
  const p = manual != null ? manual : scrollP;
  liveRef.current = p;

  /* The band is sized to its contents, not to a thin strip. Below 640px the
     panel stacks, so it needs considerably more height. */
  const STACK_AT = 800; /* matches the (max-width: 799px) block in the CSS */
  const stacked = box.w < STACK_AT;
  /* small laptops: side by side, but the text column is narrower, so the bio runs longer */
  const narrow = !stacked && box.w < 1100;
  /* never taller than the screen below the fixed nav, so the whole band is
     reachable; if the bio still doesn't fit, the panel scrolls inside */
  const endH = Math.min(
    stacked ? clamp(box.h * 0.92, 640, 760)
      : narrow ? clamp(box.h * 0.9, 500, 720)
      : clamp(box.h * 0.72, 470, 560),
    box.vh - 64
  );
  /* Internal spacing scales with the band so the contents keep their
     proportions instead of rattling around in a taller box. */
  const pad = Math.round(clamp(endH * 0.075, 16, 36));
  const shotMax = Math.round(clamp(endH - pad * 2, 110, 260));
  const startTop = 46;

  const w = lerp(CX.W, box.w, ease(seg(p, 0.06, 0.9)));
  const h = p < 0.6
    ? lerp(CX.H, 128, ease(seg(p, 0.06, 0.6)))
    : lerp(128, endH, ease(seg(p, 0.6, 1)));
  /* centred throughout, so left lands on 0 exactly when w reaches full width */
  const left = (box.w - w) / 2;
  const top = lerp(startTop, box.h - endH, ease(seg(p, 0.06, 1)));
  const angle = lerp(CX.ANGLE, 0, ease(seg(p, 0.06, 0.5)));

  const resting = p < 0.02;
  const landed = p > 0.98;

  const onDown = (e) => {
    if (liveRef.current > 0.5) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    drag.current = { on: true, y0: e.clientY, base: liveRef.current, moved: 0 };
    setManualBoth(liveRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.on) return;
    const dy = e.clientY - d.y0;
    d.moved = dy;
    if (dy > 0) setManualBoth(clamp(d.base + dy / 240, 0, 1));
  };
  const onUp = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    const open = liveRef.current > 0.24;
    animateTo(open ? 1 : 0, open ? 880 : 420);
  };

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });

  return (
    <footer id="about" ref={stageRef} className="cc-cx-stage">
      <div
        className={`cc-cx-prompt ${resting ? "cc-cx-rest" : ""}`}
        style={{ opacity: 1 - seg(p, 0.01, 0.16), top: startTop + CX.H + 34 }}
      >
        <span className="cc-cx-words">Let&rsquo;s Connect, Swipe Down!</span>
        <span className="cc-cx-chev" style={{ width: CX.W }} aria-hidden="true">
          <svg viewBox="0 0 88 32" preserveAspectRatio="none">
            <path d="M5 5 L44 27 L83 5" />
          </svg>
        </span>
      </div>

      <div
        className={`cc-cx-card ${resting ? "cc-cx-rest" : ""} ${landed ? "cc-cx-landed" : ""}`}
        style={{
          width: w, height: h, left, top,
          rotate: `${angle.toFixed(2)}deg`,
          borderLeftWidth: landed ? 0 : 1,
          borderRightWidth: landed ? 0 : 1,
          borderBottomWidth: landed ? 0 : 1,
        }}
      >
        <Ornaments />

        <span className="cc-cx-face" style={{ opacity: 1 - seg(p, 0.08, 0.34) }} aria-hidden="true">
          <svg viewBox="0 0 60 60">
            <path className="cc-glyph-fill" d="M30 7 L33.6 22.4 L49 26 L33.6 29.6 L30 45 L26.4 29.6 L11 26 L26.4 22.4 Z" />
            <path className="cc-glyph-fill" d="M46 36 L47.7 41 L52.7 42.7 L47.7 44.4 L46 49.4 L44.3 44.4 L39.3 42.7 L44.3 41 Z" />
            <path className="cc-glyph-fill" d="M14.5 38 L15.8 41.8 L19.6 43.1 L15.8 44.4 L14.5 48.2 L13.2 44.4 L9.4 43.1 L13.2 41.8 Z" />
          </svg>
        </span>

        {/* Links live outside the drag button, so they stay reachable by keyboard.
            Focusing anything inside snaps the panel open. */}
        <div
          className="cc-cx-panel"
          style={{
            opacity: seg(p, 0.76, 1),
            pointerEvents: p > 0.9 ? "auto" : "none",
            paddingTop: pad,
            paddingBottom: pad,
          }}
          onFocus={() => animateTo(1, 320)}
        >
          <div className="cc-cx-shot" style={{ maxHeight: shotMax }}>
            {PHOTO.src && !imgFailed ? (
              <img src={PHOTO.src} alt={PHOTO.alt} loading="lazy" decoding="async" onError={() => setImgFailed(true)} />
            ) : (
              <span className="cc-cx-mono" aria-label={PHOTO.alt}>{PHOTO.monogram}</span>
            )}
          </div>

          <div className="cc-cx-say">
            {/* focus target for the nav's About Me link; focusing it opens the band */}
            <h2 id="about-title" className="cc-cx-title" tabIndex={-1}>About Me</h2>
            <p className="cc-cx-line">
              Stanford HCI &middot; Class 2028. Open to internships and new grad roles.
            </p>
            <p className="cc-cx-bio">
              I&rsquo;m a designer, developer, and a curious problem-solver studying
              Computer Science on the Human-Computer Interaction track at Stanford. I love
              figuring out how things work, how people interact with them the way they do
              and improve their experiences. My work lives in the intersection of design,
              technology and storytelling. I&rsquo;m drawn to projects that work to bring
              people together and help express themselves. Outside of design, I&rsquo;m
              always looking for ways to explore visual arts by working on a silversmithing
              project or cross pattern.
            </p>
            <div className="cc-cx-btns">
              {REACH.map((r) => {
                /* The mail button reveals the address on first click and only
                   hands off to the mail client on the second, so nobody has to
                   launch an app just to read it. */
                if (r.reveal) {
                  return (
                    <a
                      key={r.label}
                      className={`cc-glass-btn cc-mail ${mailOpen ? "cc-mail-open" : ""}`}
                      href={r.href}
                      aria-label={mailOpen ? `Send mail to ${r.reveal}` : "Show my email address"}
                      onClick={(e) => {
                        if (!mailOpen) {
                          e.preventDefault();
                          setMailOpen(true);
                        }
                      }}
                    >
                      <span className="cc-glass-glyph">{mailOpen ? r.glyphOpen : r.glyph}</span>
                      {mailOpen ? r.reveal : r.label}
                    </a>
                  );
                }
                return (
                  <a
                    key={r.label}
                    className="cc-glass-btn"
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="cc-glass-glyph">{r.glyph}</span>
                    {r.label}
                  </a>
                );
              })}
            </div>
          </div>

          <button type="button" className="cc-startop" onClick={toTop} aria-label="Back to top">
            <span className="cc-startop-art" aria-hidden="true">
              <svg viewBox="0 0 40 40">
                <path className="cc-startop-tail cc-tail-1" d="M33 7 L19 21" />
                <path className="cc-startop-tail cc-tail-2" d="M36 13 L26 23" />
                <path className="cc-startop-tail cc-tail-3" d="M27 4 L17 14" />
                <path className="cc-glyph-fill" d="M13 19 L15.4 24.6 L21 27 L15.4 29.4 L13 35 L10.6 29.4 L5 27 L10.6 24.6 Z" />
              </svg>
            </span>
            <span className="cc-startop-label">Top</span>
          </button>
        </div>
      </div>

      {/* invisible handle over the resting card: tilts, bounces and drags with it */}
      {p <= 0.5 && (
        <button
          type="button"
          className={`cc-cx-grab ${resting ? "cc-cx-rest" : ""}`}
          style={{ width: w, height: h, left, top, rotate: `${angle.toFixed(2)}deg` }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onClick={() => {
            if (Math.abs(drag.current.moved) < 6 && liveRef.current < 0.5) animateTo(1, 1100);
          }}
          aria-label="Open contact details"
          aria-expanded={p > 0.9}
        />
      )}
    </footer>
  );
}

/* ---------------------- the collected card view -------------------- */

function CollectedCard({ card, onClose }) {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const closeRef = useRef(null);
  const total = card.slides.length;
  const wide = card.layout === "wide" || card.variant === "gallery";
  const portrait = card.stage === "portrait";
  const filmstrip = total >= 4;

  const go = useCallback(
    (delta) => {
      setDir(delta);
      setSlide((s) => (s + delta + total) % total);
    },
    [total]
  );

  const jump = useCallback(
    (i) => {
      setDir(i > slide ? 1 : -1);
      setSlide(i);
    },
    [slide]
  );

  /* once, on open: focus Close and lock the page behind the modal.
     Kept apart from the key handler below, which re-binds on every slide
     change; re-focusing Close then would yank the modal back to the top. */
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  const current = card.slides[slide];
  const titleBlock = (
    <>
      <p className="cc-rail-epithet">{card.epithet}</p>
      <h3 className="cc-rail-title">{card.title}</h3>
      <p className="cc-rail-role">{card.role}</p>
    </>
  );

  return (
    <div
      className="cc-scrim"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`cc-modal ${wide ? "cc-modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={`${card.title} case study`}>
        <button ref={closeRef} type="button" className="cc-close" onClick={onClose} aria-label="Close card">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.5 7.5 L16.5 16.5 M16.5 7.5 L7.5 16.5" />
          </svg>
        </button>

        <Ornaments />

        {wide && <header className="cc-head">{titleBlock}</header>}

        <div className={`cc-body ${wide ? "cc-body-wide" : "cc-body-split"}`}>
          <div className="cc-show">
            <div className={`cc-stage-frame ${wide ? "cc-stage-wide" : ""} ${portrait ? "cc-stage-portrait" : ""}`}>
              <SlideView key={slide} slide={current} dir={dir} />
              <button type="button" className="cc-nav cc-nav-prev" onClick={() => go(-1)} aria-label="Previous image">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 4 L7 12 L15 20" />
                </svg>
              </button>
              <button type="button" className="cc-nav cc-nav-next" onClick={() => go(1)} aria-label="Next image">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 4 L17 12 L9 20" />
                </svg>
              </button>
              {card.cue && <MoreCue />}
            </div>

            <div className="cc-show-bar">
              <span className="cc-count">
                {String(slide + 1).padStart(2, "0")} <span className="cc-count-sep">/</span> {String(total).padStart(2, "0")}
              </span>
              {!filmstrip && (
                <span className="cc-dots">
                  {card.slides.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`cc-dot ${i === slide ? "cc-dot-on" : ""}`}
                      onClick={() => jump(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-current={i === slide}
                    />
                  ))}
                </span>
              )}
            </div>

            {/* announced to screen readers only — no visible caption */}
            <span className="cc-sr" aria-live="polite">{current.caption}</span>

            {filmstrip && (
              <div className={`cc-film ${portrait ? "cc-film-photo" : ""}`}>
                {card.slides.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`cc-thumb ${i === slide ? "cc-thumb-on" : ""}`}
                    onClick={() => jump(i)}
                    aria-label={`Go to image ${i + 1}`}
                    aria-current={i === slide}
                  >
                    <Thumb slide={s} />
                  </button>
                ))}
              </div>
            )}
            {card.readMore && (
              <a
                className="cc-rail-link cc-more"
                href={card.readMore.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {card.readMore.label}
                <svg viewBox="0 0 20 12" aria-hidden="true">
                  <path d="M1 6 L18 6 M13 1 L18 6 L13 11" />
                </svg>
              </a>
            )}
          </div>

          <div className="cc-rail">
            {!wide && <div className="cc-rail-head">{titleBlock}</div>}

            <div className="cc-rail-main">
              {card.timeline && (
                <dl className="cc-credits cc-rail-timeline">
                  <div className="cc-credit">
                    <dt>Timeline</dt>
                    <dd>{card.timeline}</dd>
                  </div>
                </dl>
              )}
              {card.summaryLabel && <p className="cc-rail-label">{card.summaryLabel}</p>}
              {card.summary.map((para, i) => (
                <p key={i} className="cc-rail-p"><Rich text={para} /></p>
              ))}
            </div>

            <div className="cc-rail-side">
              {card.credits && (
                <dl className="cc-credits">
                  {card.credits.map((c) => (
                    <div key={c.label} className="cc-credit">
                      <dt>{c.label}</dt>
                      <dd>{c.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="cc-tagblock">
                <p className="cc-tag-label">Project tags</p>
                <div className="cc-tags">
                  {card.tags.map((t) => (
                    <button key={t} type="button" className="cc-pill">{t}</button>
                  ))}
                </div>
              </div>

              {card.link && (
                <a className="cc-rail-link" href={card.link.href}>
                  {card.link.label}
                  <svg viewBox="0 0 20 12" aria-hidden="true">
                    <path d="M1 6 L18 6 M13 1 L18 6 L13 11" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {card.story && (
          <section className="cc-below">
            <p className="cc-below-label">Decisions and outcome</p>
            <dl className="cc-tech">
              {card.story.map((r, i) => (
                <div key={i} className="cc-tech-row">
                  <dt>{r.label}</dt>
                  <dd>
                    {Array.isArray(r.detail)
                      ? r.detail.map((d, j) => <p key={j} className="cc-tech-p"><Rich text={d} /></p>)
                      : <Rich text={r.detail} />}
                    {r.quote && (
                      <blockquote className="cc-quote">
                        <p>“{r.quote.text}”</p>
                        <cite>{r.quote.by}</cite>
                      </blockquote>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {card.testimonials && (
          <section className="cc-below">
            <p className="cc-below-label">User testimonials</p>
            <div className="cc-testimonials">
              {card.testimonials.map((q, i) => (
                <blockquote key={i} className="cc-quote">
                  <p>“{q.text}”</p>
                  <cite>{q.by}</cite>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {card.technical && (
          <section className="cc-below">
            <p className="cc-below-label">Technical breakdown</p>
            <p className="cc-below-intro">{card.technical.intro}</p>
            <dl className="cc-tech">
              {card.technical.rows.map((r) => (
                <div key={r.label} className="cc-tech-row">
                  <dt>{r.label}</dt>
                  <dd>{r.detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {card.process && (
          <section className="cc-below">
            <p className="cc-below-label">Process</p>
            <ol className="cc-process">
              {card.process.map((s, i) => (
                <li key={s.title} className="cc-step">
                  <span className="cc-step-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cc-step-body">
                    <span className="cc-step-title">{s.title}</span>
                    {s.detail && <span className="cc-step-detail">{s.detail}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}

/* "Read More Below": sits at the bottom centre of the slideshow, visible the
   moment a case study opens. As the visitor scrolls it gets lighter, and it
   is fully gone exactly when the bottom of the slides passes the top of the
   screen. A visual hint only: not clickable, skipped by screen readers (the
   sections below are reached by scrolling or tabbing as normal). */
function MoreCue() {
  const ref = useRef(null);

  /* Styles are written straight onto the element each frame: no React state,
     so scrolling a case study never re-renders anything. */
  useEffect(() => {
    const el = ref.current;
    const scroller = el?.closest(".cc-scrim");
    const stage = el?.closest(".cc-stage-frame");
    if (!el || !scroller || !stage) return;
    let frame = 0;
    let last = "";
    const read = () => {
      frame = 0;
      const vh = window.innerHeight;
      const s = stage.getBoundingClientRect();
      /* where the slides' bottom edge sits when the modal is scrolled to the top */
      const startBottom = Math.max(s.bottom + scroller.scrollTop, 1);
      const fade = clamp(s.bottom / startBottom, 0, 1);
      /* on short screens the slides run past the bottom edge: lift the cue so
         it stays on screen, but never above the slides' own top */
      const gap = 14;
      const over = s.bottom - gap - (vh - 18);
      const maxLift = Math.max(s.height - el.offsetHeight - gap * 2, 0);
      const lift = Math.round(clamp(over, 0, maxLift));
      const key = `${fade.toFixed(2)}|${lift}`;
      if (key === last) return; /* nothing changed: touch nothing */
      last = key;
      el.style.opacity = fade.toFixed(2);
      el.style.visibility = fade <= 0.02 ? "hidden" : "visible";
      el.style.translate = `-50% ${-lift}px`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    /* the modal animates in; measure again once it has settled */
    const settle = setTimeout(read, 650);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(settle);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="cc-below-cue" aria-hidden="true">
      <span>Read More Below</span>
      <svg viewBox="0 0 24 14">
        <path d="M2 2 L12 11 L22 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SlideView({ slide, dir }) {
  const [failed, setFailed] = useState(false);
  const Plate = slide.Plate;
  const cls = dir > 0 ? "cc-plate cc-plate-next" : "cc-plate cc-plate-prev";

  // Video slide. Unmounting on navigation stops playback, so leaving the
  // slide pauses the recording without any extra wiring.
  if (slide.embed) {
    return (
      <div className={cls}>
        <iframe
          className="cc-plate-video"
          src={slide.embed}
          title={slide.caption}
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={cls}>
      {slide.src && !failed ? (
        <img src={slide.src} alt={slide.caption} className="cc-plate-img" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <div className="cc-plate-draw">{Plate ? <Plate /> : null}</div>
      )}
    </div>
  );
}

function Thumb({ slide }) {
  const [failed, setFailed] = useState(false);
  const Plate = slide.Plate;
  const isVideo = Boolean(slide.embed) || Plate === PlateVideo;

  return (
    <>
      {slide.src && !failed ? (
        <img src={slide.src} alt="" className="cc-thumb-img" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="cc-thumb-draw">{Plate ? <Plate /> : null}</span>
      )}
      {isVideo && (
        <span className="cc-thumb-play" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M5 3 L13 8 L5 13 Z" />
          </svg>
        </span>
      )}
    </>
  );
}

/* Renders **bold** spans inside body copy. */
function Rich({ text }) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="cc-em">{part.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );
}

function Crest() {
  return (
    <span className="cc-clow-crest" aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="6.5" />
        <path d="M20 3 L20 10 M20 30 L20 37 M3 20 L10 20 M30 20 L37 20 M8 8 L12.6 12.6 M27.4 27.4 L32 32 M32 8 L27.4 12.6 M12.6 27.4 L8 32" />
      </svg>
    </span>
  );
}

function Ornaments() {
  return (
    <span className="cc-frame" aria-hidden="true">
      <span className="cc-frame-rule" />
      <span className="cc-frame-rule cc-frame-rule-2" />
      {["tl", "tr", "bl", "br"].map((k) => (
        <span key={k} className={`cc-curl cc-curl-${k}`}>
          <svg viewBox="0 0 30 30">
            <path d="M1 29 L1 10 Q1 1 10 1 L29 1" />
            <path d="M6 26 L6 13 Q6 6 13 6 L26 6" />
            <circle cx="10.5" cy="10.5" r="1.6" className="cc-art-fill" />
          </svg>
        </span>
      ))}
      <span className="cc-lozenge cc-lozenge-t" />
      <span className="cc-lozenge cc-lozenge-b" />
    </span>
  );
}

/* ------------------------------------------------------------------ */

const CSS = `

/* ---------- readability tokens ----------
   Shared values for text and surfaces that must stay legible at every
   point of the night-to-dawn scroll. Change them here, not per rule. */
:root {
  --cc-dim: 0.10;
  --cc-parchment: #FFFDF2;
  --cc-text-meta: rgba(255,253,242,.92);   /* small caps on cards */
  --cc-text-soft: rgba(240,248,255,.9);    /* secondary copy on the sky */
  --cc-gold-label: rgba(255,215,0,.95);    /* gold field labels */
  --cc-gold-sky: #FFE97A;                  /* gold text placed straight on the sky */
  --cc-label-size: .7rem;                  /* smallest label size (~11px) */
  /* navy-tinted glass: still translucent, but dark enough that light text
     reads the same over the night sky and the brightest dawn */
  --cc-glass-card: rgba(18,30,72,.5);
  --cc-glass-sheen: linear-gradient(165deg, rgba(255,255,255,.13) 0%, rgba(255,255,255,.04) 45%, rgba(184,167,255,.1) 100%);
  --cc-glass-btn: rgba(16,34,64,.45);
  --cc-nav-h: 3.75rem;                     /* fixed nav height; anchors clear it */
}
@media (max-width: 640px) { :root { --cc-nav-h: 3.25rem; } }

/* anchor jumps glide, unless the visitor asked for less motion */
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
/* keyboard focus and anchor jumps keep things clear of the fixed nav,
   so a focused card's ring is never hidden under it */
html { scroll-padding-top: calc(var(--cc-nav-h) + 1.25rem); }
.cc-anchor { scroll-margin-top: calc(var(--cc-nav-h) - 2rem); }
/* card glows reach past the screen edge on phones; clip them without making a scroll box */
.cc-root { overflow-x: clip; }

/* ---------- global brightness ----------
   Dims the sky only. It sits inside the fixed sky layer, behind all
   content, so it never lowers the contrast of text or controls. */
.cc-dim {
  position: absolute; inset: 0;
  background: #000; opacity: var(--cc-dim);
  pointer-events: none;
}

.cc-sky-night {
  background:
    radial-gradient(120% 80% at 50% 0%, #17325C 0%, rgba(23,50,92,0) 62%),
    linear-gradient(180deg, #0A192F 0%, #14305A 52%, #2A4B8C 100%);
}
/* Dawn keeps the blue-to-lavender direction but tops out at a muted violet
   instead of near-white, so light text and gold stay readable on it. */
.cc-sky-dawn {
  background:
    radial-gradient(110% 70% at 50% 100%, rgba(184,167,255,.2) 0%, rgba(184,167,255,0) 70%),
    linear-gradient(180deg, #2A4B8C 0%, #3D4E9C 46%, #5550A4 78%, #5E56A8 100%);
  transition: opacity .12s linear;
}
.cc-haze { background: radial-gradient(90% 55% at 50% 108%, rgba(184,167,255,.3) 0%, rgba(184,167,255,0) 68%); }
/* fades back out at the bottom so there is no seam where the Connect band starts */
.cc-band-sky { background: linear-gradient(180deg, rgba(42,75,140,0) 0%, rgba(184,167,255,.12) 45%, rgba(184,167,255,.08) 80%, rgba(42,75,140,0) 100%); }
/* the band's clouds fade in and out at its edges instead of being cut off */
.cc-band-fade {
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 70%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 70%, transparent 100%);
}

.cc-star { position: absolute; border-radius: 999px; animation: cc-twinkle linear infinite; }
@keyframes cc-twinkle { 0%,100% { opacity:.18; transform: scale(.7); } 50% { opacity:1; transform: scale(1.25); } }
.cc-cloud {
  width: 100%; height: 100%; border-radius: 999px;
  background:
    radial-gradient(closest-side at 32% 62%, rgba(224,242,255,.95), rgba(224,242,255,0) 100%),
    radial-gradient(closest-side at 68% 44%, rgba(255,255,255,.85), rgba(255,255,255,0) 100%),
    radial-gradient(closest-side at 50% 55%, rgba(184,167,255,.6), rgba(184,167,255,0) 100%);
  animation: cc-drift linear infinite;
}
@keyframes cc-drift { from { transform: translateX(-14vw); } to { transform: translateX(14vw); } }
.cc-dust { position: absolute; bottom: -6vh; border-radius: 999px; animation: cc-rise linear infinite; }
@keyframes cc-rise {
  0% { opacity:0; transform: translate(0,0) scale(.6); }
  12% { opacity:.9; } 80% { opacity:.5; }
  100% { opacity:0; transform: translate(var(--cc-drift,0px), -118vh) scale(1.1); }
}

.cc-eyebrow {
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size: clamp(.85rem,2.1vw,1.05rem); letter-spacing:.16em; font-weight:500;
  /* pale gold: small italic text sitting directly on the sky needs the extra lightness */
  color: var(--cc-gold-sky); margin:0 0 1.1rem; text-align:center;
}
.cc-eyebrow-left { text-align:left; margin-bottom:.6rem; }
.cc-name {
  font-family:'Michroma',sans-serif; font-size: clamp(2rem,7.4vw,4.6rem);
  line-height:1.08; letter-spacing:-.01em; margin:0; color:#F4FAFF;
  position:relative;
  /* the near glow stays on the letters; the wide halo moved to ::before */
  text-shadow: 0 0 14px rgba(224,242,255,.7), 0 0 40px rgba(184,167,255,.55);
}
/* The breathing halo. Animating a 170px text-shadow repainted the whole hero
   every frame; a blurred layer that only changes opacity is composited cheaply
   and looks the same. */
.cc-name::before {
  content:""; position:absolute; inset:-35% -12%; z-index:-1; pointer-events:none;
  background:
    radial-gradient(closest-side, rgba(184,167,255,.42), rgba(184,167,255,.16) 55%, rgba(255,215,0,.06) 80%, rgba(184,167,255,0));
  filter: blur(18px);
  opacity:.65; will-change: opacity;
  animation: cc-pulse 6.5s ease-in-out infinite;
}
@keyframes cc-pulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }

/* scroll-driven layers get their own compositor layers */
.cc-layer { will-change: transform, opacity; }
.cc-cloud { will-change: transform; }

/* While a case study is open the sky sits behind a blur: pause its ambient
   motion so the browser isn't re-blurring a moving picture every frame. */
.cc-modal-open .cc-star, .cc-modal-open .cc-cloud, .cc-modal-open .cc-dust,
.cc-modal-open .cc-seal, .cc-modal-open .cc-name::before, .cc-modal-open .cc-clow,
.cc-modal-open .cc-back-sigil svg, .cc-modal-open .cc-cue svg, .cc-modal-open .cc-navcard-tilt,
.cc-modal-open .cc-cx-card, .cc-modal-open .cc-cx-grab, .cc-modal-open .cc-cx-words,
.cc-modal-open .cc-cx-chev svg { animation-play-state: paused !important; }
/* Once the scrim has faded in, the star, cloud and dust layers are covered:
   stop drawing them at all, so scrolling a case study only moves the modal.
   They come back instantly on close. */
.cc-layer, .cc-band-fade { transition: visibility 0s; }
.cc-modal-open .cc-layer, .cc-modal-open .cc-band-fade { visibility:hidden; transition-delay:.4s; }
.cc-name-break { display:inline; }
@media (max-width: 640px) { .cc-name-break { display:block; height:0; } }
.cc-tagline {
  font-family:'Cormorant Garamond',serif; font-size: clamp(1.05rem,2.8vw,1.45rem);
  color: rgba(224,242,255,.82); max-width:34ch; margin:1.5rem auto 0;
  line-height:1.45; letter-spacing:.02em; text-wrap: balance;
}
.cc-h2 { font-family:'Michroma',sans-serif; font-size: clamp(1.4rem,4.2vw,2.4rem); color:#F4FAFF; margin:0; text-shadow: 0 0 26px rgba(184,167,255,.5); }
.cc-lede {
  font-family:'Inter',system-ui,sans-serif; font-weight:400;
  font-size: clamp(.95rem,2.2vw,1.05rem); line-height:1.65;
  color: var(--cc-text-soft); max-width:46ch; margin:1rem 0 0;
}

.cc-seal { position:absolute; border-radius:999px; pointer-events:none; }
.cc-seal-outer {
  width:min(78vw,34rem); height:min(78vw,34rem);
  border:1px solid rgba(255,215,0,.28);
  box-shadow: 0 0 60px rgba(255,215,0,.1) inset, 0 0 40px rgba(184,167,255,.18);
  animation: cc-spin 90s linear infinite;
  background: conic-gradient(from 0deg,
    rgba(255,215,0,.16) 0deg 2deg, rgba(255,215,0,0) 2deg 45deg,
    rgba(255,215,0,.16) 45deg 47deg, rgba(255,215,0,0) 47deg 90deg,
    rgba(255,215,0,.16) 90deg 92deg, rgba(255,215,0,0) 92deg 135deg,
    rgba(255,215,0,.16) 135deg 137deg, rgba(255,215,0,0) 137deg 180deg,
    rgba(255,215,0,.16) 180deg 182deg, rgba(255,215,0,0) 182deg 225deg,
    rgba(255,215,0,.16) 225deg 227deg, rgba(255,215,0,0) 227deg 270deg,
    rgba(255,215,0,.16) 270deg 272deg, rgba(255,215,0,0) 272deg 315deg,
    rgba(255,215,0,.16) 315deg 317deg, rgba(255,215,0,0) 317deg 360deg);
  mask: radial-gradient(closest-side, transparent 76%, #000 78%);
  -webkit-mask: radial-gradient(closest-side, transparent 76%, #000 78%);
}
.cc-seal-inner { width:min(58vw,24rem); height:min(58vw,24rem); border:1px solid rgba(224,242,255,.16); animation: cc-spin 60s linear infinite reverse; }
@keyframes cc-spin { to { transform: rotate(360deg); } }

.cc-cue {
  bottom:2.4rem; left:50%; transform: translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:.7rem;
  font-family:'Inter',system-ui,sans-serif; font-weight:400; font-size:.72rem;
  letter-spacing:.22em; text-transform:uppercase; color: rgba(255,215,0,.9);
  transition: opacity .2s linear;
}
.cc-cue svg { width:22px; animation: cc-bob 2.6s ease-in-out infinite; }

/* "Read More Below" in each case study: same gold caps and bobbing chevron as the hero cue */
/* bottom centre of the slideshow: just the words and the chevron, no box.
   A tight dark halo keeps the gold legible on the light slide background,
   and pointer-events:none lets clicks and swipes pass through to the slide */
.cc-below-cue {
  position:absolute; left:50%; bottom:clamp(.6rem, 2.2%, 1.2rem); translate:-50% 0; z-index:3;
  display:flex; flex-direction:column; align-items:center; gap:.35rem;
  pointer-events:none; white-space:nowrap;
  font-family:'Inter',system-ui,sans-serif; font-weight:600; font-size:.74rem;
  letter-spacing:.2em; text-transform:uppercase; color:#FFD700;
  text-shadow: 0 0 2px rgba(10,25,47,.95), 0 0 6px rgba(10,25,47,.85), 0 1px 12px rgba(10,25,47,.6);
}
.cc-below-cue svg {
  width:18px; height:10px; animation: cc-bob 2.6s ease-in-out infinite;
  filter: drop-shadow(0 0 2px rgba(10,25,47,.95)) drop-shadow(0 0 5px rgba(10,25,47,.7));
}
@media (max-width: 640px) {
  .cc-below-cue { font-size:.64rem; letter-spacing:.16em; gap:.2rem; }
  .cc-below-cue svg { width:14px; height:8px; }
}
@keyframes cc-bob { 0%,100% { transform: translateY(0); opacity:.55; } 50% { transform: translateY(7px); opacity:1; } }

.cc-reveal { opacity:0; transform: translateY(28px); transition: opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1); }
.cc-reveal.cc-in { opacity:1; transform:none; }

/* soft night-coloured glow behind the Projects intro, so drifting clouds
   never wash out the heading, eyebrow and lede */
.cc-intro { position:relative; isolation:isolate; width:fit-content; max-width:100%; }
.cc-intro::before {
  content:""; position:absolute; inset:-1.6rem -2.6rem -1.6rem -2.4rem; z-index:-1; pointer-events:none;
  border-radius:50%; background: rgba(10,25,47,.6);
  filter: blur(30px);
}

.cc-deck { display:grid; grid-template-columns:1fr; gap:3rem 1.75rem; margin-top:4rem; justify-items:center; }
@media (min-width:640px) { .cc-deck { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (min-width:1024px) {
  .cc-deck { grid-template-columns: repeat(4, minmax(0,1fr)); gap:2rem 1.5rem; align-items:start; }
  .cc-slot { margin-top: var(--cc-lift, 0rem); }
}
.cc-slot { width:100%; max-width:17rem; }
/* the one-liner under each card: light text for the darker dawn, with a tight
   shadow (not a glow) so it stays crisp if a cloud drifts behind it */
.cc-slot-note {
  font-family:'Cormorant Garamond',serif; font-weight:500; font-size:1.08rem; line-height:1.45;
  color: var(--cc-text-soft); text-shadow: 0 1px 3px rgba(10,25,47,.65);
  margin:1.15rem .25rem 0; text-align:center; text-wrap: balance;
  position:relative; isolation:isolate;
}
/* same soft night glow as the Projects intro: this line sits low on the
   screen, where the dawn is brightest */
.cc-slot-note::before {
  content:""; position:absolute; inset:-.5rem -.9rem; z-index:-1; pointer-events:none;
  border-radius:50%; background: rgba(10,25,47,.55); filter: blur(16px);
}

.cc-clow {
  position:relative; display:block; width:100%; aspect-ratio: 5 / 8;
  padding:0; border:0; background:none; cursor:pointer;
  perspective:1400px; scale:1;
  transition: scale .45s cubic-bezier(.2,.7,.2,1);
  animation-timing-function: ease-in-out; animation-iteration-count: infinite;
}
.cc-clow:hover, .cc-clow:focus-visible { scale:1.055; outline:none; }
.cc-clow:focus-visible { outline:2px solid #FFD700; outline-offset:10px; border-radius:6px; }
/* room for the focus ring, its halo and the 5.5% focus scale when the card is
   scrolled into view, so the ring is never cut off by the nav or the screen edge */
.cc-clow { scroll-margin: 3.75rem 0; }
/* dark halo on both sides of the gold ring, so it keeps 3:1 against any sky */
.cc-clow:focus-visible::after {
  content:""; position:absolute; inset:-15px; border-radius:10px; pointer-events:none;
  border:3px solid rgba(10,25,47,.72); box-shadow: inset 0 0 0 6px rgba(10,25,47,.62);
}
@keyframes cc-f1 { 0%,100% { translate: 0 0; } 50% { translate: 0 -11px; } }
@keyframes cc-f2 { 0%,100% { translate: 0 -4px; } 50% { translate: 0 -20px; } }
@keyframes cc-f3 { 0%,100% { translate: 0 0; } 50% { translate: 0 -14px; } }
@keyframes cc-f4 { 0%,100% { translate: 0 -2px; } 50% { translate: 0 -8px; } }
.cc-float-1 { animation-name: cc-f1; animation-duration:6.4s; animation-delay:-.4s; }
.cc-float-2 { animation-name: cc-f2; animation-duration:8.6s; animation-delay:-2.1s; }
.cc-float-3 { animation-name: cc-f3; animation-duration:7.2s; animation-delay:-1.3s; }
.cc-float-4 { animation-name: cc-f4; animation-duration:5.6s; animation-delay:-3.2s; }

.cc-flipper { position:absolute; inset:0; transform-style: preserve-3d; transition: transform .68s cubic-bezier(.4,.05,.2,1); transform: rotateY(0deg); }
.cc-flipper.cc-flipped { transform: rotateY(180deg); }

.cc-aura {
  position:absolute; inset:-14%; border-radius:50% / 40%;
  background: radial-gradient(closest-side, rgba(255,215,0,.4), rgba(184,167,255,.24) 55%, rgba(184,167,255,0) 100%);
  filter: blur(22px); opacity:.5; pointer-events:none;
  transition: opacity .45s ease, filter .45s ease, inset .45s ease;
}
.cc-clow:hover .cc-aura, .cc-clow:focus-visible .cc-aura { opacity:1; filter: blur(30px); inset:-20%; }

.cc-clow-face {
  position:absolute; inset:0; display:flex; flex-direction:column; align-items:center;
  padding:1.15rem .9rem 1rem; border-radius:5px;
  border:1px solid rgba(255,215,0,.5);
  backface-visibility:hidden; -webkit-backface-visibility:hidden;
  /* navy-tinted glass: the sheen keeps the glassy highlight, the tint keeps
     the surface dark enough for light text over any part of the sky */
  background: var(--cc-glass-sheen), var(--cc-glass-card);
  backdrop-filter: blur(9px) saturate(1.1); -webkit-backdrop-filter: blur(9px) saturate(1.1);
  box-shadow: 0 22px 48px rgba(10,25,47,.4), 0 0 0 1px rgba(255,255,255,.28) inset, 0 0 26px rgba(255,215,0,.14) inset;
  transition: box-shadow .45s ease, border-color .45s ease; overflow:hidden;
}
.cc-clow:hover .cc-clow-face {
  border-color:#FFD700;
  box-shadow: 0 30px 64px rgba(10,25,47,.46), 0 0 46px rgba(255,215,0,.5),
              0 0 0 1px rgba(255,255,255,.4) inset, 0 0 40px rgba(255,215,0,.3) inset;
}
.cc-face-back {
  transform: rotateY(180deg); justify-content:center; gap:1.4rem;
  background:
    radial-gradient(closest-side at 50% 45%, rgba(184,167,255,.3), rgba(184,167,255,0) 100%),
    linear-gradient(165deg, rgba(10,25,47,.72) 0%, rgba(42,75,140,.6) 100%);
}
.cc-back-sigil { width:58%; max-width:8rem; }
.cc-back-sigil svg {
  width:100%; height:auto; fill:none; stroke: rgba(255,215,0,.9); stroke-width:2; stroke-linecap:round;
  filter: drop-shadow(0 0 12px rgba(255,215,0,.6)); animation: cc-spin 26s linear infinite;
}
.cc-back-word {
  font-family:'Cormorant Garamond',serif; font-style:italic; font-size:.95rem;
  letter-spacing:.28em; text-transform:uppercase; color: rgba(255,215,0,.9);
}

.cc-frame { position:absolute; inset:0; pointer-events:none; }
.cc-frame-rule { position:absolute; inset:7px; border:1px solid rgba(255,215,0,.34); border-radius:3px; }
.cc-frame-rule-2 { inset:11px; border-color: rgba(224,242,255,.2); border-radius:2px; }
.cc-curl { position:absolute; width:22px; height:22px; }
.cc-curl svg { width:100%; height:100%; fill:none; stroke: rgba(255,215,0,.75); stroke-width:1.4; }
.cc-curl-tl { top:4px; left:4px; }
.cc-curl-tr { top:4px; right:4px; rotate:90deg; }
.cc-curl-br { bottom:4px; right:4px; rotate:180deg; }
.cc-curl-bl { bottom:4px; left:4px; rotate:270deg; }
.cc-lozenge {
  position:absolute; left:50%; width:9px; height:9px; translate:-50% 0; rotate:45deg;
  border:1px solid rgba(255,215,0,.7); background: rgba(255,215,0,.18);
}
.cc-lozenge-t { top:3px; }
.cc-lozenge-b { bottom:3px; }

.cc-clow-crest { width:26px; height:26px; margin-top:.15rem; opacity:.9; }
.cc-clow-crest svg { width:100%; height:100%; fill:none; stroke: rgba(255,215,0,.85); stroke-width:1.3; stroke-linecap:round; }
.cc-clow-art { display:flex; align-items:center; justify-content:center; width:100%; flex:1 1 auto; padding:.35rem .2rem 0; }
.cc-art-svg {
  width:78%; max-width:9.5rem; height:auto; fill:none; stroke: rgba(255,215,0,.9);
  stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round;
  filter: drop-shadow(0 0 8px rgba(255,215,0,.45));
  transition: stroke .45s ease, filter .45s ease;
}
.cc-art-fill { fill: rgba(255,215,0,.85); stroke:none; }
.cc-clow:hover .cc-art-svg { stroke:#FFE97A; filter: drop-shadow(0 0 14px rgba(255,215,0,.8)); }
.cc-clow-epithet {
  display:block; font-family:'Cormorant Garamond',serif; font-style:italic; font-weight:400;
  font-size:1rem; letter-spacing:.06em; color: var(--cc-text-meta); margin-bottom:.45rem;
}
/* a darker strip behind the title and meta, so they read on a stable ground */
.cc-clow-banner {
  display:block; width:100%; text-align:center; padding:.55rem .35rem .3rem;
  border-top:1px solid rgba(255,215,0,.4); border-radius:0 0 3px 3px;
  background: linear-gradient(180deg, rgba(10,25,47,.18), rgba(10,25,47,.42));
}
/* title and meta share one face (Inter); weight and size carry the hierarchy */
.cc-clow-title {
  display:block; font-family:'Inter',system-ui,sans-serif; font-weight:600; font-size:.9rem;
  line-height:1.3; letter-spacing:.1em; text-transform:uppercase; color:var(--cc-parchment);
  text-wrap: balance;
  /* a tight dark shadow sharpens the letters; the old wide gold glow blurred them */
  text-shadow: 0 1px 2px rgba(10,25,47,.55);
}
.cc-clow-meta {
  display:block; margin-top:.35rem; font-family:'Inter',system-ui,sans-serif; font-weight:300;
  font-size:.75rem; letter-spacing:.08em; line-height:1.45; text-transform:uppercase;
  text-wrap: balance; color: var(--cc-text-meta);
}

/* ---------- navigation ---------- */
.cc-navbar {
  position:fixed; top:0; left:0; right:0; z-index:50;
  padding-top: env(safe-area-inset-top, 0px);
  /* navy glass, dark enough for parchment text over the brightest dawn */
  background: linear-gradient(180deg, rgba(10,25,47,.78), rgba(16,34,64,.66));
  backdrop-filter: blur(10px) saturate(1.15); -webkit-backdrop-filter: blur(10px) saturate(1.15);
  border-bottom:1px solid rgba(255,215,0,.22);
  box-shadow: 0 10px 28px rgba(10,25,47,.28);
}
/* full width on every screen: card + Resume pinned to the left edge,
   Case Studies + About Me pinned to the right; the gutter grows with the screen */
.cc-navbar-in {
  width:100%; height:var(--cc-nav-h);
  display:flex; align-items:center; justify-content:space-between; gap:1rem;
  padding-left: max(clamp(1rem, 2.5vw, 2.5rem), env(safe-area-inset-left, 0px));
  padding-right: max(clamp(1rem, 2.5vw, 2.5rem), env(safe-area-inset-right, 0px));
}

/* the miniature card: a real button, 44px hit area, card drawn inside it */
.cc-navcard {
  position:relative; flex:0 0 auto; display:flex; align-items:center; justify-content:center;
  width:2.9rem; height:3.3rem; padding:0; border:0; background:none; cursor:pointer;
  border-radius:6px;
}
.cc-navcard:focus-visible { outline:2px solid #FFD700; outline-offset:2px; }
.cc-navcard-tilt {
  display:block; width:1.9rem; height:3rem; rotate:-6deg; perspective:420px;
  animation: cc-navbob 5.5s ease-in-out infinite;
  transition: translate .35s cubic-bezier(.2,.7,.2,1);
}
@keyframes cc-navbob { 0%,100% { translate:0 0; } 50% { translate:0 -2px; } }
.cc-navcard:hover .cc-navcard-tilt { translate:0 -2px; }
/* same flip easing as the project cards */
.cc-navcard-inner {
  position:relative; display:block; width:100%; height:100%;
  transform-style:preserve-3d; transition: transform .62s cubic-bezier(.4,.05,.2,1);
}
.cc-navcard-flipped .cc-navcard-inner { transform: rotateY(180deg); }
.cc-navcard-face {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  border-radius:3px; border:1px solid rgba(255,215,0,.7); overflow:hidden;
  backface-visibility:hidden; -webkit-backface-visibility:hidden;
  background: var(--cc-glass-sheen), var(--cc-glass-card);
  box-shadow: 0 4px 12px rgba(10,25,47,.45), 0 0 0 1px rgba(255,255,255,.18) inset, 0 0 10px rgba(255,215,0,.16) inset;
  transition: border-color .35s ease, box-shadow .35s ease;
}
.cc-navcard-front { transform: rotateY(0deg); }
.cc-navcard-back {
  transform: rotateY(180deg);
  background:
    radial-gradient(closest-side at 50% 45%, rgba(184,167,255,.3), rgba(184,167,255,0) 100%),
    linear-gradient(165deg, rgba(10,25,47,.85) 0%, rgba(42,75,140,.75) 100%);
}
.cc-navcard:hover .cc-navcard-face, .cc-navcard:focus-visible .cc-navcard-face {
  border-color:#FFD700; box-shadow: 0 6px 16px rgba(10,25,47,.5), 0 0 14px rgba(255,215,0,.45), 0 0 0 1px rgba(255,255,255,.24) inset;
}
/* the shared frame, scaled down to the miniature */
.cc-navcard .cc-frame-rule { inset:2px; border-radius:2px; }
.cc-navcard .cc-frame-rule-2 { inset:4px; }
.cc-navcard .cc-curl { width:7px; height:7px; }
.cc-navcard .cc-curl-tl { top:1px; left:1px; } .cc-navcard .cc-curl-tr { top:1px; right:1px; }
.cc-navcard .cc-curl-bl { bottom:1px; left:1px; } .cc-navcard .cc-curl-br { bottom:1px; right:1px; }
.cc-navcard .cc-curl svg { stroke-width:2.6; }
.cc-navcard .cc-lozenge { width:4px; height:4px; }
.cc-navcard .cc-lozenge-t { top:0; } .cc-navcard .cc-lozenge-b { bottom:0; }
.cc-navcard-glyph { width:62%; fill:none; filter: drop-shadow(0 0 4px rgba(255,215,0,.55)); }
.cc-navcard-sigil {
  width:72%; fill:none; stroke: rgba(255,215,0,.92); stroke-width:6; stroke-linecap:round;
  filter: drop-shadow(0 0 4px rgba(255,215,0,.5));
}

.cc-navlinks { display:flex; align-items:center; gap:clamp(.9rem, 3vw, 2.4rem); margin:0; padding:0; list-style:none; }
/* left group: the card, then the resume link */
.cc-navleft { display:flex; align-items:center; gap:clamp(.5rem, 2vw, 1.4rem); min-width:0; }
.cc-navlink-ext { gap:.35rem; }
.cc-navlink-ext::after { right:1.05rem; }
.cc-navlink-ext svg { width:.6rem; height:.6rem; fill:none; stroke:currentColor; stroke-width:1.4; stroke-linecap:round; stroke-linejoin:round; }
.cc-navlink {
  position:relative; display:inline-flex; align-items:center; min-height:2.75rem; padding:0 .15rem;
  font-family:'Inter',system-ui,sans-serif; font-weight:500; font-size:.74rem;
  letter-spacing:.18em; text-transform:uppercase; text-decoration:none; white-space:nowrap;
  color: var(--cc-text-meta); transition: color .3s ease;
}
/* gold underline grows from the centre on hover, focus and for the current section */
.cc-navlink::after {
  content:""; position:absolute; left:.15rem; right:.15rem; bottom:.55rem; height:1px;
  background:#FFD700; box-shadow: 0 0 8px rgba(255,215,0,.6);
  transform: scaleX(0); transition: transform .35s cubic-bezier(.2,.7,.2,1);
}
.cc-navlink:hover, .cc-navlink:focus-visible, .cc-navlink-on { color: var(--cc-gold-sky); }
.cc-navlink:hover::after, .cc-navlink:focus-visible::after, .cc-navlink-on::after { transform: scaleX(1); }
.cc-navlink:focus-visible { outline:2px solid #FFD700; outline-offset:4px; border-radius:3px; }

@media (max-width: 640px) {
  .cc-navbar-in { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  .cc-navcard { width:2.75rem; height:2.9rem; }
  .cc-navcard-tilt { width:1.55rem; height:2.45rem; }
  .cc-navlink { font-size:.7rem; letter-spacing:.13em; }
}
/* small phones: three links plus the card still fit on one row */
@media (max-width: 400px) {
  .cc-navbar-in { gap:.5rem; }
  .cc-navlinks { gap:.75rem; }
  .cc-navleft { gap:.3rem; }
  .cc-navlink { font-size:.66rem; letter-spacing:.07em; }
  .cc-navlink-ext svg { display:none; }
  .cc-navlink-ext::after { right:.15rem; }
}

/* ---------- modal ---------- */
.cc-scrim {
  position:fixed; inset:0; z-index:60; display:flex; align-items:flex-start; justify-content:center;
  padding:1.25rem;
  background: radial-gradient(80% 60% at 50% 40%, rgba(42,75,140,.66), rgba(10,25,47,.93) 70%);
  /* no backdrop blur: the scrim is opaque enough on its own, and a full-screen
     blur under a scrolling modal was the main source of case-study lag */
  animation: cc-scrim-in .35s ease both; overflow-y:auto;
}
@keyframes cc-scrim-in { from { opacity:0; } to { opacity:1; } }

.cc-modal {
  position:relative; width:100%; max-width:68rem; margin:auto;
  padding: clamp(1.5rem, 3vw, 2.6rem); border-radius:8px;
  border:1px solid rgba(255,215,0,.55);
  background:
    linear-gradient(165deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.06) 45%, rgba(184,167,255,.16) 100%),
    rgba(16,34,64,.98);
  box-shadow: 0 40px 120px rgba(10,25,47,.7), 0 0 70px rgba(255,215,0,.22), 0 0 0 1px rgba(255,255,255,.22) inset;
  animation: cc-modal-in .5s cubic-bezier(.2,.8,.2,1) both;
}
.cc-modal-wide { max-width:74rem; }
@keyframes cc-modal-in {
  from { opacity:0; transform: translateY(18px) scale(.94) rotateY(-8deg); }
  to { opacity:1; transform:none; }
}
.cc-modal .cc-frame-rule { inset:10px; }
.cc-modal .cc-frame-rule-2 { inset:15px; }

.cc-close {
  position:absolute; top: clamp(1rem,2vw,1.5rem); right: clamp(1rem,2vw,1.5rem); z-index:4;
  width:2.6rem; height:2.6rem; border-radius:999px;
  display:flex; align-items:center; justify-content:center; cursor:pointer;
  border:1px solid rgba(255,215,0,.65); background: rgba(255,255,255,.1);
  box-shadow: 0 0 18px rgba(255,215,0,.25), 0 0 0 1px rgba(255,255,255,.2) inset;
  transition: rotate .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s ease, border-color .4s ease, background .4s ease;
}
.cc-close svg { width:1.15rem; fill:none; stroke: rgba(255,215,0,.95); stroke-width:1.7; stroke-linecap:round; }
.cc-close:hover, .cc-close:focus-visible {
  rotate:90deg; border-color:#FFD700; background: rgba(255,215,0,.18);
  box-shadow: 0 0 34px rgba(255,215,0,.6), 0 0 0 1px rgba(255,255,255,.32) inset; outline:none;
}
.cc-close:focus-visible { outline:2px solid #FFD700; outline-offset:4px; }

.cc-head { position:relative; z-index:2; padding-right:3.6rem; margin-bottom:1.5rem; }

.cc-body { position:relative; z-index:2; display:grid; grid-template-columns:1fr; gap:2rem; }
@media (min-width:960px) { .cc-body-split { grid-template-columns: minmax(0,1.6fr) minmax(0,1fr); gap:2.5rem; } }
.cc-body-wide .cc-rail { display:grid; gap:1.8rem; margin-top:.6rem; }
@media (min-width:860px) {
  .cc-body-wide .cc-rail { grid-template-columns: minmax(0,1.4fr) minmax(0,1fr); gap:2.5rem; align-items:start; }
}

.cc-show { min-width:0; }
.cc-stage-frame {
  position:relative; width:100%; aspect-ratio: 16 / 10; border-radius:5px; overflow:hidden;
  border:1px solid rgba(255,215,0,.32);
  background:
    radial-gradient(closest-side at 50% 40%, rgba(184,167,255,.24), rgba(184,167,255,0) 100%),
    linear-gradient(165deg, rgba(255,255,255,.14), rgba(10,25,47,.42));
  box-shadow: 0 0 34px rgba(255,215,0,.14) inset;
}
.cc-stage-wide { aspect-ratio: 16 / 9; background: rgba(244,250,255,.96); }
.cc-stage-portrait { aspect-ratio: 4 / 5; }
.cc-film-photo .cc-thumb { aspect-ratio: 4 / 5; width: 3.3rem; background: rgba(10,25,47,.5); }
.cc-film-photo .cc-thumb-img { object-position: center; }
.cc-plate { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
.cc-plate-next { animation: cc-slide-next .48s cubic-bezier(.2,.8,.2,1) both; }
.cc-plate-prev { animation: cc-slide-prev .48s cubic-bezier(.2,.8,.2,1) both; }
@keyframes cc-slide-next { from { opacity:0; transform: translateX(7%) scale(.97); } to { opacity:1; transform:none; } }
@keyframes cc-slide-prev { from { opacity:0; transform: translateX(-7%) scale(.97); } to { opacity:1; transform:none; } }
.cc-plate-img { width:100%; height:100%; object-fit: contain; display:block; }
.cc-plate-video { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; background:#0A192F; }
.cc-plate-draw { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:1.6rem; }
.cc-schema {
  width:auto; height:82%; max-width:82%; fill:none; stroke: rgba(255,215,0,.85);
  stroke-width:1.4; stroke-linecap:round; stroke-linejoin:round;
  filter: drop-shadow(0 0 8px rgba(255,215,0,.35));
}

.cc-nav {
  position:absolute; top:50%; translate:0 -50%; width:2.4rem; height:2.4rem;
  border-radius:999px; cursor:pointer; display:flex; align-items:center; justify-content:center;
  border:1px solid rgba(255,215,0,.55); background: rgba(10,25,47,.62);
  transition: background .35s ease, box-shadow .35s ease, border-color .35s ease, scale .35s ease;
}
.cc-nav svg { width:1rem; fill:none; stroke: rgba(255,215,0,.95); stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
.cc-nav-prev { left:.7rem; }
.cc-nav-next { right:.7rem; }
.cc-nav:hover, .cc-nav:focus-visible {
  background: rgba(10,25,47,.85); border-color:#FFD700; scale:1.08;
  box-shadow: 0 0 26px rgba(255,215,0,.5); outline:none;
}
.cc-nav:focus-visible { outline:2px solid #FFD700; outline-offset:3px; }

.cc-sr {
  position:absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}
.cc-show-bar { display:flex; align-items:center; justify-content:space-between; gap:1.5rem; margin-top:.85rem; }
.cc-count { flex:0 0 auto; font-family:'Michroma',sans-serif; font-size:var(--cc-label-size); letter-spacing:.14em; color: var(--cc-gold-label); }
.cc-count-sep { color: rgba(255,253,242,.75); margin:0 .1rem; }

.cc-dots { display:flex; gap:.5rem; }
.cc-dot {
  width:.5rem; height:.5rem; border-radius:999px; cursor:pointer; padding:0;
  border:1px solid rgba(255,215,0,.6); background:transparent;
  transition: background .3s ease, box-shadow .3s ease, scale .3s ease;
}
.cc-dot:hover { background: rgba(255,215,0,.45); }
.cc-dot-on { background:#FFD700; box-shadow: 0 0 12px rgba(255,215,0,.8); scale:1.15; }
.cc-dot:focus-visible { outline:2px solid #FFD700; outline-offset:3px; }

.cc-film {
  display:flex; gap:.5rem; margin-top:.9rem; overflow-x:auto; padding-bottom:.5rem;
  scrollbar-width: thin; scrollbar-color: rgba(255,215,0,.4) transparent;
}
.cc-film::-webkit-scrollbar { height:5px; }
.cc-film::-webkit-scrollbar-thumb { background: rgba(255,215,0,.4); border-radius:3px; }
.cc-thumb {
  flex: 0 0 auto; width:4.8rem; aspect-ratio:16/10; padding:0; cursor:pointer;
  border-radius:3px; overflow:hidden;
  border:1px solid rgba(255,215,0,.3); background: rgba(244,250,255,.9);
  opacity:.5; transition: opacity .3s ease, border-color .3s ease, box-shadow .3s ease;
}
.cc-thumb:hover { opacity:.85; }
.cc-thumb-on { opacity:1; border-color:#FFD700; box-shadow: 0 0 16px rgba(255,215,0,.45); }
.cc-thumb:focus-visible { outline:2px solid #FFD700; outline-offset:2px; }
.cc-thumb-img { width:100%; height:100%; object-fit:cover; object-position: top left; display:block; }
.cc-thumb { position:relative; }
.cc-thumb-play {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  background: rgba(10,25,47,.35); pointer-events:none;
}
.cc-thumb-play svg { width:1.1rem; height:1.1rem; fill:#FFD700; filter: drop-shadow(0 0 6px rgba(10,25,47,.9)); }
.cc-thumb-draw { display:flex; align-items:center; justify-content:center; width:100%; height:100%; padding:.3rem; background: rgba(10,25,47,.5); }
.cc-thumb-draw .cc-schema { height:92%; max-width:92%; stroke-width:2.6; filter:none; }

.cc-rail { min-width:0; }
.cc-rail-epithet { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.05rem; letter-spacing:.14em; color: rgba(255,215,0,.85); margin:0 0 .4rem; }
.cc-rail-title { font-family:'Michroma',sans-serif; font-size: clamp(1.05rem,2.4vw,1.5rem); line-height:1.3; color:#FFFDF2; margin:0; text-shadow: 0 0 24px rgba(255,215,0,.35); }
.cc-rail-role { font-family:'Inter',system-ui,sans-serif; font-weight:400; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; color: rgba(255,253,242,.85); margin:.7rem 0 0; }
.cc-rail-head { margin-bottom:1.1rem; }
.cc-rail-main { padding-top:1.1rem; border-top:1px solid rgba(255,215,0,.28); }
.cc-rail-p {
  font-family:'Inter',system-ui,sans-serif; font-weight:300; font-size:.9rem;
  line-height:1.75; color: rgba(240,248,255,.88); margin:0;
}
.cc-rail-p + .cc-rail-p { margin-top:.9rem; }
.cc-em { font-weight:500; color:#FFFDF2; }

.cc-body-split .cc-rail-side { margin-top:1.5rem; }

.cc-credits { margin:0; padding:0 0 0 0; display:grid; gap:.7rem; }
.cc-credit dt, .cc-rail-label {
  font-family:'Inter',system-ui,sans-serif; font-weight:500; font-size:var(--cc-label-size);
  letter-spacing:.16em; text-transform:uppercase; color: var(--cc-gold-label);
}
.cc-rail-label { margin:0 0 .45rem; }
.cc-rail-timeline { margin-bottom:1.1rem; }
.cc-credit dd { margin:.2rem 0 0; font-family:'Cormorant Garamond',serif; font-size:.98rem; line-height:1.4; color: rgba(240,248,255,.86); }

.cc-tagblock { margin-top:1.6rem; }
.cc-tag-label { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:.95rem; letter-spacing:.12em; color: var(--cc-gold-label); margin:0 0 .75rem; }
.cc-tags { display:flex; flex-wrap:wrap; gap:.5rem; }
.cc-pill {
  font-family:'Inter',system-ui,sans-serif; font-weight:400; font-size:var(--cc-label-size);
  letter-spacing:.12em; text-transform:uppercase; color: var(--cc-text-meta);
  padding:.5rem .85rem; border-radius:999px; cursor:default;
  border:1px solid rgba(255,215,0,.42); background: rgba(255,255,255,.1);
  box-shadow: 0 0 0 1px rgba(255,255,255,.14) inset;
  transition: background .35s ease, border-color .35s ease, box-shadow .35s ease, translate .35s ease;
}
.cc-pill:hover { background: rgba(255,215,0,.2); border-color:#FFD700; translate:0 -2px; box-shadow: 0 0 20px rgba(255,215,0,.4), 0 0 0 1px rgba(255,255,255,.24) inset; }
.cc-pill:focus-visible { outline:2px solid #FFD700; outline-offset:3px; }

.cc-rail-link {
  display:inline-flex; align-items:center; gap:.6rem; margin-top:1.7rem;
  font-family:'Inter',system-ui,sans-serif; font-weight:400; font-size:.66rem;
  letter-spacing:.2em; text-transform:uppercase; color: rgba(255,215,0,.92);
  text-decoration:none; border-bottom:1px solid rgba(255,215,0,.4); padding-bottom:.3rem;
  transition: color .3s ease, border-color .3s ease, gap .3s ease;
}
.cc-rail-link svg { width:1.1rem; fill:none; stroke:currentColor; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; }
.cc-rail-link:hover { color:#FFE97A; border-color:#FFE97A; gap:.9rem; }
.cc-rail-link:focus-visible { outline:2px solid #FFD700; outline-offset:4px; }

/* "View Full Case Study" — same treatment as the old case-study link.
   Only the spacing differs, since this one sits under the slideshow
   rather than at the end of the text rail. */
.cc-more { margin-top:1.2rem; }

/* ---------- hero height (mobile-safe) ---------- */
.cc-hero { min-height:100vh; }
/* iOS Safari's toolbar makes 100vh taller than the visible viewport,
   which pushes the scroll cue off screen. svh measures the small
   viewport instead. */
@supports (min-height: 100svh) { .cc-hero { min-height:100svh; } }

/* ---------- let's connect ----------
   Night returns at the close. The card rests here and slides open into a
   band flush with both side edges and the bottom.

   Position via top/left, tilt via the rotate property, bounce via
   translate — three separate properties, so none overwrites another. */
.cc-cx-stage {
  position:relative; z-index:2; overflow:hidden;
  /* Tall enough that the card is fully settled with scroll still remaining —
     that leftover scroll is the confirmation gesture. The card travels down
     through this space rather than it sitting empty. */
  height: clamp(40rem, 72vh, 47rem);
  background: linear-gradient(180deg,
    rgba(10,25,47,0) 0%,
    rgba(16,34,64,.62) 32%,
    rgba(10,25,47,.94) 72%,
    rgba(10,25,47,.98) 100%);
}

/* ---- the prompt, below the card ---- */
.cc-cx-prompt {
  position:absolute; left:50%; translate:-50% 0; text-align:center;
  z-index:4; pointer-events:none;
}
.cc-cx-words {
  display:block; font-family:'Cormorant Garamond',serif; font-weight:500;
  font-size:clamp(1.15rem,3.2vw,1.7rem); letter-spacing:.05em; white-space:nowrap;
  /* a dark halo under the gold keeps it readable where the sky is lightest */
  color:#FFD700; text-shadow:0 1px 3px rgba(10,25,47,.7), 0 0 18px rgba(255,215,0,.3);
}
.cc-cx-chev { display:block; margin:1.6rem auto 0; }
.cc-cx-chev svg {
  width:100%; fill:none; stroke:#FFD700; stroke-width:6;
  stroke-linecap:round; stroke-linejoin:round;
  filter:drop-shadow(0 0 12px rgba(255,215,0,.55));
}

/* ---- the card ---- */
.cc-cx-card {
  position:absolute; z-index:5; overflow:hidden; border-radius:5px;
  border:1px solid rgba(255,215,0,.62);
  background:
    linear-gradient(165deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,.08) 45%, rgba(184,167,255,.16) 100%),
    rgba(255,255,255,.1);
  backdrop-filter: blur(10px) saturate(1.1); -webkit-backdrop-filter: blur(10px) saturate(1.1);
  box-shadow: 0 -16px 48px rgba(10,25,47,.5), 0 0 0 1px rgba(255,255,255,.24) inset, 0 0 24px rgba(255,215,0,.14) inset;
}
.cc-cx-card .cc-lozenge { display:none; }
.cc-cx-landed { border-radius:0; }

.cc-cx-face { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
.cc-cx-face svg { width:52%; max-width:46px; fill:none; }

/* invisible drag handle, matched to the card's box and tilt */
.cc-cx-grab {
  position:absolute; z-index:6; padding:0; border:0; background:none;
  cursor:grab; touch-action:none; border-radius:5px;
}
.cc-cx-grab:active { cursor:grabbing; }
.cc-cx-grab:focus-visible { outline:2px solid #FFD700; outline-offset:6px; }

/* ---- shared bounce: one duration, one phase, three amplitudes ---- */
@keyframes cc-bob-card  { 0%,100% { translate:0 -5px; } 50% { translate:0 5px; } }
@keyframes cc-bob-words { 0%,100% { translate:0 -2px; } 50% { translate:0 2px; } }
@keyframes cc-bob-chev  { 0%,100% { translate:0 -5px; opacity:.72; } 50% { translate:0 5px; opacity:1; } }
.cc-cx-card.cc-cx-rest,
.cc-cx-grab.cc-cx-rest                   { animation: cc-bob-card  2.1s ease-in-out infinite; }
.cc-cx-prompt.cc-cx-rest .cc-cx-words    { animation: cc-bob-words 2.1s ease-in-out infinite; }
.cc-cx-prompt.cc-cx-rest .cc-cx-chev svg { animation: cc-bob-chev  2.1s ease-in-out infinite; }

/* ---- the landed band ---- */
.cc-cx-panel {
  /* "safe center": centred when it fits, top-aligned (and scrollable) when it doesn't */
  position:absolute; inset:0; display:grid; align-items:center; align-content:safe center;
  grid-template-columns:auto minmax(0,1fr) auto;
  gap: clamp(1.4rem, 5vw, 4rem);
  padding: 0 clamp(1.4rem,4vw,3.5rem); /* vertical padding is set inline, scaled to band height */
  /* If a very short viewport still can't fit the bio, scroll rather than clip.
     Scrolling must chain back to the page once the panel is at its end (or has
     nothing to scroll), or the visitor gets stuck at the bottom of the site. */
  overflow-y:auto; overscroll-behavior:auto;
}
.cc-cx-shot {
  position:relative; aspect-ratio:1/1; height:100%;
  border-radius:4px; overflow:hidden;
  border:1px solid rgba(255,215,0,.5);
  display:flex; align-items:center; justify-content:center;
  background:
    radial-gradient(closest-side at 50% 35%, rgba(184,167,255,.26), rgba(184,167,255,0) 100%),
    linear-gradient(165deg, rgba(30,58,102,.95), rgba(10,25,47,.98));
  box-shadow: 0 0 24px rgba(255,215,0,.14) inset;
}
.cc-cx-shot img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(.92) contrast(1.03); }
.cc-cx-mono {
  font-family:'Michroma',sans-serif; font-size:1.5rem; color:rgba(255,215,0,.72);
  text-shadow:0 0 22px rgba(255,215,0,.4);
}
.cc-cx-say { text-align:left; min-width:0; }
/* programmatic focus target (from the nav), not an interactive control */
.cc-cx-title:focus { outline:none; }
.cc-cx-title {
  font-family:'Michroma',sans-serif; font-size:clamp(1.05rem,2.8vw,1.9rem);
  line-height:1.14; margin:0 0 .55rem; color:#F4FAFF;
  text-shadow: 0 0 14px rgba(224,242,255,.66), 0 0 40px rgba(184,167,255,.55), 0 0 88px rgba(255,215,0,.18);
}
/* Same colour as the About Me heading, deliberately smaller than it. */
.cc-cx-line {
  font-family:'Inter',system-ui,sans-serif; font-weight:300;
  font-size:clamp(.85rem,1.7vw,1.05rem); line-height:1.6;
  color:#F4FAFF; margin:0 0 1.1rem; max-width:46ch;
}
/* One step down from the line above it, so the hierarchy reads
   heading > line > bio > buttons. */
.cc-cx-bio {
  font-family:'Inter',system-ui,sans-serif; font-weight:300;
  font-size:clamp(.78rem,1.35vw,.9rem); line-height:1.65;
  color:rgba(224,242,255,.86); margin:0 0 1.1rem; max-width:72ch;
}
.cc-cx-btns { display:flex; flex-wrap:wrap; gap:.5rem; }

/* Revealed address: drop the uppercase and the wide tracking, because an email
   address rendered as DJCHEN@STANFORD.EDU is both ugly and harder to read. */
.cc-mail { transition: background .4s ease, border-color .4s ease, box-shadow .4s ease, translate .4s cubic-bezier(.2,.7,.2,1); }
.cc-mail-open {
  text-transform:none; letter-spacing:.01em;
  font-size:clamp(.78rem,1.4vw,.86rem);
  border-color:#FFD700; background:rgba(255,215,0,.16);
  box-shadow: 0 14px 34px rgba(10,25,47,.45), 0 0 26px rgba(255,215,0,.3), 0 0 0 1px rgba(255,255,255,.24) inset;
}

/* ---- glass buttons, mail, back-to-top: used inside the landed panel ---- */
.cc-glass-btn {
  display:inline-flex; align-items:center; gap:.65rem;
  padding:.95rem 1.4rem; border-radius:999px; text-decoration:none;
  font-family:'Inter',system-ui,sans-serif; font-weight:400;
  font-size:.74rem; letter-spacing:.2em; text-transform:uppercase;
  color:var(--cc-parchment);
  background: linear-gradient(rgba(255,255,255,.06), rgba(255,255,255,.06)), var(--cc-glass-btn);
  border:1px solid rgba(255,255,255,.5);
  backdrop-filter: blur(10px) saturate(1.15); -webkit-backdrop-filter: blur(10px) saturate(1.15);
  box-shadow: 0 14px 34px rgba(10,25,47,.45), 0 0 0 1px rgba(255,255,255,.14) inset;
  transition: background .4s ease, border-color .4s ease, box-shadow .4s ease, translate .4s cubic-bezier(.2,.7,.2,1);
}
.cc-glass-btn:hover, .cc-glass-btn:focus-visible {
  background: linear-gradient(rgba(255,255,255,.13), rgba(255,255,255,.13)), var(--cc-glass-btn); border-color:#FFFFFF; translate:0 -3px; outline:none;
  box-shadow: 0 20px 44px rgba(10,25,47,.5), 0 0 34px rgba(255,215,0,.34), 0 0 0 1px rgba(255,255,255,.3) inset;
}
.cc-glass-btn:focus-visible { outline:2px solid #FFD700; outline-offset:4px; }
.cc-glass-glyph { display:flex; width:1.3rem; height:1.3rem; }
.cc-glass-glyph svg {
  width:100%; height:100%; fill:none; stroke:rgba(255,215,0,.95);
  stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round;
  transition: stroke .4s ease, filter .4s ease;
}
.cc-glyph-fill { fill: rgba(255,215,0,.9); stroke:none; }
.cc-glass-btn:hover .cc-glass-glyph svg { stroke:#FFE97A; filter: drop-shadow(0 0 8px rgba(255,215,0,.7)); }


/* back to top, drawn as a falling star */
.cc-startop {
  display:inline-flex; flex-direction:column; align-items:center; gap:.45rem;
  padding:.5rem .7rem; border:0; background:none; cursor:pointer; border-radius:6px;
  align-self:center;
}
.cc-startop-art { display:block; width:2.2rem; height:2.2rem; }
.cc-startop-art svg {
  width:100%; height:100%; fill:none; stroke:rgba(255,215,0,.9); stroke-width:1.6; stroke-linecap:round;
  filter: drop-shadow(0 0 10px rgba(255,215,0,.45));
  transition: translate .55s cubic-bezier(.2,.7,.2,1), filter .55s ease;
}
.cc-startop-tail { transition: opacity .55s ease; }
.cc-tail-1 { opacity:.75; }
.cc-tail-2 { opacity:.45; }
.cc-tail-3 { opacity:.3; }
.cc-startop:hover .cc-startop-art svg,
.cc-startop:focus-visible .cc-startop-art svg {
  translate: 4px -7px; filter: drop-shadow(0 0 18px rgba(255,215,0,.85));
}
.cc-startop:hover .cc-startop-tail { opacity:1; }
.cc-startop-label {
  font-family:'Inter',system-ui,sans-serif; font-weight:500; font-size:var(--cc-label-size);
  letter-spacing:.2em; text-transform:uppercase; color:var(--cc-gold-label);
  transition: color .35s ease;
}
.cc-startop:hover .cc-startop-label { color:#FFE97A; }
.cc-startop:focus-visible { outline:2px solid #FFD700; outline-offset:3px; }

/* ---------- full-width blocks below the modal grid ---------- */
.cc-below {
  position:relative; z-index:2; margin-top:2.4rem; padding-top:1.6rem;
  border-top:1px solid rgba(255,215,0,.32);
}
.cc-below-label {
  font-family:'Michroma',sans-serif; font-size:.68rem; letter-spacing:.16em;
  text-transform:uppercase; color: rgba(255,215,0,.9); margin:0 0 .9rem;
}
.cc-below-intro {
  font-family:'Cormorant Garamond',serif; font-size:1.05rem; line-height:1.55;
  color: rgba(240,248,255,.88); margin:0 0 1.4rem; max-width:62ch;
}

.cc-tech { display:grid; gap:.75rem; margin:0; }
@media (min-width:760px) { .cc-tech { grid-template-columns: repeat(2, minmax(0,1fr)); gap:.75rem 1.5rem; } }
.cc-tech-row {
  padding:.95rem 1.1rem; border-radius:5px;
  border:1px solid rgba(224,242,255,.16); background: rgba(255,255,255,.07);
  transition: border-color .35s ease, background .35s ease;
}
.cc-tech-row:hover { border-color: rgba(255,215,0,.45); background: rgba(255,255,255,.1); }
.cc-tech-row dt {
  font-family:'Inter',system-ui,sans-serif; font-weight:500; font-size:var(--cc-label-size);
  letter-spacing:.16em; text-transform:uppercase; color: var(--cc-gold-label);
}
.cc-tech-row dd {
  margin:.45rem 0 0; font-family:'Inter',system-ui,sans-serif; font-weight:300;
  font-size:.86rem; line-height:1.65; color: rgba(240,248,255,.86);
}

.cc-quote {
  margin:.85rem 0 0; padding:.1rem 0 .1rem .9rem; border-left:2px solid rgba(255,215,0,.55);
}
.cc-quote p {
  margin:0; font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:1.02rem; line-height:1.5; color:#FFFDF2;
}
.cc-quote cite {
  display:block; margin-top:.4rem; font-style:normal; font-size:.74rem;
  letter-spacing:.04em; color: rgba(240,248,255,.78);
}

.cc-tech-p { margin:0; }
.cc-tech-p + .cc-tech-p { margin-top:.75rem; }

.cc-testimonials { display:grid; gap:1.4rem; }
@media (min-width:760px) { .cc-testimonials { grid-template-columns: repeat(2, minmax(0,1fr)); gap:1.5rem; } }
.cc-testimonials .cc-quote { margin:0; }

.cc-process { list-style:none; margin:0; padding:0; display:grid; gap:.6rem; }
@media (min-width:760px) { .cc-process { grid-template-columns: repeat(2, minmax(0,1fr)); gap:.6rem 1.5rem; } }
.cc-step {
  display:flex; gap:.9rem; align-items:flex-start; padding:.85rem .4rem;
  border-bottom:1px solid rgba(224,242,255,.12);
}
.cc-step-n {
  flex:0 0 auto; font-family:'Michroma',sans-serif; font-size:var(--cc-label-size);
  color: var(--cc-gold-label); padding-top:.15rem; letter-spacing:.06em;
}
.cc-step-body { min-width:0; }
.cc-step-title {
  display:block; font-family:'Cormorant Garamond',serif; font-weight:500;
  font-size:.98rem; letter-spacing:.1em; text-transform:uppercase; color:#FFFDF2;
}
.cc-step-detail {
  display:block; margin-top:.3rem; font-family:'Inter',system-ui,sans-serif; font-weight:300;
  font-size:.84rem; line-height:1.65; color: rgba(240,248,255,.82);
}

/* ---------- mobile ---------- *//* ---------- mobile ---------- */
/* Small-screen only. Desktop sizing is untouched — the site-wide type
   floor is a separate decision still awaiting sign-off. */
/* The About Me band stacks below 800px: side by side, the bio column is too
   narrow to fit. Keep this breakpoint in sync with STACK_AT in Connect(). */
@media (max-width: 799px) {
  /* the landed band stacks: portrait, then text, then the star */
  .cc-cx-panel {
    grid-template-columns:1fr; grid-auto-rows:auto;
    justify-items:center; text-align:center;
    gap:.7rem; padding-left:1.1rem; padding-right:1.1rem;
  }
  .cc-cx-say .cc-cx-line { margin-bottom:.8rem; }
  .cc-cx-stage .cc-startop { padding:.3rem .6rem; gap:.35rem; }
  .cc-cx-stage .cc-startop-art { width:1.9rem; height:1.9rem; }
  /* fixed size: an aspect-ratio box with overflow:hidden can otherwise shrink
     to nothing in a tight grid row and slide under the heading */
  .cc-cx-shot { width:min(26vw, 100px); height:min(26vw, 100px); flex:none; }
  .cc-cx-say { text-align:center; }
  .cc-cx-line { margin-left:auto; margin-right:auto; }
  .cc-cx-btns { justify-content:center; }
  .cc-glass-btn { padding:.85rem 1.25rem; font-size:.68rem; }
  .cc-cx-stage { height: clamp(48rem, 100vh, 60rem); }
}

@media (max-width: 640px) {
  /* modal: reclaim the padding a phone can't spare */
  .cc-scrim { padding:.6rem; }
  .cc-modal { padding:1.15rem; border-radius:6px; }
  .cc-modal .cc-frame-rule { inset:6px; }
  .cc-modal .cc-frame-rule-2 { inset:10px; }
  .cc-close { width:2.3rem; height:2.3rem; top:.7rem; right:.7rem; }
  .cc-head { padding-right:2.9rem; margin-bottom:1.1rem; }

  /* the smallest labels are unreadable at arm's length on a phone */
  .cc-clow-meta { font-size:.78rem; }
  .cc-credit dt, .cc-rail-label { font-size:.74rem; }
  .cc-credit dd { font-size:1.02rem; }
  .cc-pill { font-size:.74rem; padding:.55rem .9rem; }
  .cc-count { font-size:.74rem; }
  .cc-rail-role { font-size:.76rem; }
  .cc-tech-row dt, .cc-step-n { font-size:.74rem; }
  .cc-rail-p, .cc-tech-row dd, .cc-step-detail { font-size:.92rem; }

  /* bigger tap targets for the carousel */
  .cc-nav { width:2.7rem; height:2.7rem; }
  .cc-nav-prev { left:.4rem; }
  .cc-nav-next { right:.4rem; }
  .cc-dot { width:.62rem; height:.62rem; }
  .cc-thumb { width:4rem; }

  /* one card per row, no stagger */
  .cc-slot { max-width:20rem; }
  .cc-deck { gap:2.5rem 0; }
}

/* very narrow phones */
@media (max-width: 380px) {
  .cc-slot { max-width:100%; }
  .cc-glass-btn { font-size:.68rem; letter-spacing:.16em; }
}

/* touch devices have no hover, so the resting state has to carry itself */
@media (hover: none) {
  .cc-clow-face { border-color: rgba(255,215,0,.68); }
  .cc-aura { opacity:.72; }
  .cc-startop-tail { opacity:.9; }
}

@media (prefers-reduced-motion: reduce) {
  .cc-star, .cc-cloud, .cc-dust, .cc-name, .cc-name::before, .cc-seal, .cc-cue svg, .cc-clow, .cc-back-sigil svg,
  .cc-cx-card, .cc-cx-grab, .cc-cx-words, .cc-cx-chev svg { animation:none !important; }
  .cc-reveal { transition-duration:.01ms !important; opacity:1; transform:none; }
  .cc-flipper { transition-duration:.01ms !important; }
  .cc-scrim, .cc-modal, .cc-plate-next, .cc-plate-prev { animation-duration:.01ms !important; }
  /* hover lifts and scaling become instant; colour and glow changes stay */
  .cc-clow, .cc-pill, .cc-glass-btn, .cc-rail-link, .cc-tech-row { transition-duration:.01ms !important; }
  .cc-clow:hover, .cc-clow:focus-visible { scale:1; }
  .cc-pill:hover, .cc-glass-btn:hover, .cc-glass-btn:focus-visible { translate:none; }
  /* nav: no bob, instant flip and underline (the faces still never overlap) */
  .cc-navcard-tilt { animation:none !important; transition-duration:.01ms !important; }
  .cc-navcard:hover .cc-navcard-tilt { translate:none; }
  .cc-navcard-inner, .cc-navlink, .cc-navlink::after { transition-duration:.01ms !important; }
  .cc-below-cue svg { animation:none !important; }
}
`;
