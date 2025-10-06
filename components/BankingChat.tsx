import React, { useState, useRef, useEffect } from 'react';
import { startChatSession } from '../services/geminiService';
import { SendIcon, SpinnerIcon, XIcon, ChatBubbleLeftRightIcon } from './Icons';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const BankingChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Hello! I am the ApexBank assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<ReturnType<typeof startChatSession> | null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const getChat = () => {
        if (!chatRef.current) {
            chatRef.current = startChatSession();
        }
        return chatRef.current;
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const chat = getChat();
        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error with chat stream:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 z-40 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Open chat assistant"
                >
                    <ChatBubbleLeftRightIcon className="w-8 h-8" />
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 w-full max-w-sm h-full max-h-[70vh] bg-slate-200 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-300">
                    <h3 className="text-lg font-bold text-slate-800">Banking Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-500 hover:bg-slate-300">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Messages */}
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">AI</div>}
                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm'}`}>
                                <p className="text-sm break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">AI</div>
                            <div className="max-w-xs px-4 py-2 rounded-2xl bg-white text-slate-800 rounded-bl-none shadow-sm">
                                <SpinnerIcon className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="flex-shrink-0 p-4 border-t border-slate-300 bg-slate-200/50">
                    <form onSubmit={handleSend} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full bg-white border-0 p-3 rounded-lg shadow-inner focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                            aria-label="Chat input"
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-primary text-white rounded-lg shadow-md disabled:bg-primary-300" aria-label="Send message">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
