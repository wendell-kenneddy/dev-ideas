import { ButtonHTMLAttributes, ReactNode } from 'react';

import { BG_COLORS, BORDER_COLORS, TEXT_COLORS } from '../styles/colors';

import { Spinner } from './Spinner';

export type Variant = 'contained' | 'outlined';
export type Color = 'primary' | 'secondary' | 'error' | 'gray';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  color: Color;
  children: ReactNode;
  isLoading?: boolean;
  additionalStyles?: string;
}

export function Button({
  variant,
  color,
  children,
  isLoading,
  additionalStyles,
  ...rest
}: ButtonProps) {
  const loadingStyles = `
  brightness-50
  cursor-wait
  hover:bg-opacity-100
  hover:brightness-50
  `;

  return (
    <button
      className={`
        ${variant === 'contained' ? BG_COLORS[color] : 'bg-transparent'}
        ${variant === 'contained' ? 'text-white' : TEXT_COLORS[color]}
        py-[6px]
        px-4
        flex
        items-center
        justify-center
        rounded
        font-medium
        min-w-[64px]
        shadow-md
        transition-all
        ease-in-out
        focus:outline
        focus:outline-4
        outline-cyan-700/25
        border-[1px]
        hover:brightness-75
        disabled:brightness-75
        disabled:cursor-not-allowed
        ${BORDER_COLORS[color]}
        ${variant === 'contained' ? 'border-transparent' : 'border-solid'}
        ${isLoading && loadingStyles}
        ${additionalStyles}
      `}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
