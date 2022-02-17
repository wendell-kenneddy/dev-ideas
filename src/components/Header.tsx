import { useSession } from 'next-auth/react';

import { Icon } from './Icon';
import { LinkButton } from './LinkButton';
import { UserInfo } from './UserInfo';

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const href = session ? '/dashboard' : '/login';

  return (
    <header
      className={`
        w-full
        bg-neutral-900
        p-3
        shadow-md
        shadow-green-600/50
        mb-7
        hover:shadow-green-600/100
        transition-shadow
        ease-in-out
      `}
    >
      <div className="w-full max-w-[720px] mx-auto flex items-center justify-between">
        <Icon />

        {session ? (
          <UserInfo
            email={session.user?.email ?? 'User email'}
            image={session.user?.image as string}
          />
        ) : (
          <LinkButton
            variant={session ? 'contained' : 'outlined'}
            color="primary"
            href={href}
            isLoading={isLoading}
          >
            Sign in
          </LinkButton>
        )}
      </div>
    </header>
  );
}
