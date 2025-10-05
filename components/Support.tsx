import React, { useState, useEffect, FormEvent } from 'react';
import { SystemUpdate } from '../types';
import { getSystemUpdates, getSupportAnswer } from '../services/geminiService';
import { SearchIcon, SpinnerIcon, InfoIcon, SparklesIcon, CheckCircleIcon, LightBulbIcon } from './Icons';

const SystemUpdateCard: React.FC<{ update: SystemUpdate }> = ({ update }) => {
    const categoryStyles = {
        'New Feature': 'bg-blue-100 text-blue-800',
        'Improvement': 'bg-green-100 text-green-800',
        'Maintenance': 'bg-yellow-100 text-yellow-800',
    };
    return (
        <div className="p-4 rounded-lg shadow-digital-inset space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-800">{update.title}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryStyles[update.category]}`}>{update.category}</span>
            </div>
            <p className="text-sm text-slate-600">{update.description}</p>
            <p className="text-xs text-slate-400">{new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    );
};

const FormattedAnswer: React.FC<{ text: string }> = ({ text }) => {
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n\*/g, '\n•'); // Simple bullet points

    const paragraphs = formattedText.split('\n').map((paragraph, index) => {
        if (paragraph.startsWith('•')) {
            return (
                <li key={index} className="ml-5 list-disc">{paragraph.substring(1).trim()}</li>
            );
        }
        return paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />;
    });

    return <div className="space-y-2 text-sm text-slate-700">{paragraphs}</div>;
};


export const Support: React.FC = () => {
    const [updates, setUpdates] = useState<SystemUpdate[]>([]);
    const [isLoadingUpdates, setIsLoadingUpdates] = useState(true);
    const [updatesError, setUpdatesError] = useState(false);
    
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
    const [answerError, setAnswerError] = useState(false);

    useEffect(() => {
        const fetchUpdates = async () => {
            const { updates, isError } = await getSystemUpdates();
            setUpdates(updates);
            setUpdatesError(isError);
            setIsLoadingUpdates(false);
        };
        fetchUpdates();
    }, []);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setIsLoadingAnswer(true);
        setAnswerError(false);
        setAnswer('');
        
        const { answer, isError } = await getSupportAnswer(query);
        setAnswer(answer);
        setAnswerError(isError);
        setIsLoadingAnswer(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Support & Help Center</h2>
                <p className="text-sm text-slate-500 mt-1">Get instant answers and stay updated on the latest news from ApexBank.</p>
            </div>
            
            <div className="bg-slate-200 rounded-2xl shadow-digital p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">How can we help?</h3>
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask anything, e.g., 'How do I add a recipient?'"
                            className="w-full bg-slate-200 border-0 rounded-md shadow-digital-inset focus:ring-2 focus:ring-primary-400 p-3 pl-10"
                            aria-label="Search support"
                        />
                    </div>
                    <button type="submit" disabled={isLoadingAnswer} className="px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:bg-primary-300">
                        {isLoadingAnswer ? <SpinnerIcon className="w-5 h-5" /> : 'Ask'}
                    </button>
                </form>

                { (isLoadingAnswer || answer) && (
                    <div className="mt-6 p-4 rounded-lg shadow-digital-inset">
                        {isLoadingAnswer ? (
                            <div className="flex items-center space-x-3 text-slate-600">
                                <SpinnerIcon className="w-5 h-5"/>
                                <span>Finding the best answer for you...</span>
                            </div>
                        ) : answerError ? (
                             <div className="flex items-start space-x-3 text-yellow-700">
                                <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{answer}</p>
                            </div>
                        ) : (
                             <div className="flex items-start space-x-3">
                                <div className="p-1.5 bg-primary-100 rounded-full mt-1">
                                    <SparklesIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Here's what I found:</h4>
                                    <FormattedAnswer text={answer} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-slate-200 rounded-2xl shadow-digital">
                <div className="p-6 border-b border-slate-300">
                    <h2 className="text-xl font-bold text-slate-800">System Updates & News</h2>
                </div>
                <div className="p-6">
                    {isLoadingUpdates ? (
                        <div className="flex justify-center items-center p-4">
                            <SpinnerIcon className="w-8 h-8 text-primary" />
                        </div>
                    ) : updatesError ? (
                        <div className="flex items-center space-x-3 text-yellow-700 bg-yellow-100 p-4 rounded-lg shadow-digital-inset">
                            <InfoIcon className="w-6 h-6" />
                            <p>Could not load system updates at this time.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {updates.map(update => <SystemUpdateCard key={update.id} update={update} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};