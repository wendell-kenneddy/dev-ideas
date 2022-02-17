import { mocked } from 'jest-mock';

import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { fauna } from '../../../services/fauna';

import { decryptString } from '../../../lib/crypto';

import Ideas from '../../../pages/api/ideas';

jest.mock('next-auth/react');
jest.mock('../../../services/fauna');
jest.mock('../../../lib/crypto');

const rawQuery = {
  data: [
    {
      ts: 1100,
      ref: {
        id: '2021'
      },
      data: {
        userEmail: 'johndoe@email.com',
        title: 'encrypted-title',
        notionUrl: undefined,
        figmaUrl: undefined,
        goal: 'encrypted-goal',
        updatedAt: 1644485048165
      }
    },
    {
      ts: 1100,
      ref: {
        id: '2022'
      },
      data: {
        userEmail: 'marydoe@email.com',
        title: 'encrypted-title-2',
        notionUrl: 'encrypted-notion-url',
        figmaUrl: 'encrypted-figma-url',
        goal: 'encrypted-goal-2',
        updatedAt: 1644485048165
      }
    }
  ]
};

const formattedQuery = {
  after: null,
  data: [
    {
      id: '2021',
      title: 'NodeJS API',
      notionUrl: '',
      figmaUrl: '',
      goal: 'Build an amazing API with NodeJS',
      updatedAt: '10 Feb 2022'
    },
    {
      id: '2022',
      title: 'Elixir API',
      notionUrl: 'https://notion.so/something',
      figmaUrl: 'https://figma.com/something',
      goal: 'Build an amazing API with Elixir',
      updatedAt: '10 Feb 2022'
    }
  ]
};

let httpStatus = 0;

const user = { email: 'johndoe@email.com' };

describe('Ideas API Route', () => {
  it('should be able to return paginated ideas data', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce(rawQuery);

    const mockedDecryptString = mocked(decryptString);
    mockedDecryptString.mockImplementation((str: string) => {
      if (str === 'encrypted-title') return 'NodeJS API';
      if (str === 'encrypted-title-2') return 'Elixir API';
      if (str === 'encrypted-notion-url') return 'https://notion.so/something';
      if (str === 'encrypted-figma-url') return 'https://figma.com/something';
      if (str === 'encrypted-goal') return 'Build an amazing API with NodeJS';
      if (str === 'encrypted-goal-2') return 'Build an amazing API with Elixir';

      return '';
    });

    const response = await Ideas(
      {
        method: 'GET',
        query: {}
      } as NextApiRequest,
      {
        status: (code: number) => {
          httpStatus = code;

          return {
            json: (obj: any) => obj
          };
        }
      } as NextApiResponse
    );

    expect(response).toEqual(formattedQuery);
    expect(httpStatus).toBe(200);
  });

  it('should be able to handle a POST request', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const mockedFauna = mocked(fauna);
    mockedFauna.query.mockResolvedValueOnce({});

    const response = await Ideas(
      {
        method: 'POST',
        body: {
          title: 'NodeJS API',
          goal: 'Build an amazing NodeJS API'
        }
      } as NextApiRequest,
      {
        status: (code: number) => {
          httpStatus = code;

          return {
            json: (obj: any) => obj
          };
        }
      } as NextApiResponse
    );

    expect(response).toEqual({ success: 'true' });
    expect(httpStatus).toBe(200);
  });

  it('should be able to return an error if the user is unauthenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce(null);

    const response = await Ideas(
      {
        method: 'GET'
      } as NextApiRequest,
      {
        status: (code: number) => {
          httpStatus = code;

          return {
            json: (obj: any) => obj
          };
        }
      } as NextApiResponse
    );

    expect(response).toEqual({ error: 'Unauthenticated User' });
    expect(httpStatus).toBe(401);
  });

  it('should be able to return an error if the request method is unimplemented', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const response = await Ideas(
      {
        method: 'UNIMPLEMENTED'
      } as NextApiRequest,
      {
        status: (code: number) => {
          httpStatus = code;

          return {
            json: (obj: any) => obj
          };
        }
      } as NextApiResponse
    );

    expect(response).toEqual({ error: 'Method Not Allowed' });
    expect(httpStatus).toBe(501);
  });

  it('should be able to return an error if a server-side error occurs', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockImplementationOnce(() => {
      throw new Error('Oops');
    });

    const response = await Ideas(
      {
        method: 'GET',
        query: {}
      } as NextApiRequest,
      {
        status: (code: number) => {
          httpStatus = code;

          return {
            json: (obj: any) => obj
          };
        }
      } as NextApiResponse
    );

    expect(response).toEqual({ error: 'Something Went Wrong' });
    expect(httpStatus).toBe(500);
  });
});
