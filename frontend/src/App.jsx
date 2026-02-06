import React, { useState } from 'react';
import axios from 'axios';
import { CodeInput } from './components/CodeInput';
import { AnalysisResult } from './components/AnalysisResult';
import { ChatBox } from './components/ChatBox';
import { Activity, Code2, Sparkles } from 'lucide-react';

function App() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [codeContext, setCodeContext] = useState('');

    const handleAnalyze = async (data) => {
        setLoading(true);
        setError(null);
        setAnalysis(null);

        const formData = new FormData();
        if (data.file) {
            formData.append('file', data.file);
            setCodeContext("Code from file: " + data.file.name);
        } else if (data.code_text) {
            formData.append('code_text', data.code_text);
            setCodeContext(data.code_text);
        }

        try {
            const response = await axios.post('http://localhost:8001/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAnalysis(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark via-[#1F3333] to-brand-dark">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-12 text-center relative pointer-events-none">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-teal/20 rounded-full blur-[100px] -z-10"></div>

                    <div className="inline-flex items-center justify-center p-4 bg-brand-teal/10 rounded-2xl mb-6 backdrop-blur-sm border border-brand-teal/20 shadow-lg shadow-brand-teal/5">
                        <Sparkles className="w-8 h-8 text-brand-peach" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-brand-peach via-white to-brand-peach bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm">
                        AI Code Analyzer
                    </h1>
                    <p className="text-brand-teal text-lg font-light tracking-wide">
                        Intelligent insights for your codebase
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Input */}
                    <div className={`lg:col-span-4 space-y-6 transition-all duration-500 ${analysis ? '' : 'lg:col-start-4 lg:col-span-6'}`}>
                        <section className="glass-panel rounded-3xl p-1 overflow-hidden">
                            <div className="bg-brand-dark/40 backdrop-blur-sm p-6 rounded-[20px]">
                                <h2 className="text-xl font-medium mb-6 flex items-center gap-3 text-brand-peach/90">
                                    <Code2 className="w-5 h-5 opacity-80" />
                                    Source Input
                                </h2>
                                <CodeInput onAnalyze={handleAnalyze} loading={loading} />
                                {error && (
                                    <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Show Chat here only on mobile or if analysis exists */}
                        {analysis && (
                            <section className="glass-panel rounded-3xl p-6 hidden lg:block sticky top-8">
                                <ChatBox codeContext={codeContext} />
                            </section>
                        )}
                    </div>

                    {/* Right Panel: Results */}
                    {analysis && (
                        <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <AnalysisResult data={analysis} />
                            {/* Mobile Chat */}
                            <section className="glass-panel rounded-3xl p-6 lg:hidden">
                                <ChatBox codeContext={codeContext} />
                            </section>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="lg:col-span-8 flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-4 border-brand-teal/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-brand-peach border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-4 bg-brand-teal/10 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-brand-peach text-xl font-light tracking-wider animate-pulse">Analyzing Logic flow...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!analysis && !loading && !error && (
                        <div className="hidden">
                            {/* Hidden specifically because recentering layout handles empty state visually */}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
