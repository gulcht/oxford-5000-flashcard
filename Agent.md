# Oxford 5000 Flashcard - Codebase Documentation (Agent.md)

This document provides a comprehensive overview of the architecture, folder structure, and operational logic of the **Oxford 5000 Flashcard** project. It serves as a guide for developers and agents to understand the system and build extensions.

---

## 📋 System Overview

The project is a web-based **Flashcard Application** designed to help users learn English vocabulary using the standard **Oxford 5000** wordlist. The app features native audio pronunciations, Thai translations, dark/light mode compatibility, responsive layouts, and an automated slideshow mode (autoplay).

---

## 🛠️ Tech Stack & Libraries

- **Framework**: Next.js 16.2.6 (App Router) & React 19
- **Styling**: TailwindCSS 3.4.17
- **UI Components**: shadcn/ui (Radix UI primitives) including Card, Button, Tooltip, Dropdown Menu, etc.
- **Icons**: Lucide React
- **Theme Management**: `next-themes` (Dark/Light mode)
- **Package Manager**: npm/pnpm

---

## 📂 Folder Structure

```text
oxford-5000-flashcard/
├── app/                        # Next.js App Router root
│   ├── globals.css             # Main stylesheet & custom CSS variables
│   ├── layout.tsx              # Root HTML structure and ThemeProvider wrapper
│   └── page.tsx                # Entry page rendering the FlashcardWidget
├── components/                 # React components
│   ├── ui/                     # Pre-packaged shadcn/ui components
│   ├── flashcard-widget.tsx    # Core flashcard application widget
│   ├── theme-provider.tsx      # theme-provider wrapper for next-themes
│   └── theme-toggle.tsx        # Toggle button for dark/light mode
├── public/                     # Public static assets
│   └── data/
│       └── oxford-5000.json    # Oxford 5000 vocab dataset (~6.9MB)
└── package.json                # Dependencies and scripts definitions
```

---

## 💾 Vocabulary Data Structure (`oxford-5000.json`)

The vocabulary database contains a JSON array of words. Each entry follows this structure:

```json
{
  "id": 1,
  "value": {
    "word": "abandon",
    "href": "https://www.oxfordlearnersdictionaries.com/definition/english/abandon_1",
    "type": "verb",
    "level": "B2",
    "us": {
      "mp3": "https://www.oxfordlearnersdictionaries.com/media/english/us_pron/a/aba/aband/abandon__us_2.mp3",
      "ogg": "https://www.oxfordlearnersdictionaries.com/media/english/us_pron_ogg/a/aba/aband/abandon__us_2.ogg"
    },
    "uk": {
      "mp3": "https://www.oxfordlearnersdictionaries.com/media/english/uk_pron/a/aba/aband/abandon__gb_2.mp3",
      "ogg": "https://www.oxfordlearnersdictionaries.com/media/english/uk_pron_ogg/a/aba/aband/abandon__gb_2.ogg"
    },
    "phonetics": {
      "us": "/əˈbændən/",
      "uk": "/əˈbændən/"
    },
    "examples": [
      "abandon somebody: The baby had been abandoned by its mother.",
      "People often simply abandon their pets when they go abroad."
    ],
    "thai": ["ละทิ้ง", "ทอดทิ้ง"]
  }
}
```

---

## ⚙️ Core Component Details

### 1. `components/flashcard-widget.tsx` (Core Logic)
This is the main stateful controller for the app:
- **Data Loading**: Fetches the vocabulary data from `/data/oxford-5000.json` on client mount using `fetch`.
- **State Management**:
  - `currentIndex`: Controls the current word being viewed.
  - `isPlaying`: Tracks whether the autoplay carousel is active.
  - `accent`: Chooses either US (`us`) or UK (`uk`) accent configurations.
- **Autoplay Slideshow**:
  - When `isPlaying` is true, a `setInterval` is triggered to advance the `currentIndex` every **7 seconds**.
- **Audio Pronunciation**:
  - Plays the corresponding MP3 file using the browser's `new Audio(url).play()` method.
  - **Fallback System**: In case of browser blockages (autoplay block policies) or broken links, it falls back to the native **Web Speech Synthesis API** (`speechSynthesis`) using the correct locale voice setup.
- **Dynamic Color Schemes**:
  - Maps CEFR Levels (`A1` to `C2`) and Parts of Speech (e.g., `noun`, `verb`, `adjective`) to specific CSS tailwind styles matching the theme modes.
- **Thai Translations**:
  - Reads and displays Thai translations from the optional `thai` array.

### 2. `components/theme-toggle.tsx`
- Connects to `next-themes` system using `useTheme`.
- Swaps the `<html>` element class between `light` and `dark`.
- Mitigates **hydration mismatch issues** by mounting components on the client-side using a standard `useEffect` gate.

### 3. `app/layout.tsx` & `globals.css`
- Configures default system themes, handles hydration warnings suppression, and defines SEO metadata headers (Title: `Oxford 5000 | EN-TH Flashcards`).
- `globals.css` configures raw layout adjustments and custom Tailwind variables for styling consistency.

---

## 🎯 Future Extension Ideas

1. **Filtering system**: Enable users to filter words by specific CEFR Levels or Parts of Speech.
2. **Search Bar**: Add search functionalities to find specific words or translations.
3. **Shuffle Mechanism**: Add a shuffle mode to randomize the order of the vocabulary cards.
4. **Thai Translations for Examples**: Translate example sentences into Thai.
5. **Favorites/Bookmarks**: Allow users to save cards to a custom list for focused studying.
