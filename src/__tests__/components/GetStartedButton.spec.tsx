import { render, screen } from '@testing-library/react';

import { mocked } from 'jest-mock';

import { useSession } from 'next-auth/react';

import { GetStartedButton } from '../../components/GetStartedButton';

jest.mock('next-auth/react');

describe('GetStartedButton Component', () => {
  it('should be able to render correctly', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: 'fake-data',
      status: 'authenticated'
    } as any);

    render(<GetStartedButton />);

    expect(
      screen.getByRole('button', {
        name: 'Get Started'
      })
    ).toBeInTheDocument();

    expect(
      screen
        .getByRole('button', {
          name: 'Get Started'
        })
        .closest('a')
    ).toHaveAttribute('href', '/dashboard');
  });

  it('should be able to render correctly when unauthenticated', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    } as any);

    render(<GetStartedButton />);

    expect(
      screen.getByRole('button', {
        name: 'Get Started'
      })
    ).toBeInTheDocument();

    expect(
      screen
        .getByRole('button', {
          name: 'Get Started'
        })
        .closest('a')
    ).toHaveAttribute('href', '/login');
  });

  it('should be able to render a loading state when status is loading', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: null,
      status: 'loading'
    } as any);

    render(<GetStartedButton />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status').tagName.toLowerCase()).toBe('div');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
