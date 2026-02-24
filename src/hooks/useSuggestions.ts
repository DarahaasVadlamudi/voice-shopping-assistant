import { useMemo } from 'react';
import type { Suggestion } from '../types';
import { getSubstitutes } from '../data/substitutes';
import { getSeasonalSuggestions } from '../data/seasonal';

export function useSuggestions(history: string[], listItemNames: string[]) {
  return useMemo(() => {
    const suggestions: Suggestion[] = [];
    const seasonal = getSeasonalSuggestions();

    history.slice(0, 5).forEach((item) => {
      if (!listItemNames.some((n) => n.toLowerCase().includes(item.toLowerCase()))) {
        suggestions.push({
          text: `You often buy "${item}". Add it?`,
          item,
          reason: 'history',
        });
      }
    });

    seasonal.slice(0, 3).forEach((item) => {
      suggestions.push({
        text: `In season now: ${item}`,
        item,
        reason: 'seasonal',
      });
    });

    listItemNames.forEach((name) => {
      const subs = getSubstitutes(name);
      if (subs.length > 0) {
        suggestions.push({
          text: `Alternative to ${name}: ${subs[0]}`,
          item: subs[0],
          reason: 'substitute',
        });
      }
    });

    return suggestions.slice(0, 8);
  }, [history, listItemNames]);
}
