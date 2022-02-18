import { useMemo } from 'react';

import Head from 'next/head';

import { useInfiniteQuery, useQuery } from 'react-query';

import { api } from '../services/api';

import { withAuth } from '../lib/withAuth';

import { Profile } from '../components/Profile';
import { Ideas } from '../components/Ideas';
import { Button } from '../components/Button';
import { CreateIdeaButton } from '../components/CreateIdeaButton';
import { useSession } from 'next-auth/react';

interface IdeaData {
  id: number;
  title: string;
  notionUrl?: string;
  figmaUrl?: string;
  goal: string;
  updatedAt: string;
}

interface QueryPageData {
  data: IdeaData[];
  after?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();

  const {
    data: ideas,
    isLoading: isLoadingIdeas,
    hasNextPage,
    isFetching: isFetchingIdeas,
    fetchNextPage
  } = useInfiniteQuery(
    `@${session?.user?.email}:ideas`,
    async ({ pageParam = null }) => {
      const response = await api.get<QueryPageData>('/ideas', {
        params: { after: pageParam }
      });

      return response.data;
    },
    {
      getNextPageParam: (lastPage) => (lastPage.after ? lastPage.after : null)
    }
  );

  const { data: profile, isLoading: isLoadingProfile } = useQuery(
    `@${session?.user?.email}:profile`,
    async () => {
      const profile = await api.get<Profile>('/profile');

      return profile.data;
    }
  );

  const formattedData = useMemo(() => {
    const parsedArray = ideas?.pages.map((page) => page.data).flat(3);

    return parsedArray ?? [];
  }, [ideas]);

  return (
    <>
      <Head>
        <meta name="description" content="See your activity." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Devideas | Dashboard" />
        <meta property="og:site_name" content="Devideas | Dashboard" />
        <meta property="og:description" content="See your activity." />
        <meta
          property="og:url"
          content="https://dev-ideas.vercel.app/dashboard"
        />
        <meta property="og:locale" content="en-US" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Devideas | Dashboard" />
        <meta property="twitter:description" content="See your activity." />
        <meta
          property="twitter:url"
          content="https://dev-ideas.vercel.app/dashboard"
        />
        <title>Devideas | Dashboard</title>
        <link rel="canonical" href="https://dev-ideas.vercel.app/dashboard" />
      </Head>

      <main className="w-full max-w-[720px] mx-auto px-4">
        <section className="flex items-center gap-3">
          <h2 className="sr-only">Profile</h2>

          <Profile profile={profile} isLoading={isLoadingProfile} />

          <CreateIdeaButton />
        </section>

        <section className="my-4 flex flex-col gap-4">
          <h2 className="sr-only">Ideas</h2>

          <Ideas ideas={formattedData} isLoading={isLoadingIdeas} />

          {hasNextPage && (
            <Button
              variant="outlined"
              color="primary"
              isLoading={isLoadingIdeas || isFetchingIdeas}
              onClick={() => fetchNextPage()}
            >
              Load more
            </Button>
          )}
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = withAuth(async (ctx) => ({ props: {} }));
