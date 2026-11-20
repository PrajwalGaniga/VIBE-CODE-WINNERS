import React, { useMemo } from 'react';

/**
 * LetterByLetter — renders each character as an individually animated span.
 * Wraps words in spans so they don't break mid-word.
 *
 * @param {string}  text            - The string to animate
 * @param {string}  animClass       - CSS animation class: 'anim-letter-pop' | 'anim-letter-rise' | 'anim-phrase-in'
 * @param {number}  baseDelay       - ms offset before the first letter starts
 * @param {number}  charDelay       - ms between consecutive characters
 * @param {string}  className       - Tailwind/CSS classes on the container
 * @param {string}  [tag='span']    - Wrapper element tag
 */
export function LetterByLetter({
  text,
  animClass = 'anim-letter-pop',
  baseDelay = 0,
  charDelay = 48,
  className = '',
  style = {},
  tag: Tag = 'span',
}) {
  // Split into words, animate char-by-char within each word
  const words = useMemo(() => {
    let charCount = 0;
    return text.split(' ').map((word, wi) => {
      const chars = word.split('').map((ch, ci) => {
        const delay = baseDelay + charCount * charDelay;
        charCount++;
        return { ch, delay };
      });
      charCount++; // space
      return { word, chars, wi };
    });
  }, [text, baseDelay, charDelay]);

  return (
    <Tag className={className} style={style} aria-label={text}>
      {words.map(({ word, chars, wi }) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {chars.map(({ ch, delay }, ci) => (
            <span
              key={ci}
              aria-hidden="true"
              className={`inline-block ${animClass}`}
              style={{ animationDelay: `${delay}ms`, opacity: 0 }}
            >
              {ch}
            </span>
          ))}
          {/* Space between words */}
          {wi < words.length - 1 && (
            <span aria-hidden="true" className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}

/**
 * FadePhrase — a whole phrase that fades in as a unit (no per-letter).
 */
export function FadePhrase({ children, delay = 0, className = '', tag: Tag = 'p' }) {
  return (
    <Tag
      className={`anim-settle-up ${className}`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      {children}
    </Tag>
  );
}
