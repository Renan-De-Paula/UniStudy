import React from 'react';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 mt-2 w-full flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-primary/30",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
