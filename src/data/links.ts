/**
 * =========================================================================
 * I TUOI LINK DEGLI EDITOR DI LINGUA
 * =========================================================================
 * Tutti i 9 collegamenti reali configurati con i loro indirizzi web.
 * Cliccando su "Apri" o sul listello, l'editor si apre direttamente.
 * =========================================================================
 */

export interface EditorLinkItem {
  id: string;
  title: string;
  nativeTitle: string;
  kanjiChar: string; // Carattere calligrafico nel sigillo
  url: string; // Link reale all'editor
  language: 'zh' | 'ko' | 'dual';
  categoryLabel: string;
  description: string;
  color: {
    accent: string;
    bg: string;
    border: string;
    text: string;
  };
}

export const MY_EDITOR_LINKS: EditorLinkItem[] = [
  {
    id: 'editor-multilingua',
    title: 'Editor Multilingua',
    nativeTitle: '多语言编辑器 · 다국어 에디터',
    kanjiChar: '編',
    url: 'https://editor-multiligua.netlify.app/',
    language: 'dual',
    categoryLabel: 'Editor Multilingue',
    description: 'Ambiente di redazione e composizione multilingue con supporto per caratteri orientali.',
    color: {
      accent: '#d74b33',
      bg: '#fae4dc',
      border: '#e8a996',
      text: '#8f2917'
    }
  },
  {
    id: 'hanzicraft',
    title: 'HanziCraft Dashboard',
    nativeTitle: '汉字工坊 · 拆解与部首',
    kanjiChar: '筆',
    url: 'https://hanzicraft.com/dashboard',
    language: 'zh',
    categoryLabel: 'Scomposizione Hanzi',
    description: 'Scomposizione analitica dei caratteri cinesi in radicali e componenti fonetici.',
    color: {
      accent: '#d6831d',
      bg: '#fcf1dc',
      border: '#f2cc8d',
      text: '#8c5208'
    }
  },
  {
    id: 'dong-chinese',
    title: 'Dong Chinese Wiki',
    nativeTitle: '汉字源流 · 词源字海',
    kanjiChar: '字',
    url: 'https://www.dong-chinese.com/wiki',
    language: 'zh',
    categoryLabel: 'Etimologia Cinese',
    description: 'Origine storica, evoluzione, albero dei componenti e frequenza d\'uso degli Hanzi.',
    color: {
      accent: '#3a6d47',
      bg: '#e4f2e8',
      border: '#a9d4b5',
      text: '#204d2b'
    }
  },
  {
    id: 'naver-dict',
    title: 'Dizionario Naver',
    nativeTitle: '네이버 사전 · 漢字',
    kanjiChar: '辭',
    url: 'https://dict.naver.com/',
    language: 'ko',
    categoryLabel: 'Dizionario & Lessico',
    description: 'Dizionario principale per vocaboli coreani, pronuncia, hanja ed esempi d\'uso reali.',
    color: {
      accent: '#257d8e',
      bg: '#dcf0f4',
      border: '#93cbd6',
      text: '#135460'
    }
  },
  {
    id: 'hanja-hangul-studio',
    title: 'Hanja & Hangul Studio',
    nativeTitle: '한자 · 한글 스튜디오',
    kanjiChar: '韓',
    url: 'https://hanja-hangul-studio.netlify.app/',
    language: 'ko',
    categoryLabel: 'Studio Hanja-Hangul',
    description: 'Spazio di lavoro per la corrispondenza e conversione tra ideogrammi Hanja e sillabe Hangul.',
    color: {
      accent: '#735099',
      bg: '#f0e6f7',
      border: '#cfb5e3',
      text: '#4d2d70'
    }
  },
  {
    id: 'russo-audiobook',
    title: 'Russo Audiobook Studio',
    nativeTitle: 'Аудиокнига · 听书',
    kanjiChar: '聲',
    url: 'https://russo-audiobook.netlify.app/',
    language: 'dual',
    categoryLabel: 'Audiolibri & Ascolto',
    description: 'Studio per l\'ascolto immersivo, audiolibri e pratica di lettura multilingue.',
    color: {
      accent: '#bf3f63',
      bg: '#fce3eb',
      border: '#f5afc5',
      text: '#7e1e38'
    }
  },
  {
    id: 'asiantext-designer',
    title: 'Asian Text Designer',
    nativeTitle: '东方排版 · 아시아 텍스트',
    kanjiChar: '組',
    url: 'https://asiantext-designer.vercel.app/',
    language: 'dual',
    categoryLabel: 'Tipografia Asiatica',
    description: 'Strumento per il design del testo, formattazione e composizione tipografica orientale.',
    color: {
      accent: '#cb5d24',
      bg: '#fae8dc',
      border: '#f0bfa0',
      text: '#8a380e'
    }
  },
  {
    id: 'vocaltutor',
    title: 'Vocal Tutor',
    nativeTitle: '发音导师 · 음성 튜터',
    kanjiChar: '音',
    url: 'https://vocaltutor.vercel.app/',
    language: 'dual',
    categoryLabel: 'Tutor Fonetica & Voce',
    description: 'Esercitazione vocale per la corretta pronuncia dei toni cinesi e della fonetica coreana.',
    color: {
      accent: '#d6831d',
      bg: '#fcf1dc',
      border: '#f2cc8d',
      text: '#8c5208'
    }
  },
  {
    id: 'scriba-multilingua',
    title: 'Scriba Multilingua',
    nativeTitle: '多语书写者 · 다국어 서기',
    kanjiChar: '書',
    url: 'https://scriba-multilinga.netlify.app/',
    language: 'dual',
    categoryLabel: 'Redazione & Scrittura',
    description: 'Tavolo di scrittura e redazione per bozze e composizioni in lingue multiple.',
    color: {
      accent: '#b83b54',
      bg: '#fae4ea',
      border: '#e8a9b9',
      text: '#7a192e'
    }
  }
];
