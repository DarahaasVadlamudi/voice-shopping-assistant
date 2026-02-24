interface FeedbackBarProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function FeedbackBar({ message, type }: FeedbackBarProps) {
  const styles = {
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    error: 'bg-red-500/20 text-red-300 border-red-500/40',
    info: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  };

  return (
    <div
      className={`rounded-lg border px-4 py-2 text-sm ${styles[type]}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
