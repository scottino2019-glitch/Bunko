import React, { useState, useMemo } from 'react';
import { MY_EDITOR_LINKS, EditorLinkItem } from '../data/links';
import { ExternalLink, Copy, Check, Search, Sparkles } from 'lucide-react';

interface EditorScrollListProps {
  onOpenCodeGuide: () => void;
}

export const EditorScrollList: React.FC<EditorScrollListProps> = ({ onOpenCodeGuide }) => {
  const [filterLang, setFilterLang] = useState<'all' | 'zh' | 'ko' | 'dual'>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MY_EDITOR_LINKS.filter((item) => {
      const matchLang =
        filterLang === 'all'
          ? true
          : filterLang === 'zh'
          ? item.language === 'zh' || item.language === 'dual'
          : filterLang === 'ko'
          ? item.language === 'ko' || item.language === 'dual'
          : item.language === 'dual';
      const matchQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.nativeTitle.toLowerCase().includes(query.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(query.toLowerCase());
      return matchLang && matchQuery;
    });
  }, [filterLang, query]);

  const handleCopy = (id: string, url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="flex flex-col h-full bg-[#faede6] rounded-2xl border-2 border-[#d67b63] shadow-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e8a996]">
        <div className="flex items-center gap-2.5">
          <span className="hanko-seal w-8 h-8 text-sm font-bold shadow-xs">
            蔵
          </span>
          <div>
            <h2 className="text-xl font-bold font-serif-jp text-[#2d1814] leading-tight">
              Archivio Editor
            </h2>
            <div className="text-[11px] font-semibold text-[#8a380e]">
              I tuoi link collegati nel codice
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCodeGuide}
          className="text-xs px-2.5 py-1 font-bold text-[#faf0e4] bg-[#d74b33] hover:bg-[#b83823] rounded-lg shadow-xs transition-colors"
        >
          Modifica Link
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3 mb-4">
        {/* Language Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#f0d1c5] rounded-xl border border-[#e8a996]">
          <button
            onClick={() => setFilterLang('all')}
            className={`py-1 text-xs font-bold rounded-lg transition-all ${
              filterLang === 'all'
                ? 'bg-[#faf0e4] text-[#2d1814] shadow-xs'
                : 'text-[#5a3328] hover:text-[#2d1814]'
            }`}
          >
            Tutti ({MY_EDITOR_LINKS.length})
          </button>
          <button
            onClick={() => setFilterLang('zh')}
            className={`py-1 text-xs font-bold rounded-lg transition-all ${
              filterLang === 'zh'
                ? 'bg-[#faf0e4] text-[#2d1814] shadow-xs'
                : 'text-[#5a3328] hover:text-[#2d1814]'
            }`}
          >
            Cinese
          </button>
          <button
            onClick={() => setFilterLang('ko')}
            className={`py-1 text-xs font-bold rounded-lg transition-all ${
              filterLang === 'ko'
                ? 'bg-[#faf0e4] text-[#2d1814] shadow-xs'
                : 'text-[#5a3328] hover:text-[#2d1814]'
            }`}
          >
            Coreano
          </button>
          <button
            onClick={() => setFilterLang('dual')}
            className={`py-1 text-xs font-bold rounded-lg transition-all ${
              filterLang === 'dual'
                ? 'bg-[#faf0e4] text-[#2d1814] shadow-xs'
                : 'text-[#5a3328] hover:text-[#2d1814]'
            }`}
          >
            Bilingue
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a5345]" />
          <input
            type="text"
            placeholder="Cerca editor o ideogramma..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#fbf3ec] border border-[#e8a996] rounded-xl text-[#2d1814] placeholder-[#9c6a5d] focus:outline-none focus:ring-1 focus:ring-[#d74b33]"
          />
        </div>
      </div>

      {/* List of Elegant Japanese Scroll Slips */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[580px]">
        {filtered.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.url.includes('.internal')) {
                  onOpenCodeGuide();
                } else {
                  window.open(item.url, '_blank');
                }
              }}
              style={{
                backgroundColor: item.color.bg,
                borderColor: item.color.border,
              }}
              className="scroll-slip cursor-pointer rounded-xl border p-3 flex items-center justify-between gap-3 group"
            >
              {/* Left: Hanko Seal + Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span
                  style={{
                    borderColor: item.color.accent,
                    color: item.color.accent,
                    backgroundColor: '#faf0e4'
                  }}
                  className="w-9 h-9 shrink-0 flex items-center justify-center font-serif-jp text-base font-bold rounded-lg border-2 shadow-xs group-hover:scale-105 transition-transform"
                >
                  {item.kanjiChar}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-bold font-serif-jp tracking-wide truncate"
                      style={{ color: item.color.accent }}
                    >
                      {item.nativeTitle}
                    </span>
                    <span className="text-[10px] font-semibold text-[#6e463a] uppercase">
                      · {item.categoryLabel}
                    </span>
                  </div>
                  
                  <div className="text-xs font-bold text-[#2d1814] truncate">
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Right: Direct Actions */}
              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleCopy(item.id, item.url, e)}
                  title="Copia link"
                  className="p-1.5 rounded-lg bg-[#faf0e4] hover:bg-[#f2e2d5] text-[#5a3328] border border-[#d8beaa] transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-[#3a6d47]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {item.url.includes('.internal') ? (
                  <button
                    onClick={onOpenCodeGuide}
                    style={{ backgroundColor: item.color.accent }}
                    title="Clicca per vedere come inserire il tuo link reale"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#faf0e4] rounded-lg shadow-xs hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <span>Imposta Link</span>
                  </button>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: item.color.accent }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#faf0e4] rounded-lg shadow-xs hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <span>Apri</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-[#6e463a]">
            Nessun editor corrisponde alla ricerca.
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-3 border-t border-[#e8a996] flex items-center justify-between text-[11px] text-[#6e463a]">
        <span>{filtered.length} editor disponibili</span>
        <button
          onClick={onOpenCodeGuide}
          className="text-[#d74b33] font-bold hover:underline"
        >
          src/data/links.ts
        </button>
      </div>
    </div>
  );
};
