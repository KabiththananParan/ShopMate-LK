'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { OrbState } from 'orb-ui';

import { CheckoutProgress } from "./CheckoutProgress";
import type { Product } from "@/types/product";

declare global {
    interface Window {
        SpeechRecognition: unknown;
        webkitSpeechRecognition: unknown;
    }
}

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
    currentProduct?: Product | null;

    order?: {
        id: string;
        total: string;
        checkoutUrl: string;
    };

    tracking?: {
        orderId: string;
        status: string;
        recipient: string;
        total: string;
        liveTracking: boolean;
        steps: {
            label: string;
            time: string;
            state: "complete" | "transit" | "delivered";
        }[];
    };
};

const formatMessageTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const loadingMessages = [
    "Finding the perfect gift...",
    "Searching Kapruka...",
    "Finding gifts...",
    "Checking delivery...",
    "Creating order...",
    "Generating recommendations...",
];

export const KaprukaAIChat: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');



    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome-message',
            role: 'assistant',
            content: "Hi 👋 I'm ShopMate LK, your Kapruka AI shopping assistant. How can I help you discover gifts, cakes, or bouquets across Sri Lanka today?",
            timestamp: ''
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

    // Checks if the user has actively typed and sent something beyond the greeting bubble
    const hasStartedChat = messages.length > 1;

    const [isListening, setIsListening] = useState<boolean>(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [feedback, setFeedback] =
        useState<
            Record<
                string,
                "like" |
                "dislike" |
                undefined
            >
        >({});

    const [orbState, setOrbState] = useState<OrbState>('idle');
    const [orbVolume, setOrbVolume] = useState<number>(0.08);

    type CartItem = Product & {
        quantity: number;
    };

    const [cart, setCart] =
        useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] =
        useState(false);
    const skipInitialCartPersist = useRef(true);



    const [checkoutPending, setCheckoutPending] = useState(false);

    const [checkoutStage, setCheckoutStage] =
        useState<
            | "none"
            | "confirm"
            | "city"
            | "recipient"
            | "phone"
            | "deliveryDate"
            | "address"
            | "sender"
            | "complete"
            | "gift"
            | "giftAge"
            | "giftBudget"
            | "giftDate"
            | "trackOrder"
        >("none");

    const [checkoutData, setCheckoutData] =
        useState({
            city: "",
            recipient: "",
            phone: "",
            deliveryDate: "",
            address: "",
            sender: "",
            giftMessage: "",
        });

    const cartItemCount =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    const cartTotal =
        cart.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

    const updateCartQuantity = (
        productId: string,
        quantity: number
    ) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === productId
                        ? {
                            ...item,
                            quantity,
                        }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeCartItem = (productId: string) => {
        setCart((prev) =>
            prev.filter((item) => item.id !== productId)
        );
    };

    const startCheckoutFromCart = () => {
        setCartOpen(false);
        setInputValue("checkout");
    };

    useEffect(() => {
        console.log(
            "Checkout Stage Changed:",
            checkoutStage
        );
    }, [checkoutStage]);

    useEffect(() => {
        console.log(
            "Checkout Data:",
            checkoutData
        );
    }, [checkoutData]);

    useEffect(() => {
        console.log(
            "Cart JSON:",
            JSON.stringify(
                cart,
                null,
                2
            )
        );
    }, [cart]);

    useEffect(() => {
        const saved =
            localStorage.getItem(
                "shopmate-cart"
            );

        if (!saved) {
            return;
        }

        try {
            const savedCart = JSON.parse(saved);
            window.setTimeout(() => {
                setCart(savedCart);
            }, 0);
        } catch {
            localStorage.removeItem(
                "shopmate-cart"
            );
        }
    }, []);

    useEffect(() => {
        if (skipInitialCartPersist.current) {
            skipInitialCartPersist.current = false;
            return;
        }

        localStorage.setItem(
            "shopmate-cart",
            JSON.stringify(cart)
        );
    }, [cart]);



    function getLastProduct() {
        const assistantMessages = messages.filter(
            (m) =>
                m.role === "assistant" &&
                m.currentProduct
        );

        return assistantMessages.length > 0
            ? assistantMessages[
                assistantMessages.length - 1
            ].currentProduct
            : null;
    }

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dockWaveBars = [0.28, 0.52, 0.74, 0.42, 0.9, 0.56, 0.36, 0.8, 0.46, 0.66, 0.32, 0.72, 0.5, 0.84, 0.38];

    const demoSuggestions: SuggestionCard[] = [
        { id: 'voice-cake', title: '🎤 මට කේක් එකක් ඕන', subtitle: '(Sinhala → Cake Search)', prompt: 'මට කේක් එකක් ඕන' },
        { id: 'birthday-mother', title: '🎁 Birthday gift for my mother', subtitle: 'Curated gift finder with product cards.', prompt: 'Birthday gift for my mother' },
        { id: 'flowers-demo', title: '💐 Browse flowers', subtitle: 'Visual bouquet search with delivery options.', prompt: 'browse flowers' },
        { id: 'budget-hamper', title: '🍫 Hamper under LKR 10,000', subtitle: 'Budget-aware recommendations.', prompt: 'Find me a chocolate hamper under LKR 10000' },
    ];

    const suggestions: SuggestionCard[] = [
        { id: 'cakes', title: '🎂 Order Cakes', subtitle: 'Find ribbon or chocolate fudge cakes for birthdays.', prompt: 'Show me the best selling birthday cakes available for delivery in Colombo today.' },
        { id: 'hampers', title: '🎁 Gift Hampers', subtitle: 'Surprise loved ones with curated gift sets.', prompt: 'Help me choose a luxury fruit and chocolate hamper for an anniversary.' },
        { id: 'flowers', title: '💐 Fresh Flowers', subtitle: 'Send bouquets across Sri Lanka.', prompt: 'What are the best fresh rose bouquets available for same-day delivery?' },
    ];

    void suggestions;

    const scrollToBottom = () => {
        window.requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        if (!loading) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setLoadingMessageIndex((current) =>
                (current + 1) % loadingMessages.length
            );
        }, 1400);

        return () => window.clearInterval(intervalId);
    }, [loading]);

    const handleSuggestionClick = (promptText: string) => {
        if (loading) return;
        setInputValue(promptText);
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
                timestamp: formatMessageTime()
            }
        ]);
        setFeedback({});
    };

    async function submitToChatAPI(
        userPrompt: string
    ) {
        setLoadingMessageIndex(0);
        setLoading(true);

        // STEP 13.4
        const isCheckout =
            userPrompt.toLowerCase() ===
            "checkout";

        if (isCheckout) {
            setCheckoutPending(true);
            setCheckoutStage("confirm");
        }

        try {
            const response = await fetch(
                "/api/chat",
                {
                    method: "POST",
                    headers: {
                        "content-type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        message: userPrompt,
                        lastProduct:
                            getLastProduct(),
                        cart,
                        checkoutPending:
                            checkoutPending ||
                            isCheckout,
                        checkoutStage,
                        checkoutData,
                    }),
                }
            );

            console.log(
                "SENDING CART:",
                cart
            );

            const data =
                await response.json();

            if (data.clearCart) {
                setCart([]);
            }

            if (
                data.removeFromCart
            ) {
                setCart((prev) =>
                    prev.filter(
                        (item) =>
                            !item.name
                                .toLowerCase()
                                .includes(
                                    data.removeFromCart
                                )
                    )
                );
            }

            if (data.nextCheckoutStage) {
                console.log(
                    "NEXT STAGE:",
                    data.nextCheckoutStage
                );

                setCheckoutStage(
                    data.nextCheckoutStage
                );
            }

            if (
                data.nextCheckoutStage ===
                "complete"
            ) {
                setCart([]);

                setCheckoutPending(false);

                setCheckoutStage("none");

                setCheckoutData({
                    city: "",
                    recipient: "",
                    phone: "",
                    deliveryDate: "",
                    address: "",
                    sender: "",
                    giftMessage: "",
                });
            }

            if (data.checkoutData) {
                setCheckoutData(
                    (prev) => ({
                        ...prev,
                        ...data.checkoutData,
                    })
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content:
                        data.reply,
                    timestamp: formatMessageTime(),
                    products:
                        data.products,
                    currentProduct:
                        data.currentProduct,
                    order: data.order,
                    tracking: data.tracking,
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content:
                        "Sorry, something went wrong. Please check your connection and retry.",
                    timestamp: formatMessageTime(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const startVoiceInput = () => {
        const SpeechRecognition =
            (window as Window & {
                SpeechRecognition?: new () => {
                    lang: string;
                    interimResults: boolean;
                    maxAlternatives: number;
                    start(): void;
                    onresult: (
                        event: {
                            results: {
                                transcript: string;
                            }[][];
                        }
                    ) => void;
                    onerror: () => void;
                    onend: () => void;
                };

                webkitSpeechRecognition?: new () => {
                    lang: string;
                    interimResults: boolean;
                    maxAlternatives: number;
                    start(): void;
                    onresult: (
                        event: {
                            results: {
                                transcript: string;
                            }[][];
                        }
                    ) => void;
                    onerror: () => void;
                    onend: () => void;
                };
            }).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "Voice recognition is not supported."
            );
            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.lang = "en-US";

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;

        setIsListening(true);
        setOrbState('listening');

        recognition.start();

        recognition.onresult = (
            event
        ) => {
            const transcript =
                event.results[0][0]
                    .transcript;

            console.log(
                "VOICE:",
                transcript
            );

            setInputValue(
                transcript
            );

            setIsListening(
                false
            );
        };

        recognition.onerror = () => {
            setIsListening(false);
            setOrbState('idle');
        };

        recognition.onend = () => {
            setIsListening(false);
            setOrbState('idle');
        };
    };

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        console.log(
            "Last Product:",
            getLastProduct()
        );

        console.log(
            "Stage:",
            checkoutStage
        );

        console.log(
            "Checkout Stage:",
            checkoutStage
        );

        if (!userMessage || loading) return;

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: userMessage,
                timestamp: formatMessageTime(),
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
        <div className="
    relative
    flex
    h-[100dvh]
    w-full
    flex-col
    overflow-hidden
    font-sans
    select-text
    bg-[#070A12]
    p-4
    md:p-8
    text-slate-200
    transition-colors
    duration-500
">

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

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,199,44,0.10),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.35),transparent_42%)]" />

            {/* Fixed Header Layout Frame */}
            <header className="z-20 flex w-full max-w-5xl mx-auto items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3 cursor-pointer" onClick={handleHomeClick}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-400/10 text-sm font-black text-sky-200 shadow-lg shadow-sky-950/30">
                        LK
                    </span>
                    <div>
                        <span className="block text-xl font-black tracking-tight text-white">
                            ShopMate <span className="text-[#38BDF8]">LK</span>
                        </span>
                        <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:block">
                            Kapruka AI shopping concierge
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <button onClick={handleHomeClick} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-sky-200 transition-colors hover:border-sky-300/40 hover:bg-sky-300/10">
                        <HomeIcon className="h-3.5 w-3.5" /> New Chat
                    </button>
                    <a href="https://www.kapruka.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#38BDF8] hidden sm:inline">Main Site</a>
                    <HelpCircleIcon className="h-4 w-4 cursor-pointer hover:text-white" />
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setCartOpen((open) => !open)}
                        className={`flex h-9 min-w-14 items-center justify-center gap-1.5 rounded-full border border-sky-300/20 bg-sky-500/15 px-3 text-sm font-bold text-sky-100 shadow-lg shadow-sky-500/10 transition hover:border-sky-300/50 hover:bg-sky-400/20 ${
                            cartItemCount > 0 ? "animate-bounce" : ""
                        }`}
                        aria-label={`${cartItemCount} items in cart`}
                        aria-expanded={cartOpen}
                    >
                        <ShoppingCartIcon className="h-4 w-4 text-[#38BDF8]" />
                        <span>{cartItemCount}</span>
                    </button>

                    {cartOpen && (
                        <div className="absolute right-0 top-12 z-50 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-white/10 bg-sky-400/10 px-4 py-3">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                                        Your Cart
                                    </p>
                                    <p className="mt-0.5 text-sm font-bold text-white">
                                        {cartItemCount} item{cartItemCount === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCartOpen(false)}
                                    className="rounded-md border border-white/10 px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10">
                                        <ShoppingCartIcon className="h-5 w-5 text-sky-300" />
                                    </div>
                                    <p className="mt-3 text-sm font-black text-white">
                                        Your cart is empty
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        Add a product card, then open this cart to review and checkout.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="max-h-[360px] space-y-3 overflow-y-auto p-3">
                                        {cart.map((item) => (
                                            <div key={item.id} className="grid grid-cols-[64px_1fr] gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3">
                                                <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            sizes="64px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-[10px] text-slate-500">
                                                            Gift
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="line-clamp-2 text-sm font-black leading-snug text-white">
                                                            {item.name}
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCartItem(item.id)}
                                                            className="shrink-0 rounded-md px-2 py-1 text-[11px] font-bold text-rose-300 transition hover:bg-rose-400/10"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <p className="mt-1 text-xs font-bold text-sky-200">
                                                        LKR {(item.price * item.quantity).toLocaleString()}
                                                    </p>

                                                    <div className="mt-2 flex items-center justify-between gap-2">
                                                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-white/10 bg-slate-950/60">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                                className="flex h-8 w-8 items-center justify-center text-sm font-black text-slate-300 transition hover:bg-white/10"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="flex h-8 min-w-9 items-center justify-center border-x border-white/10 px-2 text-xs font-black text-white">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                                className="flex h-8 w-8 items-center justify-center text-sm font-black text-slate-300 transition hover:bg-white/10"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-slate-500">
                                                            LKR {item.price.toLocaleString()} each
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-white/10 bg-slate-900/80 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                                Total
                                            </span>
                                            <span className="text-xl font-black text-sky-200">
                                                LKR {cartTotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={startCheckoutFromCart}
                                            className="flex h-11 w-full items-center justify-center rounded-lg bg-sky-300 text-sm font-black text-slate-950 shadow-lg shadow-sky-300/20 transition hover:bg-sky-200"
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Main Interactive Work Area Stage */}
            <main className="z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden justify-between pt-4 min-h-0">

                {/* CONDITIONAL STATE 1: VOICE INTERACTION INTERFACE */}
                {isListening ? (
                    <div className="flex flex-col flex-1 items-center justify-center text-center animate-fade-in pb-12">
                        <div className="mb-4 h-[3px] w-12 rounded-full bg-[#FFC72C] shadow-lg shadow-[#FFC72C]/50" />
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-500/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#38BDF8] shadow-lg shadow-sky-500/10 animate-pulse">
                            <MicIcon className="h-4 w-4" />
                            <span>{orbState === 'listening' ? 'Listening...' : 'Kapruka AI is Speaking...'}</span>
                        </div>

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
                    <div className="flex flex-col flex-1 overflow-hidden min-h-0">

                        <CheckoutProgress
                            stage={checkoutStage}
                            visible={checkoutPending || checkoutStage !== "none"}
                        />

                        {/* Beautiful Adaptive Messaging Scroll Container Area */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent min-h-0">
                            <div className="flex flex-col gap-4 w-full">
                                {!hasStartedChat && (
                                    <div className="animate-fade-in">
                                        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-md">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-200">
                                                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.8)]" />
                                                <SparklesIcon className="h-3.5 w-3.5 text-[#FFC72C]" />
                                                Live Kapruka MCP integration
                                            </div>
                                            <h1 className="mt-3 max-w-2xl font-black tracking-tight text-white text-2xl md:text-3xl">
                                                Shop gifts with ShopMate LK.
                                            </h1>
                                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                                Search, add to cart, checkout, pay, and track Kapruka orders in one chat.
                                            </p>
                                        </div>

                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            {demoSuggestions.map((sug) => (
                                                <button
                                                    key={sug.id}
                                                    type="button"
                                                    onClick={() => handleSuggestionClick(sug.prompt)}
                                                    className="relative flex min-h-24 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#111827]/70 p-3.5 text-left shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-[#38BDF8]/50 hover:bg-[#172033] hover:shadow-[0_18px_38px_rgba(14,165,233,0.14)]"
                                                >
                                                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
                                                    <span className="text-sm font-black leading-snug text-white">
                                                        {sug.title}
                                                    </span>
                                                    <span className="mt-3 text-xs leading-normal text-slate-400">
                                                        {sug.subtitle}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'
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
                                                    <p className="whitespace-pre-line">
                                                        {message.tracking ? "Here is the latest Kapruka delivery status." : message.content}
                                                    </p>

                                                    {message.tracking && (
                                                        <div className="mt-4 overflow-hidden rounded-xl border border-emerald-300/20 bg-slate-950/70 shadow-2xl shadow-emerald-950/20">
                                                            <div className="border-b border-white/10 bg-emerald-400/10 px-4 py-3">
                                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                                    <div>
                                                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                                                                            Delivery Timeline
                                                                        </p>
                                                                        <p className="mt-1 text-lg font-black text-white">
                                                                            {message.tracking.orderId}
                                                                        </p>
                                                                    </div>
                                                                    <span className="rounded-full border border-emerald-300/30 bg-emerald-300 px-3 py-1 text-xs font-black tracking-[0.14em] text-slate-950 shadow-lg shadow-emerald-300/20">
                                                                        {message.tracking.status}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                                                                <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
                                                                    <div className="grid gap-3">
                                                                        <div>
                                                                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                                                                                Recipient
                                                                            </p>
                                                                            <p className="mt-1 text-sm font-bold text-white">
                                                                                {message.tracking.recipient}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                                                                                Total
                                                                            </p>
                                                                            <p className="mt-1 text-xl font-black text-sky-200">
                                                                                {message.tracking.total}
                                                                            </p>
                                                                        </div>
                                                                        {message.tracking.liveTracking && (
                                                                            <div className="rounded-lg border border-sky-300/20 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-100">
                                                                                Live tracking available on Kapruka
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="p-4">
                                                                    <div className="space-y-0">
                                                                        {message.tracking.steps.map((step, index) => {
                                                                            const isLast = index === message.tracking!.steps.length - 1;
                                                                            const markerClass =
                                                                                step.state === "transit"
                                                                                    ? "bg-amber-300 text-slate-950 shadow-amber-300/30"
                                                                                    : step.state === "delivered"
                                                                                        ? "bg-emerald-300 text-slate-950 shadow-emerald-300/30"
                                                                                        : "bg-emerald-400 text-slate-950 shadow-emerald-400/25";

                                                                            return (
                                                                                <div key={`${step.label}-${step.time}`} className="relative grid grid-cols-[28px_1fr] gap-3">
                                                                                    {!isLast && (
                                                                                        <span className="absolute left-[13px] top-8 h-[calc(100%-1.25rem)] w-px bg-gradient-to-b from-emerald-300/70 to-emerald-300/20" />
                                                                                    )}
                                                                                    <span className={`z-10 mt-1 flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-black shadow-lg ${markerClass}`}>
                                                                                        {step.state === "transit" ? "→" : "✓"}
                                                                                    </span>
                                                                                    <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                                                                                        <p className="text-sm font-black text-white">
                                                                                            {step.label}
                                                                                        </p>
                                                                                        <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                                                                            {step.time}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>

                                                                    <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-3 text-sm font-bold text-emerald-100">
                                                                        Delivery completed successfully.
                                                                        <span className="mt-1 block text-xs font-medium text-slate-300">
                                                                            Thank you for shopping with ShopMate LK.
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {message.order && (
                                                        <div className="mt-4 overflow-hidden rounded-xl border border-emerald-300/25 bg-slate-950/70 text-center shadow-2xl shadow-emerald-950/20">

                                                            <div className="bg-emerald-400/10 p-5">

                                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-300/30">
                                                                <CheckIcon className="h-6 w-6" />
                                                            </div>

                                                            <div className="sr-only">
                                                                Order Created ✓
                                                            </div>

                                                            <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                                                                Order Created
                                                            </div>

                                                            <div className="mt-3 text-lg font-black text-white">
                                                                {message.order.id}
                                                            </div>

                                                            <div className="mt-1 text-3xl font-black text-sky-200">
                                                                LKR {message.order.total}
                                                            </div>
                                                            </div>

                                                            <div className="grid gap-2 border-t border-white/10 p-4 sm:grid-cols-2">
                                                            <a
                                                                href={message.order.checkoutUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-300 px-5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-300/20 transition hover:bg-emerald-200"
                                                            >
                                                                Pay Now
                                                            </a>

                                                            <button
                                                                type="button"
                                                                onClick={() => setInputValue(`Track order ${message.order?.id}`)}
                                                                className="inline-flex h-11 items-center justify-center rounded-lg border border-sky-300/25 bg-sky-400/10 px-5 text-sm font-black text-sky-100 transition hover:bg-sky-300/15"
                                                            >
                                                                Track Order
                                                            </button>
                                                            </div>

                                                        </div>
                                                    )}


                                                    {message.products && message.products.length > 0 && (
                                                        /* Main Layout Grid split into Left (Info) and Right (Cards) */
                                                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">

                                                            {/* LEFT SIDE: Dynamic Product Descriptions & Context List */}
                                                            <div className="lg:col-span-4 space-y-4">
                                                                {/* Context Header */}
                                                                <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-slate-300 text-sm backdrop-blur-sm">
                                                                    <p className="font-medium text-white mb-1">💡 Product Overview</p>
                                                                    <p className="text-xs text-slate-400">
                                                                        Review the product details below. You can quickly add items to your bag from the right panel.
                                                                    </p>
                                                                </div>

                                                                {/* Rendered List of Descriptions */}
                                                                <div className="space-y-3">
                                                                    {message.products.map((product) => (
                                                                        <div
                                                                            key={`desc-${product.id}`}
                                                                            className="rounded-xl border border-white/10 bg-slate-900/30 p-3.5 transition hover:bg-slate-900/50"
                                                                        >
                                                                            <h5 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
                                                                                {product.name}
                                                                            </h5>
                                                                            {product.description ? (
                                                                                <p className="text-sm text-slate-300 leading-relaxed">
                                                                                    {product.description}
                                                                                </p>
                                                                            ) : (
                                                                                <p className="text-xs italic text-slate-500">
                                                                                    No additional description available.
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* RIGHT SIDE: Cleaner, Card-focused Products Grid */}
                                                            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                {message.products.map((product, index) => (
                                                                    <div
                                                                        key={product.id}
                                                                        className="group relative flex min-h-[430px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-sky-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/40 hover:shadow-[0_18px_45px_rgba(14,165,233,0.18)]"
                                                                    >
                                                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-400/10 to-transparent" />
                                                                        <div>
                                                                            <div className="mb-3 flex items-center justify-between">
                                                                                <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                                                                                    index === 0
                                                                                        ? "bg-rose-500/15 text-rose-200 ring-1 ring-rose-300/25"
                                                                                        : "bg-sky-500/15 text-sky-200 ring-1 ring-sky-300/20"
                                                                                }`}>
                                                                                    <span>{index === 0 ? "❤️" : "✨"}</span>
                                                                                    {index === 0 ? "Best Match" : "Good Gift"}
                                                                                </span>
                                                                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                                                                                    Stock: {product.stock}
                                                                                </span>
                                                                            </div>

                                                                            {/* Clean Product Image */}
                                                                            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                                                                                {product.image ? (
                                                                                    <Image
                                                                                        src={product.image}
                                                                                        alt={product.name}
                                                                                        fill
                                                                                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                                                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                                                                                        Gift Preview
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Product Core Info */}
                                                                            <h4 className="min-h-11 text-base font-bold leading-snug tracking-tight text-white line-clamp-2">
                                                                                {product.name}
                                                                            </h4>

                                                                            <div className="mt-2 flex items-baseline justify-between">
                                                                                <p className="text-xl font-black text-sky-300">
                                                                                    LKR {product.price.toLocaleString()}
                                                                                </p>
                                                                            </div>

                                                                            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                                                                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFC72C]">
                                                                                    Why we chose it
                                                                                </p>
                                                                                <p className="mt-1.5 text-sm leading-relaxed text-slate-300 line-clamp-3">
                                                                                    {product.description || "A thoughtful pick with strong gifting appeal and a clear fit for the occasion."}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Action Row */}
                                                                        <div className="mt-5 flex items-center gap-2.5">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setCart((prev) => {
                                                                                        const existing =
                                                                                            prev.find(
                                                                                                (item) =>
                                                                                                    item.id ===
                                                                                                    product.id
                                                                                            );

                                                                                        if (existing) {
                                                                                            return prev.map(
                                                                                                (item) =>
                                                                                                    item.id ===
                                                                                                        product.id
                                                                                                        ? {
                                                                                                            ...item,
                                                                                                            quantity:
                                                                                                                item.quantity +
                                                                                                                1,
                                                                                                        }
                                                                                                        : item
                                                                                            );
                                                                                        }

                                                                                        return [
                                                                                            ...prev,
                                                                                            {
                                                                                                ...product,
                                                                                                quantity: 1,
                                                                                            },
                                                                                        ];
                                                                                    });
                                                                                }}
                                                                                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-sky-400 px-4 text-sm font-black text-slate-950 shadow-lg shadow-sky-400/20 transition hover:bg-sky-300"
                                                                            >
                                                                                Add To Bag
                                                                                {cart.find((item) => item.id === product.id)?.quantity
                                                                                    ? ` (${cart.find((item) => item.id === product.id)?.quantity})`
                                                                                    : ""}
                                                                            </button>

                                                                            <a
                                                                                href={product.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 whitespace-nowrap"
                                                                            >
                                                                                Details
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

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
                                                            className={`flex h-4 w-4 items-center justify-center rounded transition ${feedback[message.id] === 'like' ? 'text-emerald-400' : 'text-white/50 hover:text-emerald-400'
                                                                }`}
                                                            title="Good response"
                                                        >
                                                            <ThumbsUpIcon className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleFeedback(message.id, 'dislike')}
                                                            className={`flex h-4 w-4 items-center justify-center rounded transition ${feedback[message.id] === 'dislike' ? 'text-rose-400' : 'text-white/50 hover:text-rose-400'
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
                                        <div className="rounded-2xl rounded-tl-sm border border-sky-400/10 bg-[#111827]/70 px-4 py-3 shadow-xl backdrop-blur-md">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sm">
                                                    🤖
                                                </span>
                                                <div>
                                                    <p className="text-xs md:text-sm font-medium text-slate-300 animate-pulse">
                                                        {loadingMessages[loadingMessageIndex]}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-1">
                                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.2s]" />
                                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.1s]" />
                                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Search Input Box Area Form Container */}
                        <form onSubmit={handleSearchSubmit} className="w-full group relative shrink-0 border-t border-white/10 bg-[#070A12]/80 pt-3 backdrop-blur-xl">
                            <div className={`flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/80 p-2 shadow-2xl backdrop-blur-md focus-within:border-[#38BDF8] ${loading ? 'opacity-50' : ''}`}>
                                <button
                                    type="button"
                                    onClick={handleHomeClick}
                                    disabled={loading}
                                    className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[11px] font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                                    title="Start New Chat Session"
                                >
                                    <PlusIcon className="h-4 w-4 text-[#38BDF8]" />
                                    <span className="hidden sm:inline">New Chat</span>
                                </button>

                            <div className="relative min-w-0 flex-1">
                                <input
                                    type="text"
                                    disabled={loading}
                                    className="h-10 w-full bg-transparent pl-2 pr-24 text-sm text-white transition-all duration-200 placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed md:text-base"
                                    placeholder={loading ? 'Processing...' : 'Ask ShopMate anything...'}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    autoFocus
                                />

                                <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={startVoiceInput}
                                        disabled={loading}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                                        aria-label="Voice search"
                                    >
                                        <MicIcon
                                            className={`h-4.5 w-4.5 ${isListening
                                                ? "text-red-500"
                                                : ""
                                                }`}
                                        />
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
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};
