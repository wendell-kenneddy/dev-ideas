import { render, screen } from '@testing-library/react';

import { useSession } from 'next-auth/react';

import { mocked } from 'jest-mock';

import { Header } from '../../components/Header';

jest.mock('next-auth/react');

const user = {
  email: 'johndoe@email.com',
  image: '/avatar-image'
};

describe('Header Component', () => {
  it('should be able to render correctly', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    render(<Header />);

    const avatarImage = screen.getByAltText('Avatar image');
    const signOutBtn = screen.getByRole('button', {
      name: 'Sign out'
    });

    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(signOutBtn).toBeInTheDocument();
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage.closest('a')).toHaveAttribute('href', '/dashboard');
  });

  it('should be able to render a link to the sign in page if user is unauthenticated', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    });

    render(<Header />);

    const signInBtn = screen.getByRole('button', {
      name: 'Sign in'
    });

    expect(signInBtn).toBeInTheDocument();
    expect(signInBtn.closest('a')).toHaveAttribute('href', '/login');
  });
});
