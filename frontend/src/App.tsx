import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
// @ts-ignore
import { motion, AnimatePresence } from "framer-motion";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import atomOneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import "./App.css";


// TypeScript declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const API_URL = "http://localhost:8000/analyze-query";

// Dora-inspired Animated Hero Section
function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-[60vh] mb-1 overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900" />
        {/* Animated floating shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              zIndex: 1,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            {i % 3 === 0 ? (
              <svg width="60" height="60" viewBox="0 0 40 40" className="fill-indigo-200/30">
                <polygon points="20,5 35,35 5,35" />
              </svg>
            ) : i % 3 === 1 ? (
              <svg width="60" height="60" viewBox="0 0 40 40" className="fill-purple-200/30">
                <polygon points="20,5 35,20 20,35 5,20" />
              </svg>
            ) : (
              <svg width="60" height="60" viewBox="0 0 40 40" className="fill-pink-200/30">
                <polygon points="20,5 32,12 32,28 20,35 8,28 8,12" />
              </svg>
            )}
          </motion.div>
        ))}
      </motion.div>
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-16">
        <motion.h1
          className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-cyan-300 dark:via-cyan-400 dark:to-pink-300 mb-6 tracking-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 80 }}
        >
          DeciGenie LLM
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium mb-8 max-w-2xl mx-auto leading-relaxed text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Instantly analyze insurance, legal, HR, or contract queries with AI-powered reasoning.
        </motion.p>
        <motion.button
          onClick={onGetStarted}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white text-lg font-bold shadow-lg hover:scale-105 transition-transform animate-pulse focus:outline-none focus:ring-4 focus:ring-indigo-400/30 dark:focus:ring-cyan-400/30 mt-8"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
}

// Animated AI Pipeline Section
function AIPipeline() {
  const steps = [
    {
      icon: (
        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Enter Query',
      desc: 'Describe your insurance, legal, or contract question in natural language.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      title: 'Upload Documents',
      desc: 'Optionally upload related PDFs, DOCX, or EML files for deeper analysis.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'AI Analysis',
      desc: 'Our advanced AI analyzes your query and documents in real time.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Get Results',
      desc: 'Receive instant, detailed results with justifications and supporting clauses.'
    },
  ];
  return (
    <section className="relative w-full flex flex-col items-center justify-center mb-6 px-2">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
      >
        How It Works
      </motion.h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            className="flex flex-col items-center bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/40 p-6 w-full md:w-64 mb-4 md:mb-0 relative z-10 hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx, duration: 0.7, type: 'spring', stiffness: 80 }}
            whileHover={{ scale: 1.08 }}
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-lg font-bold mb-2 text-indigo-700 dark:text-indigo-300 text-center">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">{step.desc}</p>
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute right-[-32px] top-1/2 transform -translate-y-1/2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 16h24M20 12l4 4-4 4" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            {idx < steps.length - 1 && (
              <div className="md:hidden mt-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4v24M12 20l4 4 4-4" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am DeciGenie. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    // Simulate bot reply
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: "I'm an AI assistant. (This is a demo, no backend yet!)" }]);
    }, 800);
    setInput('');
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-6 right-6 z-[120] w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chatbot"
        style={{ boxShadow: '0 8px 32px 0 rgba(99,102,241,0.25)' }}
      >
        {/* Chat bubble with three dots icon */}
        <svg className="w-9 h-9 text-white" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M44 24c0 9.941-9.402 18-21 18-2.13 0-4.19-.22-6.14-.63L4 44l2.63-7.89C5.22 33.19 5 31.13 5 29c0-9.941 9.402-18 21-18s18 8.059 18 18z" />
          <circle cx="16" cy="26" r="2.5" fill="#fff" />
          <circle cx="24" cy="26" r="2.5" fill="#fff" />
          <circle cx="32" cy="26" r="2.5" fill="#fff" />
        </svg>
      </button>
      {/* Chatbot Overlay */}
      {open && (
        <div className="fixed inset-0 z-[130] flex items-end justify-end pointer-events-none">
          <div className="w-full h-full bg-black/30 backdrop-blur-sm absolute top-0 left-0 pointer-events-auto" onClick={() => setOpen(false)} />
          <div className="relative m-6 mb-24 w-full max-w-xs sm:max-w-sm pointer-events-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[420px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-indigo-900/30 dark:to-pink-900/30 rounded-t-2xl">
                <span className="font-bold text-indigo-700 dark:text-pink-300 text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10-4v4m0 0l-2-2m2 2l2-2" />
                  </svg>
                  DeciGenie Chat
                </span>
                <button className="text-gray-400 hover:text-red-500 text-xl font-bold" onClick={() => setOpen(false)}>&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-xl max-w-[80%] text-sm shadow ${msg.from === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-indigo-100 dark:border-gray-700'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Add at the top, after imports
interface UserProfile {
  name: string;
  email: string;
  profile_picture?: string;
  queries_made?: number;
  last_login?: string;
  created_at?: string;
}

function App() {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [viewMode, setViewMode] = useState<'json' | 'text'>("text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'technology' | 'features' | 'applications' | 'architecture' | 'performance'
  >('overview');
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  // Add authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);
  // Add a ref to scroll to main content
  const mainContentRef = useRef<HTMLDivElement>(null);
  // Add user profile modal state and logic to App component
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [profileEdit, setProfileEdit] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  // Add state for signup form fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  // Add state for login form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Add state for user_id and profile picture upload
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");
  const [passwordForm, setPasswordForm] = useState({ old: "", new1: "", new2: "" });
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<string>("");
  // Add chat history state
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatHistoryLoading, setChatHistoryLoading] = useState(false);
  const [chatHistoryError, setChatHistoryError] = useState("");
  // Add state for chat history modal
  const [showChatHistoryModal, setShowChatHistoryModal] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    // Delay search box appearance until main animation completes
    const timer = setTimeout(() => setShowSearch(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsVoiceSupported(true);
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Auto-speak when results are displayed
  useEffect(() => {
    if (result && speechSynthesis && !isSpeaking) {
      // Create speech text from the result
      const speechText = `Decision: ${result.decision}. Amount: ₹${result.amount}. Justification: ${result.justification.explanation}. Supporting clauses: ${result.justification.clauses.map((c: any, idx: number) => `Clause ${idx + 1}: ${c.clause} from document ${c.document} page ${c.page}`).join('. ')}`;
      
      // Auto-speak the result
      speakText(speechText);
    }
  }, [result, speechSynthesis]);

  // Stop speaking on page refresh/reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Stop speaking when component unmounts
      if (speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [speechSynthesis, isSpeaking]);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const formData = new FormData();
      formData.append("query", query);
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }
      // Add user_id to form data for chat history
      if (userId) formData.append("user_id", userId);
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleClearFiles = () => {
    setFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startVoiceRecognition = () => {
    if (!isVoiceSupported) {
      alert("Voice recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice recognition.');
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
    setRecognitionInstance(recognition);
    return recognition;
  };

  // Text-to-speech functions
  const speakText = (text: string) => {
    if (!speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    

    
    utterance.lang = 'en-US';

    // Function to set female voice
    const setFemaleVoice = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      
      // Common female voice names across different systems
      const femaleVoiceNames = [
        'samantha', 'victoria', 'alex', 'karen', 'helena', 'maria', 'sophie', 'anna',
        'yuki', 'xiaoxiao', 'ayesha', 'female', 'woman', 'girl', 'lisa', 'sarah',
        'emma', 'olivia', 'ava', 'isabella', 'sophia', 'charlotte', 'amelia', 'harper',
        'evelyn', 'abigail', 'emily', 'elizabeth', 'sofia', 'madison', 'avery',
        'ella', 'scarlett', 'grace', 'chloe', 'camila', 'penelope', 'layla', 'riley',
        'zoey', 'nora', 'lily', 'eleanor', 'hannah', 'luna', 'savannah', 'brooklyn',
        'leah', 'zoe', 'stella', 'hazel', 'ellie', 'paisley', 'audrey', 'skylar',
        'violet', 'claire', 'bella', 'aurora', 'lucy', 'anna', 'samantha', 'caroline'
      ];
      
      // First try to find a female voice for English
      let femaleVoice = voices.find(voice => 
        voice.lang.includes('en-US') && 
        femaleVoiceNames.some(name => voice.name.toLowerCase().includes(name))
      );
      
      // If no language-specific female voice, try any female voice
      if (!femaleVoice) {
        femaleVoice = voices.find(voice => 
          femaleVoiceNames.some(name => voice.name.toLowerCase().includes(name))
        );
      }
      
      // If still no female voice, try to find any voice that's not explicitly male
      if (!femaleVoice) {
        const maleVoiceNames = ['david', 'james', 'john', 'michael', 'robert', 'william', 'richard', 'joseph', 'thomas', 'christopher', 'charles', 'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian', 'george', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel', 'frank', 'gregory', 'raymond', 'alexander', 'patrick', 'jack', 'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam', 'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle', 'walter', 'ethan', 'jeremy', 'harold', 'seth', 'christian', 'mason', 'austin', 'juan', 'keith', 'roger', 'tyler', 'noah', 'carl', 'alan', 'ronald', 'cameron', 'eric', 'allan', 'theodore', 'sean', 'gavin', 'glen', 'glenn', 'mike', 'michael', 'jim', 'james', 'jimmy', 'james', 'bob', 'robert', 'rob', 'robert', 'tom', 'thomas', 'tony', 'anthony', 'dave', 'david', 'dan', 'daniel', 'chris', 'christopher', 'nick', 'nicholas', 'alex', 'alexander', 'sam', 'samuel', 'ben', 'benjamin', 'joe', 'joseph', 'jake', 'jacob', 'matt', 'matthew', 'andy', 'andrew', 'josh', 'joshua', 'nate', 'nathan', 'steve', 'steven', 'brad', 'bradley', 'chad', 'chadwick', 'clint', 'clinton', 'drew', 'andrew', 'ed', 'edward', 'eddie', 'edward', 'fred', 'frederick', 'freddie', 'frederick', 'greg', 'gregory', 'ian', 'ian', 'jeff', 'jeffrey', 'ken', 'kenneth', 'kenny', 'kenneth', 'larry', 'lawrence', 'leo', 'leonard', 'leonardo', 'marc', 'marcus', 'mark', 'mark', 'marty', 'martin', 'max', 'maxwell', 'maximilian', 'mike', 'michael', 'mitch', 'mitchell', 'nate', 'nathan', 'nathaniel', 'nick', 'nicholas', 'nicky', 'nicholas', 'pat', 'patrick', 'patty', 'patrick', 'phil', 'philip', 'phillip', 'randy', 'randall', 'randolph', 'rick', 'richard', 'ricky', 'richard', 'rob', 'robert', 'robbie', 'robert', 'ron', 'ronald', 'ronnie', 'ronald', 'ross', 'ross', 'russ', 'russell', 'rusty', 'russell', 'sam', 'samuel', 'sammie', 'samuel', 'shawn', 'sean', 'shaun', 'sean', 'sid', 'sidney', 'sydney', 'stan', 'stanley', 'steve', 'steven', 'stevie', 'steven', 'ted', 'theodore', 'teddy', 'theodore', 'tim', 'timothy', 'timmy', 'timothy', 'todd', 'todd', 'tom', 'thomas', 'tommy', 'thomas', 'tony', 'anthony', 'troy', 'troy', 'ty', 'tyler', 'tyler', 'tyler', 'vince', 'vincent', 'vinnie', 'vincent', 'walt', 'walter', 'wally', 'walter', 'wayne', 'wayne', 'wes', 'wesley', 'weston', 'weston', 'will', 'william', 'willie', 'william', 'willy', 'william', 'zach', 'zachary', 'zack', 'zachary', 'zackary', 'zachary'];
        
        femaleVoice = voices.find(voice => 
          !maleVoiceNames.some(name => voice.name.toLowerCase().includes(name))
        );
      }
      
      if (femaleVoice) {
        console.log('Selected female voice:', femaleVoice.name);
        utterance.voice = femaleVoice;
      } else {
        console.log('No female voice found, using default voice');
      }
    };

    // Try to set female voice immediately
    setFemaleVoice();
    
    // If voices are not loaded yet, wait for them
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        setFemaleVoice();
      };
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setRecognitionInstance(null);
    }
    setIsListening(false);
  };

  // Add handleDownload helper function
  const handleDownload = (data: any, type: 'json' | 'text') => {
    let content = '';
    let filename = '';
    let mimeType = '';
    if (type === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = 'result.json';
      mimeType = 'application/json';
    } else {
      // Format the text output similar to renderText
      content = `Decision: ${data.decision}\nAmount: ₹${data.amount}\nJustification: ${data.justification.explanation}\n\nClauses:\n`;
      content += data.justification.clauses.map((c: any, idx: number) =>
        `  ${idx + 1}. Clause: ${c.clause}\n     Document: ${c.document}  Page: ${c.page}`
      ).join('\n\n');
      filename = 'result.txt';
      mimeType = 'text/plain';
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to pretty-print JSON with syntax highlighting
  const renderJson = (data: any) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 70, damping: 18 }}
      className="w-full h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30 dark:border-gray-700/40 text-gray-800 dark:text-gray-100 flex flex-col glass-card"
      style={{ boxShadow: '0 8px 32px 0 rgba(99,102,241,0.12)' }}
    >
      <div className="flex justify-end mb-4 flex-shrink-0">
        <button
          onClick={() => handleDownload(data, 'json')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white dark:bg-cyan-400 dark:text-gray-900 font-semibold shadow-lg hover:bg-indigo-700 dark:hover:bg-cyan-300 transition-all duration-300 hover:shadow-xl"
        >
          Download JSON
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
      <SyntaxHighlighter
        language="json"
        style={darkMode ? atomOneDark : atomOneLight}
        customStyle={{
            borderRadius: "0.75rem",
          fontSize: "0.95rem",
            padding: "1.5rem",
            background: darkMode ? "#1f2937" : "#f8fafc",
          boxShadow: "none",
          margin: 0,
            border: darkMode ? "1px solid #374151" : "1px solid #e2e8f0",
            height: "100%",
            minHeight: "400px",
        }}
        showLineNumbers={false}
        wrapLongLines={true}
      >
        {JSON.stringify(data, null, 2)}
      </SyntaxHighlighter>
      </div>
    </motion.div>
  );

  // Helper to render the text view
  const renderText = (data: any) => {
    // Create the text content for speech
    const speechText = `Decision: ${data.decision}. Amount: ₹${data.amount}. Justification: ${data.justification.explanation}. Supporting clauses: ${data.justification.clauses.map((c: any, idx: number) => `Clause ${idx + 1}: ${c.clause} from document ${c.document} page ${c.page}`).join('. ')}`;

    return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 70, damping: 18 }}
      className="w-full h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30 dark:border-gray-700/40 text-gray-800 dark:text-gray-100 flex flex-col glass-card"
      style={{ boxShadow: '0 8px 32px 0 rgba(99,102,241,0.12)' }}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => isSpeaking ? stopSpeaking() : speakText(speechText)}
            className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2 ${
              isSpeaking 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSpeaking ? (
              <>
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Stop Speaking
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                Speak Result
              </>
            )}
          </button>
        </div>
        <button
          onClick={() => handleDownload(data, 'text')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white dark:bg-cyan-400 dark:text-gray-900 font-semibold shadow-lg hover:bg-indigo-700 dark:hover:bg-cyan-300 transition-all duration-300 hover:shadow-xl"
        >
          Download Text
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="inline-block w-5 h-5 bg-indigo-500 dark:bg-cyan-400 rounded-full"
        />
          Decision: <span className="ml-2 text-indigo-600 dark:text-cyan-400">{data.decision}</span>
      </h2>
        <div className="text-lg p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700/50">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">Amount:</span> 
          <span className="ml-2 text-2xl font-bold text-indigo-600 dark:text-cyan-400">₹{data.amount}</span>
      </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Justification:</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
            {data.justification.explanation}
          </p>
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">Supporting Clauses:</h4>
          {data.justification.clauses.map((c: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl px-4 py-3 border border-blue-200 dark:border-blue-700/50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                                      <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Clause:</span> {c.clause}
                  </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-semibold">Document:</span> {c.document}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                        </svg>
                        <span className="font-semibold">Page:</span> {c.page}
                      </span>
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </motion.div>
    );
  };

  // Dummy login/signup handlers (replace with backend integration)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await axios.post("/api/user/login", {
        email: loginEmail,
        password: loginPassword,
      });
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      setShowLogin(false);
      setLoginEmail("");
      setLoginPassword("");
      setUserId(res.data.user_id);
      localStorage.setItem("userId", res.data.user_id);
    } catch (err: any) {
      setAuthError(err?.response?.data?.detail || "Login failed.");
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await axios.post("/api/user/signup", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      setShowSignup(false);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setUserId(res.data.user_id);
      localStorage.setItem("userId", res.data.user_id);
    } catch (err: any) {
      setAuthError(err?.response?.data?.detail || "Signup failed.");
    }
  };

  // Add logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    setShowProfileMenu(false);
    // Optionally clear other user state here
  };

  // Handler for Hero 'Get Started' button
  const handleHeroGetStarted = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch user profile from backend
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setProfileLoading(true);
    setProfileError("");
    try {
      const res = await axios.get("/api/user/profile", { params: { user_id: userId } });
      setProfileData(res.data);
      setProfileEdit({ name: res.data.name, email: res.data.email });
      setProfilePicPreview(res.data.profile_picture ? `data:image/*;base64,${res.data.profile_picture}` : "");
    } catch (err: any) {
      setProfileError(err?.response?.data?.detail || "Failed to load profile.");
    } finally {
      setProfileLoading(false);
    }
  }, [userId]);

  // Open profile modal and fetch data
  const handleOpenProfile = () => {
    setShowProfileModal(true);
    fetchProfile();
  };

  // Save profile changes
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    try {
      const res = await axios.put("/api/user/profile", profileEdit, { params: { user_id: userId } });
      setProfileData(res.data);
      setShowProfileModal(false);
      fetchProfile();
    } catch (err: any) {
      setProfileError(err?.response?.data?.detail || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Profile picture upload handler
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePicPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setProfilePicPreview("");
    }
  };
  const handleProfilePicUpload = async () => {
    if (!profilePicFile || !userId) return;
    const formData = new FormData();
    formData.append("file", profilePicFile);
    try {
      await axios.put(`/api/user/profile-picture?user_id=${userId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      fetchProfile();
    } catch (err) {
      alert("Failed to upload profile picture.");
    }
  };
  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus("");
    if (passwordForm.new1 !== passwordForm.new2) {
      setPasswordChangeStatus("New passwords do not match.");
      return;
    }
    try {
      await axios.post("/api/user/change-password", {
        user_id: userId,
        old_password: passwordForm.old,
        new_password: passwordForm.new1,
      });
      setPasswordChangeStatus("Password changed successfully!");
      setPasswordForm({ old: "", new1: "", new2: "" });
      fetchProfile();
    } catch (err: any) {
      setPasswordChangeStatus(err?.response?.data?.detail || "Failed to change password.");
    }
  };

  // Add polling for real-time updates
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (showProfileModal || showProfileMenu) {
      fetchProfile();
      interval = setInterval(fetchProfile, 10000); // Poll every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showProfileModal, showProfileMenu, fetchProfile]);

  // Fetch chat history when dropdown opens
  useEffect(() => {
    if (showProfileMenu && userId) {
      setChatHistoryLoading(true);
      setChatHistoryError("");
      fetch(`/api/user/chat-history?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          setChatHistory(data.history || []);
          setChatHistoryLoading(false);
        })
        .catch(() => {
          setChatHistoryError("Failed to load chat history.");
          setChatHistoryLoading(false);
        });
    }
  }, [showProfileMenu, userId]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main-app-animated"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 18 }}
        className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        {/* Dora-inspired Hero Section */}
        <Hero onGetStarted={handleHeroGetStarted} />
        {/* Animated AI Pipeline Section */}
        <AIPipeline />
        {/* Main Content Anchor */}
        <div ref={mainContentRef} />
        {/* Elegant Animated Background */}
        <div         className={`absolute inset-0 ${
          darkMode 
            ? 'bg-black' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}>
                    {/* Dark Theme - Pure Black Background */}
          {darkMode && (
            <div className="absolute inset-0 bg-black"></div>
          )}
          
          {/* Light Theme Animations */}
          {!darkMode && (
            <>
              {/* Shining Stars */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute w-1 h-1 bg-indigo-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.8, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 3,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                    }}
                  />
                ))}
              </div>
              
              {/* Animated DeciGenie Text Background */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`text-${i}`}
                    className="absolute text-indigo-200/10 font-black text-6xl md:text-8xl select-none pointer-events-none"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: 'rotate(-15deg)',
                    }}
                    animate={{
                      x: [0, -80, 0],
                      y: [0, -40, 0],
                      opacity: [0.1, 0.2, 0.1],
                      scale: [0.8, 1.1, 0.8],
                    }}
                    transition={{
                      duration: Math.random() * 25 + 35,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 15,
                    }}
                  >
                    DeciGenie
                  </motion.div>
                ))}
              </div>
              
              {/* Animated Boxy Grid Background */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Grid Pattern - Reduced */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
                </div>
                
                {/* Animated Boxes */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border-2 border-indigo-200/40 rounded-lg"
                    style={{
                      width: `${Math.random() * 120 + 80}px`,
                      height: `${Math.random() * 120 + 80}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                      opacity: [0.1, 0.3, 0.1],
                      x: [0, Math.random() * 50 - 25],
                      y: [0, Math.random() * 50 - 25],
                    }}
                    transition={{
                      duration: Math.random() * 10 + 15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 5,
                    }}
                  />
                ))}
                
                {/* Floating Geometric Shapes */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`shape-${i}`}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: Math.random() * 8 + 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 3,
                    }}
                  >
                    {i % 3 === 0 ? (
                      // Triangle
                      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-indigo-200/30">
                        <polygon points="20,5 35,35 5,35" />
                      </svg>
                    ) : i % 3 === 1 ? (
                      // Diamond
                      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-purple-200/30">
                        <polygon points="20,5 35,20 20,35 5,20" />
                      </svg>
                    ) : (
                      // Hexagon
                      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-blue-200/30">
                        <polygon points="20,5 32,12 32,28 20,35 8,28 8,12" />
                      </svg>
                    )}
                  </motion.div>
                ))}
                
                {/* Animated Corner Boxes */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`corner-${i}`}
                    className="absolute w-16 h-16 border-2 border-indigo-300/50 rounded-lg"
                    style={{
                      left: i % 2 === 0 ? '10%' : '80%',
                      top: i < 2 ? '10%' : '80%',
                    }}
                    animate={{
                      rotate: [0, 90, 180, 270, 360],
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 2,
                    }}
                  />
                ))}
                
                {/* Moving Lines */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`line-${i}`}
                    className="absolute h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent"
                    style={{
                      width: `${Math.random() * 200 + 100}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, -200],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 6 + 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 4,
                    }}
                  />
                ))}
                
                {/* Pulsing Boxes */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`pulse-${i}`}
                    className="absolute border border-indigo-200/60 rounded-md"
                    style={{
                      width: `${Math.random() * 60 + 40}px`,
                      height: `${Math.random() * 60 + 40}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-indigo-200 rounded-full opacity-30"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>
              
              {/* Subtle Gradient Orbs */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"
                  animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Top Right Controls (scroll with page) */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 md:gap-3">
          {isLoggedIn ? (
            <>
              {/* Dark Mode Toggle Button */}
              <motion.button
                onClick={() => setDarkMode((d) => !d)}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-indigo-300 dark:border-gray-700 transition-colors duration-300 focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <motion.svg
                    key="moon"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-7 md:w-7 text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="sun"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-7 md:w-7 text-cyan-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 16v2m11-11h-2M5 12H3m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 4.636" />
                  </motion.svg>
                )}
              </motion.button>
              {/* Profile Icon with Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-indigo-300 dark:border-gray-700 transition-colors duration-300 focus:outline-none group"
                  aria-label="Profile"
                  onClick={() => {
                    setShowProfileMenu((v) => !v);
                    fetchProfile(); // Always fetch latest info
                  }}
                >
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : profileData && profileData.name ? (
                    <span className="w-full h-full flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-cyan-300 bg-indigo-100 dark:bg-cyan-900 rounded-full">
                      {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  ) : (
                    <svg className="w-7 h-7 md:w-9 md:h-9 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </motion.button>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      {/* User info section */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                          {profilePicPreview ? (
                            <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : profileData && profileData.name ? (
                            <span className="w-full h-full flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-cyan-300 bg-indigo-100 dark:bg-cyan-900 rounded-full">
                              {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          ) : (
                            <svg className="w-8 h-8 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-indigo-800 dark:text-cyan-200 text-base">{profileData?.name || "User"}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{profileData?.email || ""}</span>
                        </div>
                      </div>
                      {/* In the user dropdown, after user info, show chat history if logged in */}
                      {userId && (
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Chat History</h4>
                          {chatHistoryLoading ? (
                            <div className="text-xs text-gray-400">Loading...</div>
                          ) : chatHistoryError ? (
                            <div className="text-xs text-red-500">{chatHistoryError}</div>
                          ) : chatHistory.length === 0 ? (
                            <div className="text-xs text-gray-400">No recent queries.</div>
                          ) : (
                            <ul className="max-h-40 overflow-y-auto text-xs space-y-1">
                              {chatHistory.map((item, idx) => (
                                <li key={idx} className="flex flex-col gap-0.5">
                                  <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{item.query}</span>
                                  <span className="text-[10px] text-gray-400">{item.timestamp && new Date(item.timestamp).toLocaleString()}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                      {/* Only keep dark mode toggle and logout */}
                      <button className="w-full flex items-center gap-3 text-left px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all" onClick={() => setDarkMode((d) => !d)}>
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                      </button>
                      <button className="w-full flex items-center gap-3 text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all font-semibold" onClick={handleLogout}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                        Log Out
                      </button>
                      {/* In the user dropdown, add a Chat History button after user info, before dark mode toggle */}
                      {userId && (
                        <button className="w-full flex items-center gap-3 text-left px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all font-semibold" onClick={() => setShowChatHistoryModal(true)}>
                          <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          Chat History
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <button
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white font-extrabold text-base shadow-lg border border-white/30 backdrop-blur-[6px] hover:shadow-2xl hover:scale-105 hover:ring-4 hover:ring-pink-200/30 focus:outline-none focus:ring-4 focus:ring-pink-300/40 transition-all duration-200 inner-shadow-glass mr-2"
                style={{ boxShadow: '0 2px 12px 0 rgba(99,102,241,0.12) inset, 0 4px 16px 0 rgba(99,102,241,0.12)' }}
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white font-extrabold text-base shadow-lg border border-white/30 backdrop-blur-[6px] hover:shadow-2xl hover:scale-105 hover:ring-4 hover:ring-pink-200/30 focus:outline-none focus:ring-4 focus:ring-pink-300/40 transition-all duration-200 inner-shadow-glass"
                style={{ boxShadow: '0 2px 12px 0 rgba(99,102,241,0.12) inset, 0 4px 16px 0 rgba(99,102,241,0.12)' }}
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* AI-Powered Analysis Badge - Top Left */}
        <div className="absolute top-6 left-6 z-50">
          <motion.button
            onClick={() => {
              setShowAIModal(true);
              setActiveTab('overview');
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full border border-indigo-200 dark:border-indigo-700/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Glowing dot */}
            <div className="relative">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-cyan-400 dark:to-teal-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
              <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-cyan-400 dark:to-teal-500 rounded-full animate-ping opacity-75"></div>
            </div>
            
            <span className="relative text-sm font-semibold text-indigo-700 dark:text-cyan-200 group-hover:text-indigo-800 dark:group-hover:text-cyan-100 transition-colors duration-300">
              AI-Powered Analysis
            </span>
            
            {/* Hover indicator */}
            <motion.div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-cyan-400 dark:to-teal-500 rounded-full"
              initial={{ width: 0 }}
              whileHover={{ width: "80%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>

        {/* Main Content: Search + Output */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.97, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 30 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 70, damping: 18 }}
          className={`w-full h-full flex flex-col md:flex-row md:items-start md:justify-center gap-8 transition-all duration-700 relative`}
        >
          {/* Search Box */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1,
                  width: "100%",
                  maxWidth: result && !loading ? "28rem" : "32rem",
                  zIndex: 10,
                }}
                exit={{ opacity: 0, y: 30, scale: 0.97 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 18 }}
                className="w-full md:w-[28rem] flex-1 flex-shrink-0 relative z-10"
              >
                <motion.form
                  onSubmit={handleSubmit}
                  className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-white/20 dark:border-gray-700/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  encType="multipart/form-data"
                >
                  <div className="space-y-2">
                    <label className="text-gray-700 dark:text-gray-200 font-semibold text-lg flex items-center gap-2" htmlFor="query">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Enter your query
                  </label>
                    <div className="relative overflow-hidden">
                  <input
                    id="query"
                    type="text"
                        className="rounded-xl border-2 border-gray-200 dark:border-gray-600 px-6 py-4 pr-14 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 focus:border-indigo-500 dark:focus:border-cyan-400 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Describe your insurance, legal, or contract query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                  />
                    {isVoiceSupported && (
                      <button
                        type="button"
                        style={{
                          backgroundColor: isListening 
                            ? '#ef4444' 
                            : darkMode 
                              ? '#eab308' 
                              : '#4f46e5'
                        }}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center pointer-events-auto text-white shadow-sm`}
                        title={isListening ? "Click to stop listening" : "Click to speak"}
                        onMouseEnter={() => {
                          // Play hover sound
                          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                          audio.volume = 0.3;
                          audio.play().catch(() => {});
                        }}
                        onClick={() => {
                          if (isListening) {
                            // Stop listening if already listening
                            // Play mic off sound
                            const micOffAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                            micOffAudio.volume = 0.4;
                            micOffAudio.play().catch(() => {});
                            
                            stopVoiceRecognition();
                          } else {
                            // Start listening if not listening
                            // Play mic on sound
                            const micOnAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                            micOnAudio.volume = 0.6;
                            micOnAudio.play().catch(() => {});
                            
                            startVoiceRecognition();
                          }
                        }}
                      >
                        {isListening ? (
                          <div className="relative">
                            <svg
                              className="w-4 h-4 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                            </svg>
                          </div>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                                                  <div className="space-y-2">
                    <label className="text-gray-700 dark:text-gray-200 font-semibold text-lg flex items-center gap-2" htmlFor="files">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload documents <span className="text-gray-500 text-sm font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                    <input
                      id="files"
                      type="file"
                      ref={fileInputRef}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.docx,.eml"
                      multiple
                      onChange={handleFileChange}
                    />
                      <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-8 text-center bg-gray-50 dark:bg-gray-800/50 hover:border-indigo-400 dark:hover:border-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-gray-700 dark:text-gray-200 font-medium text-lg">
                          Drag your files here or click to browse
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                          PDF, DOCX, EML files supported
                        </div>
                      </div>
                    </div>
                    {files && files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-700 dark:text-green-300 font-medium text-sm">
                            {files.length} files selected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                        {Array.from(files).map((file, idx) => (
                            <span key={idx} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs border border-green-200 dark:border-green-700 flex items-center gap-1">
                              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            {file.name}
                          </span>
                        ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleClearFiles}
                          className="mt-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-medium flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear all files
                        </button>
                      </motion.div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      x: query ? (files && files.length > 0 ? [0, -10, 10, 0] : [0, -5, 5, 0]) : 0,
                      y: files && files.length > 0 ? (query ? [0, -3, 3, 0] : [0, -2, 2, 0]) : 0,
                      scale: (query || (files && files.length > 0)) ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: query && files && files.length > 0 ? Infinity : 0,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                    type="submit"
                    className={`bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-500 dark:to-teal-500 text-white dark:text-gray-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed group ${
                      (query || (files && files.length > 0)) ? 'ring-4 ring-indigo-500/30 dark:ring-cyan-500/30' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.div
                          className="relative"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"></div>
                          <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-t-white rounded-full animate-ping"></div>
                        </motion.div>
                        <span className="font-semibold">Analyzing with AI...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <motion.svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={query && files && files.length > 0 ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 0.5, repeat: query && files && files.length > 0 ? Infinity : 0, repeatDelay: 1 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </motion.svg>
                        <span>Analyze with AI</span>
                        {query && files && files.length > 0 && (
                          <motion.div
                            className="ml-1 w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </span>
                    )}
                  </motion.button>
                  {/* Toggle View Button */}
                  {result && !loading && (
                    <div className="mt-2 flex items-center justify-center">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex items-center gap-1">
                    <button
                      type="button"
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                            viewMode === "text" 
                              ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-cyan-400 shadow-sm" 
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          }`}
                          onClick={() => setViewMode("text")}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Text View
                    </button>
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                            viewMode === "json" 
                              ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-cyan-400 shadow-sm" 
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          }`}
                          onClick={() => setViewMode("json")}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          JSON View
                        </button>
                      </div>
                    </div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
                    </motion.div>
                  )}
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Output Box */}
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div
                key={viewMode + (result ? "-output" : "")}
                initial={{ opacity: 0, x: 40, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.97 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 18 }}
                className="w-full md:w-[28rem] flex-1 flex-shrink-0 relative z-20 flex flex-col mt-8 md:mt-0"
              >
                {viewMode === "json" ? renderJson(result) : renderText(result)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* AI Information Modal */}
        <AnimatePresence>
          {showAIModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              onClick={() => setShowAIModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      AI-Powered Analysis
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 hover:scale-110 relative z-10"
                  >
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex flex-col h-[calc(95vh-140px)]">
                  {/* Navigation Tabs */}
                  <div className="flex flex-wrap gap-2 p-4 pb-0 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
                    {['overview', 'technology', 'features', 'applications', 'architecture', 'performance'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'overview' | 'technology' | 'features' | 'applications' | 'architecture' | 'performance')}
                        className={`px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 relative overflow-hidden ${
                          activeTab === tab
                            ? 'bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 shadow-md border border-indigo-200 dark:border-indigo-700 scale-105'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {/* Tab Content */}
                  <div className="flex-1 overflow-auto p-6">
                      {activeTab === 'overview' && (
                      <div className="flex flex-col items-center gap-8" style={{ overflow: 'visible' }}>
                        <div className="w-full max-w-4xl">
                          <div className="flex items-center gap-3 mb-4 justify-center">
                            {/* Removed badges here */}
                            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl shadow-lg px-12 py-4 mb-6 border border-indigo-100 dark:border-indigo-800 min-h-0" style={{ minHeight: 'unset', maxWidth: '1000px', overflow: 'visible' }}>
                              <h3 className="text-3xl font-extrabold mb-2 text-indigo-700 dark:text-indigo-200 text-center">Meet DeciGenie LLM</h3>
                              <p className="mb-2 text-lg text-gray-700 dark:text-gray-100 text-center">
                                <span className="font-bold text-indigo-600 dark:text-indigo-300">DeciGenie</span> is your next-generation AI assistant for insurance, legal, and HR document analysis. Instantly extract key clauses, validate claims, and receive transparent, actionable decisions—now even faster and more accurate than ever.
                              </p>
                              <div className="mb-2 text-center">
                                <span className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs font-semibold mr-2">New</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Improved clause detection, smarter justifications, and enhanced PDF support (added yesterday).</span>
                              </div>
                              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-100 space-y-1 mb-2 text-left">
                                <li>Lightning-fast, human-like reasoning for complex queries</li>
                                <li>Transparent justifications and clause references for every answer</li>
                                <li>Enterprise-grade security & privacy with end-to-end encryption</li>
                                <li>Supports PDF, DOCX, and EML files</li>
                                <li>Now with multi-document cross-referencing</li>
                              </ul>
                              <div className="flex flex-wrap justify-center gap-4 mt-2">
                                <div className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-700 rounded-2xl shadow flex flex-col items-center px-6 py-2 min-w-[110px]">
                                  <svg className="w-7 h-7 mb-1 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                                  <span className="font-bold text-2xl text-indigo-700 dark:text-indigo-300">99.2%</span>
                                  <span className="text-xs font-medium text-gray-500">Accuracy</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-green-100 dark:border-green-700 rounded-2xl shadow flex flex-col items-center px-6 py-2 min-w-[110px]">
                                  <svg className="w-7 h-7 mb-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                  <span className="font-bold text-2xl text-green-700 dark:text-green-300">&lt;2s</span>
                                  <span className="text-xs font-medium text-gray-500">Response</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-700 rounded-2xl shadow flex flex-col items-center px-6 py-2 min-w-[110px]">
                                  <svg className="w-7 h-7 mb-1 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  <span className="font-bold text-2xl text-purple-700 dark:text-purple-300">10K+</span>
                                  <span className="text-xs font-medium text-gray-500">Docs</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-pink-100 dark:border-pink-700 rounded-2xl shadow flex flex-col items-center px-6 py-2 min-w-[110px]">
                                  <svg className="w-7 h-7 mb-1 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                  <span className="font-bold text-2xl text-pink-700 dark:text-pink-300">24/7</span>
                                  <span className="text-xs font-medium text-gray-500">Availability</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'technology' && (
                      <div className="w-full max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-purple-900/30 rounded-3xl shadow-lg p-12 border border-blue-100 dark:border-blue-800">
                          <h3 className="text-2xl font-extrabold mb-6 text-blue-700 dark:text-blue-200 text-center">Technology Stack</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-center gap-4">
                              <span className="bg-indigo-100 p-3 rounded-xl"><svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></span>
                                  <div>
                                <div className="font-bold text-indigo-700 dark:text-indigo-200">Large Language Model (LLM)</div>
                                <div className="text-gray-600 dark:text-gray-100 text-sm">Trained on legal, insurance, and HR data for deep understanding.</div>
                                  </div>
                                </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-blue-100 p-3 rounded-xl"><svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></span>
                                  <div>
                                <div className="font-bold text-blue-700 dark:text-blue-200">Semantic Search</div>
                                <div className="text-gray-600 dark:text-gray-100 text-sm">Intelligent document indexing and retrieval for relevant clauses.</div>
                                  </div>
                                </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-purple-100 p-3 rounded-xl"><svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01" /></svg></span>
                                  <div>
                                <div className="font-bold text-purple-700 dark:text-purple-200">Natural Language Processing</div>
                                <div className="text-gray-600 dark:text-gray-100 text-sm">Advanced text analysis and context-aware reasoning.</div>
                                  </div>
                                </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-green-100 p-3 rounded-xl"><svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg></span>
                          <div>
                                <div className="font-bold text-green-700 dark:text-green-200">Real-time Processing</div>
                                <div className="text-gray-600 dark:text-gray-100 text-sm">Instant analysis and results, even for large documents.</div>
                                </div>
                                </div>
                                </div>
                              </div>
                                </div>
                    )}
                      {activeTab === 'features' && (
                      <div className="w-full max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-yellow-900/30 rounded-3xl shadow-lg p-8 border border-purple-100 dark:border-purple-800">
                          <h3 className="text-2xl font-extrabold mb-6 text-purple-700 dark:text-purple-200 text-center">Key Features</h3>
                          <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-100"><span className="bg-indigo-100 p-2 rounded-full"><svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg></span> PDF, DOCX, and EML file support <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">New</span></li>
                            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-100"><span className="bg-blue-100 p-2 rounded-full"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></span> Advanced clause detection and classification</li>
                            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-100"><span className="bg-green-100 p-2 rounded-full"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01" /></svg></span> AI-powered reasoning and explanations</li>
                            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-100"><span className="bg-purple-100 p-2 rounded-full"><svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg></span> Real-time analysis and results</li>
                            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-100"><span className="bg-pink-100 p-2 rounded-full"><svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></span> Multi-document cross-referencing <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">Improved</span></li>
                          </ul>
                                </div>
                                </div>
                    )}
                      {activeTab === 'applications' && (
                      <div className="w-full max-w-3xl mx-auto">
                        <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/30 dark:via-blue-900/30 dark:to-purple-900/30 rounded-3xl shadow-lg p-8 border border-green-100 dark:border-green-800">
                          <h3 className="text-2xl font-extrabold mb-6 text-green-700 dark:text-green-200 text-center">Applications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col items-center border border-blue-100 dark:border-blue-700">
                              <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <div className="font-bold text-blue-700 dark:text-blue-200 mb-1">Insurance Claims</div>
                              <div className="text-gray-600 dark:text-gray-100 text-sm text-center">Automated claim processing, policy analysis, and risk assessment.</div>
                                </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col items-center border border-green-100 dark:border-green-700">
                              <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              <div className="font-bold text-green-700 dark:text-green-200 mb-1">Legal Documents</div>
                              <div className="text-gray-600 dark:text-gray-100 text-sm text-center">Contract review, compliance checking, and legal clause analysis.</div>
                              </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col items-center border border-purple-100 dark:border-purple-700">
                              <svg className="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                              <div className="font-bold text-purple-700 dark:text-purple-200 mb-1">HR Documents</div>
                              <div className="text-gray-600 dark:text-gray-100 text-sm text-center">Employee contract analysis, policy interpretation, and compliance.</div>
                                </div>
                              </div>
                                </div>
                              </div>
                      )}
                      {activeTab === 'architecture' && (
                      <div className="w-full max-w-3xl mx-auto">
                        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-pink-900/30 rounded-3xl shadow-lg p-8 border border-yellow-100 dark:border-yellow-800">
                          <h3 className="text-2xl font-extrabold mb-6 text-yellow-700 dark:text-yellow-200 text-center">System Architecture</h3>
                          <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 flex justify-center">
                              <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="10" y="40" width="60" height="40" rx="10" fill="#a5b4fc"/>
                                <rect x="110" y="40" width="60" height="40" rx="10" fill="#6ee7b7"/>
                                <rect x="60" y="80" width="60" height="30" rx="8" fill="#f9a8d4"/>
                                <rect x="60" y="10" width="60" height="30" rx="8" fill="#fcd34d"/>
                                <text x="40" y="65" textAnchor="middle" fill="#3730a3" fontSize="13">Frontend</text>
                                <text x="140" y="65" textAnchor="middle" fill="#065f46" fontSize="13">Backend</text>
                                <text x="90" y="100" textAnchor="middle" fill="#be185d" fontSize="13">Database</text>
                                <text x="90" y="30" textAnchor="middle" fill="#b45309" fontSize="13">AI Layer</text>
                              </svg>
                                </div>
                            <div className="flex-1">
                              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-100 space-y-2 mb-2">
                                <li><span className="font-bold text-yellow-700">Frontend:</span> React + Tailwind CSS</li>
                                <li><span className="font-bold text-yellow-700">Backend:</span> FastAPI (Python)</li>
                                <li><span className="font-bold text-yellow-700">Database:</span> MongoDB, FAISS for vector search</li>
                                <li><span className="font-bold text-yellow-700">AI Layer:</span> OpenAI LLM, custom NLP</li>
                              </ul>
                              <div className="text-gray-500 dark:text-gray-300 text-sm">All layers are securely integrated for seamless, real-time analysis.</div>
                                </div>
                              </div>
                                </div>
                                </div>
                      )}
                      {activeTab === 'performance' && (
                      <div className="w-full max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-pink-50 via-red-50 to-yellow-50 dark:from-pink-900/30 dark:via-red-900/30 dark:to-yellow-900/30 rounded-3xl shadow-lg p-8 border border-pink-100 dark:border-pink-800">
                          <h3 className="text-2xl font-extrabold mb-6 text-pink-700 dark:text-pink-200 text-center">Performance Metrics</h3>
                          <div className="flex flex-wrap justify-center gap-6">
                            <div className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-700 rounded-2xl shadow flex flex-col items-center px-6 py-4 min-w-[110px]">
                              <svg className="w-7 h-7 mb-1 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                              <span className="font-bold text-2xl text-indigo-700 dark:text-indigo-200">&lt;2s</span>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Avg. Response</span>
                                </div>
                            <div className="bg-white dark:bg-gray-800 border border-green-100 dark:border-green-700 rounded-2xl shadow flex flex-col items-center px-6 py-4 min-w-[110px]">
                              <svg className="w-7 h-7 mb-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                              <span className="font-bold text-2xl text-green-700 dark:text-green-200">99.2%</span>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Accuracy</span>
                                </div>
                            <div className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-700 rounded-2xl shadow flex flex-col items-center px-6 py-4 min-w-[110px]">
                              <svg className="w-7 h-7 mb-1 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                              <span className="font-bold text-2xl text-purple-700 dark:text-purple-200">10K+</span>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Docs/Month</span>
                                </div>
                            <div className="bg-white dark:bg-gray-800 border border-pink-100 dark:border-pink-700 rounded-2xl shadow flex flex-col items-center px-6 py-4 min-w-[110px]">
                              <svg className="w-7 h-7 mb-1 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              <span className="font-bold text-2xl text-pink-700 dark:text-pink-200">24/7</span>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Uptime</span>
                              </div>
                                </div>
                          <div className="mt-6 text-center text-gray-600 dark:text-gray-100 text-sm">DeciGenie delivers industry-leading speed, accuracy, and reliability for all your document analysis needs.</div>
                                </div>
                                </div>
                      )}
                  </div>
                </div> {/* closes Modal Content */}
              </motion.div> {/* closes Modal Wrapper */}
            </motion.div> /* closes Modal Backdrop */
          )}
        </AnimatePresence>
        {/* Login/Signup Modals with Animation */}
        <AnimatePresence>
          {showLogin && (
            <motion.div
              key="login-modal"
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Blurred background overlay */}
              <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setShowLogin(false)}
              />
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-sm relative z-10"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setShowLogin(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                {authError && <div className="text-red-500 mb-2 text-center">{authError}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                  <input type="email" required placeholder="Email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                  <input type="password" required placeholder="Password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                  <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-200">Login</button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <button className="text-cyan-600 hover:underline" onClick={() => { setShowLogin(false); setShowSignup(true); }}>Sign Up</button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {showSignup && (
            <motion.div
              key="signup-modal"
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Blurred background overlay */}
              <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setShowSignup(false)}
              />
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-sm relative z-10"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setShowSignup(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                {authError && <div className="text-red-500 mb-2 text-center">{authError}</div>}
                <form onSubmit={handleSignup} className="space-y-4">
                  <input type="text" required placeholder="Name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={signupName} onChange={e => setSignupName(e.target.value)} />
                  <input type="email" required placeholder="Email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                  <input type="password" required placeholder="Password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                  <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-200">Sign Up</button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <button className="text-indigo-600 hover:underline" onClick={() => { setShowSignup(false); setShowLogin(true); }}>Login</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Profile Modal */}
        <AnimatePresence>
          {showProfileModal && (
            <motion.div
              key="profile-modal"
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Blurred background overlay */}
              <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setShowProfileModal(false)}
              />
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setShowProfileModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-center">My Account</h2>
                {/* Debug info */}
                <div className="w-full mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-200">
                  <div><b>Debug:</b> userId = <span className="font-mono">{userId}</span></div>
                  <div><b>profileData:</b> <span className="font-mono">{JSON.stringify(profileData)}</span></div>
                </div>
                {!userId ? (
                  <div className="w-full text-center py-8">
                    <div className="text-lg font-semibold mb-2 text-indigo-700 dark:text-cyan-300">You are not logged in.</div>
                    <div className="mb-4 text-gray-600 dark:text-gray-300">Please log in to view and manage your account.</div>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-200" onClick={() => { setShowProfileModal(false); setShowLogin(true); }}>Log In</button>
                  </div>
                ) : profileLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : profileError ? (
                  <div className="text-red-500 mb-2 text-center">{profileError}</div>
                ) : profileData ? (
                  <>
                    {/* Avatar and upload */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2 border-4 border-indigo-200 dark:border-cyan-700">
                        {profilePicPreview ? (
                          <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="mb-2" onChange={handleProfilePicChange} />
                      <button onClick={handleProfilePicUpload} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all">Upload</button>
                    </div>
                    {/* Profile info form */}
                    <form onSubmit={handleProfileSave} className="space-y-4 w-full">
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={profileEdit.name}
                        onChange={e => setProfileEdit({ ...profileEdit, name: e.target.value })}
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={profileEdit.email}
                        onChange={e => setProfileEdit({ ...profileEdit, email: e.target.value })}
                      />
                      <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-200"
                        disabled={profileSaving}
                      >
                        {profileSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </form>
                    {/* Usage Info section */}
                    <div className="w-full mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-cyan-900/20 border border-indigo-100 dark:border-cyan-800">
                      <h3 className="text-lg font-bold mb-2 text-indigo-700 dark:text-cyan-200">Usage Info</h3>
                      <ul className="text-gray-700 dark:text-gray-100 text-sm space-y-1">
                        <li><b>Queries made:</b> <span className="font-mono">{profileData.queries_made}</span></li>
                        <li><b>Last login:</b> <span className="font-mono">{profileData.last_login}</span></li>
                        <li><b>Account created:</b> <span className="font-mono">{profileData.created_at}</span></li>
                      </ul>
                    </div>
                    {/* Change password form */}
                    <form onSubmit={handleChangePassword} className="space-y-2 w-full mt-6">
                      <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                      <input type="password" required placeholder="Old Password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={passwordForm.old} onChange={e => setPasswordForm(f => ({ ...f, old: e.target.value }))} />
                      <input type="password" required placeholder="New Password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={passwordForm.new1} onChange={e => setPasswordForm(f => ({ ...f, new1: e.target.value }))} />
                      <input type="password" required placeholder="Confirm New Password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={passwordForm.new2} onChange={e => setPasswordForm(f => ({ ...f, new2: e.target.value }))} />
                      <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-500 dark:to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-200">Change Password</button>
                      {passwordChangeStatus && <div className={`text-center text-sm mt-1 ${passwordChangeStatus.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{passwordChangeStatus}</div>}
                    </form>
                  </>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Chat History Modal */}
        <AnimatePresence>
          {showChatHistoryModal && (
            <motion.div
              key="chat-history-modal"
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Blurred background overlay */}
              <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setShowChatHistoryModal(false)}
              />
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-lg relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setShowChatHistoryModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-center">Chat History</h2>
                {chatHistoryLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading...</div>
                ) : chatHistoryError ? (
                  <div className="text-center py-8 text-red-500">{chatHistoryError}</div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No recent queries.</div>
                ) : (
                  <ul className="w-full max-h-96 overflow-y-auto text-sm space-y-3">
                    {chatHistory.map((item, idx) => (
                      <li key={idx} className="p-3 rounded-lg bg-indigo-50 dark:bg-cyan-900/20 border border-indigo-100 dark:border-cyan-800 flex flex-col gap-1">
                        <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{item.query}</span>
                        <span className="text-xs text-gray-400">{item.timestamp && new Date(item.timestamp).toLocaleString()}</span>
                        {item.decision && (
                          <span className="text-xs text-indigo-700 dark:text-cyan-300">Decision: {item.decision}</span>
                        )}
                        {item.amount !== undefined && (
                          <span className="text-xs text-gray-500">Amount: {item.amount}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div> {/* closes main-app-animated */}
    </AnimatePresence>
  );
}

export default App;