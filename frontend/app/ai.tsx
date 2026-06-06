'use client';

import React, { useEffect, useState, useRef } from 'react';
import type { OrbState } from 'orb-ui';

import type { Product } from "@/types/product";

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

const PlusIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="14" height="14" x="8" y="8" rx="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const ThumbsUpIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 10v12" />
        <path d="M15 5.9 14 10h5.8a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 18.5 21H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2.8L13 5.2a1.4 1.4 0 0 1 2 .7Z" />
    </svg>
);

const ThumbsDownIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 14V2" />
        <path d="M9 18.1 10 14H4.2a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 5.5 3H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2.8L11 18.8a1.4 1.4 0 0 1-2-.7Z" />
    </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
    </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 0 1-9 9 9.8 9.8 0 0 1-6.7-2.7" />
        <path d="M3 12a9 9 0 0 1 9-9 9.8 9.8 0 0 1 6.7 2.7" />
        <path d="M3 19v-6h6" />
        <path d="M21 5v6h-6" />
    </svg>
);

const MoreIcon = ({ className }: { className?: string }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="5" cy="12" r="1.7" />
        <circle cx="12" cy="12" r="1.7" />
        <circle cx="19" cy="12" r="1.7" />
    </svg>
);

interface SuggestionCard {
    id: string;
    title: string;
    subtitle: string;
    prompt: string;
}

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;

    products?: Product[];
};

export const KaprukaAIChat: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome-message',
            role: 'assistant',
            content: "Hi 👋 I'm ShopMate LK, your Kapruka AI shopping assistant. How can I help you discover gifts, cakes, or bouquets across Sri Lanka today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [loading, setLoading] = useState(false);
    
    // Checks if the user has actively typed and sent something beyond the greeting bubble
    const hasStartedChat = messages.length > 1;

    const [isListening, setIsListening] = useState<boolean>(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike'>>({});
    
    const [orbState, setOrbState] = useState<OrbState>('idle');
    const [orbVolume, setOrbVolume] = useState<number>(0.08);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dockWaveBars = [0.28, 0.52, 0.74, 0.42, 0.9, 0.56, 0.36, 0.8, 0.46, 0.66, 0.32, 0.72, 0.5, 0.84, 0.38];

    const suggestions: SuggestionCard[] = [
        { id: 'cakes', title: '🎂 Order Cakes', subtitle: 'Find ribbon or chocolate fudge cakes for birthdays.', prompt: 'Show me the best selling birthday cakes available for delivery in Colombo today.' },
        { id: 'hampers', title: '🎁 Gift Hampers', subtitle: 'Surprise loved ones with curated gift sets.', prompt: 'Help me choose a luxury fruit and chocolate hamper for an anniversary.' },
        { id: 'flowers', title: '💐 Fresh Flowers', subtitle: 'Send bouquets across Sri Lanka.', prompt: 'What are the best fresh rose bouquets available for same-day delivery?' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSuggestionClick = (promptText: string) => {
        if (loading) return;
        setInputValue(promptText);
    };

    const handleVoiceToggle = () => {
        if (loading) return;
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
        setMessages([
            {
                id: 'welcome-message',
                role: 'assistant',
                content: "Hi 👋 I'm ShopMate LK, your Kapruka AI shopping assistant. How can I help you discover gifts, cakes, or bouquets across Sri Lanka today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]); 
        setFeedback({});
    };

    async function submitToChatAPI (userPrompt: string) {
        setLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ 
                    message: userPrompt,
                    history: messages,
                 })
            });

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: data.reply,
                    products: data.products ?? [],
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please check your connection and retry.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || loading) return;

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: userMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
        ]);

        setInputValue('');
        await submitToChatAPI(userMessage);
    };

    const handleCopy = async (messageId: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
        setFeedback(prev => ({
            ...prev,
            [messageId]: prev[messageId] === type ? undefined : type
        }));
    };

    const handleShare = async (text: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Kapruka AI Recommendation',
                    text: text,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Sharing failed', err);
            }
        } else {
            await navigator.clipboard.writeText(`${text}\n\nShared via Kapruka AI.`);
            alert('Sharing details saved directly to clipboard!');
        }
    };

    const handleRegenerate = async () => {
        if (loading) return;
        const userMessages = messages.filter(m => m.role === 'user');
        if (userMessages.length === 0) return;
        
        const lastUserMessage = userMessages[userMessages.length - 1].content;
        await submitToChatAPI(lastUserMessage);
    };

    useEffect(() => {
        if (orbState === 'idle') return;

        const intervalId = window.setInterval(() => {
            const baseVolume = orbState === 'speaking' ? 0.55 : 0.34;
            const voiceMovement = Math.random() * (orbState === 'speaking' ? 0.36 : 0.28);

            setOrbVolume(Number(Math.min(1, baseVolume + voiceMovement).toFixed(2)));
        }, 180);

        return () => window.clearInterval(intervalId);
    }, [orbState]);

    return (
        <div className="relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden font-sans select-none bg-[#0B0F19] p-4 md:p-8 text-slate-200 transition-colors duration-500">
            
            {/* Technical Grid Background Overlay */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #38BDF8 1px, transparent 1px),
                        linear-gradient(to bottom, #38BDF8 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Background Glow Ambiance */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#005CB9]/5 via-[#0EA5E9]/5 to-[#FFC72C]/5 blur-[120px] opacity-60" />
            
            {/* Fixed Header Layout Frame */}
            <header className="z-20 flex w-full max-w-4xl mx-auto items-center justify-between pb-3 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
                    <span className="text-xl font-black tracking-tight text-white">
                        KAPRUKA <span className="text-[#38BDF8]">AI</span>
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <button onClick={handleHomeClick} className="text-[#38BDF8] hover:underline flex items-center gap-1 transition-colors">
                        <HomeIcon className="h-3.5 w-3.5" /> Reset & New Chat
                    </button>
                    <a href="https://www.kapruka.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#38BDF8] hidden sm:inline">Main Site</a>
                    <HelpCircleIcon className="h-4 w-4 cursor-pointer hover:text-white" />
                </div>
            </header>

            {/* Main Interactive Work Area Stage */}
            <main className="z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden justify-between pt-4 min-h-0">
                
                {/* CONDITIONAL STATE 1: VOICE INTERACTION INTERFACE */}
                {isListening ? (
                    <div className="flex flex-col flex-1 items-center justify-center text-center animate-fade-in pb-12">
                        <div className="mb-4 h-[3px] w-12 rounded-full bg-[#FFC72C] shadow-lg shadow-[#FFC72C]/50" />
                        <p className="text-sm font-bold uppercase tracking-widest text-[#38BDF8] animate-pulse">
                            {orbState === 'listening' ? 'Listening to you...' : 'Kapruka AI is Speaking...'}
                        </p>
                        
                        <div
                            className="voice-orb-stage voice-orb-siri my-8 flex h-60 w-60 items-center justify-center"
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

                        <p className="text-lg font-medium text-slate-300 max-w-md italic px-4">
                            &quot;{inputValue || "Go ahead, say something like 'Show me birthday cakes'..."}&quot;
                        </p>

                        <div className="mt-8 flex items-center justify-center gap-4 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 shadow-2xl backdrop-blur-xl">
                            <button
                                type="button"
                                onClick={stopVoiceSession}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                                aria-label="Back to chat"
                            >
                                <MessageIcon className="h-5 w-5" />
                            </button>
                            <div className="flex h-6 items-center gap-1 px-2">
                                {dockWaveBars.slice(0, 8).map((barScale, index) => (
                                    <span
                                        key={index}
                                        className="w-[2.5px] rounded-full bg-[#38BDF8]"
                                        style={{
                                            height: `${6 + orbVolume * barScale * 20}px`,
                                        }}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleHomeClick}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                                aria-label="Reset assistant"
                            >
                                <HomeIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    
                    /* CONDITIONAL STATE 2: TEXT CHAT STREAM LAYOUT */
                    <div className="flex flex-col flex-1 overflow-hidden justify-between min-h-0">
                        
                        {/* Title Branding Header */}
                        {!hasStartedChat && (
                            <div className="mb-3 animate-fade-in shrink-0">
                                <div className="mb-1.5 h-[3px] w-10 rounded-full bg-[#FFC72C] shadow-lg shadow-[#FFC72C]/50" />
                                <h1 className="flex items-center gap-2.5 font-black tracking-tight text-white text-2xl md:text-3xl">
                                    <ShoppingCartIcon className="shrink-0 text-[#38BDF8] h-7 w-7 md:h-8 md:w-8" />
                                    What can I help you find?
                                </h1>
                            </div>
                        )}

                        {/* Suggestions Carousel (Shown only when chat hasn't started) */}
                        {!hasStartedChat && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 shrink-0 animate-fade-in">
                                {suggestions.map((sug) => (
                                    <div
                                        key={sug.id}
                                        onClick={() => handleSuggestionClick(sug.prompt)}
                                        className="flex flex-col p-3.5 rounded-xl border border-white/5 bg-[#111827]/40 hover:bg-[#1E293B]/60 hover:border-[#38BDF8]/40 transition-all duration-300 cursor-pointer group text-left shadow-lg"
                                    >
                                        <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                                            {sug.title}
                                            <SparklesIcon className="h-3.5 w-3.5 text-[#FFC72C] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-normal">{sug.subtitle}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Beautiful Adaptive Messaging Scroll Container Area */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent min-h-0">
                            <div className="flex flex-col gap-4 w-full">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex w-full ${
                                            message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {message.role === 'user' ? (
                                            <div className="flex flex-col items-end gap-1 max-w-[80%] md:max-w-[70%]">
                                                <div className="rounded-2xl rounded-tr-sm bg-[#1E293B] border border-white/5 px-4 py-2.5 text-sm md:text-base leading-relaxed text-slate-100 shadow-md">
                                                    {message.content}
                                                </div>
                                                <span className="text-[10px] text-slate-500 tracking-wide px-1">{message.timestamp}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-start gap-1 max-w-[95%] md:max-w-[90%]">
                                                <div className="text-left rounded-2xl rounded-tl-sm border border-white/5 bg-[#111827]/70 backdrop-blur-md p-4 shadow-xl w-full">
                                                    <p className="text-sm md:text-base leading-relaxed text-slate-200">
                                                        {message.content}
                                                    </p>


                                                    {message.products && message.products.length > 0 && (
                                                        <div className="mt-4 grid gap-3">
                                                            {message.products.map((product) => (
                                                                <div
                                                                    key={product.id}
                                                                    className="rounded-xl border border-white/10 bg-slate-900/60 p-3"
                                                                >
                                                                    <h4 className="font-medium text-white">
                                                                        {product.name}
                                                                    </h4>

                                                                    <p className="mt-1 text-sm text-slate-400">
                                                                        LKR {product.price.toLocaleString()}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        {product.stock}
                                                                    </p>

                                                                    <a
                                                                        href={product.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="mt-2 inline-block text-sm text-sky-400 hover:text-sky-300"
                                                                    >
                                                                        View on Kapruka →
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Actions Toolbar Interface Elements Box */}
                                                    <div className="mt-3.5 flex items-center gap-3.5 text-white/40 border-t border-white/5 pt-2.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(message.id, message.content)}
                                                            className="flex h-4 w-4 items-center justify-center rounded text-white/50 transition hover:text-[#38BDF8]"
                                                            title="Copy text"
                                                        >
                                                            {copiedMessageId === message.id ? (
                                                                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                                                            ) : (
                                                                <CopyIcon className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleFeedback(message.id, 'like')}
                                                            className={`flex h-4 w-4 items-center justify-center rounded transition ${
                                                                feedback[message.id] === 'like' ? 'text-emerald-400' : 'text-white/50 hover:text-emerald-400'
                                                            }`}
                                                            title="Good response"
                                                        >
                                                            <ThumbsUpIcon className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleFeedback(message.id, 'dislike')}
                                                            className={`flex h-4 w-4 items-center justify-center rounded transition ${
                                                                feedback[message.id] === 'dislike' ? 'text-rose-400' : 'text-white/50 hover:text-rose-400'
                                                            }`}
                                                            title="Bad response"
                                                        >
                                                            <ThumbsDownIcon className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleShare(message.content)}
                                                            className="flex h-4 w-4 items-center justify-center rounded text-white/50 transition hover:text-[#38BDF8]"
                                                            title="Share"
                                                        >
                                                            <UploadIcon className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={handleRegenerate}
                                                            disabled={loading}
                                                            className="flex h-4 w-4 items-center justify-center rounded text-white/50 transition hover:text-[#38BDF8] disabled:opacity-30"
                                                            title="Regenerate"
                                                        >
                                                            <RefreshIcon className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => alert('Additional features coming soon!')}
                                                            className="flex h-4 w-4 items-center justify-center rounded text-white/50 transition hover:text-[#38BDF8]"
                                                            title="More options"
                                                        >
                                                            <MoreIcon className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-500 tracking-wide px-1">{message.timestamp}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-[#111827]/40 p-4">
                                            <p className="text-slate-400 animate-pulse text-xs md:text-sm font-medium">
                                                ShopMate LK is finding products...
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Search Input Box Area Form Container */}
                        <form onSubmit={handleSearchSubmit} className="w-full group relative mb-4 shrink-0">
                            {/* Explicit Navigation & Control Anchor Nodes */}
                            <button
                                type="button"
                                onClick={handleHomeClick}
                                disabled={loading}
                                className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-lg h-8 px-2 bg-white/5 text-slate-400 hover:text-white transition gap-1 text-[11px] font-bold border border-white/5"
                                title="Start New Chat Session"
                            >
                                <PlusIcon className="h-4 w-4 text-[#38BDF8]" />
                                <span className="hidden sm:inline">New Chat</span>
                            </button>

                            <div className={`relative rounded-xl border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-md focus-within:border-[#38BDF8] ${loading ? 'opacity-50' : ''}`}>
                                <input
                                    type="text"
                                    disabled={loading}
                                    className="w-full text-white text-sm md:text-base transition-all duration-200 placeholder:text-slate-500 focus:outline-none bg-transparent h-14 pl-24 sm:pl-28 pr-24 disabled:cursor-not-allowed"
                                    placeholder={loading ? 'Processing...' : 'Ask ShopMate anything...'}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    autoFocus
                                />

                                <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={handleVoiceToggle}
                                        disabled={loading}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                                        aria-label="Voice search"
                                    >
                                        <MicIcon className="h-4.5 w-4.5" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !inputValue.trim()}
                                        className="flex h-9 px-3.5 items-center justify-center rounded-lg bg-[#005CB9] text-white hover:bg-[#004b99] disabled:bg-white/5 disabled:text-slate-500 font-bold text-xs md:text-sm transition-all"
                                        aria-label="Send message"
                                    >
                                        <span className="hidden sm:inline mr-1">Send</span>
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};