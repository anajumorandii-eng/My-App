import React from 'react';

export function AJMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Símbolo AJ"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 39c4.8-11.2 8.1-22 13.2-30.2 3.1 7.9 5.2 17.1 9.1 24.3 2.4 4.4 5.8 7 9.1 4.8 3.4-2.2 3.5-7.1 2.6-12.2"
        stroke="currentColor"
        strokeWidth="3.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 27.2c8.2-1.2 15.6 1.7 21.4-2.4 4.5-3.2 5.2-9.1 4.2-15.8"
        stroke="currentColor"
        strokeWidth="3.05"
        strokeLinecap="round"
      />
      <path d="m36.2 10.8 3-2.2 2.5 2.7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
