import React, { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exampleSnippet = `// Apri il file src/data/links.ts e modifica o aggiungi il tuo editor:
{
  id: 'mio-editor',
  title: 'Il Mio Editor Cinese',
  nativeTitle: '我的中文编辑器',
  kanjiChar: '筆',
  url: 'https://tuo-sito.com', // <-- INSERISCI QUI IL TUO LINK
  language: 'zh', // 'zh' = Cinese | 'ko' = Coreano | 'dual' = Bilingue
  categoryLabel: 'Calligrafia',
  description: 'Compositore e studio caratteri.',
  color: {
    accent: '#d74b33',
    bg: '#fae4dc',
    border: '#e8a996',
    text: '#8f2917'
  }
},`;

  const copySnippet = () => {
    navigator.clipboard.writeText(exampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d1814]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#faede6] rounded-2xl border-2 border-[#d67b63] shadow-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#5a3328] hover:text-[#2d1814] hover:bg-[#f0d1c5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-[#d74b33] uppercase tracking-wider mb-2">
          <FileCode className="w-4 h-4" />
          <span>src/data/links.ts</span>
        </div>

        <h3 className="text-2xl font-bold font-serif-jp text-[#2d1814] mb-2">
          Come Inserire i Tuoi Link
        </h3>
        <p className="text-xs text-[#5a3328] mb-5">
          Tutti i link degli editor si collegano direttamente nel file di codice sorgente <code className="bg-[#f0d1c5] px-1.5 py-0.5 rounded font-mono font-bold text-[#2d1814]">src/data/links.ts</code>.
        </p>

        {/* Code Snippet Box */}
        <div className="relative rounded-xl border border-[#d67b63] bg-[#fdf4ee] p-4 text-xs font-mono text-[#2d1814] overflow-x-auto mb-6">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e8a996] text-[11px] text-[#8a380e]">
            <span>src/data/links.ts</span>
            <button
              onClick={copySnippet}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#faede6] text-[#2d1814] hover:bg-[#f0d1c5] border border-[#d67b63] transition-colors font-sans font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#3a6d47]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiato' : 'Copia'}</span>
            </button>
          </div>
          <pre className="leading-relaxed whitespace-pre-wrap">{exampleSnippet}</pre>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-[#faf0e4] bg-[#d74b33] hover:bg-[#b83823] rounded-xl transition-colors"
          >
            Ho Capito, Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
