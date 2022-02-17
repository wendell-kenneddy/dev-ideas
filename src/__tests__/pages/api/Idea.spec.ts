import { mocked } from 'jest-mock';

import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { fauna } from '../../../services/fauna';

import { decryptString } from '../../../lib/crypto';

import Idea from '../../../pages/api/ideas/[id]';

jest.mock('next-auth/react');
jest.mock('../../../services/fauna');
jest.mock('../../../lib/crypto');

const rawQuery = {
  ref: { id: '2022' },
  data: {
    userEmail: 'johndoe@email.com',
    title: 'encrypted-title',
    notionUrl: 'encrypted-notion-url',
    figmaUrl: 'encrypted-figma-url',
    goal: 'encrypted-goal',
    updatedAt: 1644485048165
  }
};
const idea = {
  id: '2022',
  title: 'NodeJS API',
  notionUrl: 'https://notion.so/something',
  figmaUrl: 'https://figma.com/something',
  goal: 'Build an amazing API with NodeJS',
  updatedAt: '10 Feb 2022'
};
const user = { email: 'johndoe@email.com' };
let httpStatus = 0;
const nextStatusFn = (status: number) => {
  httpStatus = status;

  return { json: (obj: any) => obj };
};

describe('Idea API Route', () => {
  it('should be able to return idea data', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawQuery);

    const mockedDecryptString = mocked(decryptString);
    mockedDecryptString.mockImplementation((str: string) => {
      if (str === 'encrypted-title') return idea.title;
      if (str === 'encrypted-figma-url') return idea.figmaUrl;
      if (str === 'encrypted-notion-url') return idea.notionUrl;
      if (str === 'encrypted-goal') return idea.goal;

      return '';
    });

    const response = await Idea(
      {
        method: 'GET',
        query: { id: '2022' }
      } as unknown as NextApiRequest,
      { status: nextStatusFn } as NextApiResponse
    );

    expect(response).toEqual(idea);
    expect(httpStatus).toBe(200);
  });

  it('should be able to handle a PATCH request', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawQuery);

    const response = await Idea(
      {
        method: 'PATCH',
        query: { id: '2022' },
        body: {
          title: 'Elixir API',
          goal: 'Build an amazing API with Elixir'
        }
      } as unknown as NextApiRequest,
      { status: nextStatusFn } as NextApiResponse
    );

    expect(response).toEqual({ success: 'true' });
    expect(httpStatus).toBe(200);
  });

  it('should be able to handle a DELETE request', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawQuery);

    const response = await Idea(
      {
        method: 'DELETE',
        query: { id: '2022' }
      } as unknown as NextApiRequest,
      { status: nextStatusFn } as NextApiResponse
    );

    expect(response).toEqual({ success: 'true' });
    expect(httpStatus).toBe(200);
  });

  it('should be able to return an error if the user is unauthenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce(null);

    const response = await Idea(
      {
        method: 'GET',
        query: { id: '2022' }
      } as unknown as NextApiRequest,
      { status: nextStatusFn } as NextApiResponse
    );

    expect(response).toEqual({ error: 'Unauthenticated User' });
    expect(httpStatus).toBe(401);
  });

  it('should be able to return an error if the user tries to access other user data', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user: { email: 'marydoe@email.com' },
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawQuery);

    const response = await Idea(
      {
        method: 'GET',
        query: { id: '2022' }
      } as unknown as NextApiRequest,
      { status: nextStatusFn } as NextApiResponse
    );

    expect(response).toEqual({ error: 'Invalid Credentials' });
    expect(httpStatus).toBe(403);
  });

  it('should be able to return an error if the request method is unimplemented', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawQuery);

    const response = await Idea(
      {
        method: 'UNIMPLEMENTED',
        query: { id: '2022' }
      } as unknown as NextApiRequest,
      { status: nextStatusFn } as NextApiResponse
    );

    expect(response).toEqual({ error: 'Method Not Allowed' });
    expect(httpStatus).toBe(501);
  });

  it('should be able to return an error if a server-side error occurs', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockImplementationOnce(async () => {
      throw new Error('Oops');
    });

    const response = await Idea(
      {
        method: 'GET',
        query: { id: '2022' }
      } as unknown as NextApiRequest,
      { status: nextStatusFn } as NextApiResponse
    );

    expect(response).toEqual({ error: 'Something Went Wrong' });
    expect(httpStatus).toBe(500);
  });
});
