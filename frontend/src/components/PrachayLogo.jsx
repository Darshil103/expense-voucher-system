import React from 'react';

export default function PrachayLogo({ className = "h-10", showText = true }) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Exact Logo from public assets */}
      <img
        src="/prachay_logo.png"
        alt="Prachay Group Logo"
        className="h-full w-auto object-contain shrink-0"
      />

      {/* Corporate Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline font-bold tracking-wider text-xl text-[#1d5b96] font-sans">
            <span>P</span>
            <span className="text-[#f39c12] px-[1px]">₹</span>
            <span>ACHAY</span>
            <span className="text-[10px] align-super text-[#1d5b96] font-normal ml-0.5">®</span>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-[#1d5b96] via-[#f39c12] to-[#1d5b96] my-0.5 rounded-full" />
          <span className="text-[10px] font-semibold text-[#1d5b96] tracking-[0.35em] uppercase font-sans">
            GROUP
          </span>
        </div>
      )}
    </div>
  );
}
