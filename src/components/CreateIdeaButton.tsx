import { AnchorHTMLAttributes } from 'react';

import Link from 'next/link';

import { FiPlus } from 'react-icons/fi';

interface CreateIdeaButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  additionalStyles?: string;
}

export function CreateIdeaButton({
  additionalStyles,
  ...rest
}: CreateIdeaButtonProps) {
  return (
    <Link href="/ideas">
      <a
        className={`
          bg-green-600
          h-16
          w-16
          rounded-full
          shadow-md
          flex items-center justify-center
          px-2
          transition-all
          ease-in-out
          hover:brightness-75
          cursor-pointer
          fixed
          bottom-4
          right-4
          sm:static
          z-50
          ${additionalStyles}
        `}
        {...rest}
      >
        <FiPlus fontSize="32" title="Plus icon" />
      </a>
    </Link>
  );
}
