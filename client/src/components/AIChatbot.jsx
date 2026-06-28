import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User, HelpCircle } from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['price', 'pricing', 'rent', 'cost', 'sharing', 'bed', 'room', 'deluxe', 'suite'],
    answer: "We offer flexible layout configurations: \n• Deluxe Private Suite: ₹10,000/mo (attached bath, AC, workdesk)\n• Twin Sharing: ₹8,000/mo\n• Triple Sharing: ₹6,500/mo\n• Quad Sharing: ₹5,000/mo\nAll sharing plans include cleaning, WiFi, and maintenance."
  },
  {
    keywords: ['food', 'catering', 'meal', 'breakfast', 'dinner', 'lunch', 'menu', 'veg'],
    answer: "Our curated catering provides delicious, organic home-style buffet meals (Veg & Non-Veg options available). \n• Breakfast: 8:00 AM - 10:00 AM\n• Lunch: 1:00 PM - 3:00 PM\n• Dinner: 8:00 PM - 10:00 PM\nMeals are prepared hygienically in our modern modular kitchen."
  },
  {
    keywords: ['wifi', 'internet', 'speed', 'network', 'broadband'],
    answer: "StayMate AI features high-speed Gigabit fiber broadband internet. We have dedicated mesh router nodes on every floor to ensure stable connection for working, designing, and coding."
  },
  {
    keywords: ['security', 'safe', 'cctv', 'biometric', 'camera', 'entry', 'lock'],
    answer: "Your safety is our absolute priority. We employ: \n• 24/7 CCTV surveillance in common areas\n• Safe Biometric entry facade scanners at main entrances\n• Professional security guards on-site."
  },
  {
    keywords: ['complaint', 'issue', 'repair', 'ticket', 'plumbing', 'wifi issue', 'maintenance'],
    answer: "Once you check in, you can log into your Tenant Portal to file operational issues (WiFi, water, food, cleaning) via our 'Raise Complaint' page. Wardens monitor ticket statuses live in their Owner Portal."
  },
  {
    keywords: ['join', 'book', 'booking', 'reserve', 'visit', 'apply', 'contact'],
    answer: "To book a stay: \n1. Click 'Join PG' in the navigation bar.\n2. Submit your profile details.\n3. The warden will review and reach out to complete verification!"
  }
];

const PRESETS = [
  "What is the monthly rent?",
  "Tell me about the food timings",
  "How is the internet speed?",
  "How safe is the accommodation?"
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hello! I am your StayMate AI Assistant. Ask me any question about our rooms, pricing, food menus, or safety protocols!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const userText = textToSend || input;
    if (!userText.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Trigger typing response
    setIsTyping(true);
    setTimeout(() => {
      let botResponse = "I'm here to clear your doubts! For details regarding monthly rent, food buffets, safety controls, or booking, click the options below or ask me directly.";
      
      const cleanText = userText.toLowerCase();
      
      // Look for keywords in knowledge base
      const match = KNOWLEDGE_BASE.find(k => 
        k.keywords.some(kw => cleanText.includes(kw))
      );

      if (match) {
        botResponse = match.answer;
      } else if (cleanText.includes('hi') || cleanText.includes('hello') || cleanText.includes('hey')) {
        botResponse = "Hey there! How can I assist you with StayMate AI today?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 font-sans flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full sm:w-[380px] h-[450px] sm:h-[500px] max-h-[calc(100vh-120px)] rounded-3xl border border-white/10 bg-[#0b0f19]/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden mb-4 pointer-events-auto"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-aurora-gradient flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-extrabold flex items-center gap-1.5">
                    StayMate Assistant
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Ask us anything about our PG</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-aurora-gradient text-white font-medium rounded-tr-none'
                      : 'bg-white/[0.03] border border-white/5 text-slate-300 rounded-tl-none whitespace-pre-line'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 text-slate-400 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets / Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-cyan-400" /> Suggested Doubts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      className="px-2.5 py-1 text-[10px] bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-cyan-500/40 rounded-full transition text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="p-3 border-t border-white/10 bg-black/45 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask StayMate Assistant..."
                className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-aurora-gradient flex items-center justify-center text-white hover:opacity-90 shadow-glass transition flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-aurora-gradient flex items-center justify-center text-white shadow-neon-violet border border-white/10 relative pointer-events-auto"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-cyan-400 border-2 border-slate-950 rounded-full animate-pulse" />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatbot;
