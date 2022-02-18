import Image from 'next/image';
import Head from 'next/head';

import { GetStartedButton } from '../components/GetStartedButton';

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Manage your web app ideas intuitively."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Devideas" />
        <meta property="og:site_name" content="Devideas" />
        <meta
          property="og:description"
          content="Manage your web app ideas intuitively."
        />
        <meta property="og:url" content="https://dev-ideas.vercel.app/" />
        <meta property="og:locale" content="en-US" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Devideas" />
        <meta
          property="twitter:description"
          content="Manage your web app ideas intuitively."
        />
        <meta property="twitter:url" content="https://dev-ideas.vercel.app/" />
        <title>Devideas</title>
        <link rel="canonical" href="https://dev-ideas.vercel.app/" />
      </Head>

      <main
        className={`
        w-full
        max-w-[720px]
        xs:mt[5vh]
        md:mt-[10vh]
        mx-auto
        p-4
        lg:p-0
        flex
        flex-col
        md:flex-row
        items-center
        justify-center
        md:justify-between
        gap-10
        md:gap-0
    `}
      >
        <div className="flex flex-col items-center justify-center md:items-start gap-4">
          <Image src="/logo.svg" alt="Logo" width="200" height="48" />

          <h2 className="text-sm">Manage your web app ideas intuitively.</h2>

          <GetStartedButton />
        </div>

        <div>
          <Image
            src="/illustration.svg"
            alt="Illustration"
            width="400"
            height="250"
            priority
          />
        </div>
      </main>
    </>
  );
}
