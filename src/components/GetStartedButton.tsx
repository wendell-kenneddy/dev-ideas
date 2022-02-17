import { useSession } from 'next-auth/react';

import { LinkButton } from './LinkButton';

export function GetStartedButton() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const href = session ? '/dashboard' : '/login';

  return (
    <LinkButton
      variant="contained"
      color="primary"
      href={href}
      isLoading={isLoading}
    >
      Get Started
    </LinkButton>
  );
}
