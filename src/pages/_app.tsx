import { useEffect } from 'react';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { SessionProvider } from 'next-auth/react';

import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { ToastContainer } from 'react-toastify';

import { queryClient } from '../lib/queryClient';

import nProgress from 'nprogress';

import { Header } from '../components/Header';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import '../styles/nprogress.css';

nProgress.configure({ showSpinner: false });

export default function App({ Component, pageProps }: AppProps) {
  const { events } = useRouter();

  useEffect(() => {
    events.on('routeChangeStart', nProgress.start);
    events.on('routeChangeComplete', nProgress.done);
    events.on('routeChangeError', nProgress.done);

    return () => {
      events.off('routeChangeStart', nProgress.start);
      events.off('routeChangeComplete', nProgress.done);
      events.off('routeChangeError', nProgress.done);
    };
  }, [events]);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Header />

        <Component {...pageProps} />

        <ToastContainer />

        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </SessionProvider>
  );
}
