import React from 'react';

// The brand mark: a sieve — a frame of punched holes with one grain caught
// in the center. Literal to "Crivo" and deliberately not another academic
// stand-in (no cap, brain, book, lightbulb, star or sparkle).
export function CrivoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" />
      <circle cx="12" cy="8" r="1.3" fill="currentColor" />
      <circle cx="16" cy="8" r="1.3" fill="currentColor" />
      <circle cx="8" cy="12" r="1.3" fill="currentColor" />
      <circle cx="16" cy="12" r="1.3" fill="currentColor" />
      <circle cx="8" cy="16" r="1.3" fill="currentColor" />
      <circle cx="12" cy="16" r="1.3" fill="currentColor" />
      <circle cx="16" cy="16" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  );
}
