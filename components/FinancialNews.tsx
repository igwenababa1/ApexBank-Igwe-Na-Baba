import React, { useState, useEffect } from 'react';
import { getFinancialNews } from '../services/geminiService';
import { NewsArticle } from '../types';
import { SpinnerIcon, InfoIcon, StarIcon } from './Icons';

const NewsArticleCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="p-4 rounded-lg shadow-digital-inset">
        <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
            {article.category}
        </span>
        <h4 className="font-bold text-slate-800 mb-1">{article.title}</h4>
        <p className="text-sm text-slate-600">{article.summary}</p>
    </div>
);

const AdCard: React.FC = () => (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 text-primary-500/20">
            <StarIcon />
        </div>
        <div className="relative z-10">
            <h3 className="text-xl font-bold">Upgrade to ApexBank Premium</h3>
            <p className="mt-2 text-sm text-primary-100">Unlock higher transfer limits, a dedicated account manager, and exclusive investment opportunities.</p>
            <button className="mt-4 bg-white text-primary font-bold py-2 px-4 rounded-lg shadow-md hover:bg-slate-100 transition-colors">
                Learn More
            </button>
        </div>
    </div>
);


const NewsSkeletonLoader: React.FC = () => (
    <div className="p-4 rounded-lg shadow-digital-inset animate-pulse">
        <div className="h-4 bg-slate-300 rounded w-1/3 mb-3"></div>
        <div className="h-5 bg-slate-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-300 rounded w-4/5"></div>
    </div>
);


export const FinancialNews: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            setIsError(false);
            const result = await getFinancialNews();
            if (result.isError) {
                setIsError(true);
            } else {
                setArticles(result.articles);
            }
            setIsLoading(false);
        };
        fetchNews();
    }, []);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-slate-200 rounded-2xl shadow-digital">
                <div className="p-6 border-b border-slate-300">
                    <h2 className="text-xl font-bold text-slate-800">Market Insights & News</h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="space-y-4">
                           <NewsSkeletonLoader />
                           <NewsSkeletonLoader />
                           <NewsSkeletonLoader />
                        </div>
                    ) : isError ? (
                        <div className="flex items-center space-x-3 text-yellow-700 bg-yellow-100 p-4 rounded-lg shadow-digital-inset">
                            <InfoIcon className="w-6 h-6" />
                            <p>Could not load financial news at this time. Please try again later.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {articles.map((article, index) => (
                                <NewsArticleCard key={index} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="lg:col-span-1">
                <AdCard />
            </div>
        </div>
    );
};
