/**
 * Reusable Card component
 */

'use client';

import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  title,
  description,
  children,
  className = '',
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-200
        p-6
        ${className}
      `}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-600 text-sm">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
