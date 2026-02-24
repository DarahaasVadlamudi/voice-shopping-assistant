import type { VoiceAction } from '../types';

const ADD_PATTERNS = [
  /add\s+(?:(\d+)\s+)?(.+?)(?:\s+to\s+my\s+list)?\.?$/i,
  /(?:i\s+)?(?:need|want|would\s+like)\s+(?:to\s+)?(?:buy|get|add)\s+(?:(\d+)\s+)?(.+?)(?:\.|$)/i,
  /(?:buy|get)\s+(?:(\d+)\s+)?(.+?)(?:\.|$)/i,
  /put\s+(?:(\d+)\s+)?(.+?)\s+on\s+(?:my\s+)?list/i,
  /(?:(\d+)\s+)?(.+?)\s+please/i,
];

const REMOVE_PATTERNS = [
  /remove\s+(.+?)(?:\s+from\s+my\s+list)?\.?$/i,
  /delete\s+(.+?)(?:\s+from\s+my\s+list)?\.?$/i,
  /(?:don't|do\s+not)\s+need\s+(.+?)(?:\.|$)/i,
  /cross\s+off\s+(.+?)(?:\.|$)/i,
  /take\s+off\s+(.+?)(?:\s+from\s+my\s+list)?\.?$/i,
];

const SEARCH_PATTERNS = [
  /find\s+(?:me\s+)?(.+?)(?:\.|$)/i,
  /search\s+for\s+(.+?)(?:\.|$)/i,
  /look\s+for\s+(.+?)(?:\.|$)/i,
  /(?:find|show)\s+(.+?)\s+under\s+\$?(\d+)/i,
];

function extractQuantityAndItem(patterns: RegExp[], text: string): { quantity?: number; item: string } | null {
  const t = text.trim();
  for (const p of ADD_PATTERNS) {
    const m = t.match(p);
    if (m) {
      const q = m[1] ? parseInt(m[1], 10) : undefined;
      const item = (m[2] ?? m[3] ?? '').trim();
      if (item) return { quantity: q ?? 1, item };
    }
  }
  return null;
}

export function parseVoiceCommand(transcript: string): VoiceAction {
  const text = transcript.trim();
  if (!text) return { type: 'unknown' };

  for (const p of REMOVE_PATTERNS) {
    const m = text.match(p);
    if (m) {
      const item = (m[1] ?? '').trim();
      if (item) return { type: 'remove', item };
    }
  }

  const underMatch = text.match(/(.+?)\s+under\s+\$?(\d+)/i);
  if (underMatch) {
    const item = underMatch[1].trim();
    const maxPrice = parseInt(underMatch[2], 10);
    return { type: 'search', item, filters: { maxPrice } };
  }

  const organicMatch = text.match(/(?:find\s+)?(organic|natural)\s+(.+?)(?:\.|$)/i);
  if (organicMatch) {
    return {
      type: 'search',
      item: organicMatch[2].trim(),
      filters: { organic: true },
    };
  }

  for (const p of SEARCH_PATTERNS) {
    const m = text.match(p);
    if (m) {
      const item = (m[1] ?? '').trim();
      if (item) return { type: 'search', item };
    }
  }

  const addResult = extractQuantityAndItem(ADD_PATTERNS, text);
  if (addResult) return { type: 'add', item: addResult.item, quantity: addResult.quantity };

  return { type: 'unknown' };
}
