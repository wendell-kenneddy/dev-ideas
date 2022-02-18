import Link from 'next/link';

import { signOut } from 'next-auth/react';

import { Avatar } from './Avatar';

interface UserInfoProps {
  email: string;
  image?: string;
}

export function UserInfo({ email, image }: UserInfoProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col items-end">
        <span className="text-white/50 font-medium text-sm sr-only sm:not-sr-only">
          {email}
        </span>

        <button
          className="text-red-600/50 font-bold text-xs"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </button>
      </div>

      <Link href="/dashboard">
        <a
          className={`
          relative
          w-11
          h-11
          rounded-full
          border-2
          border-green-600
          flex
          items-center
          justify-center
          ${image ? 'bg-transparent' : 'bg-gray-900'}
        `}
        >
          <Avatar src={image} />
        </a>
      </Link>
    </div>
  );
}
