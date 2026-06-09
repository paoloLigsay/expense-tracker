'use client';

import React from 'react';

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  gap?: 'sm' | 'md' | 'lg';
}

export function List({
  gap = 'md',
  className = '',
  children,
  ...props
}: ListProps) {
  const gapStyles = {
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-3',
  };

  return (
    <ul className={`${gapStyles[gap]} ${className}`} {...props}>
      {children}
    </ul>
  );
}

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  interactive?: boolean;
}

export function ListItem({
  interactive = false,
  className = '',
  children,
  ...props
}: ListItemProps) {
  const baseStyles = 'rounded-lg border border-slate-800 bg-slate-900 p-4';
  const interactiveStyles = interactive ? 'hover:border-slate-700 transition-colors' : '';

  return (
    <li className={`${baseStyles} ${interactiveStyles} ${className}`} {...props}>
      {children}
    </li>
  );
}
