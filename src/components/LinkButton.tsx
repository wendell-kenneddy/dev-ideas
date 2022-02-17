import { ReactNode } from 'react';

import Link from 'next/link';

import { Button, Color, Variant } from './Button';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant: Variant;
  color: Color;
  isLoading?: boolean;
}

export function LinkButton({
  href,
  children,
  variant,
  color,
  isLoading
}: LinkButtonProps) {
  return isLoading ? (
    <Button variant={variant} color={color} isLoading={true}>
      {children}
    </Button>
  ) : (
    <Link href={href}>
      <a>
        <Button variant={variant} color={color} isLoading={false}>
          {children}
        </Button>
      </a>
    </Link>
  );
}
