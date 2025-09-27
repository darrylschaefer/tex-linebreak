// import {
//   breakLines,
//   positionItems,
//   MaxAdjustmentExceededError,
//   Box,
//   Glue,
//   Penalty,
//   PositionedItem,
//   MAX_COST,
//   forcedBreak,
// } from './layout';

// export interface TextBox extends Box {
//   text: string;
//   /* NEW */ meta?: { classes?: string[] };
// }

// export interface TextGlue extends Glue {
//   text: string;
// }

// export type TextInputItem = TextBox | TextGlue | Penalty;

// /**
//  * A convenience function that generates a set of input items for `breakLines`
//  * from a string.
//  *
//  * @param s - Text to process
//  * @param measureFn - Callback that calculates the width of a given string
//  * @param hyphenateFn - Callback that calculates legal hyphenation points in
//  *                      words and returns an array of pieces that can be joined
//  *                      with hyphens.
//  * @param meta - A meta object that passes the associated CSS "classes" downwards
//  */


// // New helper type – makes the two–argument call explicit
// type MeasureFn = (word: string, meta?: { classes?: string[] }) => number;

// export function layoutItemsFromString(
//   s: string,
//   measureFn: MeasureFn,                     // <── updated
//   hyphenateFn?: (word: string, meta: Object) => string[],
//   meta: { classes?: string[] }[] = []       // default to []
// ): TextInputItem[] {
//   const items: TextInputItem[] = [];
//   const chunks = s.split(/(\s+)/).filter(w => w.length);

//   const spaceWidth  = measureFn(' ');
//   const hyphenWidth = measureFn('-');
//   const isSpace     = (w: string) => /\s/.test(w.charAt(0));

// //  const MIN_SPACE = 5.75;                // px you never want to go belo
// //  const shrink = Math.max(0, spaceWidth - spaceWidth * .0);
// //  const shrink = Math.max(0, spaceWidth - 2);
//   const stretch = 0.5 * spaceWidth; // TeX-like
// const shrink = 0.333 * spaceWidth; // TeX-like

//   let metaIndex = 0;                        // <- incremented only for words

//   chunks.forEach(w => {

//     if (isSpace(w)) {
//       // plain glue; no meta & no metaIndex++
//       items.push({
//         type    : 'glue',
//         width   : spaceWidth,
//         shrink: shrink,
//         stretch : stretch,
//         text    : w
//       });
//       return;
//     }

//     // meta that belongs to THIS word
//     const metaItem = meta[metaIndex++];
//     const pushBox = (txt: string) => items.push({
//       type : 'box',
//       width: measureFn(txt, metaItem),      // <── meta forwarded to measureFn
//       text : txt,
//       meta : metaItem
//     });

//       // ——— New flag ————————————————————————————————
//     // const canHyphenate =
//     // hyphenateFn && !(metaItem?.classes?.includes('newLine'));
//     // ———————————————————————————————————————————————

//     if (hyphenateFn) {
//       const parts = hyphenateFn(w, metaItem);
//       parts.forEach((part, j) => {
//         pushBox(part);
//         if (j < parts.length - 1) {
//           // hyphen penalty: no meta, no measure call
//           items.push({
//             type   : 'penalty',
//             width  : hyphenWidth,
//             cost   : 10,
//             flagged: true
//           });
//         }
//       });
//     } else {
//       pushBox(w);
//     }
//   });

//   // Finishing glue + forced break
//   items.push({ type: 'glue', width: 0, stretch: MAX_COST, shrink: 0, text: '' });
//   items.push(forcedBreak());

//   return items;
// }

// /**
//  * Helper for laying out a paragraph of text.
//  *
//  * @param text - The text to lay out
//  * @param lineWidth - Width for each line
//  * @param measure - Function which is called to measure each word or space in the input
//  * @param hyphenate - Function which is called to split words at possible
// * @param meta - A meta object that passes the associated CSS "classes" downwards
//  * hyphenation points
//  */

// export function layoutText(
//   text: string,
//   lineWidth: number | number[],
//   measure: (word: string) => number,
//   hyphenate: (word: string) => string[],
//   meta?: any[],
// ) {
//   let items: TextInputItem[];
//   let breakpoints;
//   let positions: PositionedItem[];


//   try {
//     items = layoutItemsFromString(text, measure, undefined, meta);
//     breakpoints = breakLines(items, lineWidth, {
//       maxAdjustmentRatio: 1,
//     });
//     positions = positionItems(items, lineWidth, breakpoints);
//   } catch (e) {
//     if (e instanceof MaxAdjustmentExceededError) {
//       items = layoutItemsFromString(text, measure, hyphenate, meta);
//       breakpoints = breakLines(items, lineWidth);
//       positions = positionItems(items, lineWidth, breakpoints);
//     } else {
//       throw e;
//     }
//   }

//   return { items, breakpoints, positions };
// }



















import {
  breakLines,
  positionItems,
  MaxAdjustmentExceededError,
  Box,
  Glue,
  Penalty,
  PositionedItem,
  MAX_COST,
  forcedBreak,
} from './layout';

export interface TextBox extends Box {
  text: string;
  /* NEW */ meta?: { classes?: string[] };
}

export interface TextGlue extends Glue {
  text: string;
}

export type TextInputItem = TextBox | TextGlue | Penalty;

/**
 * A convenience function that generates a set of input items for `breakLines`
 * from a string.
 *
 * Notes on whitespace handling:
 * - ASCII space/tab/newline runs are collapsed to a single breakable space.
 * - NBSP (U+00A0) runs are treated as unbreakable boxes.
 * - Other Unicode spaces (thin/en/em etc.) are kept as measured glues with
 *   stretch/shrink scaled to their actual width.
 *
 * Punctuation-aware break penalties:
 * - Discourage breaks after closing punctuation and before opening punctuation.
 *
 * @param s - Text to process
 * @param measureFn - Callback that calculates the width of a given string
 * @param hyphenateFn - Callback that calculates legal hyphenation points in
 *                      words and returns an array of pieces that can be joined
 *                      with hyphens.
 * @param meta - A meta object that passes the associated CSS "classes" downwards
 */

// New helper type – makes the two–argument call explicit
type MeasureFn = (word: string, meta?: { classes?: string[] }) => number;

// Unicode space classes
const NBSP = '\u00A0';
const OTHER_UNICODE_SPACE_RE = /^[\u2000-\u200A\u202F\u205F\u3000]+$/u;

// Punctuation heuristics
const CLOSE_PUNCT_RE = /[.,;:!?…)\]\}”’»]$/u;
const OPEN_PUNCT_RE = /^[(\[\{“‘«]/u;
const PUNCT_BREAK_PENALTY = 50; // tune 30–80 to taste

// Measure a whitespace run robustly by summing per-character widths
function measureWhitespaceRun(run: string, measureFn: MeasureFn): number {
  let total = 0;
  for (const ch of Array.from(run)) {
    total += measureFn(ch);
  }
  return total;
}

export function layoutItemsFromString(
  s: string,
  measureFn: MeasureFn, // <── updated
  hyphenateFn?: (word: string, meta: Object) => string[],
  meta: { classes?: string[] }[] = [] // default to []
): TextInputItem[] {
  const items: TextInputItem[] = [];

  // Split into whitespace/non-whitespace runs
  const chunks = s.split(/(\s+)/u).filter(w => w.length);

  const spaceWidth = measureFn(' ');
  const hyphenWidth = measureFn('-');
  const isSpace = (w: string) => /\s/.test(w.charAt(0));

  // TeX-like stretch/shrink for a single ASCII space
  const baseStretch = 0.5 * spaceWidth;
  const baseShrink = 0.333 * spaceWidth;

  let metaIndex = 0; // incremented only for words
  let prevNonSpaceChunk: string | null = null;

  chunks.forEach(w => {
    if (isSpace(w)) {
      // NBSP run => unbreakable box
      if (w.indexOf(NBSP) !== -1) {
        const width = measureWhitespaceRun(w, measureFn);
        items.push({
          type: 'box',
          width,
          text: w,
        });
        return;
      }

      // Other Unicode space run => glue with proportional stretch/shrink
      if (OTHER_UNICODE_SPACE_RE.test(w)) {
        const width = measureWhitespaceRun(w, measureFn);
        const multiplier = spaceWidth > 0 ? width / spaceWidth : w.length;

        if (prevNonSpaceChunk && CLOSE_PUNCT_RE.test(prevNonSpaceChunk)) {
          items.push({
            type: 'penalty',
            width: 0,
            cost: PUNCT_BREAK_PENALTY,
            flagged: false,
          });
        }
        items.push({
          type: 'glue',
          width,
          shrink: multiplier * baseShrink,
          stretch: multiplier * baseStretch,
          text: w,
        });
        return;
      }

      // Default: a single breakable ASCII space
      if (prevNonSpaceChunk && CLOSE_PUNCT_RE.test(prevNonSpaceChunk)) {
        items.push({
          type: 'penalty',
          width: 0,
          cost: PUNCT_BREAK_PENALTY,
          flagged: false,
        });
      }
      items.push({
        type: 'glue',
        width: spaceWidth,
        shrink: baseShrink,
        stretch: baseStretch,
        text: ' ',
      });
      return;
    }

    // Word (or punctuation run)
    if (OPEN_PUNCT_RE.test(w) && items.length >= 1 && items[items.length - 1].type === 'glue') {
      items.splice(items.length - 1, 0, {
        type: 'penalty',
        width: 0,
        cost: PUNCT_BREAK_PENALTY,
        flagged: false,
      });
    }

    // meta that belongs to THIS word
    const metaItem = meta[metaIndex++];
    const pushBox = (txt: string) =>
      items.push({
        type: 'box',
        width: measureFn(txt, metaItem), // <── meta forwarded to measureFn
        text: txt,
        meta: metaItem,
      });

    if (hyphenateFn) {
      const parts = hyphenateFn(w, metaItem);
      parts.forEach((part, j) => {
        pushBox(part);
        if (j < parts.length - 1) {
          // hyphen penalty: no meta, no measure call
          items.push({
            type: 'penalty',
            width: hyphenWidth,
            cost: 10,
            flagged: true,
          });
        }
      });
    } else {
      pushBox(w);
    }

    prevNonSpaceChunk = w;
  });

  // Finishing glue + forced break
  items.push({ type: 'glue', width: 0, stretch: MAX_COST, shrink: 0, text: '' });
  items.push(forcedBreak());

  return items;
}

/**
 * Helper for laying out a paragraph of text.
 *
 * @param text - The text to lay out
 * @param lineWidth - Width for each line
 * @param measure - Function which is called to measure each word or space in the input
 * @param hyphenate - Function which is called to split words at possible
 * @param meta - A meta object that passes the associated CSS "classes" downwards
 * hyphenation points
 */

export function layoutText(
  text: string,
  lineWidth: number | number[],
  measure: (word: string) => number,
  hyphenate: (word: string) => string[],
  meta?: any[],
) {
  // Compute items up front so they exist even if breakLines throws.
  const items: TextInputItem[] = layoutItemsFromString(
    text,
    ((w: string) => measure(w)) as MeasureFn,
    hyphenate,
    meta
  );

  let breakpoints: number[];
  let positions: PositionedItem[];

  try {
    breakpoints = breakLines(items, lineWidth, {
      maxAdjustmentRatio: 1,
      doubleHyphenPenalty: 150,
      adjacentLooseTightPenalty: 75,
    });
  } catch (e) {
    if (e instanceof MaxAdjustmentExceededError) {
      // Relax stretch limits if needed (keep hyphenation on)
      breakpoints = breakLines(items, lineWidth, {
        maxAdjustmentRatio: null,
        doubleHyphenPenalty: 150,
        adjacentLooseTightPenalty: 75,
      });
    } else {
      throw e;
    }
  }

  positions = positionItems(items, lineWidth, breakpoints);
  return { items, breakpoints, positions };
}