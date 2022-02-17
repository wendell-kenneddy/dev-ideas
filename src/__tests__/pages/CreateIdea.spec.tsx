import { render, screen, fireEvent, act } from '@testing-library/react';

import { mocked } from 'jest-mock';

import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { getSession, useSession } from 'next-auth/react';

import { QueryClient, QueryClientProvider } from 'react-query';

import { api } from '../../services/api';

import { toast } from '../../lib/toast';

import CreateIdea, { getServerSideProps } from '../../pages/ideas';

jest.mock('next/router');
jest.mock('next-auth/react');
jest.mock('../../lib/toast');
jest.mock('../../services/api');

const user = { email: 'johndoe@email.com' };

describe('CreateIdea Page', () => {
  it('should be able to render correctly', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <CreateIdea />
      </QueryClientProvider>
    );

    expect(screen.getByText('Create Idea')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Notion URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Figma URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Goal')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Create'
      })
    ).toBeInTheDocument();
  });

  it('should be able to create an idea', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedUseRouter = mocked(useRouter);
    const mockedToast = mocked(toast);
    const mockedApi = mocked(api);
    const mockedPush = jest.fn();

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    mockedUseRouter.mockReturnValue({
      push: mockedPush
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <CreateIdea />
      </QueryClientProvider>
    );

    const title = screen.getByPlaceholderText('Title') as HTMLInputElement;
    const notionUrl = screen.getByPlaceholderText(
      'Notion URL'
    ) as HTMLInputElement;
    const figmaUrl = screen.getByPlaceholderText(
      'Figma URL'
    ) as HTMLInputElement;
    const goal = screen.getByPlaceholderText('Goal') as HTMLTextAreaElement;
    const submitBtn = screen.getByRole('button', {
      name: 'Create'
    });

    fireEvent.input(title, { target: { value: 'NodeJS API' } });
    fireEvent.input(notionUrl, {
      target: { value: 'https://notion.so/something' }
    });
    fireEvent.input(figmaUrl, {
      target: { value: 'https://figma.com/something' }
    });
    fireEvent.input(goal, {
      target: { value: 'Build an amazing API with Node' }
    });

    await act(async () => {
      fireEvent.submit(submitBtn);
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/ideas', {
      title: 'NodeJS API',
      notionUrl: 'https://notion.so/something',
      figmaUrl: 'https://figma.com/something',
      goal: 'Build an amazing API with Node'
    });

    expect(mockedApi.patch).toHaveBeenCalledWith('/profile', {
      toAddOngoing: 1
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Idea successfully created!',
      'success'
    );

    expect(mockedPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should be able to show error messages for invalid fields', async () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <CreateIdea />
      </QueryClientProvider>
    );

    const title = screen.getByPlaceholderText('Title') as HTMLInputElement;
    const notionUrl = screen.getByPlaceholderText(
      'Notion URL'
    ) as HTMLInputElement;
    const figmaUrl = screen.getByPlaceholderText(
      'Figma URL'
    ) as HTMLInputElement;
    const goal = screen.getByPlaceholderText('Goal') as HTMLTextAreaElement;
    const submitBtn = screen.getByRole('button', {
      name: 'Create'
    });

    fireEvent.input(title, { target: { value: '' } });
    fireEvent.input(notionUrl, {
      target: { value: 'https://othersite.com/' }
    });
    fireEvent.input(figmaUrl, {
      target: { value: 'https://othersite.com/' }
    });
    fireEvent.input(goal, {
      target: { value: '' }
    });

    await act(async () => {
      fireEvent.submit(submitBtn);
    });

    expect(screen.getByText('Title required')).toBeInTheDocument();
    expect(screen.getByText('Must be a valid Figma URL')).toBeInTheDocument();
    expect(screen.getByText('Must be a valid Figma URL')).toBeInTheDocument();
    expect(screen.getByText('Goal required')).toBeInTheDocument();
  });

  it('should be able to show an error if something goes wrong', async () => {
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
        <CreateIdea />
      </QueryClientProvider>
    );

    const title = screen.getByPlaceholderText('Title') as HTMLInputElement;

    const goal = screen.getByPlaceholderText('Goal') as HTMLTextAreaElement;
    const submitBtn = screen.getByRole('button', {
      name: 'Create'
    });

    fireEvent.input(title, { target: { value: 'NodeJS API' } });
    fireEvent.input(goal, {
      target: { value: 'Build an amazing API with Node' }
    });

    await act(async () => {
      fireEvent.submit(submitBtn);
    });

    expect(mockedToast).toHaveBeenCalledWith(
      'Something went wrong :(',
      'error'
    );
  });

  it('should be able to return props from getServerSideProps correctly', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValue({
      user: { email: 'johndoe@email.com' },
      expires: 'fake-expires'
    });

    const getServerSidePropsResult = await getServerSideProps(
      {} as GetServerSidePropsContext
    );

    expect(getServerSidePropsResult).toEqual({ props: {} });
  });

  it('should be able to return redirect to login page from getServerSideProps if user is unauthenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValue(null);

    const getServerSidePropsResult = await getServerSideProps(
      {} as GetServerSidePropsContext
    );

    expect(getServerSidePropsResult).toEqual({
      redirect: {
        destination: '/login',
        permanent: false
      }
    });
  });
});
