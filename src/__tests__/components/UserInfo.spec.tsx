import { render, screen, fireEvent } from '@testing-library/react';

import { signOut } from 'next-auth/react';

import { mocked } from 'jest-mock';

import { UserInfo } from '../../components/UserInfo';

jest.mock('next-auth/react');

const user = {
  email: 'johndoe@email.com',
  image: '/avatar-image'
};

describe('UserInfo Component', () => {
  it('should be able to render correctly', () => {
    render(<UserInfo {...user} />);

    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Sign out'
      })
    ).toBeInTheDocument();
    expect(screen.getByAltText('Avatar image').closest('a')).toHaveAttribute(
      'href',
      '/dashboard'
    );
  });

  it('should be able to render a fallback image if user has no image', () => {
    render(<UserInfo email={user.email} />);

    expect(screen.getByTitle('Avatar image')).toBeInTheDocument();
  });

  it('should be able to handle a sign out', () => {
    const mockedSignOut = mocked(signOut);
    mockedSignOut.mockResolvedValueOnce({} as any);

    render(<UserInfo {...user} />);

    const signOutBtn = screen.getByRole('button', { name: 'Sign out' });

    fireEvent.click(signOutBtn);

    expect(mockedSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });
});
