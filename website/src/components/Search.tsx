'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch index once when component mounts or modal opens
  useEffect(() => {
    if (isOpen && docs.length === 0) {
      setIsLoading(true);
      fetch('/api/search')
        .then(res => res.json())
        .then(data => {
          setDocs(data.docs || []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to load search index:', err);
          setIsLoading(false);
        });
    }
  }, [isOpen, docs.length]);

  // Handle hotkeys (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!query.trim() || docs.length === 0) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(docs, {
      keys: ['title', 'description', 'text'],
      threshold: 0.3,
      includeMatches: true
    });

    const searchResults = fuse.search(query).slice(0, 8).map(res => ({
      slug: res.item.slug,
      title: res.item.title,
      description: res.item.description
    }));

    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, docs]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/docs/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].slug);
      }
    }
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-64 flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-slate-950/60 hover:bg-slate-900 border border-violet-950/40 hover:border-violet-900/60 rounded-lg transition duration-150 text-left outline-none cursor-pointer"
        aria-label="Search documentation"
      >
        <span className="flex items-center gap-2">
          <span>🔍</span>
          <span>Search docs...</span>
        </span>
        <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-800 rounded text-slate-500">
          Ctrl+K
        </kbd>
      </button>

      {/* Search Modal Dialog */}
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="w-full max-w-xl bg-slate-900 border border-violet-950/60 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-violet-950/30">
              <span className="text-lg">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search standards, failure modes, prompts, tools..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none border-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-500 hover:text-slate-300"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[350px] overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-10 gap-3 text-xs text-slate-400">
                  <div className="spinner"></div>
                  <span>Building search index...</span>
                </div>
              ) : query.trim() === '' ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Type to start searching the standard...
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No results found for &ldquo;<span className="text-violet-400 font-medium">{query}</span>&rdquo;
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((result, idx) => (
                    <button
                      key={result.slug}
                      onClick={() => handleSelect(result.slug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left p-3 rounded-lg flex flex-col transition duration-150 ${
                        idx === selectedIndex
                          ? 'bg-violet-950/30 border border-violet-950/60 text-violet-300'
                          : 'border border-transparent text-slate-300 hover:bg-slate-950/20'
                      }`}
                    >
                      <span className="font-semibold text-xs text-white block mb-0.5">
                        {result.title}
                      </span>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        {result.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-violet-950/20 bg-slate-950/40 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-mono">Enter</kbd> Select
                </span>
              </div>
              <span>OAIES Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
