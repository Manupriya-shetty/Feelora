import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`} {...props}>
    {children}
  </h3>
);