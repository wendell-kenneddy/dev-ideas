import { render, screen } from '@testing-library/react';

import { mocked } from 'jest-mock';

import { getSession, useSession } from 'next-auth/react';

import { QueryClient, QueryClientProvider } from 'react-query';

import AxiosMock from 'axios-mock-adapter';

import { api } from '../../services/api';

import Dashboard, { getServerSideProps } from '../../pages/dashboard';
import { GetServerSidePropsContext } from 'next';

const apiMock = new AxiosMock(api);

jest.mock('next-auth/react');

const user = { email: 'johndoe@email.com' };
const profileResponse = {
  email: user.email,
  completed: 119,
  ongoing: 2,
  lastCompletedDate: '10 Feb 2022'
};
const pages = [
  {
    data: [
      {
        id: 1,
        title: 'NodeJS API',
        notionUrl: 'https://notion.so/something',
        figmaUrl: 'https://figma.com/something',
        goal: 'Build an amazing API with NodeJS',
        updatedAt: '05 Feb 2022'
      },
      {
        id: 2,
        title: 'Elixir API',
        notionUrl: '',
        figmaUrl: '',
        goal: 'Build an amazing API with Elixir',
        updatedAt: '06 Feb 2022'
      }
    ],
    after: null
  }
];

describe('Dashboard Page', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('should be able to render three loading states', async () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    const { debug } = render(
      <QueryClientProvider client={new QueryClient()}>
        <Dashboard />
      </QueryClientProvider>
    );

    const loadings = screen.getAllByText('Loading...');
  });

  it('should be able to render correctly', async () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    apiMock.onGet('/profile').reply(200, profileResponse);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Dashboard />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Completed')).toBeInTheDocument();
    expect(await screen.findByText('119')).toBeInTheDocument();

    expect(await screen.findByText('Ongoing')).toBeInTheDocument();
    expect(await screen.findByText('2')).toBeInTheDocument();

    expect(await screen.findByText('Last completed date')).toBeInTheDocument();
    expect(await screen.findByText('10 Feb 2022')).toBeInTheDocument();
  });

  it('should be able to render ideas correctly', async () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    apiMock.onGet('/ideas').reply(200, pages[0]);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Dashboard />
      </QueryClientProvider>
    );

    const firstTitle = await screen.findByText('NodeJS API');
    const secondTitle = await screen.findByText('Elixir API');
    const notionLinks = await screen.findAllByText('Notion');
    const figmaLinks = await screen.findAllByText('Figma');

    expect(firstTitle).toBeInTheDocument();
    expect(firstTitle.closest('a')).toHaveAttribute('href', '/ideas/1');

    expect(secondTitle).toBeInTheDocument();
    expect(secondTitle.closest('a')).toHaveAttribute('href', '/ideas/2');

    expect(notionLinks.length).toBe(2);
    expect(notionLinks[0].closest('a')).toHaveAttribute(
      'href',
      'https://notion.so/something'
    );

    expect(figmaLinks.length).toBe(2);
    expect(figmaLinks[0].closest('a')).toHaveAttribute(
      'href',
      'https://figma.com/something'
    );
  });

  it('should be able to render a button to fetch next page', async () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValue({
      data: { user, expires: 'fake-expires' },
      status: 'authenticated'
    });

    apiMock.onGet('/ideas').reply(200, { ...pages[0], after: 'fake-after' });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Dashboard />
      </QueryClientProvider>
    );

    const loadMoreBtn = await screen.findByRole('button', {
      name: 'Load more'
    });

    expect(loadMoreBtn).toBeInTheDocument();
  });

  it('should be able to return props from getServerSideProps correctly', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce({
      user,
      expires: 'fake-expires'
    });

    const getServerSidePropsResponse = await getServerSideProps(
      {} as GetServerSidePropsContext
    );

    expect(getServerSidePropsResponse).toEqual({ props: {} });
  });

  it('should be able to return redirect to login page from getServerSideProps if user is unauthenticated', async () => {
    const mockedGetSession = mocked(getSession);
    mockedGetSession.mockResolvedValueOnce(null);

    const getServerSidePropsResponse = await getServerSideProps(
      {} as GetServerSidePropsContext
    );

    expect(getServerSidePropsResponse).toEqual({
      redirect: {
        destination: '/login',
        permanent: false
      }
    });
  });
});
