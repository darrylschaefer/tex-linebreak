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
    minWordLength?: number;
    allowAllCaps?: boolean;
    exceptions?: string[];
    leftmin?: number;
    rightmin?: number;
}
/**
 * Create a plain hyphenator using given patterns (compat).
 * Accepts an optional second arg to match call sites that pass meta.
 */
export declare function createHyphenator(patterns: Patterns): (word: string, _meta?: any) => string[];
/**
 * Create a guarded hyphenator that applies quality gates and enforces left/right mins.
 */
export declare function createGuardedHyphenator(patterns: Patterns, guard?: GuardOptions): (word: string, _meta?: any) => string[];
