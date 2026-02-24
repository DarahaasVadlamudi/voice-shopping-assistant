# Voice Command Shopping Assistant

A voice-based shopping list manager with smart suggestions. Add, remove, and search items using natural speech (e.g. “Add milk”, “Remove bread”, “Find organic apples”). Optimized for mobile and voice-only use.

## Features

- **Voice input**: Add/remove items and search using the Web Speech API. Supports multiple languages (EN, ES, FR, DE, HI, AR).
- **NLP**: Parses varied phrases like “I need bananas”, “Add 2 bottles of water”, “Remove milk from my list”.
- **Smart suggestions**: History-based (“You often buy X”), seasonal items, and substitutes (e.g. almond milk for milk).
- **List management**: Add, remove, quantity controls, and automatic categorization (dairy, produce, bakery, etc.).
- **Voice search**: “Find me organic apples”, “toothpaste under $5” to filter the list by text and optional price.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). Use **Chrome or Edge** for voice recognition; other browsers may not support the Speech API.

## Build & deploy

```bash
npm run build
npm run preview   # test production build locally
```

Deploy the `dist` folder to any static host. Options below.

### Deploy on AWS (cloud)

The app is static (HTML/JS/CSS only), so it fits **AWS** and other cloud static hosting.

**Option A: AWS Amplify Hosting** (simplest)

1. Install Amplify CLI: `npm install -g @aws-amplify/cli` and run `amplify configure` if needed.
2. In the project folder: `amplify init`, then `amplify add hosting` → choose **Hosting with Amplify Console** (manual deploy).
3. Build: `npm run build`.
4. In [AWS Amplify Console](https://console.aws.amazon.com/amplify/): create app → deploy without Git by uploading the `dist` folder (zip it first), or connect your GitHub repo and set build command `npm run build` and output directory `dist`.
5. Your app URL will be like `https://main.xxxx.amplifyapp.com`.

**Option B: S3 + CloudFront**

1. Create an S3 bucket, enable **Static website hosting**, set index document to `index.html`.
2. Upload the contents of `dist` to the bucket (make sure `index.html` is in the root).
3. (Recommended) Create a CloudFront distribution with the S3 website endpoint as origin. Set **Default Root Object** to `index.html` and add a custom error response: HTTP 403/404 → respond with `index.html` (200) so client-side routing works if you add it later.
4. Use the CloudFront URL (or your custom domain) to access the app.

**Option C: AWS Elastic Beanstalk**

You can serve the `dist` folder with a small Node/Express (or nginx) app and deploy that to Elastic Beanstalk, but for a static SPA, Amplify or S3 + CloudFront is simpler.

### Other cloud / static hosts

- **Vercel**: `npx vercel` in the project (set build command `npm run build`, output `dist`).
- **Netlify**: Drag-and-drop the `dist` folder in the Netlify dashboard, or connect Git and set build command `npm run build`, publish directory `dist`.
- **Firebase Hosting**: `npm i -g firebase-tools`, `firebase init hosting` (set public directory to `dist`), `npm run build`, then `firebase deploy`.
- **Google Cloud**: Upload `dist` to a Cloud Storage bucket and optionally put it behind a load balancer or use Firebase Hosting.
- **Azure**: Use **Azure Static Web Apps**; connect the repo and set build to `npm run build` and app location to `dist`.

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for layout and styling
- **Web Speech API** for voice (no backend required)
- **localStorage** for list and history persistence
- Regex-based **NLP** for add/remove/search intent and quantity extraction

## Project structure

- `src/App.tsx` – Main UI and voice/list wiring
- `src/components/` – VoiceButton, ShoppingList, Suggestions, FeedbackBar
- `src/hooks/` – useSpeechRecognition, useSuggestions
- `src/store/useShoppingList.ts` – List state and localStorage
- `src/utils/nlp.ts` – Voice command parsing
- `src/data/` – Categories, substitutes, seasonal suggestions

## Browser support

Voice recognition works in **Chrome** and **Edge** (desktop and Android). Safari and Firefox have limited or no support; the app still works with the text “Add item” field and suggestions.
=======
# voice-shopping-assistant
A voice-driven shopping assistant that uses speech-to-text and basic NLP to understand commands, manage items, handle quantities, and offer simple suggestions. It provides a minimal UI with real-time feedback and is deployed on AWS for fast, reliable performance within a lightweight, scalable setup.
It combines speech-to-text processing with lightweight NLP to understand flexible phrases such as “Add milk,” “I need apples,” or “Buy two packets of rice.” Users can add, remove, or update items, and the system automatically extracts quantities and categorizes items for a more organized list.
The assistant includes a simple suggestion mechanism that recommends commonly purchased or relevant items based on basic patterns and recent activity. A clean, minimalist interface provides real-time visual feedback for every recognized command, ensuring the user always knows what the system understood.

