import type { NextApiRequest, NextApiResponse } from 'next';

import ProfileHandler from '../../../pages/api/profile';

import { mocked } from 'jest-mock';

import { getSession } from 'next-auth/react';

import { fauna } from '../../../services/fauna';

import { decryptString } from '../../../lib/crypto';

jest.mock('next-auth/react');
jest.mock('faunadb');
jest.mock('../../../services/fauna');
jest.mock('../../../lib/crypto');

const user = {
  email: 'johndoe@email.com'
};

const profile = {
  email: 'johndoe@email.com',
  ongoing: 3,
  completed: 119,
  lastCompletedDate: '09 Feb 2022'
};

const rawProfile = {
  ref: {
    id: 1011
  },
  data: {
    email: 'johndoe@email.com',
    ongoing: 'encrypted-ongoing',
    completed: 'encrypted-completed',
    lastCompletedDate: 1644399617100
  }
};

let httpStatus: number | null;

const nextResponse = {
  status(code: number) {
    httpStatus = code;

    return {
      json(obj: any) {
        return obj;
      }
    };
  }
};

describe('Profile API Route', () => {
  it('should be able to return profile data', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawProfile);

    const mockedDecryptString = mocked(decryptString);
    mockedDecryptString.mockImplementation((str: string) => {
      return str === rawProfile.data.completed
        ? String(profile.completed)
        : String(profile.ongoing);
    });

    const response = await ProfileHandler(
      { method: 'GET' } as NextApiRequest,
      nextResponse as NextApiResponse
    );

    expect(response).toEqual(profile);
    expect(httpStatus).toBe(200);
  });

  it('should be able to execute a patch', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawProfile);

    const response = await ProfileHandler(
      {
        method: 'PATCH',
        body: { toAddCompleted: 1, toAddOngoing: -1 }
      } as NextApiRequest,
      nextResponse as NextApiResponse
    );

    expect(response).toEqual({ success: 'true' });
    expect(httpStatus).toBe(200);
  });

  it('should be able to return an error if no session is found', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce(null);

    const response = await ProfileHandler(
      { method: 'GET' } as NextApiRequest,
      nextResponse as NextApiResponse
    );

    expect(response).toEqual({ error: 'Unauthenticated User' });
    expect(httpStatus).toBe(401);
  });

  it('should be able to return an error is the method is unimplemented', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawProfile);

    const response = await ProfileHandler(
      { method: 'UNIMPLEMENTED' } as NextApiRequest,
      nextResponse as NextApiResponse
    );

    expect(response).toEqual({ error: 'Method Not Allowed' });
    expect(httpStatus).toBe(501);
  });

  it('should be able to return an error if the user tries to access other user data', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user: { email: 'otheruser@email.com' },
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawProfile);

    const response = await ProfileHandler(
      { method: 'GET' } as NextApiRequest,
      nextResponse as NextApiResponse
    );

    expect(response).toEqual({ error: 'Invalid Credentials' });
    expect(httpStatus).toBe(403);
  });

  it('should be able to return an error if a server-side error occurs', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockImplementationOnce(async () => {
      throw new Error('Oops');
    });

    const response = await ProfileHandler(
      { method: 'GET' } as NextApiRequest,
      nextResponse as NextApiResponse
    );

    expect(response).toEqual({ error: 'Something Went Wrong' });
    expect(httpStatus).toBe(500);
  });
});
