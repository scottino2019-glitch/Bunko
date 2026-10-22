import React from 'react';

interface TopBarProps {
  onOpenCodeGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenCodeGuide }) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#e5927b]/95 border-b-2 border-[#d67b63] shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="hanko-seal w-8 h-8 text-sm font-bold shadow-xs">
            文
          </span>
          <div>
            <div className="text-lg font-bold font-serif-jp text-[#2d1814] leading-tight">
              文庫 · BUNKO STUDIO
            </div>
            <div className="text-[10px] font-bold text-[#8f2917] uppercase tracking-wider">
              Studio & Archivio Linguistico Cinese & Coreano
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCodeGuide}
          className="px-4 py-2 text-xs font-bold text-[#faf0e4] bg-[#d74b33] hover:bg-[#b83823] active:scale-[0.98] transition-all rounded-xl shadow-xs"
        >
          Modifica i Tuoi Link nel Codice
        </button>
      </div>
    </header>
  );
};
