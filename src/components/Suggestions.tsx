import type { Suggestion } from '../types';

interface SuggestionsProps {
  suggestions: Suggestion[];
  onAdd: (item: string) => void;
  loading?: boolean;
}

const reasonLabel: Record<Suggestion['reason'], string> = {
  history: 'You often buy this',
  seasonal: 'In season',
  substitute: 'Alternative',
};

export function Suggestions({ suggestions, onAdd, loading }: SuggestionsProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-400">Smart suggestions</h2>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 flex-1 animate-pulse rounded-lg bg-slate-700/50"
              aria-hidden
            />
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
      <h2 className="mb-3 text-sm font-medium text-slate-400">Smart suggestions</h2>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-xs text-sky-400/90">{reasonLabel[s.reason]}</span>
              <p className="truncate text-sm text-slate-200">{s.text}</p>
            </div>
            {s.item && (
              <button
                type="button"
                onClick={() => onAdd(s.item!)}
                className="shrink-0 rounded-lg bg-sky-500/20 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/30"
              >
                Add
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
