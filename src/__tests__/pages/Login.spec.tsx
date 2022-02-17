import { render, screen, fireEvent } from '@testing-library/react';

import { mocked } from 'jest-mock';
import { GetServerSidePropsContext } from 'next';

import { signIn, getSession } from 'next-auth/react';

import Login, { getServerSideProps } from '../../pages/login';

jest.mock('next-auth/react');

describe('Login Page', () => {
  it('should be able to render correctly', () => {
    render(<Login />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Sign in with Github'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Sign in with Discord'
      })
    ).toBeInTheDocument();
  });

  it('should be able to execute the sign in with a provider', () => {
    const mockedSignIn = mocked(signIn);
    mockedSignIn.mockImplementation(() => Promise.resolve(undefined));

    render(<Login />);

    const signInWithGithub = screen.getByRole('button', {
      name: 'Sign in with Github'
    });
    const signInWithDiscord = screen.getByRole('button', {
      name: 'Sign in with Discord'
    });

    fireEvent.click(signInWithGithub);
    expect(mockedSignIn).toHaveBeenCalledWith('github', {
      callbackUrl: '/dashboard'
    });

    fireEvent.click(signInWithDiscord);
    expect(mockedSignIn).toHaveBeenCalledWith('discord', {
      callbackUrl: '/dashboard'
    });
  });

  it('should be able to redirect to dashboard if the user is authenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValue({
      user: { email: 'johndoe@email.com' },
      expires: 'fake-expires'
    });

    const getServerSidePropsResult = await getServerSideProps(
      {} as GetServerSidePropsContext
    );

    expect(getServerSidePropsResult).toEqual({
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    });
  });

  it('should not redirect to dashboard if the user is unauthenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValue(null);

    const getServerSidePropsResult = await getServerSideProps(
      {} as GetServerSidePropsContext
    );

    expect(getServerSidePropsResult).toEqual({ props: {} });
  });
});
