import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Lightbulb, Info, AlertTriangle, CheckCircle, List } from 'lucide-react';

export function AnalysisResult({ data }) {
    if (!data) return null;

    const { summary, explanation, quality_analysis, key_components } = data;

    const getComplexityColor = (level) => {
        if (!level) return 'text-brand-teal';
        const l = level.toLowerCase();
        if (l.includes('low')) return 'text-emerald-400';
        if (l.includes('medium')) return 'text-yellow-400';
        if (l.includes('high')) return 'text-rose-400';
        return 'text-brand-teal';
    };

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-peach"></div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-3 text-brand-teal uppercase tracking-wider text-sm">
                    <Info className="w-5 h-5" />
                    Executive Summary
                </h2>
                <p className="text-brand-peach/90 leading-relaxed text-lg font-light">{summary}</p>
            </div>

            {/* Explanation */}
            <div className="glass-panel rounded-3xl p-8">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-3 text-brand-teal uppercase tracking-wider text-sm">
                    <Lightbulb className="w-5 h-5 text-brand-peach" />
                    Detailed Breakdown
                </h2>
                <div className="prose prose-invert max-w-none prose-p:text-brand-peach/80 prose-p:font-light prose-p:leading-loose prose-headings:text-brand-teal prose-strong:text-brand-peach prose-pre:bg-brand-dark/50 prose-pre:border prose-pre:border-brand-teal/20">
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
            </div>

            {/* Quality & Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quality Analysis */}
                <div className="glass-panel rounded-3xl p-8 flex flex-col h-full">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-brand-teal uppercase tracking-wider text-sm">
                        <AlertTriangle className="w-5 h-5 text-brand-peach" />
                        Quality Metrix
                    </h3>

                    <div className="space-y-4 flex-1">
                        <div className="flex justify-between items-center p-4 bg-brand-dark/40 rounded-xl border border-brand-teal/10">
                            <span className="text-brand-teal font-medium">Complexity</span>
                            <span className={`font-mono font-bold text-lg ${getComplexityColor(quality_analysis.complexity)}`}>
                                {quality_analysis.complexity}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-brand-dark/40 rounded-xl border border-brand-teal/10">
                            <span className="text-brand-teal font-medium">Readability</span>
                            <span className="font-mono font-bold text-lg text-brand-peach">
                                {quality_analysis.readability_score} / 10
                            </span>
                        </div>

                        <div className="mt-8">
                            <p className="text-xs font-bold text-brand-teal mb-4 uppercase tracking-widest opacity-60">Suggestions</p>
                            <ul className="space-y-3">
                                {quality_analysis.suggestions && quality_analysis.suggestions.map((sug, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-brand-peach/80 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0"></div>
                                        {sug}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Key Components */}
                <div className="glass-panel rounded-3xl p-8 flex flex-col h-full">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-brand-teal uppercase tracking-wider text-sm">
                        <List className="w-5 h-5 text-brand-peach" />
                        Key Components
                    </h3>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {key_components && key_components.map((comp, idx) => (
                            <div key={idx} className="p-4 bg-brand-dark/40 rounded-xl border border-brand-teal/10 hover:border-brand-teal/30 transition-colors group">
                                <div className="font-mono text-brand-peach font-semibold mb-2 group-hover:text-white transition-colors">{comp.name}</div>
                                <div className="text-sm text-brand-teal/80 font-light leading-relaxed">{comp.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
