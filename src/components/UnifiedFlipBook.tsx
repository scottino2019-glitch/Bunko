import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  CheckSquare, 
  Square,
  Sparkles,
  Pencil,
  X,
  Clock
} from 'lucide-react';
import { playPageFlipSound } from '../utils/audio';

type BookMode = 'agenda' | 'chinese' | 'korean';

const AGENDA_DAYS = [
  {
    dayIt: 'Lunedì',
    zh: '周一 · 星期一',
    ko: '월요일 (月)',
    quoteZh: '千里之行，始于足下。',
    quoteKo: '시작이 반이다.',
    it: 'Un viaggio di mille miglia inizia con un solo passo. Iniziare è già metà dell\'opera.'
  },
  {
    dayIt: 'Martedì',
    zh: '周二 · 星期二',
    ko: '화요일 (火)',
    quoteZh: '温故而知新，可以为师矣。',
    quoteKo: '가는 말이 고와야 오는 말이 곱다.',
    it: 'Ripassa il vecchio per comprendere il nuovo. Le parole gentili generano gentilezza.'
  },
  {
    dayIt: 'Mercoledì',
    zh: '周三 · 星期三',
    ko: '수요일 (水)',
    quoteZh: '学而时习之，不亦说乎？',
    quoteKo: '백지장도 맞들면 낫다.',
    it: 'Imparare e praticare con costanza è vera gioia. L\'unione fa la forza.'
  },
  {
    dayIt: 'Giovedì',
    zh: '周四 · 星期四',
    ko: '목요일 (木)',
    quoteZh: '熟能生巧，勤能补拙。',
    quoteKo: '티끌 모아 태산.',
    it: 'La pratica rende perfetti. Goccia dopo goccia si crea una montagna.'
  },
  {
    dayIt: 'Venerdì',
    zh: '周五 · 星期五',
    ko: '금요일 (金)',
    quoteZh: '三人行，必有我师焉。',
    quoteKo: '우물을 파도 한 우물을 파라.',
    it: 'C\'è sempre da imparare da chi ci circonda. Concentrati con perseveranza.'
  },
  {
    dayIt: 'Sabato',
    zh: '周六 · 星期六',
    ko: '토요일 (土)',
    quoteZh: '业精于勤，荒于嬉。',
    quoteKo: '고진감래 (苦盡甘來).',
    it: 'L\'eccellenza nasce dalla dedizione. Dopo l\'amaro viene la dolcezza.'
  },
  {
    dayIt: 'Domenica',
    zh: '周日 · 星期日',
    ko: '일요일 (日)',
    quoteZh: '日日新，又日新。',
    quoteKo: '천 리 길도 한 걸음부터.',
    it: 'Rinnovati ogni giorno. Anche il cammino più lungo comincia dal primo passo.'
  }
];

// Orari completi della giornata (dalle 06:00 alle 24:00)
const FULL_HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
];

const PINYIN = ['ā', 'á', 'ǎ', 'à', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ō', 'ó', 'ǒ', 'ò', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ'];
const JAMO = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

export const UnifiedFlipBook: React.FC = () => {
  const [mode, setMode] = useState<BookMode>('agenda');
  const [dayIndex, setDayIndex] = useState(3); // Giovedì
  const [chinesePageIndex, setChinesePageIndex] = useState(0);
  const [koreanPageIndex, setKoreanPageIndex] = useState(0);
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null);
  const [sound, setSound] = useState(true);
  
  // Interactive Editing States
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [todoEditText, setTodoEditText] = useState('');

  const [editingScheduleHour, setEditingScheduleHour] = useState<string | null>(null);
  const [scheduleEditText, setScheduleEditText] = useState('');

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [habitEditText, setHabitEditText] = useState('');

  const [copied, setCopied] = useState(false);

  // Chinese Notebook Pages
  const [chinesePages, setChinesePages] = useState<{ id: string; title: string; content: string }[]>(() => {
    try {
      const saved = localStorage.getItem('bunko_zh_pages_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'zh-1',
        title: 'Pratica Tratti Hanzi · 永字八法',
        content: `【永字八法 · Otto Tratti Fondamentali】
一 侧 (cè) · 点 (diǎn)
二 勒 (lè) · 横 (héng)
三 努 (nǔ) · 竖 (shù)
四 趯 (tì) · 钩 (gōu)
五 策 (cè) · 提 (tí)
六 掠 (lüè) · 撇 (piě)
七 啄 (zhuó) · 短撇
八 磔 (zhé) · 捺 (nà)

【练习词汇】
- 学习 (xuéxí) · Studio
- 语言 (yǔyán) · Lingua
- 汉字 (hànzì) · Caratteri cinesi`
      },
      {
        id: 'zh-2',
        title: 'Note Grammaticali & Vocaboli · 语法笔记',
        content: `【把字句 结构】
主语 + 把 + 宾语 + 动词 + 其他成分
例：请把书给我。 (Per favore dammi il libro.)

【常用连词】
- 不但……而且…… (Non solo... ma anche...)
- 只要……就…… (Basta che... e...)`
      }
    ];
  });

  // Korean Notebook Pages
  const [koreanPages, setKoreanPages] = useState<{ id: string; title: string; content: string }[]>(() => {
    try {
      const saved = localStorage.getItem('bunko_ko_pages_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'ko-1',
        title: 'Manoscritto Wongoji · 원고지 작성 연습',
        content: `【원고지 쓰기 기본 규칙】
1. 첫 칸을 비우고 글을 시작합니다.
2. 단어와 단어 사이는 한 칸 띄웁니다 (띄어쓰기).
3. 마침표(.)는 칸의 왼쪽 구석에 씁니다.

【핵심 어휘】
- 한국어 공부 (Studio della lingua coreana)
- 원고지 연습 (Pratica su foglio Wongoji)
- 매일의 성실함 (Costanza quotidiana)`
      },
      {
        id: 'ko-2',
        title: 'Assimilazione & Batchim · 발음 규칙',
        content: `【받침 연음과 비음화】
1. 십육 -> [심뉵] (ㄴ 첨가 및 비음화)
2. 국물 -> [궁물] (ㄱ이 ㅁ 앞에서 ㅇ으로)
3. 독립 -> [동닙] (ㄹ의 비음화)

연습 문장:
한국어를 매일 조금씩 연습하면 자연스러워집니다.`
      }
    ];
  });

  // Agenda Day Data (all 7 days support full hours)
  const [agendaDays, setAgendaDays] = useState<Record<number, {
    schedule: Record<string, string>;
    habits: Record<string, boolean>;
    todos: { id: string; text: string; done: boolean }[];
    notes: string;
  }>>(() => {
    try {
      const s = localStorage.getItem('bunko_agenda_days_v4');
      if (s) return JSON.parse(s);
    } catch {}
    return {
      3: {
        schedule: {
          '07:00': 'Esercizi di respirazione & Ripasso flashcards',
          '08:00': 'Rassegna vocabolario e notizie bilingui',
          '09:00': 'Studio tratti Hanzi su Tianzige',
          '10:00': 'Scomposizione radicali su HanziCraft',
          '11:00': 'Esercizi di spaziatura Wongoji',
          '14:00': 'Ascolto podcast & pronuncia su Vocal Tutor',
          '16:00': 'Consultazione etimologica su Naver Dict',
          '18:00': 'Ripasso vocaboli su editor',
          '20:00': 'Lettura bilingue su Russo Audiobook',
          '21:00': 'Annotazioni serali e diario'
        },
        habits: {
          'Scrittura Hanzi (汉字)': true,
          'Pronuncia Hangul (한글)': true,
          'Ascolto quotidiano': false,
          'Lettura 15 min': true
        },
        todos: [
          { id: '1', text: 'Completare 5 righe su Tianzige', done: true },
          { id: '2', text: 'Ripassare regole di spaziatura 띄어쓰기', done: false },
          { id: '3', text: 'Esercizio comparato SVO vs SOV', done: true }
        ],
        notes: 'Oggi focus sulle consonanti doppie ㄲ, ㄸ, ㅃ e sui radicali 木 e 水.'
      }
    };
  });

  // Persist
  useEffect(() => {
    localStorage.setItem('bunko_zh_pages_v3', JSON.stringify(chinesePages));
  }, [chinesePages]);

  useEffect(() => {
    localStorage.setItem('bunko_ko_pages_v3', JSON.stringify(koreanPages));
  }, [koreanPages]);

  useEffect(() => {
    localStorage.setItem('bunko_agenda_days_v4', JSON.stringify(agendaDays));
  }, [agendaDays]);

  const currentAgenda = AGENDA_DAYS[dayIndex];
  const dayData = agendaDays[dayIndex] || { schedule: {}, habits: {}, todos: [], notes: '' };

  const currentZhPage = chinesePages[chinesePageIndex] || chinesePages[0];
  const currentKoPage = koreanPages[koreanPageIndex] || koreanPages[0];

  const handleFlip = (dir: 'next' | 'prev') => {
    if (flipping) return;
    playPageFlipSound(sound);
    setFlipping(dir);

    setTimeout(() => {
      if (mode === 'agenda') {
        setDayIndex((prev) => (dir === 'next' ? (prev + 1) % AGENDA_DAYS.length : (prev - 1 + AGENDA_DAYS.length) % AGENDA_DAYS.length));
      } else if (mode === 'chinese') {
        setChinesePageIndex((prev) => (dir === 'next' ? Math.min(prev + 1, chinesePages.length - 1) : Math.max(prev - 1, 0)));
      } else {
        setKoreanPageIndex((prev) => (dir === 'next' ? Math.min(prev + 1, koreanPages.length - 1) : Math.max(prev - 1, 0)));
      }
      setFlipping(null);
    }, 240);
  };

  // --- Schedule handlers (Edit & Delete) ---
  const startEditSchedule = (hr: string) => {
    setEditingScheduleHour(hr);
    setScheduleEditText(dayData.schedule[hr] || '');
  };

  const saveEditSchedule = (hr: string) => {
    setAgendaDays((prev) => ({
      ...prev,
      [dayIndex]: {
        ...dayData,
        schedule: { ...dayData.schedule, [hr]: scheduleEditText.trim() }
      }
    }));
    setEditingScheduleHour(null);
  };

  const deleteScheduleItem = (hr: string) => {
    setAgendaDays((prev) => {
      const nextSchedule = { ...dayData.schedule };
      delete nextSchedule[hr];
      return {
        ...prev,
        [dayIndex]: {
          ...dayData,
          schedule: nextSchedule
        }
      };
    });
    if (editingScheduleHour === hr) {
      setEditingScheduleHour(null);
    }
  };

  // --- To-Do handlers (Add, Toggle, Edit, Delete) ---
  const toggleTodo = (id: string) => {
    setAgendaDays((prev) => ({
      ...prev,
      [dayIndex]: {
        ...dayData,
        todos: dayData.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      }
    }));
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setAgendaDays((prev) => ({
      ...prev,
      [dayIndex]: {
        ...dayData,
        todos: [...dayData.todos, { id: String(Date.now()), text: newTodo.trim(), done: false }]
      }
    }));
    setNewTodo('');
  };

  const startEditTodo = (id: string, text: string) => {
    setEditingTodoId(id);
    setTodoEditText(text);
  };

  const saveEditTodo = (id: string) => {
    if (!todoEditText.trim()) {
      deleteTodo(id);
      return;
    }
    setAgendaDays((prev) => ({
      ...prev,
      [dayIndex]: {
        ...dayData,
        todos: dayData.todos.map((t) => (t.id === id ? { ...t, text: todoEditText.trim() } : t))
      }
    }));
    setEditingTodoId(null);
  };

  const deleteTodo = (id: string) => {
    setAgendaDays((prev) => ({
      ...prev,
      [dayIndex]: {
        ...dayData,
        todos: dayData.todos.filter((t) => t.id !== id)
      }
    }));
    if (editingTodoId === id) setEditingTodoId(null);
  };

  // --- Habit handlers (Add, Toggle, Edit, Delete) ---
  const toggleHabit = (h: string) => {
    setAgendaDays((prev) => ({
      ...prev,
      [dayIndex]: {
        ...dayData,
        habits: { ...dayData.habits, [h]: !dayData.habits[h] }
      }
    }));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    setAgendaDays((prev) => ({
      ...prev,
      [dayIndex]: {
        ...dayData,
        habits: { ...dayData.habits, [newHabitText.trim()]: false }
      }
    }));
    setNewHabitText('');
    setIsAddingHabit(false);
  };

  const saveEditHabit = (oldName: string) => {
    if (!habitEditText.trim() || habitEditText.trim() === oldName) {
      setEditingHabit(null);
      return;
    }
    setAgendaDays((prev) => {
      const nextHabits: Record<string, boolean> = {};
      Object.keys(dayData.habits).forEach((k) => {
        if (k === oldName) {
          nextHabits[habitEditText.trim()] = dayData.habits[oldName];
        } else {
          nextHabits[k] = dayData.habits[k];
        }
      });
      return {
        ...prev,
        [dayIndex]: {
          ...dayData,
          habits: nextHabits
        }
      };
    });
    setEditingHabit(null);
  };

  const deleteHabit = (h: string) => {
    setAgendaDays((prev) => {
      const nextHabits = { ...dayData.habits };
      delete nextHabits[h];
      return {
        ...prev,
        [dayIndex]: {
          ...dayData,
          habits: nextHabits
        }
      };
    });
    if (editingHabit === h) setEditingHabit(null);
  };

  // --- Notebook Handlers ---
  const updateZh = (content: string) => {
    setChinesePages((prev) => prev.map((p, i) => (i === chinesePageIndex ? { ...p, content } : p)));
  };

  const updateKo = (content: string) => {
    setKoreanPages((prev) => prev.map((p, i) => (i === koreanPageIndex ? { ...p, content } : p)));
  };

  const addZhPage = () => {
    playPageFlipSound(sound);
    const n = { id: `zh-${Date.now()}`, title: `Foglio Tianzige ${chinesePages.length + 1}`, content: '' };
    setChinesePages([...chinesePages, n]);
    setChinesePageIndex(chinesePages.length);
  };

  const addKoPage = () => {
    playPageFlipSound(sound);
    const n = { id: `ko-${Date.now()}`, title: `Foglio Wongoji ${koreanPages.length + 1}`, content: '' };
    setKoreanPages([...koreanPages, n]);
    setKoreanPageIndex(koreanPages.length);
  };

  const copyCurrentText = () => {
    const text = mode === 'chinese' ? currentZhPage.content : currentKoPage.content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col h-full bg-[#faede6] rounded-2xl border-2 border-[#d67b63] shadow-lg p-5">
      {/* Book Top Bar: Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#e8a996]">
        {/* Book Mode Tabs */}
        <div className="flex items-center p-1 bg-[#f0d1c5] rounded-xl border border-[#e8a996]">
          <button
            onClick={() => setMode('agenda')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'agenda'
                ? 'bg-[#faf0e4] text-[#d74b33] shadow-xs'
                : 'text-[#5a3328] hover:text-[#2d1814]'
            }`}
          >
            手帳 Agenda Tascabile
          </button>
          <button
            onClick={() => setMode('chinese')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'chinese'
                ? 'bg-[#faf0e4] text-[#d6831d] shadow-xs'
                : 'text-[#5a3328] hover:text-[#2d1814]'
            }`}
          >
            田字格 Quaderno Cinese
          </button>
          <button
            onClick={() => setMode('korean')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'korean'
                ? 'bg-[#faf0e4] text-[#257d8e] shadow-xs'
                : 'text-[#5a3328] hover:text-[#2d1814]'
            }`}
          >
            원고지 Quaderno Coreano
          </button>
        </div>

        {/* Navigation & Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSound(!sound)}
            title={sound ? 'Suono attivo' : 'Muto'}
            className="p-1.5 rounded-lg bg-[#f0d1c5] text-[#5a3328] hover:bg-[#e8a996] transition-colors"
          >
            {sound ? <Volume2 className="w-4 h-4 text-[#3a6d47]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleFlip('prev')}
            className="px-2.5 py-1 text-xs font-bold bg-[#faf0e4] hover:bg-[#f2e2d5] text-[#2d1814] rounded-lg border border-[#d8beaa] flex items-center gap-1 shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prec</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#2d1814] px-1">
            {mode === 'agenda' ? `${dayIndex + 1}/7` : mode === 'chinese' ? `${chinesePageIndex + 1}/${chinesePages.length}` : `${koreanPageIndex + 1}/${koreanPages.length}`}
          </span>

          <button
            onClick={() => handleFlip('next')}
            className="px-2.5 py-1 text-xs font-bold bg-[#faf0e4] hover:bg-[#f2e2d5] text-[#2d1814] rounded-lg border border-[#d8beaa] flex items-center gap-1 shadow-2xs"
          >
            <span>Succ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {mode === 'chinese' && (
            <button
              onClick={addZhPage}
              className="px-2.5 py-1 text-xs font-bold text-[#faf0e4] bg-[#d6831d] hover:bg-[#b86d14] rounded-lg shadow-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuovo Foglio</span>
            </button>
          )}

          {mode === 'korean' && (
            <button
              onClick={addKoPage}
              className="px-2.5 py-1 text-xs font-bold text-[#faf0e4] bg-[#257d8e] hover:bg-[#1c6472] rounded-lg shadow-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuovo Foglio</span>
            </button>
          )}
        </div>
      </div>

      {/* Realistic Book Container */}
      <div className="perspective-container relative flex-1 min-h-[620px]">
        {/* Silk Ribbon Bookmark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-14 bg-[#d74b33] rounded-b-sm shadow-md z-30 pointer-events-none transform -rotate-1 origin-top" />

        {/* Bound Book Exterior */}
        <div className="bg-[#4a241b] p-3 rounded-2xl shadow-2xl border-2 border-[#381a13] h-full flex flex-col">
          
          {/* ================= MODE 1: AGENDA ================= */}
          {mode === 'agenda' && (
            <div className={`grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden bg-[#faf0e4] border border-[#d8beaa] flex-1 preserve-3d transition-transform duration-200 ${
              flipping === 'prev' ? 'rotate-y-8 opacity-80' : flipping === 'next' ? '-rotate-y-8 opacity-80' : ''
            }`}>
              
              {/* Left Page (Verso) - Full Schedule (06:00 - 24:00) with Edit & Delete */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-[#d8beaa] book-spine-right flex flex-col justify-between">
                <div>
                  {/* Date Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#e2cfbe]">
                    <div>
                      <div className="text-xs font-bold text-[#d74b33] uppercase">
                        {currentAgenda.dayIt}
                      </div>
                      <div className="text-base font-bold font-serif-jp text-[#2d1814] flex items-center gap-2 mt-0.5">
                        <span>{currentAgenda.zh}</span>
                        <span className="text-xs font-normal text-[#257d8e] font-cjk-ko">{currentAgenda.ko}</span>
                      </div>
                    </div>
                    <span className="hanko-seal w-7 h-7 text-xs font-bold shadow-xs">
                      日
                    </span>
                  </div>

                  {/* Hourly schedule (Full timeline with Modifica & Elimina) */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5a3328] uppercase tracking-wider mb-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#d74b33]" />
                        <span>Orari Giornalieri (06:00 - 24:00)</span>
                      </div>
                      <span className="text-[10px] font-normal text-[#8a5345]">
                        Tasti ✏️ Modifica e 🗑️ Elimina
                      </span>
                    </div>

                    <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                      {FULL_HOURS.map((hr) => {
                        const val = dayData.schedule[hr] || '';
                        const isEditing = editingScheduleHour === hr;

                        return (
                          <div 
                            key={hr} 
                            className={`flex items-center gap-2 p-1 rounded-lg text-xs transition-colors ${
                              val ? 'bg-[#f5e3d4]/70 border border-[#e5cdbc]' : 'hover:bg-[#f6e6d8]'
                            }`}
                          >
                            <span className="font-mono text-[#8a5345] w-11 shrink-0 font-bold text-[11px]">
                              {hr}
                            </span>

                            {isEditing ? (
                              <div className="flex items-center gap-1 flex-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={scheduleEditText}
                                  onChange={(e) => setScheduleEditText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditSchedule(hr);
                                    if (e.key === 'Escape') setEditingScheduleHour(null);
                                  }}
                                  placeholder="Scrivi attività..."
                                  className="flex-1 px-2 py-0.5 text-xs bg-[#faf0e4] border border-[#d74b33] rounded text-[#2d1814] focus:outline-none"
                                />
                                <button
                                  onClick={() => saveEditSchedule(hr)}
                                  title="Salva modifica"
                                  className="p-1 rounded bg-[#3a6d47] text-white hover:bg-[#2d5738]"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setEditingScheduleHour(null)}
                                  title="Annulla"
                                  className="p-1 rounded bg-[#8a5345] text-white hover:bg-[#6e3e32]"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-1 flex-1 min-w-0">
                                <span 
                                  onClick={() => startEditSchedule(hr)}
                                  className={`truncate cursor-pointer flex-1 ${
                                    val ? 'text-[#2d1814] font-medium' : 'text-[#a37566] italic text-[11px]'
                                  }`}
                                >
                                  {val || '—'}
                                </span>

                                <div className="flex items-center gap-0.5 shrink-0">
                                  <button
                                    onClick={() => startEditSchedule(hr)}
                                    title={`Modifica orario ${hr}`}
                                    className="p-1 rounded hover:bg-[#ebd3c1] text-[#6e463a] hover:text-[#2d1814] transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>

                                  {val && (
                                    <button
                                      onClick={() => deleteScheduleItem(hr)}
                                      title={`Elimina orario ${hr}`}
                                      className="p-1 rounded hover:bg-[#f7d5cc] text-[#b83823] transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Habits Tracker (With Add, Edit, Delete) */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5a3328] uppercase tracking-wider mb-2">
                      <span>Abitudini di Studio</span>
                      <button
                        onClick={() => setIsAddingHabit(true)}
                        className="text-[10px] font-bold text-[#d74b33] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Aggiungi</span>
                      </button>
                    </div>

                    {/* New Habit Form */}
                    {isAddingHabit && (
                      <form onSubmit={addHabit} className="flex items-center gap-1 mb-2">
                        <input
                          type="text"
                          autoFocus
                          value={newHabitText}
                          onChange={(e) => setNewHabitText(e.target.value)}
                          placeholder="Nome abitudine..."
                          className="flex-1 px-2 py-1 text-xs bg-[#f4e4d6] border border-[#d74b33] rounded text-[#2d1814] focus:outline-none"
                        />
                        <button type="submit" className="p-1 px-2 bg-[#3a6d47] text-white rounded text-xs font-bold">
                          Salva
                        </button>
                        <button type="button" onClick={() => setIsAddingHabit(false)} className="p-1 px-2 bg-[#8a5345] text-white rounded text-xs">
                          Annulla
                        </button>
                      </form>
                    )}

                    <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                      {Object.keys(dayData.habits).map((h) => {
                        const checked = !!dayData.habits[h];
                        const isEditing = editingHabit === h;

                        return (
                          <div
                            key={h}
                            className="flex items-center justify-between gap-1 text-xs text-[#2d1814] p-1 rounded hover:bg-[#f4e4d6] group"
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-1 flex-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={habitEditText}
                                  onChange={(e) => setHabitEditText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditHabit(h);
                                    if (e.key === 'Escape') setEditingHabit(null);
                                  }}
                                  className="flex-1 px-2 py-0.5 text-xs bg-[#faf0e4] border border-[#d74b33] rounded text-[#2d1814] focus:outline-none"
                                />
                                <button
                                  onClick={() => saveEditHabit(h)}
                                  className="p-1 rounded bg-[#3a6d47] text-white"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setEditingHabit(null)}
                                  className="p-1 rounded bg-[#8a5345] text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div
                                  onClick={() => toggleHabit(h)}
                                  className="flex items-center gap-2 cursor-pointer select-none flex-1 min-w-0"
                                >
                                  {checked ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-[#3a6d47] shrink-0" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-[#9c6a5d] shrink-0" />
                                  )}
                                  <span className={`truncate ${checked ? 'line-through text-[#8a5345]' : 'font-medium'}`}>
                                    {h}
                                  </span>
                                </div>

                                <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                                  <button
                                    onClick={() => {
                                      setEditingHabit(h);
                                      setHabitEditText(h);
                                    }}
                                    title="Modifica abitudine"
                                    className="p-1 rounded hover:bg-[#ebd3c1] text-[#6e463a]"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteHabit(h)}
                                    title="Elimina abitudine"
                                    className="p-1 rounded hover:bg-[#f7d5cc] text-[#b83823]"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-[#e2cfbe] text-[11px] text-[#8a5345] flex items-center justify-between">
                  <span>Agenda Tascabile · Giorno {dayIndex + 1} di 7</span>
                  <span className="font-serif-jp text-xs text-[#d74b33]">文庫手帳</span>
                </div>
              </div>

              {/* Right Page (Recto) - Tasks (with Edit & Delete) & Quotes & Notes */}
              <div className="p-5 book-spine-crease flex flex-col justify-between relative">
                <div>
                  {/* Daily Quote Box */}
                  <div className="p-3 bg-[#f5e3d4] border border-[#d8beaa] rounded-lg mb-4 shadow-2xs">
                    <div className="text-xs font-bold text-[#d74b33] font-serif-jp">
                      {currentAgenda.quoteZh}
                    </div>
                    <div className="text-xs font-bold text-[#257d8e] font-cjk-ko mt-0.5">
                      {currentAgenda.quoteKo}
                    </div>
                    <div className="text-[11px] text-[#5a3328] italic mt-1 leading-snug">
                      {currentAgenda.it}
                    </div>
                  </div>

                  {/* To-Do Checklist (With Edit & Delete buttons) */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5a3328] uppercase tracking-wider mb-2">
                      <span>Compiti di Oggi</span>
                      <span className="text-[10px] text-[#8a5345]">
                        {dayData.todos.filter(t => t.done).length}/{dayData.todos.length} completati
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {dayData.todos.map((todo) => {
                        const isEditing = editingTodoId === todo.id;

                        return (
                          <div 
                            key={todo.id} 
                            className="flex items-center justify-between gap-1 p-1 rounded-lg hover:bg-[#f4e4d6] text-xs group"
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-1 flex-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={todoEditText}
                                  onChange={(e) => setTodoEditText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditTodo(todo.id);
                                    if (e.key === 'Escape') setEditingTodoId(null);
                                  }}
                                  className="flex-1 px-2 py-0.5 text-xs bg-[#faf0e4] border border-[#d74b33] rounded text-[#2d1814] focus:outline-none"
                                />
                                <button
                                  onClick={() => saveEditTodo(todo.id)}
                                  title="Salva"
                                  className="p-1 rounded bg-[#3a6d47] text-white"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setEditingTodoId(null)}
                                  title="Annulla"
                                  className="p-1 rounded bg-[#8a5345] text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div 
                                  onClick={() => toggleTodo(todo.id)} 
                                  className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                                >
                                  {todo.done ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-[#3a6d47] shrink-0" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-[#9c6a5d] shrink-0" />
                                  )}
                                  <span className={`truncate ${todo.done ? 'line-through text-[#8a5345]' : 'text-[#2d1814]'}`}>
                                    {todo.text}
                                  </span>
                                </div>

                                <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                                  <button
                                    onClick={() => startEditTodo(todo.id, todo.text)}
                                    title="Modifica compito"
                                    className="p-1 rounded hover:bg-[#ebd3c1] text-[#6e463a] hover:text-[#2d1814] transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>

                                  <button
                                    onClick={() => deleteTodo(todo.id)}
                                    title="Elimina compito"
                                    className="p-1 rounded hover:bg-[#f7d5cc] text-[#b83823] transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Add To-Do Form */}
                    <form onSubmit={addTodo} className="flex items-center gap-1.5 mt-2">
                      <input
                        type="text"
                        placeholder="Nuovo compito..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-[#f4e4d6] border border-[#d8beaa] rounded-lg text-[#2d1814] placeholder-[#9c6a5d] focus:outline-none focus:border-[#d74b33]"
                      />
                      <button 
                        type="submit" 
                        className="px-2.5 py-1 text-xs font-bold text-[#faf0e4] bg-[#d74b33] hover:bg-[#b83823] rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Aggiungi</span>
                      </button>
                    </form>
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5a3328] uppercase tracking-wider mb-1">
                      <span>Appunti del Giorno</span>
                      {dayData.notes && (
                        <button
                          onClick={() => {
                            setAgendaDays((prev) => ({
                              ...prev,
                              [dayIndex]: { ...dayData, notes: '' }
                            }));
                          }}
                          className="text-[10px] text-[#b83823] hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Cancella appunti</span>
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={dayData.notes}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAgendaDays((prev) => ({
                          ...prev,
                          [dayIndex]: { ...dayData, notes: val }
                        }));
                      }}
                      placeholder="Scrivi qui i tuoi pensieri, vocaboli o riflessioni..."
                      className="w-full p-2.5 text-xs bg-[#f4e4d6] border border-[#d8beaa] rounded-lg text-[#2d1814] placeholder-[#9c6a5d] focus:outline-none focus:border-[#d74b33] resize-none font-serif-jp"
                    />
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-[#e2cfbe] flex items-center justify-between text-[11px] text-[#8a5345]">
                  <span>Pagina {dayIndex * 2 + 2}</span>
                  <span className="font-serif-jp text-xs text-[#257d8e]">秋水文社</span>
                </div>

                {/* Dog-Ear Flip Corner */}
                <div
                  onClick={() => handleFlip('next')}
                  title="Sfoglia giorno successivo"
                  className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer group"
                >
                  <div className="w-0 h-0 border-t-0 border-l-[32px] border-l-transparent border-b-[32px] border-b-[#cbb49e] group-hover:border-b-[#d74b33] transition-colors" />
                </div>
              </div>

            </div>
          )}

          {/* ================= MODE 2: QUADERNO CINESE (TIANZIGE) ================= */}
          {mode === 'chinese' && (
            <div className={`flex flex-col flex-1 rounded-xl overflow-hidden bg-[#faf0e4] border border-[#d8beaa] p-6 preserve-3d transition-transform duration-200 relative ${
              flipping === 'prev' ? 'rotate-y-8 opacity-80' : flipping === 'next' ? '-rotate-y-8 opacity-80' : ''
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2cfbe]">
                <div>
                  <span className="text-[11px] font-bold text-[#d6831d] uppercase">CARTA GRIGLIATA CINESE</span>
                  <input
                    type="text"
                    value={currentZhPage.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setChinesePages((prev) => prev.map((p, i) => (i === chinesePageIndex ? { ...p, title: t } : p)));
                    }}
                    className="text-lg font-bold font-serif-jp text-[#2d1814] bg-transparent focus:outline-none block w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCurrentText}
                    className="p-1.5 rounded-lg bg-[#f4e4d6] hover:bg-[#ecd4c3] text-[#2d1814] transition-colors"
                    title="Copia testo"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#3a6d47]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {chinesePages.length > 1 && (
                    <button
                      onClick={() => {
                        const nextPages = chinesePages.filter((_, i) => i !== chinesePageIndex);
                        setChinesePages(nextPages);
                        setChinesePageIndex(Math.max(0, chinesePageIndex - 1));
                      }}
                      className="p-1.5 rounded-lg bg-[#fae4dc] hover:bg-[#f7d1c4] text-[#b83823] transition-colors"
                      title="Elimina foglio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tianzige Grid Writing Surface */}
              <div className="flex-1 rounded-lg border-2 border-[#e8a996] p-4 tianzige-grid">
                <textarea
                  value={currentZhPage.content}
                  onChange={(e) => updateZh(e.target.value)}
                  placeholder="Scrivi qui i tuoi caratteri cinesi Hanzi su griglia Tianzige..."
                  className="w-full h-full min-h-[340px] bg-transparent text-[#2d1814] font-serif-jp text-base leading-relaxed focus:outline-none resize-none"
                  style={{ lineHeight: '40px', letterSpacing: '2px' }}
                />
              </div>

              {/* Pinyin Toolbar */}
              <div className="pt-3 mt-3 border-t border-[#e2cfbe]">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <span className="text-[11px] font-bold text-[#d6831d] mr-1 uppercase">Pinyin:</span>
                  {PINYIN.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateZh((currentZhPage.content || '') + c)}
                      className="px-1.5 py-0.5 bg-[#f4e4d6] hover:bg-[#ecd4c3] text-[#2d1814] rounded border border-[#d8beaa] font-serif-jp text-xs transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dog-Ear */}
              <div
                onClick={() => handleFlip('next')}
                title="Sfoglia al foglio successivo"
                className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer group"
              >
                <div className="w-0 h-0 border-t-0 border-l-[32px] border-l-transparent border-b-[32px] border-b-[#cbb49e] group-hover:border-b-[#d6831d] transition-colors" />
              </div>
            </div>
          )}

          {/* ================= MODE 3: QUADERNO COREANO (WONGOJI) ================= */}
          {mode === 'korean' && (
            <div className={`flex flex-col flex-1 rounded-xl overflow-hidden bg-[#faf0e4] border border-[#d8beaa] p-6 preserve-3d transition-transform duration-200 relative ${
              flipping === 'prev' ? 'rotate-y-8 opacity-80' : flipping === 'next' ? '-rotate-y-8 opacity-80' : ''
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2cfbe]">
                <div>
                  <span className="text-[11px] font-bold text-[#257d8e] uppercase">CARTA MANOSCRITTO COREANA</span>
                  <input
                    type="text"
                    value={currentKoPage.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setKoreanPages((prev) => prev.map((p, i) => (i === koreanPageIndex ? { ...p, title: t } : p)));
                    }}
                    className="text-lg font-bold font-serif-jp text-[#2d1814] bg-transparent focus:outline-none block w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCurrentText}
                    className="p-1.5 rounded-lg bg-[#f4e4d6] hover:bg-[#ecd4c3] text-[#2d1814] transition-colors"
                    title="Copia testo"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#3a6d47]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {koreanPages.length > 1 && (
                    <button
                      onClick={() => {
                        const nextPages = koreanPages.filter((_, i) => i !== koreanPageIndex);
                        setKoreanPages(nextPages);
                        setKoreanPageIndex(Math.max(0, koreanPageIndex - 1));
                      }}
                      className="p-1.5 rounded-lg bg-[#fae4dc] hover:bg-[#f7d1c4] text-[#b83823] transition-colors"
                      title="Elimina foglio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Wongoji Grid Writing Surface */}
              <div className="flex-1 rounded-lg border-2 border-[#93cbd6] p-4 wongoji-grid">
                <textarea
                  value={currentKoPage.content}
                  onChange={(e) => updateKo(e.target.value)}
                  placeholder="Scrivi qui i tuoi testi coreani Hangul rispettando le caselle Wongoji..."
                  className="w-full h-full min-h-[340px] bg-transparent text-[#2d1814] font-serif-jp text-base leading-relaxed focus:outline-none resize-none"
                  style={{ lineHeight: '42px', letterSpacing: '3px' }}
                />
              </div>

              {/* Hangul Jamo Toolbar */}
              <div className="pt-3 mt-3 border-t border-[#e2cfbe]">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <span className="text-[11px] font-bold text-[#257d8e] mr-1 uppercase">Hangul:</span>
                  {JAMO.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateKo((currentKoPage.content || '') + c)}
                      className="px-1.5 py-0.5 bg-[#f4e4d6] hover:bg-[#ecd4c3] text-[#2d1814] rounded border border-[#d8beaa] font-cjk-ko text-xs transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dog-Ear */}
              <div
                onClick={() => handleFlip('next')}
                title="Sfoglia al foglio successivo"
                className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer group"
              >
                <div className="w-0 h-0 border-t-0 border-l-[32px] border-l-transparent border-b-[32px] border-b-[#cbb49e] group-hover:border-b-[#257d8e] transition-colors" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
