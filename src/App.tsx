/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { EditorScrollList } from './components/EditorScrollList';
import { UnifiedFlipBook } from './components/UnifiedFlipBook';
import { CodeModal } from './components/CodeModal';

export default function App() {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#d74b33] selection:text-[#faf0e4]">
      {/* Top Header */}
      <TopBar onOpenCodeGuide={() => setIsCodeModalOpen(true)} />

      {/* Main Studio Desk Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Japanese Lacquer Scroll Rack of Language Editors (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <EditorScrollList onOpenCodeGuide={() => setIsCodeModalOpen(true)} />
          </div>

          {/* RIGHT: The Physical Open Japanese Book (Agenda + Tianzige + Wongoji) (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <UnifiedFlipBook />
          </div>

        </div>
      </main>

      {/* Code Customization Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
