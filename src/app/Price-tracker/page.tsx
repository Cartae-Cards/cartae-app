"use client";

// ─────────────────────────────────────────────────────────────────────────────
// src/app/price-tracker/page.tsx
// Cartae — Price Tracker Page
// Next.js 14 App Router | TypeScript | Tailwind CSS | "use client"
//
// What this page does:
//   1. Shows a large search bar at the top
//   2. As the user types (with debounce), it calls GET /api/cards/search?q=...
//      — that is Simon's API route, which proxies pokemontcg.io
//   3. Results display as a responsive grid (2 cols mobile → 4 cols desktop)
//   4. Each card shows: image, name, set name, language badge
//   5. Handles loading, empty, and error states gracefully
//
// MOCK DATA is used while Simon's route is not ready.
// Search for the TODO comments to find where to swap in the real API call.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// ─── TYPES ───────────────────────────────────────────────────────────────────

// This is the shape of each card object returned by Simon's API route.
// Update these fields if Simon's response shape differs.
type CardLanguage = "EN" | "JP" | "KR";

interface CardResult {
  id: string;           // Unique card ID from pokemontcg.io
  name: string;         // Card name e.g. "Charizard ex"
  setName: string;      // Set name e.g. "Obsidian Flames"
  setId: string;        // Set ID e.g. "sv03"
  number: string;       // Card number e.g. "234"
  imageUrl: string;     // Full card image URL
  language: CardLanguage;
  rarity?: string;      // e.g. "Special Illustration Rare"
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
// TODO: Remove this once Simon's /api/cards/search route is ready.
// These are placeholder cards used so the UI is testable right now.

const MOCK_CARDS: CardResult[] = [
  {
    id: "sv3-234",
    name: "Charizard ex",
    setName: "Obsidian Flames",
    setId: "sv3",
    number: "234",
    imageUrl: "https://images.pokemontcg.io/sv3/234_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
  {
    id: "sv1-199",
    name: "Miraidon ex",
    setName: "Scarlet & Violet",
    setId: "sv1",
    number: "199",
    imageUrl: "https://images.pokemontcg.io/sv1/199_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
  {
    id: "sv2-197",
    name: "Gardevoir ex",
    setName: "Paldea Evolved",
    setId: "sv2",
    number: "197",
    imageUrl: "https://images.pokemontcg.io/sv2/197_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
  {
    id: "sv3pt5-191",
    name: "Pikachu ex",
    setName: "151",
    setId: "sv3pt5",
    number: "191",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/191_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
  {
    id: "sv4-169",
    name: "Mewtwo ex",
    setName: "Paradox Rift",
    setId: "sv4",
    number: "169",
    imageUrl: "https://images.pokemontcg.io/sv4/169_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
  {
    id: "sv4-171",
    name: "Espeon ex",
    setName: "Paradox Rift",
    setId: "sv4",
    number: "171",
    imageUrl: "https://images.pokemontcg.io/sv4/171_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
  {
    id: "sv5-191",
    name: "Iron Valiant ex",
    setName: "Temporal Forces",
    setId: "sv5",
    number: "191",
    imageUrl: "https://images.pokemontcg.io/sv5/191_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
  {
    id: "sv6-191",
    name: "Teal Mask Ogerpon ex",
    setName: "Twilight Masquerade",
    setId: "sv6",
    number: "191",
    imageUrl: "https://images.pokemontcg.io/sv6/191_hires.png",
    language: "EN",
    rarity: "Special Illustration Rare",
  },
];

// ─── LANGUAGE BADGE ──────────────────────────────────────────────────────────

// Maps each language to its Tailwind colour classes.
const LANGUAGE_STYLES: Record<CardLanguage, { bg: string; text: string; label: string }> = {
  EN: { bg: "bg-blue-100",   text: "text-blue-800",  label: "EN" },
  JP: { bg: "bg-red-100",    text: "text-red-800",   label: "JP" },
  KR: { bg: "bg-green-100",  text: "text-green-800", label: "KR" },
};

function LanguageBadge({ language }: { language: CardLanguage }) {
  const style = LANGUAGE_STYLES[language];
  return (
    <span
      className={`inline-block ${style.bg} ${style.text} text-[0.65rem] font-bold px-2 py-0.5 rounded tracking-wide`}
    >
      {style.label}
    </span>
  );
}

// ─── CARD SKELETON (loading placeholder) ─────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e1d8] rounded-2xl overflow-hidden animate-pulse">
      {/* Image area */}
      <div className="bg-gray-100 aspect-[2.5/3.5] w-full" />
      {/* Text area */}
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-10" />
      </div>
    </div>
  );
}

// ─── SINGLE CARD RESULT ───────────────────────────────────────────────────────

function CardResultItem({ card }: { card: CardResult }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white border border-[#e5e1d8] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer">
      {/* Card image */}
      <div className="relative aspect-[2.5/3.5] w-full bg-gradient-to-br from-[#e8f0fe] to-[#c7d8f8] overflow-hidden">
        {!imgError ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback if image fails to load
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#6b7280]">
            <span className="text-3xl mb-1">🃏</span>
            <span className="text-xs text-center px-2">{card.name}</span>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-3 space-y-1.5">
        <p className="font-playfair font-bold text-sm text-[#0f1f3d] leading-tight line-clamp-1">
          {card.name}
        </p>
        <p className="text-xs text-[#6b7280] line-clamp-1">{card.setName}</p>
        <div className="flex items-center gap-1.5 pt-0.5">
          <LanguageBadge language={card.language} />
          {card.rarity && (
            <span className="text-[0.6rem] text-[#9ca3af] truncate">
              {card.rarity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl mb-4">🔍</span>
      <h3 className="font-playfair font-bold text-xl text-[#0f1f3d] mb-2">
        No cards found
      </h3>
      <p className="text-[#6b7280] text-sm max-w-xs">
        We couldn&apos;t find any cards matching{" "}
        <span className="font-medium text-[#0f1f3d]">&ldquo;{query}&rdquo;</span>.
        Try a different name or set.
      </p>
    </div>
  );
}

// ─── IDLE STATE (before any search) ──────────────────────────────────────────

function IdleState() {
  const suggestions = [
    "Charizard ex",
    "Pikachu ex",
    "Gardevoir ex",
    "Mewtwo ex",
    "Miraidon ex",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-3xl mb-6">
        ✨
      </div>
      <h3 className="font-playfair font-bold text-2xl text-[#0f1f3d] mb-2">
        Search any Pokémon card
      </h3>
      <p className="text-[#6b7280] text-sm mb-8 max-w-sm">
        Get live GBP prices, 30-day trends, and PSA grade values — free, no
        account needed.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <p className="w-full text-xs text-[#9ca3af] mb-1 uppercase tracking-widest font-medium">
          Try searching
        </p>
        {suggestions.map((s) => (
          // These are just display labels — wire them to setQuery if you want
          // clickable suggestions in the future
          <span
            key={s}
            className="bg-white border border-[#e5e1d8] text-[#0f1f3d] text-xs font-medium px-3.5 py-1.5 rounded-full hover:border-[#c9a84c] hover:text-[#8a6a1a] transition-colors cursor-default"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── ERROR STATE ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <h3 className="font-playfair font-bold text-xl text-[#0f1f3d] mb-2">
        Something went wrong
      </h3>
      <p className="text-[#6b7280] text-sm max-w-xs mb-6">
        We couldn&apos;t reach the card search service. Please check your
        connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="bg-[#0f1f3d] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#1a3260] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PriceTrackerPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CardResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultCount, setResultCount] = useState(0);

  // We use a ref to store the latest query so the debounce closure captures
  // the right value without needing to be in the dependency array.
  const latestQuery = useRef(query);
  latestQuery.current = query;

  // ── SEARCH FUNCTION ──
  // This is the function that actually calls Simon's API route.
  const performSearch = useCallback(async (searchQuery: string) => {
    // Don't search if the input is empty or only whitespace
    if (!searchQuery.trim()) {
      setStatus("idle");
      setResults([]);
      return;
    }

    setStatus("loading");

    try {
      // TODO: replace mock data with Simon's real API route when ready
      // Real call (uncomment when /api/cards/search is ready):
      //
      // const res = await fetch(`/api/cards/search?q=${encodeURIComponent(searchQuery)}`);
      // if (!res.ok) throw new Error(`API error: ${res.status}`);
      // const data = await res.json();
      // const cards: CardResult[] = data.cards; // adjust if Simon's shape differs
      //
      // ── MOCK: simulate network delay + filter mock data ──
      await new Promise((resolve) => setTimeout(resolve, 600));
      const cards = MOCK_CARDS.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.setName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // ── END MOCK ──

      setResults(cards);
      setResultCount(cards.length);
      setStatus("success");
    } catch (err) {
      console.error("Card search failed:", err);
      setStatus("error");
    }
  }, []);

  // ── DEBOUNCE ──
  // Wait 400ms after the user stops typing before firing the search.
  // This avoids hammering the API on every keypress.
  useEffect(() => {
    if (!query.trim()) {
      setStatus("idle");
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 400);

    // Clean up the timer if the user types again before 400ms is up
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // ── RETRY HANDLER ──
  const handleRetry = useCallback(() => {
    performSearch(latestQuery.current);
  }, [performSearch]);

  // ── RENDER ──
  return (
    <div className="min-h-screen bg-[#faf8f4]">

      {/* ── HEADER ── */}
      <div className="bg-[#0f1f3d] pt-24 pb-14 px-[5%]">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="inline-block bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#e8c97a] text-xs font-medium px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Free Tool · No login required
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3">
            GBP Price Tracker
          </h1>
          <p className="text-white/55 text-base leading-relaxed">
            Live GBP prices, 30-day trends, and PSA grade values for any
            Pokémon card.
          </p>
        </div>

        {/* ── SEARCH BOX ── */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Search icon */}
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any Pokémon card..."
              autoFocus
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white text-base placeholder-white/30 outline-none focus:border-[#c9a84c]/60 focus:bg-white/15 transition-all"
            />

            {/* Clear button — only shows when there's text */}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Loading bar under search — thin animated line */}
          {status === "loading" && (
            <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#c9a84c] rounded-full animate-loading-bar" />
            </div>
          )}
        </div>
      </div>

      {/* ── RESULTS AREA ── */}
      <div className="px-[5%] py-8 max-w-7xl mx-auto">

        {/* Results count label */}
        {status === "success" && (
          <p className="text-sm text-[#6b7280] mb-6">
            {resultCount === 0
              ? null
              : `${resultCount} card${resultCount !== 1 ? "s" : ""} found for `}
            {resultCount > 0 && (
              <span className="font-medium text-[#0f1f3d]">
                &ldquo;{query}&rdquo;
              </span>
            )}
          </p>
        )}

        {/* ── LOADING SKELETONS ── */}
        {status === "loading" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── RESULTS GRID ── */}
        {status === "success" && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {results.map((card) => (
              <CardResultItem key={card.id} card={card} />
            ))}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {status === "success" && results.length === 0 && (
          <EmptyState query={query} />
        )}

        {/* ── ERROR STATE ── */}
        {status === "error" && <ErrorState onRetry={handleRetry} />}

        {/* ── IDLE STATE ── */}
        {status === "idle" && <IdleState />}
      </div>

      {/* ── TAILWIND ANIMATION NOTE ──────────────────────────────────────────
          Add this to your tailwind.config.ts keyframes + animation blocks:

          keyframes: {
            "loading-bar": {
              "0%":   { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(100%)" },
            },
          },
          animation: {
            "loading-bar": "loading-bar 1s ease-in-out infinite",
          },
      ── ────────────────────────────────────────────────────────────────── */}
    </div>
  );
}