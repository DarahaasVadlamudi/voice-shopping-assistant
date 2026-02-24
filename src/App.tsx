import { useCallback, useEffect, useState } from 'react';
import { parseVoiceCommand } from './utils/nlp';
import { useSpeechRecognition, LANGUAGES } from './hooks/useSpeechRecognition';
import { useShoppingList } from './store/useShoppingList';
import { useSuggestions } from './hooks/useSuggestions';
import { VoiceButton } from './components/VoiceButton';
import { ShoppingList } from './components/ShoppingList';
import { Suggestions } from './components/Suggestions';
import { FeedbackBar } from './components/FeedbackBar';

type Feedback = { message: string; type: 'success' | 'error' | 'info' } | null;

export default function App() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
  const [lang, setLang] = useState('en-US');

  const {
    items,
    addItem,
    removeItem,
    removeByName,
    updateQuantity,
    getHistory,
    clearList,
  } = useShoppingList();

  const history = getHistory();
  const listItemNames = items.map((i) => i.name);
  const suggestions = useSuggestions(history, listItemNames);

  const showFeedback = useCallback((message: string, type: Feedback['type']) => {
    setFeedback({ message, type });
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleVoiceResult = useCallback(
    (transcript: string) => {
      const action = parseVoiceCommand(transcript);
      if (action.type === 'add' && action.item) {
        const q = action.quantity ?? 1;
        const added = addItem(action.item, q);
        if (added) {
          showFeedback(`Added ${q > 1 ? q + ' ' : ''}${action.item}`, 'success');
        }
      } else if (action.type === 'remove' && action.item) {
        removeByName(action.item);
        showFeedback(`Removed "${action.item}" from list`, 'success');
      } else if (action.type === 'search' && action.item) {
        setSearchQuery(action.item);
        if (action.filters?.maxPrice != null) setMaxPriceFilter(action.filters.maxPrice);
        else if (action.filters?.organic) setSearchQuery(`organic ${action.item}`);
        showFeedback(`Searching for: ${action.item}`, 'info');
      } else {
        showFeedback(`Could not understand: "${transcript}"`, 'error');
      }
    },
    [addItem, removeByName, showFeedback]
  );

  const {
    start,
    stop,
    status,
    error,
    interimTranscript,
    resetStatus,
    isSupported,
  } = useSpeechRecognition(handleVoiceResult, lang);

  useEffect(() => {
    if (status === 'processing') {
      const t = setTimeout(resetStatus, 800);
      return () => clearTimeout(t);
    }
  }, [status, resetStatus]);

  useEffect(() => {
    if (error) showFeedback(error, 'error');
  }, [error, showFeedback]);

  const handleSuggestionAdd = useCallback(
    (item: string) => {
      addItem(item);
      showFeedback(`Added ${item}`, 'success');
    },
    [addItem, showFeedback]
  );

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 pb-24 pt-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-100">Voice Shopping Assistant</h1>
        <p className="mt-1 text-sm text-slate-400">Say &quot;Add milk&quot; or &quot;Remove bread&quot;</p>
      </header>

      <div className="mb-6 flex justify-center">
        <VoiceButton
          status={status}
          onClick={status === 'listening' ? stop : start}
          lang={lang}
          onLangChange={setLang}
          languages={LANGUAGES}
        />
      </div>

      {(interimTranscript || feedback) && (
        <div className="mb-4 space-y-2">
          {interimTranscript && (
            <p className="rounded-lg bg-slate-800/60 px-4 py-2 text-sm italic text-slate-400">
              {interimTranscript}
            </p>
          )}
          {feedback && <FeedbackBar message={feedback.message} type={feedback.type} />}
        </div>
      )}

      <div className="mb-6">
        <Suggestions suggestions={suggestions} onAdd={handleSuggestionAdd} />
      </div>

      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const input = form.querySelector<HTMLInputElement>('input[name="newItem"]');
          const qInput = form.querySelector<HTMLInputElement>('input[name="quantity"]');
          const name = input?.value?.trim();
          const q = Math.max(1, parseInt(qInput?.value || '1', 10) || 1);
          if (name) {
            addItem(name, q);
            showFeedback(`Added ${q > 1 ? q + ' ' : ''}${name}`, 'success');
            input!.value = '';
            if (qInput) qInput.value = '1';
          }
        }}
      >
        <input
          name="newItem"
          type="text"
          placeholder="Or type to add item…"
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 min-w-[140px]"
          aria-label="Add item by typing"
        />
        <input
          name="quantity"
          type="number"
          min={1}
          defaultValue={1}
          className="w-14 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-2 text-center text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          aria-label="Quantity"
        />
        <button
          type="submit"
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
        >
          Add
        </button>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search or filter list…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 min-w-[140px]"
          aria-label="Search list"
        />
        <select
          value={filterCategory ?? ''}
          onChange={(e) => setFilterCategory(e.target.value || null)}
          className="rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          <option value="dairy">Dairy</option>
          <option value="produce">Produce</option>
          <option value="bakery">Bakery</option>
          <option value="beverages">Beverages</option>
          <option value="snacks">Snacks</option>
          <option value="household">Household</option>
          <option value="personal care">Personal Care</option>
          <option value="frozen">Frozen</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Max $"
          min={0}
          step={1}
          value={maxPriceFilter ?? ''}
          onChange={(e) =>
            setMaxPriceFilter(e.target.value ? parseInt(e.target.value, 10) : null)
          }
          className="w-20 rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          aria-label="Max price"
        />
      </div>

      <ShoppingList
        items={items}
        onRemove={removeItem}
        onQuantityChange={updateQuantity}
        filterCategory={filterCategory}
        searchQuery={searchQuery}
        maxPriceFilter={maxPriceFilter}
      />

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 safe-area-pb flex justify-center bg-slate-900/95 py-3">
          <button
            type="button"
            onClick={() => {
              clearList();
              setSearchQuery('');
              setFilterCategory(null);
              setMaxPriceFilter(null);
              showFeedback('List cleared', 'info');
            }}
            className="rounded-full bg-slate-600 px-6 py-2 text-sm font-medium text-slate-200 hover:bg-slate-500"
          >
            Clear list
          </button>
        </div>
      )}

      {!isSupported && (
        <p className="mt-4 text-center text-sm text-amber-400">
          Use Chrome or Edge for voice commands. You can still add items by typing in search and using suggestions.
        </p>
      )}
    </div>
  );
}
