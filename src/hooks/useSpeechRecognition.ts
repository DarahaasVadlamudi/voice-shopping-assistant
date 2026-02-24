import { useCallback, useRef, useState } from 'react';

const SpeechRecognitionAPI =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition);

export const LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'es-ES', label: 'Español' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'ar-SA', label: 'العربية' },
] as const;

export type SpeechStatus = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';

export function useSpeechRecognition(onResult: (transcript: string) => void, lang: string = 'en-US') {
  const [status, setStatus] = useState<SpeechStatus>(SpeechRecognitionAPI ? 'idle' : 'unsupported');
  const [error, setError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const start = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setStatus('unsupported');
      setError('Voice recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    setError(null);
    setInterimTranscript('');
    setStatus('listening');

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i];
        const t = r[0].transcript;
        if (r.isFinal) final += t;
        else interim += t;
      }
      if (final) {
        setStatus('processing');
        setInterimTranscript('');
        onResult(final.trim());
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onend = () => {
      if (status === 'listening') setStatus('idle');
      recognitionRef.current = null;
    };

    recognition.onerror = (e: { error: string }) => {
      if (e.error === 'aborted') return;
      setStatus('error');
      setError(e.error === 'no-speech' ? 'No speech detected. Try again.' : `Error: ${e.error}`);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      setStatus('error');
      setError('Could not start microphone.');
    }
  }, [lang, onResult, status]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setStatus('idle');
    setInterimTranscript('');
  }, []);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { start, stop, status, error, interimTranscript, resetStatus, isSupported: !!SpeechRecognitionAPI };
}
