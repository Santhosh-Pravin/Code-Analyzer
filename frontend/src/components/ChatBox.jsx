import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, User, Sparkles } from 'lucide-react';

export function ChatBox({ codeContext }) {
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi! I analyzed your code. Do you have any specific questions about it?' }
    ]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setSending(true);

        const historyForApi = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        try {
            const response = await axios.post('http://localhost:8001/chat', {
                history: historyForApi,
                question: userMsg,
                code_context: codeContext || "No code context available."
            });

            const botResponse = response.data.response;
            setMessages(prev => [...prev, { role: 'model', text: botResponse }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error answering that." }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-brand-dark/10 to-transparent z-10 pointer-events-none"></div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg ${msg.role === 'user'
                                ? 'bg-brand-peach border-brand-peach text-brand-dark'
                                : 'bg-brand-teal/20 border-brand-teal/30 text-brand-teal'
                            }`}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        </div>

                        <div className={`max-w-[80%] rounded-[20px] p-4 text-sm leading-relaxed shadow-md ${msg.role === 'user'
                                ? 'bg-brand-peach text-brand-dark rounded-br-sm'
                                : 'bg-brand-dark/50 border border-brand-teal/10 text-brand-peach/90 rounded-bl-sm backdrop-blur-sm'
                            }`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {sending && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="bg-brand-dark/30 rounded-[20px] rounded-bl-sm p-4 flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-brand-teal/50 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-brand-teal/50 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-brand-teal/50 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 relative">
                <input
                    type="text"
                    className="w-full bg-brand-dark/60 border border-brand-teal/20 rounded-full pl-6 pr-14 py-4 text-brand-peach placeholder-brand-teal/40 focus:outline-none focus:border-brand-peach/50 focus:ring-1 focus:ring-brand-peach/50 shadow-inner transition-all"
                    placeholder="Follow up with a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="absolute right-2 top-2 w-10 h-10 rounded-full bg-brand-teal hover:bg-brand-peach hover:text-brand-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-300 shadow-lg"
                >
                    <Send className="w-4 h-4 ml-0.5" />
                </button>
            </div>
        </div>
    );
}
