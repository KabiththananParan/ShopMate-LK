'use client';

import React, { useState } from 'react';

// Microphone Icon for Voice Interaction
const MicIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
);

const ShoppingCartIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="9" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
        <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 3 1.9 4.3L18 9.2l-4.1 1.9L12 15l-1.9-3.9L6 9.2l4.1-1.9L12 3Z" />
        <path d="m19 14 1 2.2 2 1-2 1-1 2.2-1-2.2-2-1 2-1 1-2.2Z" />
        <path d="m5 13 1.2 2.7L9 17l-2.8 1.3L5 21l-1.2-2.7L1 17l2.8-1.3L5 13Z" />
    </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const HelpCircleIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.1 9a3 3 0 1 1 5.9 1c0 2-3 2-3 4" />
        <path d="M12 17h.01" />
    </svg>
);

interface SuggestionCard {
    id: string;
    title: string;
    subtitle: string;
    prompt: string;
}

export const KaprukaAIChat: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);

    const suggestions: SuggestionCard[] = [
        { id: 'cakes', title: '🎂 Order Cakes', subtitle: 'Find ribbon or chocolate fudge cakes for birthdays.', prompt: 'Show me the best selling birthday cakes available for delivery in Colombo today.' },
        { id: 'hampers', title: '🎁 Gift Hampers', subtitle: 'Surprise loved ones with curated gift sets.', prompt: 'Help me choose a luxury fruit and chocolate hamper for an anniversary.' },
        { id: 'flowers', title: '💐 Fresh Flowers', subtitle: 'Send bouquets across Sri Lanka.', prompt: 'What are the best fresh rose bouquets available for same-day delivery?' },
    ];

    const handleSuggestionClick = (promptText: string) => {
        setInputValue(promptText);
    };

    const handleVoiceStart = () => {
        setIsListening(!isListening);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        alert(`Searching Kapruka AI for: "${inputValue}"`);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#0B0F19] p-6 font-sans select-none text-slate-200 md:p-12">
            
            {/* 1. Technical Grid Overlay Inspired by image_01c605.png */}
            <div 
                className="absolute inset-0 opacity-15 pointer-events-none" 
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #38BDF8 1px, transparent 1px),
                        linear-gradient(to bottom, #38BDF8 1px, transparent 1px)
                    `,
                    backgroundSize: '44px 44px'
                }}
            />

            {/* 2. Fluid Glowing Sci-Fi Orbs mimicking the fluid center blob from image_01c605.png */}
            <div className="pointer-events-none absolute left-[45%] top-[15%] h-[45vw] w-[45vw] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#005CB9]/20 via-[#0EA5E9]/20 to-[#FFC72C]/10 blur-[90px] opacity-70" />
            
            {/* Dynamic expanding orb ring structure when voice is listening */}
            <div className={`pointer-events-none absolute left-[45%] top-[25%] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px] transition-all duration-1000 ${
                isListening ? 'h-[55vw] w-[55vw] opacity-100 scale-110 animate-pulse' : 'h-[30vw] w-[30vw] opacity-40'
            }`} />

            {/* Header section with absolute depth context */}
            <header className="z-10 flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-white">
                        KAPRUKA <span className="text-[#38BDF8]">AI</span>
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                    <a href="https://www.kapruka.com" className="transition-colors hover:text-[#38BDF8]">Main Site</a>
                    <HelpCircleIcon className="h-5 w-5 cursor-pointer hover:text-white" />
                </div>
            </header>

            {/* Core Interaction Engine Frame */}
            <main className="z-10 mx-auto flex w-full max-w-4xl flex-grow flex-col justify-center">
                <div className="mb-8">
                    <div className="mb-2 h-[3px] w-12 rounded-full bg-[#FFC72C] shadow-lg shadow-[#FFC72C]/50" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">System Ready</p>
                    <h1 className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                        <ShoppingCartIcon className="h-9 w-9 shrink-0 text-[#38BDF8] md:h-12 md:w-12" />
                        What would you like to buy today?
                    </h1>
                </div>

                {/* Glassmorphic Search Container */}
                <form onSubmit={handleSearchSubmit} className="group relative mb-10">
                    <div className="pointer-events-none absolute inset-y-0 left-6 flex items-center text-slate-400 transition-colors group-focus-within:text-[#38BDF8]">
                        <SparklesIcon className="h-6 w-6" />
                    </div>

                    <input
                        type="text"
                        className="h-20 w-full rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl pl-16 pr-36 text-xl text-white transition-all duration-300 placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/30 focus:shadow-2xl focus:shadow-cyan-500/10"
                        placeholder={isListening ? "Listening to your voice..." : "Ask me anything..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />

                    {/* Unified Premium Dual-State Button */}
                    <button
                        type="button"
                        onClick={handleVoiceStart}
                        className={`absolute inset-y-3 right-3 flex items-center justify-center gap-2 rounded-xl px-5 font-semibold transition-all duration-300 active:scale-95 shadow-md ${
                            isListening 
                                ? 'bg-[#FFC72C] text-[#0B0F19] shadow-[#FFC72C]/30 border border-[#FFC72C] scale-105' 
                                : 'bg-[#005CB9] text-white hover:bg-[#006ee0] hover:shadow-lg hover:shadow-sky-500/20 border border-sky-500/30'
                        }`}
                        aria-label="Start voice search"
                    >
                        <span className="text-sm tracking-wide">{isListening ? 'Listening' : 'Speak'}</span>
                        <MicIcon className="h-5 w-5" />
                    </button>
                </form>

                {/* Glassmorphic Grid Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {suggestions.map((card) => (
                        <button 
                            key={card.id} 
                            type="button" 
                            onClick={() => handleSuggestionClick(card.prompt)} 
                            className="group flex h-44 flex-col items-start justify-between rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 text-left transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-900/40 hover:shadow-xl hover:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                            <div>
                                <h2 className="text-lg font-bold text-white transition-colors duration-150 group-hover:text-[#38BDF8]">{card.title}</h2>
                                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{card.subtitle}</p>
                            </div>
                            <div className="flex w-full translate-x-2 justify-end opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                <span className="flex items-center gap-1 rounded-lg bg-[#FFC72C]/10 border border-[#FFC72C]/20 px-2.5 py-1 text-xs font-bold text-[#FFC72C]">
                                    Use Prompt <ArrowRightIcon className="h-3 w-3" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            <footer className="z-10 w-full border-t border-white/5 pt-4 text-center text-xs font-medium text-slate-500">
                © {new Date().getFullYear()} Kapruka AI Assistant. Delivering love and care across Sri Lanka.
            </footer>
        </div>
    );
};