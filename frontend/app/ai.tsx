'use client';

import React, { useEffect, useState } from 'react';
import type { OrbState } from 'orb-ui';



// Icons
const MicIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
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
    
    // Simulating Orb's internal audio state variant ('speaking' | 'listening' | 'idle')
    const [orbState, setOrbState] = useState<OrbState>('idle');
    const [orbVolume, setOrbVolume] = useState<number>(0.08);
    const dockWaveBars = [0.28, 0.52, 0.74, 0.42, 0.9, 0.56, 0.36, 0.8, 0.46, 0.66, 0.32, 0.72, 0.5, 0.84, 0.38];

    const suggestions: SuggestionCard[] = [
        { id: 'cakes', title: '🎂 Order Cakes', subtitle: 'Find ribbon or chocolate fudge cakes for birthdays.', prompt: 'Show me the best selling birthday cakes available for delivery in Colombo today.' },
        { id: 'hampers', title: '🎁 Gift Hampers', subtitle: 'Surprise loved ones with curated gift sets.', prompt: 'Help me choose a luxury fruit and chocolate hamper for an anniversary.' },
        { id: 'flowers', title: '💐 Fresh Flowers', subtitle: 'Send bouquets across Sri Lanka.', prompt: 'What are the best fresh rose bouquets available for same-day delivery?' },
    ];

    const handleSuggestionClick = (promptText: string) => {
        setInputValue(promptText);
    };

    const handleVoiceToggle = () => {
        const nextListeningState = !isListening;
        setIsListening(nextListeningState);
        setOrbState(nextListeningState ? 'listening' : 'idle');
        if (!nextListeningState) {
            setOrbVolume(0.08);
        }
    };

    const stopVoiceSession = () => {
        setIsListening(false);
        setOrbState('idle');
        setOrbVolume(0.08);
    };

    const handleHomeClick = () => {
        stopVoiceSession();
        setInputValue('');
    };

    useEffect(() => {
        if (orbState === 'idle') {
            return;
        }

        const intervalId = window.setInterval(() => {
            const baseVolume = orbState === 'speaking' ? 0.55 : 0.34;
            const voiceMovement = Math.random() * (orbState === 'speaking' ? 0.36 : 0.28);

            setOrbVolume(Number(Math.min(1, baseVolume + voiceMovement).toFixed(2)));
        }, 180);

        return () => window.clearInterval(intervalId);
    }, [orbState]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        alert(`Searching Kapruka AI for: "${inputValue}"`);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#0B0F19] p-6 font-sans select-none text-slate-200 md:p-12">
            
            {/* 1. Technical Grid Overlay */}
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

            {/* 2. Background Glow Ambiance (Softened to balance with the ElevenLabs Orb) */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#005CB9]/10 via-[#0EA5E9]/10 to-[#FFC72C]/5 blur-[120px] opacity-60" />
            
            {/* Header section */}
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
            <main className="z-10 mx-auto flex w-full max-w-4xl flex-grow flex-col justify-center transition-all duration-500">
                
                {/* CONDITIONAL STATE 1: VOICE INTERACTION INTERFACE */}
                {isListening ? (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-in pb-28 pt-8">
                        <div className="mb-4 h-[3px] w-12 rounded-full bg-[#FFC72C] shadow-lg shadow-[#FFC72C]/50" />
                        <p className="text-sm font-bold uppercase tracking-widest text-[#38BDF8] animate-pulse">
                            {orbState === 'listening' ? 'Listening to you...' : 'Kapruka AI is Speaking...'}
                        </p>
                        
                        {/* Container wrapper for ElevenLabs Orb to guarantee center-point scaling */}
                        <div
                            className="voice-orb-stage voice-orb-siri my-12 flex h-72 w-72 items-center justify-center"
                            style={{ '--orb-volume': orbVolume } as React.CSSProperties}
                            aria-hidden="true"
                        >
                            <div className="siri-orb-shadow" />
                            <div className="siri-orb-shell">
                                <span className="siri-orb-layer siri-orb-layer-one" />
                                <span className="siri-orb-layer siri-orb-layer-two" />
                                <span className="siri-orb-layer siri-orb-layer-three" />
                                <span className="siri-orb-layer siri-orb-layer-four" />
                                <span className="siri-orb-highlight" />
                            </div>
                            <div className="siri-orb-wave siri-orb-wave-one" />
                            <div className="siri-orb-wave siri-orb-wave-two" />
                            <div className="siri-orb-wave siri-orb-wave-three" />
                        </div>

                        <p className="text-xl font-medium text-slate-300 max-w-md italic px-4">
                            &quot;{inputValue || "Go ahead, say something like 'Show me birthday cakes'..."}&quot;
                        </p>

                        <div
                            className="fixed bottom-5 left-1/2 z-50 flex w-[min(430px,calc(100vw-28px))] -translate-x-1/2 items-center justify-center gap-4 rounded-[34px] border border-white/40 bg-gradient-to-r from-[#f7efff]/85 via-[#e8f6ff]/85 to-[#d6f5f2]/85 px-3 py-2.5 shadow-2xl shadow-black/30 backdrop-blur-xl max-[430px]:gap-2.5 max-[430px]:px-2.5 max-[430px]:py-2"
                            aria-label="Voice controls"
                        >
                            <button
                                type="button"
                                onClick={stopVoiceSession}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-900/10 bg-white/75 text-slate-700 shadow-lg shadow-slate-900/10 transition active:scale-95 max-[430px]:h-10 max-[430px]:w-10"
                                aria-label="Back to chat"
                            >
                                <MessageIcon className="h-6 w-6" />
                            </button>

                            <button
                                type="button"
                                onClick={stopVoiceSession}
                                className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-full border border-slate-400/20 bg-white/80 py-2 pl-5 pr-4 shadow-lg shadow-slate-900/10"
                                aria-label="Stop voice input"
                            >
                                <div className="voice-dock-wave flex h-9 min-w-0 flex-1 items-center justify-center gap-1">
                                    {dockWaveBars.map((barScale, index) => (
                                        <span
                                            key={`${barScale}-${index}`}
                                            className="w-[3px] rounded-full bg-slate-500"
                                            style={{
                                                height: `${9 + orbVolume * barScale * 30}px`,
                                                animationDelay: `${index * 42}ms`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <MicIcon className="h-7 w-7 text-slate-700" />
                            </button>

                            <button
                                type="button"
                                onClick={handleHomeClick}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-900/10 bg-white/75 text-slate-700 shadow-lg shadow-slate-900/10 transition active:scale-95 max-[430px]:h-10 max-[430px]:w-10"
                                aria-label="Reset assistant"
                            >
                                <HomeIcon className="h-7 w-7" />
                            </button>
                        </div>
                    </div>
                ) : (
                    
                    /* CONDITIONAL STATE 2: DEFAULT SEARCH & GRID INTERFACE */
                    <div className="animate-fade-in">
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
                                placeholder="Ask me anything..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus
                            />

                            {/* Premium Dual-State Action Button */}
                            <button
                                type="button"
                                onClick={handleVoiceToggle}
                                className="absolute inset-y-3 right-3 flex items-center justify-center gap-2 rounded-xl px-5 font-semibold transition-all duration-300 active:scale-95 bg-[#005CB9] text-white hover:bg-[#006ee0] hover:shadow-lg hover:shadow-sky-500/20 border border-sky-500/30"
                                aria-label="Start voice search"
                            >
                                <span className="text-sm tracking-wide">Speak</span>
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
                    </div>
                )}
            </main>

            {!isListening && (
            <footer className="z-10 w-full border-t border-white/5 pt-4 text-center text-xs font-medium text-slate-500">
                © {new Date().getFullYear()} Kapruka AI Assistant. Delivering love and care across Sri Lanka.
            </footer>
            )}
        </div>
    );
};
