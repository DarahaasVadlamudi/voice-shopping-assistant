# Approach (≤200 words)

**Voice:** Browser Web Speech API (SpeechRecognition) for microphone input and multilingual support. No backend required; works in Chrome/Edge.

**NLP:** Pattern-based parsing in `nlp.ts`: regex for “add/remove/search” intent, optional quantity (e.g. “add 2 milk”), and filters (price “under $5”, “organic X”). Easy to extend with more phrases or an external NLU later.

**List & suggestions:** React state plus localStorage for persistence. Categories are inferred from item keywords (dairy, produce, etc.). Suggestions: (1) history from past adds, (2) seasonal list by month, (3) substitutes map (e.g. milk → almond milk). One-click “Add” from suggestions.

**Search/filter:** Voice commands set search query and optional max price; list is filtered in the UI. Category dropdown and text search allow the same without voice.

**UX:** Minimal layout, real-time feedback (interim transcript, success/error toasts), loading/processing state on the mic button, mobile-friendly layout and touch targets. Clear list and quantity +/- for full list management.

**Deploy:** Static build (`npm run build`); host `dist` on Vercel, Netlify, or Firebase Hosting.
