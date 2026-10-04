import React from 'react';

export function Input({ label, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors ${props.className || ''}`}
      />
    </div>
  );
}
