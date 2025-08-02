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
 * @param s - Text to process
 * @param measureFn - Callback that calculates the width of a given string
 * @param hyphenateFn - Callback that calculates legal hyphenation points in
 *                      words and returns an array of pieces that can be joined
 *                      with hyphens.
 * @param meta - A meta object that passes the associated CSS "classes" downwards
 */


// New helper type – makes the two–argument call explicit
type MeasureFn = (word: string, meta?: { classes?: string[] }) => number;

export function layoutItemsFromString(
  s: string,
  measureFn: MeasureFn,                     // <── updated
  hyphenateFn?: (word: string, meta: Object) => string[],
  meta: { classes?: string[] }[] = []       // default to []
): TextInputItem[] {
  const items: TextInputItem[] = [];
  const chunks = s.split(/(\s+)/).filter(w => w.length);

  const spaceWidth  = measureFn(' ');
  const hyphenWidth = measureFn('-');
  const isSpace     = (w: string) => /\s/.test(w.charAt(0));

//  const MIN_SPACE = 5.75;                // px you never want to go belo
  const shrink = Math.max(0, spaceWidth - spaceWidth * .0);
  let metaIndex = 0;                        // <- incremented only for words

  chunks.forEach(w => {

    if (isSpace(w)) {
      // plain glue; no meta & no metaIndex++
      items.push({
        type    : 'glue',
        width   : spaceWidth,
        shrink: shrink,
        stretch : spaceWidth * 1.5,
        text    : w
      });
      return;
    }

    // meta that belongs to THIS word
    const metaItem = meta[metaIndex++];
    const pushBox = (txt: string) => items.push({
      type : 'box',
      width: measureFn(txt, metaItem),      // <── meta forwarded to measureFn
      text : txt,
      meta : metaItem
    });

      // ——— New flag ————————————————————————————————
    // const canHyphenate =
    // hyphenateFn && !(metaItem?.classes?.includes('newLine'));
    // ———————————————————————————————————————————————

    if (hyphenateFn) {
      const parts = hyphenateFn(w, metaItem);
      parts.forEach((part, j) => {
        pushBox(part);
        if (j < parts.length - 1) {
          // hyphen penalty: no meta, no measure call
          items.push({
            type   : 'penalty',
            width  : hyphenWidth,
            cost   : 10,
            flagged: true
          });
        }
      });
    } else {
      pushBox(w);
    }
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
  let items: TextInputItem[];
  let breakpoints;
  let positions: PositionedItem[];


  try {
    items = layoutItemsFromString(text, measure, undefined, meta);
    breakpoints = breakLines(items, lineWidth, {
      maxAdjustmentRatio: 1,
    });
    positions = positionItems(items, lineWidth, breakpoints);
  } catch (e) {
    if (e instanceof MaxAdjustmentExceededError) {
      items = layoutItemsFromString(text, measure, hyphenate, meta);
      breakpoints = breakLines(items, lineWidth);
      positions = positionItems(items, lineWidth, breakpoints);
    } else {
      throw e;
    }
  }

  return { items, breakpoints, positions };
}
