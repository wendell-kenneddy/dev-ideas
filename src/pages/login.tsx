import Head from 'next/head';

import { signIn } from 'next-auth/react';

import { withoutAuth } from '../lib/withoutAuth';

import { Button } from '../components/Button';

export default function Login() {
  async function handleSignIn(provider: 'github' | 'discord' | 'spotify') {
    signIn(provider, { callbackUrl: '/dashboard' });
  }

  return (
    <>
      <Head>
        <meta name="description" content="Sign in into the application." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Devideas | Sign In" />
        <meta property="og:site_name" content="Devideas | Sign In" />
        <meta
          property="og:description"
          content="Sign in into the application."
        />
        {/* <meta property="og:url" content="" /> */}
        <meta property="og:locale" content="en-US" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Devideas | Sign In" />
        <meta
          property="twitter:description"
          content="Sign in into the application."
        />
        {/* <meta property="twitter:url" content="" /> */}
        <title>Devideas | Sign In</title>
        {/* <link rel="canonical" href="" /> */}
      </Head>

      <main
        className={`
        w-full
        max-w-[720px]
        mx-auto
        flex
        items-center
        justify-center
    `}
      >
        <div
          className={`
        bg-neutral-900
        rounded
        shadow-md
        flex
        flex-col
        items-center
        justify-center
        gap-4
        p-4
      `}
        >
          <h2 className="font-bold text-xl">Sign in</h2>

          <Button
            variant="contained"
            onClick={() => handleSignIn('github')}
            color="gray"
            additionalStyles="w-[180px] shadow-slate-600/50"
          >
            Sign in with Github
          </Button>

          <Button
            variant="contained"
            onClick={() => handleSignIn('discord')}
            color="secondary"
            additionalStyles="w-[180px] shadow-purple-600/50"
          >
            Sign in with Discord
          </Button>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = withoutAuth(async (ctx) => ({ props: {} }));
