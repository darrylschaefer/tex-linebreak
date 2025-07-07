(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["texLineBreak_lib"] = factory();
	else
		root["texLineBreak_lib"] = factory();
})(typeof self !== 'undefined' ? self : this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/hypher/lib/hypher.js":
/*!*******************************************!*\
  !*** ./node_modules/hypher/lib/hypher.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * @constructor
 * @param {!{patterns: !Object, leftmin: !number, rightmin: !number}} language The language pattern file. Compatible with Hyphenator.js.
 */
function Hypher(language) {
    var exceptions = [],
        i = 0;
    /**
     * @type {!Hypher.TrieNode}
     */
    this.trie = this.createTrie(language['patterns']);

    /**
     * @type {!number}
     * @const
     */
    this.leftMin = language['leftmin'];

    /**
     * @type {!number}
     * @const
     */
    this.rightMin = language['rightmin'];

    /**
     * @type {!Object.<string, !Array.<string>>}
     */
    this.exceptions = {};

    if (language['exceptions']) {
        exceptions = language['exceptions'].split(/,\s?/g);

        for (; i < exceptions.length; i += 1) {
            this.exceptions[exceptions[i].replace(/\u2027/g, '').toLowerCase()] = new RegExp('(' + exceptions[i].split('\u2027').join(')(') + ')', 'i');
        }
    }
}

/**
 * @typedef {{_points: !Array.<number>}}
 */
Hypher.TrieNode;

/**
 * Creates a trie from a language pattern.
 * @private
 * @param {!Object} patternObject An object with language patterns.
 * @return {!Hypher.TrieNode} An object trie.
 */
Hypher.prototype.createTrie = function (patternObject) {
    var size = 0,
        i = 0,
        c = 0,
        p = 0,
        chars = null,
        points = null,
        codePoint = null,
        t = null,
        tree = {
            _points: []
        },
        patterns;

    for (size in patternObject) {
        if (patternObject.hasOwnProperty(size)) {
            patterns = patternObject[size].match(new RegExp('.{1,' + (+size) + '}', 'g'));

            for (i = 0; i < patterns.length; i += 1) {
                chars = patterns[i].replace(/[0-9]/g, '').split('');
                points = patterns[i].split(/\D/);
                t = tree;

                for (c = 0; c < chars.length; c += 1) {
                    codePoint = chars[c].charCodeAt(0);

                    if (!t[codePoint]) {
                        t[codePoint] = {};
                    }
                    t = t[codePoint];
                }

                t._points = [];

                for (p = 0; p < points.length; p += 1) {
                    t._points[p] = points[p] || 0;
                }
            }
        }
    }
    return tree;
};

/**
 * Hyphenates a text.
 *
 * @param {!string} str The text to hyphenate.
 * @return {!string} The same text with soft hyphens inserted in the right positions.
 */
Hypher.prototype.hyphenateText = function (str, minLength) {
    minLength = minLength || 4;

    // Regexp("\b", "g") splits on word boundaries,
    // compound separators and ZWNJ so we don't need
    // any special cases for those characters. Unfortunately
    // it does not support unicode word boundaries, so
    // we implement it manually.
    var words = str.split(/([a-zA-Z0-9_\u0027\u00AD\u00DF-\u00EA\u00EB\u00EC-\u00EF\u00F1-\u00F6\u00F8-\u00FD\u0101\u0103\u0105\u0107\u0109\u010D\u010F\u0111\u0113\u0117\u0119\u011B\u011D\u011F\u0123\u0125\u012B\u012F\u0131\u0135\u0137\u013C\u013E\u0142\u0144\u0146\u0148\u0151\u0153\u0155\u0159\u015B\u015D\u015F\u0161\u0165\u016B\u016D\u016F\u0171\u0173\u017A\u017C\u017E\u017F\u0219\u021B\u02BC\u0390\u03AC-\u03CE\u03F2\u0401\u0410-\u044F\u0451\u0454\u0456\u0457\u045E\u0491\u0531-\u0556\u0561-\u0587\u0902\u0903\u0905-\u090B\u090E-\u0910\u0912\u0914-\u0928\u092A-\u0939\u093E-\u0943\u0946-\u0948\u094A-\u094D\u0982\u0983\u0985-\u098B\u098F\u0990\u0994-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BE-\u09C3\u09C7\u09C8\u09CB-\u09CD\u09D7\u0A02\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A14-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A82\u0A83\u0A85-\u0A8B\u0A8F\u0A90\u0A94-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABE-\u0AC3\u0AC7\u0AC8\u0ACB-\u0ACD\u0B02\u0B03\u0B05-\u0B0B\u0B0F\u0B10\u0B14-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3E-\u0B43\u0B47\u0B48\u0B4B-\u0B4D\u0B57\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C02\u0C03\u0C05-\u0C0B\u0C0E-\u0C10\u0C12\u0C14-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3E-\u0C43\u0C46-\u0C48\u0C4A-\u0C4D\u0C82\u0C83\u0C85-\u0C8B\u0C8E-\u0C90\u0C92\u0C94-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBE-\u0CC3\u0CC6-\u0CC8\u0CCA-\u0CCD\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60\u0D61\u0D7A-\u0D7F\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB2-\u1FB4\u1FB6\u1FB7\u1FBD\u1FBF\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD2\u1FD3\u1FD6\u1FD7\u1FE2-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u200D\u2019]+)/gi);

    for (var i = 0; i < words.length; i += 1) {
        if (words[i].indexOf('/') !== -1) {
            // Don't insert a zero width space if the slash is at the beginning or end
            // of the text, or right after or before a space.
            if (i !== 0 && i !== words.length - 1 && !(/\s+\/|\/\s+/.test(words[i]))) {
                words[i] += '\u200B';
            }
        } else if (words[i].length > minLength) {
            words[i] = this.hyphenate(words[i]).join('\u00AD');
        }
    }
    return words.join('');
};

/**
 * Hyphenates a word.
 *
 * @param {!string} word The word to hyphenate
 * @return {!Array.<!string>} An array of word fragments indicating valid hyphenation points.
 */
Hypher.prototype.hyphenate = function (word) {
    var characters,
        characterPoints = [],
        originalCharacters,
        i,
        j,
        k,
        node,
        points = [],
        wordLength,
        lowerCaseWord = word.toLowerCase(),
        nodePoints,
        nodePointsLength,
        m = Math.max,
        trie = this.trie,
        result = [''];

    if (this.exceptions.hasOwnProperty(lowerCaseWord)) {
        return word.match(this.exceptions[lowerCaseWord]).slice(1);
    }

    if (word.indexOf('\u00AD') !== -1) {
        return [word];
    }

    word = '_' + word + '_';

    characters = word.toLowerCase().split('');
    originalCharacters = word.split('');
    wordLength = characters.length;

    for (i = 0; i < wordLength; i += 1) {
        points[i] = 0;
        characterPoints[i] = characters[i].charCodeAt(0);
    }

    for (i = 0; i < wordLength; i += 1) {
        node = trie;
        for (j = i; j < wordLength; j += 1) {
            node = node[characterPoints[j]];

            if (node) {
                nodePoints = node._points;
                if (nodePoints) {
                    for (k = 0, nodePointsLength = nodePoints.length; k < nodePointsLength; k += 1) {
                        points[i + k] = m(points[i + k], nodePoints[k]);
                    }
                }
            } else {
                break;
            }
        }
    }

    for (i = 1; i < wordLength - 1; i += 1) {
        if (i > this.leftMin && i < (wordLength - this.rightMin) && points[i] % 2) {
            result.push(originalCharacters[i]);
        } else {
            result[result.length - 1] += originalCharacters[i];
        }
    }

    return result;
};

module.exports = Hypher;


/***/ }),

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.layoutText = exports.layoutItemsFromString = void 0;
const layout_1 = __webpack_require__(/*! ./layout */ "./src/layout.ts");
function layoutItemsFromString(s, measureFn, // <── updated
hyphenateFn, meta = [] // default to []
) {
    const items = [];
    const chunks = s.split(/(\s+)/).filter(w => w.length);
    const spaceWidth = measureFn(' ');
    const hyphenWidth = measureFn('-');
    const isSpace = (w) => /\s/.test(w.charAt(0));
    const MIN_SPACE = 5.75; // px you never want to go below
    const shrink = Math.max(0, spaceWidth - spaceWidth * .2);
    let metaIndex = 0; // <- incremented only for words
    chunks.forEach(w => {
        if (isSpace(w)) {
            // plain glue; no meta & no metaIndex++
            items.push({
                type: 'glue',
                width: spaceWidth,
                shrink: shrink,
                stretch: spaceWidth * 1.5,
                text: w
            });
            return;
        }
        // meta that belongs to THIS word
        const metaItem = meta[metaIndex++];
        const pushBox = (txt) => items.push({
            type: 'box',
            width: measureFn(txt, metaItem), // <── meta forwarded to measureFn
            text: txt,
            meta: metaItem
        });
        if (hyphenateFn) {
            const parts = hyphenateFn(w);
            parts.forEach((part, j) => {
                pushBox(part);
                if (j < parts.length - 1) {
                    // hyphen penalty: no meta, no measure call
                    items.push({
                        type: 'penalty',
                        width: hyphenWidth,
                        cost: 10,
                        flagged: true
                    });
                }
            });
        }
        else {
            pushBox(w);
        }
    });
    // Finishing glue + forced break
    items.push({ type: 'glue', width: 0, stretch: layout_1.MAX_COST, shrink: 0, text: '' });
    items.push((0, layout_1.forcedBreak)());
    return items;
}
exports.layoutItemsFromString = layoutItemsFromString;
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
function layoutText(text, lineWidth, measure, hyphenate, meta) {
    let items;
    let breakpoints;
    let positions;
    try {
        items = layoutItemsFromString(text, measure, undefined, meta);
        breakpoints = (0, layout_1.breakLines)(items, lineWidth, {
            maxAdjustmentRatio: 1,
        });
        positions = (0, layout_1.positionItems)(items, lineWidth, breakpoints);
    }
    catch (e) {
        if (e instanceof layout_1.MaxAdjustmentExceededError) {
            items = layoutItemsFromString(text, measure, hyphenate, meta);
            breakpoints = (0, layout_1.breakLines)(items, lineWidth);
            positions = (0, layout_1.positionItems)(items, lineWidth, breakpoints);
        }
        else {
            throw e;
        }
    }
    return { items, breakpoints, positions };
}
exports.layoutText = layoutText;


/***/ }),

/***/ "./src/html.ts":
/*!*********************!*\
  !*** ./src/html.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.justifyContent = exports.unjustifyContent = void 0;
const layout_1 = __webpack_require__(/*! ./layout */ "./src/layout.ts");
const range_1 = __webpack_require__(/*! ./util/range */ "./src/util/range.ts");
const dom_text_measurer_1 = __importDefault(__webpack_require__(/*! ./util/dom-text-measurer */ "./src/util/dom-text-measurer.ts"));
const NODE_TAG = 'insertedByTexLinebreak';
/**
 * Add layout items for `node` to `items`.
 */
function addItemsForTextNode(items, node, measureFn, hyphenateFn) {
    const text = node.nodeValue;
    const el = node.parentNode;
    const spaceWidth = measureFn(el, ' ');
    const shrink = Math.max(0, spaceWidth - spaceWidth * .2);
    const hyphenWidth = measureFn(el, '-');
    const isSpace = (word) => /\s/.test(word.charAt(0));
    const chunks = text.split(/(\s+)/).filter((w) => w.length > 0);
    let textOffset = 0;
    chunks.forEach((w) => {
        if (isSpace(w)) {
            const glue = {
                type: 'glue',
                width: spaceWidth,
                shrink,
                stretch: spaceWidth,
                node,
                start: textOffset,
                end: textOffset + w.length,
            };
            items.push(glue);
            textOffset += w.length;
            return;
        }
        if (hyphenateFn) {
            const chunks = hyphenateFn(w);
            chunks.forEach((c, i) => {
                const box = {
                    type: 'box',
                    width: measureFn(el, c),
                    node,
                    start: textOffset,
                    end: textOffset + c.length,
                };
                textOffset += c.length;
                items.push(box);
                if (i < chunks.length - 1) {
                    const hyphen = {
                        type: 'penalty',
                        width: hyphenWidth,
                        cost: 10,
                        flagged: true,
                        node,
                        start: textOffset,
                        end: textOffset,
                    };
                    items.push(hyphen);
                }
            });
        }
        else {
            const box = {
                type: 'box',
                width: measureFn(el, w),
                node,
                start: textOffset,
                end: textOffset + w.length,
            };
            textOffset += w.length;
            items.push(box);
        }
    });
}
/**
 * Add layout items for `element` and its descendants to `items`.
 */
function addItemsForElement(items, element, measureFn, hyphenateFn) {
    const { display, width, paddingLeft, paddingRight, marginLeft, marginRight, borderLeftWidth, borderRightWidth, } = getComputedStyle(element);
    if (display === 'inline') {
        // Add box for margin/border/padding at start of box.
        const leftMargin = parseFloat(marginLeft) + parseFloat(borderLeftWidth) + parseFloat(paddingLeft);
        if (leftMargin > 0) {
            items.push({ type: 'box', width: leftMargin, node: element, start: 0, end: 0 });
        }
        // Add items for child nodes.
        addItemsForNode(items, element, measureFn, hyphenateFn, false);
        // Add box for margin/border/padding at end of box.
        const rightMargin = parseFloat(marginRight) + parseFloat(borderRightWidth) + parseFloat(paddingRight);
        if (rightMargin > 0) {
            const length = element.childNodes.length;
            items.push({ type: 'box', width: rightMargin, node: element, start: length, end: length });
        }
    }
    else {
        // Treat this item as an opaque box.
        items.push({
            type: 'box',
            width: parseFloat(width),
            node: element,
            start: 0,
            end: 1,
        });
    }
}
/**
 * Add layout items for input to `breakLines` for `node` to `items`.
 *
 * This function, `addItemsForTextNode` and `addItemsForElement` take an
 * existing array as a first argument to avoid allocating a large number of
 * small arrays.
 */
function addItemsForNode(items, node, measureFn, hyphenateFn, addParagraphEnd = true) {
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
        if (child instanceof Text) {
            addItemsForTextNode(items, child, measureFn, hyphenateFn);
        }
        else if (child instanceof Element) {
            addItemsForElement(items, child, measureFn, hyphenateFn);
        }
    });
    if (addParagraphEnd) {
        const end = node.childNodes.length;
        // Add a synthetic glue that aborbs any left-over space at the end of the
        // last line.
        items.push({ type: 'glue', width: 0, shrink: 0, stretch: 1000, node, start: end, end });
        // Add a forced break to end the paragraph.
        items.push(Object.assign(Object.assign({}, (0, layout_1.forcedBreak)()), { node, start: end, end }));
    }
}
function elementLineWidth(el) {
    const { width, boxSizing, paddingLeft, paddingRight } = getComputedStyle(el);
    let w = parseFloat(width);
    if (boxSizing === 'border-box') {
        w -= parseFloat(paddingLeft);
        w -= parseFloat(paddingRight);
    }
    return w;
}
/**
 * Calculate the actual width of each line and the number of spaces that can be
 * stretched or shrunk to adjust the width.
 */
function lineWidthsAndGlueCounts(items, breakpoints) {
    const widths = [];
    const glueCounts = [];
    for (let b = 0; b < breakpoints.length - 1; b++) {
        let actualWidth = 0;
        let glueCount = 0;
        const start = b === 0 ? breakpoints[b] : breakpoints[b] + 1;
        for (let p = start; p <= breakpoints[b + 1]; p++) {
            const item = items[p];
            if (item.type === 'box') {
                actualWidth += item.width;
            }
            else if (item.type === 'glue' && p !== start && p !== breakpoints[b + 1]) {
                actualWidth += item.width;
                ++glueCount;
            }
            else if (item.type === 'penalty' && p === breakpoints[b + 1]) {
                actualWidth += item.width;
            }
        }
        widths.push(actualWidth);
        glueCounts.push(glueCount);
    }
    return [widths, glueCounts];
}
/**
 * Mark a node as having been created by `justifyContent`.
 */
function tagNode(node) {
    node[NODE_TAG] = true;
}
/**
 * Return `true` if `node` was created by `justifyContent`.
 */
function isTaggedNode(node) {
    return node.hasOwnProperty(NODE_TAG);
}
/**
 * Return all descendants of `node` created by `justifyContent`.
 */
function taggedChildren(node) {
    const children = [];
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (isTaggedNode(child)) {
            children.push(child);
        }
        if (child.childNodes.length > 0) {
            children.push(...taggedChildren(child));
        }
    }
    return children;
}
function isTextOrInlineElement(node) {
    if (node instanceof Text) {
        return true;
    }
    else if (node instanceof Element) {
        const style = getComputedStyle(node);
        return style.display === 'inline';
    }
    else {
        return false;
    }
}
/**
 * Wrap text nodes in a range and adjust the inter-word spacing.
 *
 * @param r - The range to wrap
 * @param wordSpacing - The additional spacing to add between words in pixels
 */
function addWordSpacing(r, wordSpacing) {
    // Collect all text nodes in range, skipping any non-inline elements and
    // their children because those are treated as opaque blocks by the line-
    // breaking step.
    const texts = (0, range_1.textNodesInRange)(r, isTextOrInlineElement);
    for (let t of texts) {
        const wrapper = document.createElement('span');
        tagNode(wrapper);
        wrapper.style.wordSpacing = `${wordSpacing}px`;
        t.parentNode.replaceChild(wrapper, t);
        wrapper.appendChild(t);
    }
    return texts;
}
/**
 * Reverse the changes made to an element by `justifyContent`.
 */
function unjustifyContent(el) {
    // Find and remove all elements inserted by `justifyContent`.
    const tagged = taggedChildren(el);
    for (let node of tagged) {
        const parent = node.parentNode;
        const children = Array.from(node.childNodes);
        children.forEach((child) => {
            parent.insertBefore(child, node);
        });
        parent.removeChild(node);
    }
    // Re-join text nodes that were split by `justifyContent`.
    el.normalize();
}
exports.unjustifyContent = unjustifyContent;
/**
 * Justify an existing paragraph.
 *
 * Justify the contents of `elements`, using `hyphenateFn` to apply hyphenation if
 * necessary.
 *
 * To justify multiple paragraphs, it is more efficient to call `justifyContent`
 * once with all the elements to be processed, than to call `justifyContent`
 * separately for each element. Passing a list allows `justifyContent` to
 * optimize DOM manipulations.
 */
function justifyContent(elements, hyphenateFn) {
    // To avoid layout thrashing, we batch DOM layout reads and writes in this
    // function. ie. we first measure the available width and compute linebreaks
    // for all elements and then afterwards modify all the elements.
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    // Undo the changes made by any previous justification of this content.
    elements.forEach((el) => {
        unjustifyContent(el);
    });
    // Calculate line-break positions given current element width and content.
    const measurer = new dom_text_measurer_1.default();
    const measure = measurer.measure.bind(measurer);
    const elementBreaks = [];
    elements.forEach((el) => {
        const lineWidth = elementLineWidth(el);
        let items = [];
        addItemsForNode(items, el, measure);
        let breakpoints;
        try {
            // First try without hyphenation but a maximum stretch-factor for each
            // space.
            breakpoints = (0, layout_1.breakLines)(items, lineWidth, {
                maxAdjustmentRatio: 2.0,
            });
        }
        catch (e) {
            if (e instanceof layout_1.MaxAdjustmentExceededError) {
                // Retry with hyphenation and unlimited stretching of each space.
                items = [];
                addItemsForNode(items, el, measure, hyphenateFn);
                breakpoints = (0, layout_1.breakLines)(items, lineWidth);
            }
            else {
                throw e;
            }
        }
        elementBreaks.push({ el, items, breakpoints, lineWidth });
    });
    // Insert line-breaks and adjust inter-word spacing.
    elementBreaks.forEach(({ el, items, breakpoints, lineWidth }) => {
        const [actualWidths, glueCounts] = lineWidthsAndGlueCounts(items, breakpoints);
        // Create a `Range` for each line. We create the ranges before modifying the
        // contents so that node offsets in `items` are still valid at the point when
        // we create the Range.
        const endsWithHyphen = [];
        const lineRanges = [];
        for (let b = 1; b < breakpoints.length; b++) {
            const prevBreakItem = items[breakpoints[b - 1]];
            const breakItem = items[breakpoints[b]];
            const r = document.createRange();
            if (b > 1) {
                r.setStart(prevBreakItem.node, prevBreakItem.end);
            }
            else {
                r.setStart(el, 0);
            }
            r.setEnd(breakItem.node, breakItem.start);
            lineRanges.push(r);
            endsWithHyphen.push(breakItem.type === 'penalty' && breakItem.flagged);
        }
        // Disable automatic line wrap.
        el.style.whiteSpace = 'nowrap';
        // Insert linebreaks.
        lineRanges.forEach((r, i) => {
            if (i === 0) {
                return;
            }
            const brEl = document.createElement('br');
            tagNode(brEl);
            // Insert linebreak. The browser will automatically adjust subsequent
            // ranges.
            r.insertNode(brEl);
            r.setStart(brEl.nextSibling, 0);
        });
        // Adjust inter-word spacing on each line and add hyphenation if needed.
        lineRanges.forEach((r, i) => {
            const spaceDiff = lineWidth - actualWidths[i];
            const extraSpacePerGlue = spaceDiff / glueCounts[i];
            // If this is the final line and the natural spacing between words does
            // not need to be compressed, then don't try to expand the spacing to fill
            // the line.
            const isFinalLine = i === lineRanges.length - 1;
            if (isFinalLine && extraSpacePerGlue >= 0) {
                return;
            }
            const wrappedNodes = addWordSpacing(r, extraSpacePerGlue);
            if (endsWithHyphen[i] && wrappedNodes.length > 0) {
                const lastNode = wrappedNodes[wrappedNodes.length - 1];
                const hyphen = document.createTextNode('-');
                tagNode(hyphen);
                lastNode.parentNode.appendChild(hyphen);
            }
        });
    });
}
exports.justifyContent = justifyContent;


/***/ }),

/***/ "./src/hyphenate.ts":
/*!**************************!*\
  !*** ./src/hyphenate.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createHyphenator = void 0;
const hypher_1 = __importDefault(__webpack_require__(/*! hypher */ "./node_modules/hypher/lib/hypher.js"));
/**
 * Create a hyphenator that uses the given patterns.
 *
 * A wrapper around the `hypher` hyphenation library.
 */
function createHyphenator(patterns) {
    const hypher = new hypher_1.default(patterns);
    return (word) => hypher.hyphenate(word);
}
exports.createHyphenator = createHyphenator;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./layout */ "./src/layout.ts"), exports);
__exportStar(__webpack_require__(/*! ./helpers */ "./src/helpers.ts"), exports);
__exportStar(__webpack_require__(/*! ./html */ "./src/html.ts"), exports);
__exportStar(__webpack_require__(/*! ./hyphenate */ "./src/hyphenate.ts"), exports);


/***/ }),

/***/ "./src/layout.ts":
/*!***********************!*\
  !*** ./src/layout.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.forcedBreak = exports.positionItems = exports.adjustmentRatios = exports.breakLines = exports.MaxAdjustmentExceededError = exports.MAX_COST = exports.MIN_COST = void 0;
/**
 * Minimum cost for a breakpoint.
 *
 * Values <= `MIN_COST` force a break.
 */
exports.MIN_COST = -1000;
/**
 * Maximum cost for a breakpoint.
 *
 * Values >= `MAX_COST` prevent a break.
 */
exports.MAX_COST = 1000;
const MIN_ADJUSTMENT_RATIO = -.5;
function isForcedBreak(item) {
    return item.type === 'penalty' && item.cost <= exports.MIN_COST;
}
const defaultOptions = {
    maxAdjustmentRatio: null,
    initialMaxAdjustmentRatio: 1,
    doubleHyphenPenalty: 0,
    adjacentLooseTightPenalty: 0,
};
/**
 * Error thrown by `breakLines` when `maxAdjustmentRatio` is exceeded.
 */
class MaxAdjustmentExceededError extends Error {
}
exports.MaxAdjustmentExceededError = MaxAdjustmentExceededError;
/**
 * Break a paragraph of text into justified lines.
 *
 * Returns the indexes from `items` which have been chosen as breakpoints.
 * `positionBoxes` can be used to generate the X offsets and line numbers of
 * each box using the resulting breakpoints.
 *
 * May throw an `Error` if valid breakpoints cannot be found given the specified
 * adjustment ratio thresholds.
 *
 * The implementation uses the "TeX algorithm" from [1].
 *
 * [1] D. E. Knuth and M. F. Plass, “Breaking paragraphs into lines,” Softw.
 *     Pract. Exp., vol. 11, no. 11, pp. 1119–1184, Nov. 1981.
 *
 * @param items - Sequence of box, glue and penalty items to layout.
 * @param lineLengths - Length or lengths of each line.
 */
function breakLines(items, lineLengths, opts = {}) {
    if (items.length === 0) {
        return [];
    }
    const opts_ = Object.assign(Object.assign({}, defaultOptions), opts);
    const lineLen = (i) => (Array.isArray(lineLengths) ? lineLengths[i] : lineLengths);
    const currentMaxAdjustmentRatio = Math.min(opts_.initialMaxAdjustmentRatio, opts_.maxAdjustmentRatio !== null ? opts_.maxAdjustmentRatio : Infinity);
    const active = new Set();
    // Add initial active node for beginning of paragraph.
    active.add({
        index: 0,
        line: 0,
        // Fitness is ignored for this node.
        fitness: 0,
        totalWidth: 0,
        totalStretch: 0,
        totalShrink: 0,
        totalDemerits: 0,
        prev: null,
    });
    // Sum of `width` of items up to current item.
    let sumWidth = 0;
    // Sum of `stretch` of glue items up to current item.
    let sumStretch = 0;
    // Sum of `shrink` of glue items up to current item.
    let sumShrink = 0;
    let minAdjustmentRatioAboveThreshold = Infinity;
    for (let b = 0; b < items.length; b++) {
        const item = items[b];
        // TeX allows items with negative widths or stretch factors but imposes two
        // restrictions for efficiency. These restrictions are not yet implemented
        // here and we avoid the problem by just disallowing negative
        // width/shrink/stretch amounts.
        if (item.width < 0) {
            throw new Error(`Item ${b} has disallowed negative width`);
        }
        // Determine if this is a feasible breakpoint and update `sumWidth`,
        // `sumStretch` and `sumShrink`.
        let canBreak = false;
        if (item.type === 'box') {
            sumWidth += item.width;
        }
        else if (item.type === 'glue') {
            if (item.shrink < 0 || item.stretch < 0) {
                throw new Error(`Item ${b} has disallowed negative stretch or shrink`);
            }
            canBreak = b > 0 && items[b - 1].type === 'box';
            if (!canBreak) {
                sumWidth += item.width;
                sumShrink += item.shrink;
                sumStretch += item.stretch;
            }
        }
        else if (item.type === 'penalty') {
            canBreak = item.cost < exports.MAX_COST;
        }
        if (!canBreak) {
            continue;
        }
        // Update the set of active nodes.
        let lastActive = null;
        const feasible = [];
        active.forEach((a) => {
            // Compute adjustment ratio from `a` to `b`.
            let adjustmentRatio = 0;
            const lineShrink = sumShrink - a.totalShrink;
            const lineStretch = sumStretch - a.totalStretch;
            const idealLen = lineLen(a.line);
            let actualLen = sumWidth - a.totalWidth;
            // Include width of penalty in line length if chosen as a breakpoint.
            if (item.type === 'penalty') {
                actualLen += item.width;
            }
            // nb. Division by zero produces `Infinity` here, which is what we want.
            if (actualLen < idealLen) {
                adjustmentRatio = (idealLen - actualLen) / lineStretch;
            }
            else {
                adjustmentRatio = (idealLen - actualLen) / lineShrink;
            }
            if (adjustmentRatio > currentMaxAdjustmentRatio) {
                // In case we need to try again later with a higher
                // `maxAdjustmentRatio`, track the minimum value needed to produce
                // different output.
                minAdjustmentRatioAboveThreshold = Math.min(adjustmentRatio, minAdjustmentRatioAboveThreshold);
            }
            if (adjustmentRatio < MIN_ADJUSTMENT_RATIO || isForcedBreak(item)) {
                // Items from `a` to `b` cannot fit on one line.
                active.delete(a);
                lastActive = a;
            }
            if (adjustmentRatio >= MIN_ADJUSTMENT_RATIO && adjustmentRatio <= currentMaxAdjustmentRatio) {
                // We found a feasible breakpoint. Compute a `demerits` score for it as
                // per formula on p. 1128.
                let demerits;
                const badness = 100 * Math.abs(adjustmentRatio) ** 3;
                const penalty = item.type === 'penalty' ? item.cost : 0;
                if (penalty >= 0) {
                    demerits = (1 + badness + penalty) ** 2;
                }
                else if (penalty > exports.MIN_COST) {
                    demerits = (1 + badness) ** 2 - penalty ** 2;
                }
                else {
                    demerits = (1 + badness) ** 2;
                }
                let doubleHyphenPenalty = 0;
                const prevItem = items[a.index];
                if (item.type === 'penalty' && prevItem.type === 'penalty') {
                    if (item.flagged && prevItem.flagged) {
                        doubleHyphenPenalty = opts_.doubleHyphenPenalty;
                    }
                }
                demerits += doubleHyphenPenalty;
                // Fitness classes are defined on p. 1155
                let fitness;
                if (adjustmentRatio < -0.5) {
                    fitness = 0;
                }
                else if (adjustmentRatio < 0.5) {
                    fitness = 1;
                }
                else if (adjustmentRatio < 1) {
                    fitness = 2;
                }
                else {
                    fitness = 3;
                }
                if (a.index > 0 && Math.abs(fitness - a.fitness) > 1) {
                    demerits += opts_.adjacentLooseTightPenalty;
                }
                // If this breakpoint is followed by glue or non-breakable penalty items
                // then we don't want to include the width of those when calculating the
                // width of lines starting after this breakpoint. This is because when
                // rendering we ignore glue/penalty items at the start of lines.
                let widthToNextBox = 0;
                let shrinkToNextBox = 0;
                let stretchToNextBox = 0;
                for (let bp = b; bp < items.length; bp++) {
                    const item = items[bp];
                    if (item.type === 'box') {
                        break;
                    }
                    if (item.type === 'penalty' && item.cost >= exports.MAX_COST) {
                        break;
                    }
                    widthToNextBox += item.width;
                    if (item.type === 'glue') {
                        shrinkToNextBox += item.shrink;
                        stretchToNextBox += item.stretch;
                    }
                }
                const node = {
                    index: b,
                    line: a.line + 1,
                    fitness,
                    totalWidth: sumWidth + widthToNextBox,
                    totalShrink: sumShrink + shrinkToNextBox,
                    totalStretch: sumStretch + stretchToNextBox,
                    totalDemerits: a.totalDemerits + demerits,
                    prev: a,
                };
                feasible.push(node);
            }
        });
        // Add feasible breakpoint with lowest score to active set.
        if (feasible.length > 0) {
            let bestNode = feasible[0];
            for (let f of feasible) {
                if (f.totalDemerits < bestNode.totalDemerits) {
                    bestNode = f;
                }
            }
            active.add(bestNode);
        }
        // Handle situation where there is no way to break the paragraph without
        // shrinking or stretching a line beyond [-1, currentMaxAdjustmentRatio].
        if (active.size === 0) {
            if (isFinite(minAdjustmentRatioAboveThreshold)) {
                if (opts_.maxAdjustmentRatio === currentMaxAdjustmentRatio) {
                    throw new MaxAdjustmentExceededError();
                }
                // Too much stretching was required for an earlier ignored breakpoint.
                // Try again with a higher threshold.
                return breakLines(items, lineLengths, Object.assign(Object.assign({}, opts), { initialMaxAdjustmentRatio: minAdjustmentRatioAboveThreshold * 2 }));
            }
            else {
                // We cannot create a breakpoint sequence by increasing the max
                // adjustment ratio. This could happen if a box is too wide or there are
                // glue items with zero stretch/shrink.
                //
                // Give up and create a breakpoint at the current position.
                active.add({
                    index: b,
                    line: lastActive.line + 1,
                    fitness: 1,
                    totalWidth: sumWidth,
                    totalShrink: sumShrink,
                    totalStretch: sumStretch,
                    totalDemerits: lastActive.totalDemerits + 1000,
                    prev: lastActive,
                });
            }
        }
        if (item.type === 'glue') {
            sumWidth += item.width;
            sumStretch += item.stretch;
            sumShrink += item.shrink;
        }
    }
    // Choose active node with fewest total demerits as the last breakpoint.
    //
    // There should always be an active node at this point since:
    //
    //  1. We add a node to the active set before entering the loop.
    //  2. Each iteration of the loop either returns from the function, leaves the
    //     active set unchanged and breaks early or finishes with a non-empty active
    //     set.
    let bestNode = null;
    active.forEach((a) => {
        if (!bestNode || a.totalDemerits < bestNode.totalDemerits) {
            bestNode = a;
        }
    });
    // Follow the chain backwards from the chosen node to get the sequence of
    // chosen breakpoints.
    const output = [];
    let next = bestNode;
    while (next) {
        output.push(next.index);
        next = next.prev;
    }
    output.reverse();
    return output;
}
exports.breakLines = breakLines;
/**
 * Compute adjustment ratios for lines given a set of breakpoints.
 *
 * The adjustment ratio of a line is the proportion of each glue item's stretch
 * (if positive) or shrink (if negative) which needs to be used in order to make
 * the line the specified width. A value of zero indicates that every glue item
 * is exactly its preferred width.
 *
 * @param items - The box, glue and penalty items being laid out
 * @param lineLengths - Length or lengths of each line
 * @param breakpoints - Indexes in `items` where lines are being broken
 */
function adjustmentRatios(items, lineLengths, breakpoints) {
    const lineLen = (i) => (Array.isArray(lineLengths) ? lineLengths[i] : lineLengths);
    const ratios = [];
    for (let b = 0; b < breakpoints.length - 1; b++) {
        let idealWidth = lineLen(b);
        let actualWidth = 0;
        let lineShrink = 0;
        let lineStretch = 0;
        const start = b === 0 ? breakpoints[b] : breakpoints[b] + 1;
        for (let p = start; p <= breakpoints[b + 1]; p++) {
            const item = items[p];
            if (item.type === 'box') {
                actualWidth += item.width;
            }
            else if (item.type === 'glue' && p !== start && p !== breakpoints[b + 1]) {
                actualWidth += item.width;
                lineShrink += item.shrink;
                lineStretch += item.stretch;
            }
            else if (item.type === 'penalty' && p === breakpoints[b + 1]) {
                actualWidth += item.width;
            }
        }
        let adjustmentRatio;
        if (actualWidth < idealWidth) {
            adjustmentRatio = (idealWidth - actualWidth) / lineStretch;
        }
        else {
            adjustmentRatio = (idealWidth - actualWidth) / lineShrink;
        }
        ratios.push(adjustmentRatio);
    }
    return ratios;
}
exports.adjustmentRatios = adjustmentRatios;
/**
 * Compute the positions at which to draw boxes forming a paragraph given a set
 * of breakpoints.
 *
 * @param items - The sequence of items that form the paragraph.
 * @param lineLengths - Length or lengths of each line.
 * @param breakpoints - Indexes within `items` of the start of each line.
 */
function positionItems(items, lineLengths, breakpoints, options = {}) {
    const adjRatios = adjustmentRatios(items, lineLengths, breakpoints);
    const result = [];
    for (let b = 0; b < breakpoints.length - 1; b++) {
        // Limit the amount of shrinking of lines to 1x `glue.shrink` for each glue
        // item in a line.
        const adjustmentRatio = Math.max(adjRatios[b], MIN_ADJUSTMENT_RATIO);
        let xOffset = 0;
        const start = b === 0 ? breakpoints[b] : breakpoints[b] + 1;
        for (let p = start; p <= breakpoints[b + 1]; p++) {
            const item = items[p];
            if (item.type === 'box') {
                result.push({
                    item: p,
                    line: b,
                    xOffset,
                    width: item.width,
                });
                xOffset += item.width;
            }
            else if (item.type === 'glue' && p !== start && p !== breakpoints[b + 1]) {
                let gap;
                if (adjustmentRatio < 0) {
                    gap = item.width + adjustmentRatio * item.shrink;
                }
                else {
                    gap = item.width + adjustmentRatio * item.stretch;
                }
                if (options.includeGlue) {
                    result.push({
                        item: p,
                        line: b,
                        xOffset,
                        width: gap,
                    });
                }
                xOffset += gap;
            }
            else if (item.type === 'penalty' && p === breakpoints[b + 1] && item.width > 0) {
                result.push({
                    item: p,
                    line: b,
                    xOffset,
                    width: item.width,
                });
            }
        }
    }
    return result;
}
exports.positionItems = positionItems;
/**
 * Return a `Penalty` item which forces a line-break.
 */
function forcedBreak() {
    return { type: 'penalty', cost: exports.MIN_COST, width: 0, flagged: false };
}
exports.forcedBreak = forcedBreak;


/***/ }),

/***/ "./src/util/dom-text-measurer.ts":
/*!***************************************!*\
  !*** ./src/util/dom-text-measurer.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class TextMetricsCache {
    constructor() {
        this._fonts = new Map();
        this._textWidths = new Map();
    }
    putFont(el, cssFont) {
        this._fonts.set(el, cssFont);
    }
    cssFontForElement(el) {
        return this._fonts.get(el);
    }
    putWidth(cssFont, word, width) {
        let widths = this._textWidths.get(cssFont);
        if (!widths) {
            widths = new Map();
            this._textWidths.set(cssFont, widths);
        }
        widths.set(word, width);
    }
    getWidth(cssFont, word) {
        const widths = this._textWidths.get(cssFont);
        if (!widths) {
            return null;
        }
        return widths.get(word);
    }
}
/**
 * Return the computed CSS `font` property value for an element.
 */
function cssFontForElement(el) {
    const style = getComputedStyle(el);
    // Safari and Chrome can synthesize a value for `font` for us.
    let font = style.font;
    if (font.length > 0) {
        return font;
    }
    // Fall back to generating CSS font property value if browser (eg. Firefox)
    // does not synthesize it automatically.
    const { fontStyle, fontVariant, fontWeight, fontSize, fontFamily } = style;
    font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`;
    return font;
}
let measureCtx;
/**
 * Measure the width of `text` as it would appear if rendered within an
 * `Element` with a given computed `font` style.
 */
function measureText(cssFont, text) {
    if (!measureCtx) {
        const canvas = document.createElement('canvas');
        measureCtx = canvas.getContext('2d');
    }
    // Capture as much of the style as possible. Note that some properties such
    // as `font-stretch`, `font-size-adjust` and `font-kerning` are not settable
    // through the CSS `font` property.
    //
    // Apparently in some browsers the canvas context's text style inherits
    // style properties from the `<canvas>` element.
    // See https://stackoverflow.com/a/8955835/434243
    measureCtx.font = cssFont;
    return measureCtx.measureText(text).width;
}
/** Measure the width of pieces of text in the DOM, with caching. */
class DOMTextMeasurer {
    constructor() {
        this._cache = new TextMetricsCache();
    }
    /**
     * Return the width of `text` rendered by a `Text` node child of `context`.
     */
    measure(context, text) {
        let cssFont = this._cache.cssFontForElement(context);
        if (!cssFont) {
            cssFont = cssFontForElement(context);
            this._cache.putFont(context, cssFont);
        }
        let width = this._cache.getWidth(cssFont, text);
        if (!width) {
            width = measureText(cssFont, text);
            this._cache.putWidth(cssFont, text, width);
        }
        return width;
    }
}
exports["default"] = DOMTextMeasurer;


/***/ }),

/***/ "./src/util/range.ts":
/*!***************************!*\
  !*** ./src/util/range.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.textNodesInRange = void 0;
/**
 * Return a list of `Text` nodes in `range`.
 *
 * `filter` is called with each node in document order in the subtree rooted
 * at `range.commonAncestorContainer`. If it returns false, that node and its
 * children are skipped.
 */
function textNodesInRange(range, filter) {
    const root = range.commonAncestorContainer;
    const nodeIter = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ALL, {
        acceptNode(node) {
            if (filter(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else {
                return NodeFilter.FILTER_REJECT;
            }
        },
    }, 
    // @ts-expect-error - Extra argument for IE 11 / Legacy Edge
    false /* expandEntityReferences */);
    let currentNode = nodeIter.currentNode;
    let foundStart = false;
    let nodes = [];
    while (currentNode) {
        if (range.intersectsNode(currentNode) && currentNode instanceof Text) {
            nodes.push(currentNode);
        }
        currentNode = nodeIter.nextNode();
    }
    return nodes;
}
exports.textNodesInRange = textNodesInRange;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=lib.js.map