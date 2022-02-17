import { render, screen, fireEvent, act } from '@testing-library/react';

import { mocked } from 'jest-mock';

import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { getSession, useSession } from 'next-auth/react';

import { QueryClient, QueryClientProvider } from 'react-query';

import { api } from '../../services/api';
import { fauna } from '../../services/fauna';

import { toast } from '../../lib/toast';
import { decryptString } from '../../lib/crypto';

import EditIdea, { getServerSideProps } from '../../pages/ideas/[id]';

jest.mock('next/router');
jest.mock('next-auth/react');
jest.mock('../../services/api');
jest.mock('../../services/fauna');
jest.mock('../../lib/toast');
jest.mock('../../lib/crypto');

const user = { email: 'johndoe@email.com' };
const idea = {
  id: 1011,
  title: 'NodeJS API',
  notionUrl: 'https://notion.so/something',
  figmaUrl: 'https://figma.com/something',
  goal: 'Build an amazing API with Node'
};
const faunaResponse = {
  ref: {
    id: 1011
  },
  data: {
    userEmail: 'johndoe@email.com',
    title: 'encrypted-title',
    notionUrl: 'encrypted-notion-url',
    figmaUrl: 'encrypted-figma-url',
    goal: 'encrypted-goal'
  }
};

describe('EditIdea Page', () => {
  it('should be able to render correctly', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <EditIdea idea={idea} />
      </QueryClientProvider>
    );

    const titleInput = screen.getByPlaceholderText('Title');
    const notionUrlInput = screen.getByPlaceholderText('Notion URL');
    const figmaUrlInput = screen.getByPlaceholderText('Figma URL');
    const goalInput = screen.getByPlaceholderText('Goal');

    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(idea.title);

    expect(notionUrlInput).toBeInTheDocument();
    expect(notionUrlInput).toHaveValue(idea.notionUrl);

    expect(figmaUrlInput).toBeInTheDocument();
    expect(figmaUrlInput).toHaveValue(idea.figmaUrl);

    expect(goalInput).toBeInTheDocument();
    expect(goalInput).toHaveValue(idea.goal);

    expect(
      screen.getByRole('button', {
        name: 'Save'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Complete'
      })
    ).toBeInTheDocument();
  });

  it('should be able to edit an idea', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedApi = mocked(api);
    const mockedToast = mocked(toast);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <EditIdea idea={idea} />
      </QueryClientProvider>
    );

    const titleInput = screen.getByPlaceholderText('Title');
    const notionUrlInput = screen.getByPlaceholderText('Notion URL');
    const figmaUrlInput = screen.getByPlaceholderText('Figma URL');
    const goalInput = screen.getByPlaceholderText('Goal');
    const submitBtn = screen.getByRole('button', {
      name: 'Save'
    });

    fireEvent.input(titleInput, { target: { value: 'Elixir API' } });
    fireEvent.input(notionUrlInput, {
      target: { value: 'https://notion.so/something2' }
    });
    fireEvent.input(figmaUrlInput, { target: { value: '' } });
    fireEvent.input(goalInput, {
      target: { value: 'Build an amazing API with Elixir' }
    });

    await act(async () => {
      fireEvent.submit(submitBtn);
    });

    expect(mockedApi.patch).toHaveBeenCalledWith('/ideas/1011', {
      title: 'Elixir API',
      notionUrl: 'https://notion.so/something2',
      figmaUrl: '',
      goal: 'Build an amazing API with Elixir'
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Idea successfully saved!',
      'success'
    );
  });

  it('should be able to complete an idea', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedApi = mocked(api);
    const mockedToast = mocked(toast);
    const mockedPush = jest.fn();
    const mockedUseRouter = mocked(useRouter);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    mockedUseRouter.mockReturnValueOnce({
      push: mockedPush
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <EditIdea idea={idea} />
      </QueryClientProvider>
    );

    const completeBtn = screen.getByRole('button', {
      name: 'Complete'
    });

    await act(async () => {
      fireEvent.click(completeBtn);
    });

    expect(mockedApi.delete).toHaveBeenCalledWith('/ideas/1011');
    expect(mockedApi.patch).toHaveBeenCalledWith('profile', {
      toAddOngoing: -1,
      toAddCompleted: 1,
      updateLastCompletedDate: true
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Idea successfully completed!',
      'success'
    );
    expect(mockedPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should be able to show an error if the idea edit goes wrong', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedApi = mocked(api);
    const mockedToast = mocked(toast);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    mockedToast.mockImplementationOnce((message: string) => {
      if (message === 'Idea successfully saved!') {
        throw new Error('Oops');
      }

      return '';
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <EditIdea idea={idea} />
      </QueryClientProvider>
    );

    const submitBtn = screen.getByRole('button', {
      name: 'Save'
    });

    await act(async () => {
      fireEvent.submit(submitBtn);
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Something went wrong :(',
      'error'
    );
  });

  it('should be able to show an error if the idea completion goes wrong', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedApi = mocked(api);
    const mockedToast = mocked(toast);
    const mockedUseRouter = mocked(useRouter);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    mockedUseRouter.mockReturnValueOnce({
      push() {
        throw new Error('Oops');
      }
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <EditIdea idea={idea} />
      </QueryClientProvider>
    );

    const completeBtn = screen.getByRole('button', {
      name: 'Complete'
    });

    await act(async () => {
      fireEvent.click(completeBtn);
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Something went wrong :(',
      'error'
    );
  });

  it('should be able to return a formatted idea from getServerSideProps', async () => {
    const mockedGetSession = mocked(getSession);
    const mockedFauna = mocked(fauna);
    const mockedDecryptString = mocked(decryptString);

    mockedGetSession.mockResolvedValue({
      user,
      expires: 'fake-expires'
    });

    mockedFauna.query.mockResolvedValueOnce(faunaResponse);

    mockedDecryptString.mockImplementation((str: string) => {
      if (str === faunaResponse.data.title) return idea.title;
      if (str === faunaResponse.data.notionUrl) return idea.notionUrl;
      if (str === faunaResponse.data.figmaUrl) return idea.figmaUrl;
      if (str === faunaResponse.data.goal) return idea.goal;

      return '';
    });

    const ctx = {
      params: { id: '1011' }
    } as unknown as GetServerSidePropsContext;

    const getServerSidePropsResult = await getServerSideProps(ctx);

    expect(getServerSidePropsResult).toEqual({ props: { idea } });
  });

  it('should be able to return 404 from getServerSideProps if user is trying to access other user data', async () => {
    const mockedGetSession = mocked(getSession);
    const mockedFauna = mocked(fauna);

    mockedGetSession.mockResolvedValue({
      user: { email: 'marydoe@email.com' },
      expires: 'fake-expires'
    });

    mockedFauna.query.mockResolvedValueOnce(faunaResponse);

    const ctx = {
      params: { id: '1011' }
    } as unknown as GetServerSidePropsContext;

    const getServerSidePropsResult = await getServerSideProps(ctx);

    expect(getServerSidePropsResult).toEqual({ notFound: true });
  });

  it('should be able to return redirect to login page from getServerSideProps if user is unauthenticated', async () => {
    const mockedGetSession = mocked(getSession);

    mockedGetSession.mockResolvedValue(null);

    const ctx = {
      params: { id: '1011' }
    } as unknown as GetServerSidePropsContext;

    const getServerSidePropsResult = await getServerSideProps(ctx);

    expect(getServerSidePropsResult).toEqual({
      redirect: {
        destination: '/login',
        permanent: false
      }
    });
  });
});
