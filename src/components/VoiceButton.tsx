import type { SpeechStatus } from '../hooks/useSpeechRecognition';

interface VoiceButtonProps {
  status: SpeechStatus;
  onClick: () => void;
  disabled?: boolean;
  lang: string;
  onLangChange: (lang: string) => void;
  languages: readonly { code: string; label: string }[];
}

export function VoiceButton({
  status,
  onClick,
  disabled,
  lang,
  onLangChange,
  languages,
}: VoiceButtonProps) {
  const isListening = status === 'listening';
  const isProcessing = status === 'processing';

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-xs text-slate-400">Language</label>
      <select
        value={lang}
        onChange={(e) => onLangChange(e.target.value)}
        className="rounded-lg bg-slate-700/80 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
        aria-label="Select language"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || status === 'unsupported'}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        className={`
          flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-sky-400/50
          ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}
          ${isProcessing ? 'bg-amber-500' : ''}
          ${!isListening && !isProcessing && status !== 'unsupported' ? 'bg-sky-500 hover:bg-sky-600' : ''}
          ${status === 'unsupported' ? 'cursor-not-allowed bg-slate-600 opacity-60' : ''}
          ${status === 'error' ? 'bg-red-500/80' : ''}
        `}
      >
        <svg
          className="h-8 w-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          {isListening ? (
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          ) : (
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          )}
        </svg>
      </button>
      <span className="text-xs text-slate-400">
        {isListening && 'Listening…'}
        {isProcessing && 'Processing…'}
        {status === 'idle' && 'Tap to speak'}
        {status === 'error' && 'Try again'}
        {status === 'unsupported' && 'Not supported'}
      </span>
    </div>
  );
}
