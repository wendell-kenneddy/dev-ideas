import { mocked } from 'jest-mock';

import { GetServerSidePropsContext } from 'next';

import { getSession } from 'next-auth/react';

import { withoutAuth } from '../../lib/withoutAuth';

jest.mock('next-auth/react');

const user = { email: 'johndoe@email.com' };

describe('withoutAuth Component', () => {
  it('should be able to let the callback execute if the user is unauthenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce(null);

    const callback = await withoutAuth(async (ctx) => ({
      props: {}
    }));

    const execution = await callback({} as GetServerSidePropsContext);

    expect(execution).toEqual({ props: {} });
  });

  it('should be able to return a redirect if the user is authenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({ user, expires: 'fake-expires' });

    const callback = await withoutAuth(async (ctx) => ({
      props: {}
    }));

    const execution = await callback({} as GetServerSidePropsContext);

    expect(execution).toEqual({
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    });
  });

  it('should be able to redirect to the homepage if a server-side error occurs', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockImplementationOnce(async () => {
      throw new Error('Oops');
    });

    const callback = await withoutAuth(async (ctx) => ({
      props: {}
    }));

    const execution = await callback({} as GetServerSidePropsContext);

    expect(execution).toEqual({
      redirect: {
        destination: '/',
        permanent: false
      }
    });
  });
});
