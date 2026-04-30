import React from 'react';

export default function Logo({ className, style }) {
  return (
    <svg 
      viewBox="0 0 250 100" 
      className={className} 
      style={{ display: 'block', ...style }}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three Black Bars for 'M' */}
      <path d="M10 90 L60 10 H95 L45 90 H10 Z" fill="black" />
      <path d="M55 90 L105 10 H140 L90 90 H55 Z" fill="black" />
      <path d="M100 90 L150 10 H185 L135 90 H100 Z" fill="black" />
      
      {/* Red 'K' Shape */}
      <path d="M145 90 L195 10 H230 L180 90 H145 Z" fill="#E31E24" />
      <path d="M190 90 L155 50 H185 L220 90 H190 Z" fill="#E31E24" />
      
      {/* Copyright Symbol */}
      <circle cx="235" cy="15" r="8" stroke="black" strokeWidth="1.5" />
      <text 
        x="231" 
        y="19" 
        fill="black" 
        fontFamily="Arial, sans-serif" 
        fontSize="11" 
        fontWeight="bold"
      >
        C
      </text>
    </svg>
  );
}
