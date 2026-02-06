import React, { useState } from 'react';
import { Upload, FileText, Play, Code } from 'lucide-react';

export function CodeInput({ onAnalyze, loading }) {
    const [mode, setMode] = useState('paste'); // 'paste' or 'upload'
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = () => {
        if (loading) return;
        if (mode === 'paste' && text.trim()) {
            onAnalyze({ code_text: text });
        } else if (mode === 'upload' && file) {
            onAnalyze({ file });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex bg-brand-dark/60 p-1.5 rounded-xl border border-brand-teal/10">
                <button
                    onClick={() => setMode('paste')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'paste'
                            ? 'bg-brand-teal/20 text-brand-peach shadow-sm border border-brand-teal/20'
                            : 'text-brand-teal/60 hover:text-brand-teal hover:bg-white/5'
                        }`}
                >
                    <Code className="w-4 h-4" />
                    Paste Code
                </button>
                <button
                    onClick={() => setMode('upload')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'upload'
                            ? 'bg-brand-teal/20 text-brand-peach shadow-sm border border-brand-teal/20'
                            : 'text-brand-teal/60 hover:text-brand-teal hover:bg-white/5'
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    Upload File
                </button>
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-peach to-brand-teal rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative">
                    {mode === 'paste' ? (
                        <textarea
                            className="w-full h-64 bg-[#142020] border border-brand-teal/20 rounded-xl p-5 font-mono text-sm text-brand-peach/90 focus:outline-none focus:border-brand-peach/50 focus:ring-1 focus:ring-brand-peach/50 placeholder-brand-teal/30 resize-none transition-all"
                            placeholder="// Paste your code here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    ) : (
                        <div className="w-full h-64 border-2 border-dashed border-brand-teal/20 rounded-xl bg-[#142020] flex flex-col items-center justify-center cursor-pointer hover:bg-brand-teal/5 hover:border-brand-teal/40 transition-all relative overflow-hidden group/upload">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setFile(e.target.files[0])}
                            />

                            {file ? (
                                <div className="flex flex-col items-center text-brand-peach animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-teal/20">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <span className="font-medium text-lg tracking-wide">{file.name}</span>
                                    <span className="text-sm text-brand-teal mt-1">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-brand-teal/60 group-hover/upload:text-brand-teal transition-colors">
                                    <Upload className="w-12 h-12 mb-4 opacity-50" />
                                    <span className="font-medium">Drag & Drop or Click</span>
                                    <span className="text-xs mt-2 opacity-60">Supports all major languages</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || (mode === 'paste' && !text) || (mode === 'upload' && !file)}
                className="w-full py-4 bg-brand-peach hover:bg-[#ffdfd4] disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark font-bold rounded-xl shadow-lg shadow-brand-peach/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
                {loading ? (
                    <span className="opacity-80">Processing...</span>
                ) : (
                    <>
                        <Play className="w-5 h-5 fill-current" />
                        Run Analysis
                    </>
                )}
            </button>
        </div>
    );
}
