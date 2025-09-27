// import Hypher from 'hypher';

// export interface Patterns {
//   id: string;
//   leftmin: number;
//   rightmin: number;
//   patterns: {
//     [key: string]: string;
//   };
// }

// /**
//  * Create a hyphenator that uses the given patterns.
//  *
//  * A wrapper around the `hypher` hyphenation library.
//  */
// export function createHyphenator(patterns: Patterns) {
//   const hypher = new Hypher(patterns);
//   return (word: string) => hypher.hyphenate(word);
// }











import Hypher from 'hypher';

export interface Patterns {
  id: string;
  leftmin: number;
  rightmin: number;
  patterns: {
    [key: string]: string;
  };
}

/**
 * Options to guard hyphenation quality.
 */
export interface GuardOptions {
  minWordLength?: number;   // Do not hyphenate words shorter than this (default 5)
  allowAllCaps?: boolean;   // If false, skip ALL-CAPS words (default false)
  exceptions?: string[];    // Words to never hyphenate (case-insensitive)
  leftmin?: number;         // Minimum chars before a hyphen (defaults to patterns.leftmin or 2)
  rightmin?: number;        // Minimum chars after a hyphen (defaults to patterns.rightmin or 3)
}

/**
 * Create a plain hyphenator using given patterns (compat).
 * Accepts an optional second arg to match call sites that pass meta.
 */
export function createHyphenator(patterns: Patterns) {
  const hypher = new Hypher(patterns);
  return (word: string, _meta?: any) => hypher.hyphenate(word);
}

/**
 * Create a guarded hyphenator that applies quality gates and enforces left/right mins.
 */
export function createGuardedHyphenator(patterns: Patterns, guard: GuardOptions = {}) {
  const hypher = new Hypher(patterns);

  const {
    minWordLength = 5,
    allowAllCaps = false,
    exceptions = [],
    leftmin = typeof patterns.leftmin === 'number' ? patterns.leftmin : 2,
    rightmin = typeof patterns.rightmin === 'number' ? patterns.rightmin : 3,
  } = guard;

  const exceptionSet = new Set(exceptions.map(w => w.toLowerCase()));

  function stripForChecks(s: string) {
    // Remove common leading/trailing punctuation for heuristics/exception check
    return s
      .replace(/^[("'“‘«\[\{]+/u, '')
      .replace(/[)"'”’»\]\}\.,;:!?…]+$/u, '');
  }

  function isAllCapsWord(s: string) {
    const letters = s.replace(/[^A-Za-z\u00C0-\u017F]/g, '');
    if (letters.length === 0) return false;
    return letters === letters.toUpperCase() && letters !== letters.toLowerCase();
  }

  function enforceMins(parts: string[]) {
    if (parts.length <= 1) return parts;
    const out = parts.slice();

    // Merge from left until leftmin satisfied
    while (out.length > 1 && out[0].length < leftmin) {
      out[1] = out[0] + out[1];
      out.shift();
    }
    // Merge from right until rightmin satisfied
    while (out.length > 1 && out[out.length - 1].length < rightmin) {
      const last = out.pop()!;
      out[out.length - 1] = out[out.length - 1] + last;
    }

    return out;
  }

  return (word: string, _meta?: any) => {
    const bare = stripForChecks(word);

    if (bare.length < minWordLength) return [word];
    if (!allowAllCaps && isAllCapsWord(bare)) return [word];
    if (exceptionSet.has(bare.toLowerCase())) return [word];

    let parts = hypher.hyphenate(word);
    if (parts.length <= 1) return parts;

    parts = enforceMins(parts);
    if (parts.length <= 1) return [word];

    return parts;
  };
}